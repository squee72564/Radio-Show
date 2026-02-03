import { createStreamArchive } from '@/lib/db/actions/streamscheduleActions';
import { deleteArchiveFileFromS3, startArchiveUploadToS3 } from '@/lib/S3Utils';
import { parseStream } from 'music-metadata';
import { Result } from '@/types/generic';
import { serverConfig } from '@/lib/server-config';
import formidable from 'formidable';
import { randomUUID } from 'node:crypto';
import { PassThrough, Readable, Writable } from 'node:stream';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_ARCHIVE_BYTES = 10 * 1024 * 1024 * 1024;

function createDiscardStream() {
  return new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  });
}

function getMissingHeaderError(
  userId: string | undefined,
  scheduleId: string | undefined,
  instanceId: string | undefined,
) {
  if (!userId) {
    return 'Missing header `userId`';
  }

  if (!scheduleId) {
    return 'Missing header `streamScheduleId`';
  }

  if (!instanceId) {
    return 'Missing header `streamInstanceId`';
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (authHeader !== `Bearer ${serverConfig.secretArchiveToken}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    let userId = req.headers.get('userId') || undefined;
    let scheduleId = req.headers.get('streamScheduleId') || undefined;
    let instanceId = req.headers.get('streamInstanceId') || undefined;

    if (!req.body) {
      return new Response(JSON.stringify({ error: 'Missing request body' }), { status: 400 });
    }

    let fileReceived = false;
    let fileMimeType: string | null = null;
    let fileSizeBytes = 0;
    let filename: string | null = null;
    let fileError: string | null = null;
    let uploadPromise: Promise<Result<{ location: string }>> | null = null;
    let uploadAbort: (() => void) | null = null;
    let metadataPromise: ReturnType<typeof parseStream> | null = null;
    let uploadLocation: string | null = null;
    let teeStream: PassThrough | null = null;
    let uploadStream: PassThrough | null = null;
    let metadataStream: PassThrough | null = null;

    const form = formidable({
      multiples: false,
      allowEmptyFiles: false,
      maxFileSize: MAX_ARCHIVE_BYTES,
      fileWriteStreamHandler: (file) => {
        fileReceived = true;
        fileMimeType = file.mimetype || null;

        if (file.mimetype !== 'audio/mpeg') {
          fileError = 'Invalid file type';
          return createDiscardStream();
        }

        filename =
          userId && scheduleId && instanceId
            ? `archive-${userId}-${scheduleId}-${instanceId}-${Date.now()}.mp3`
            : `archive-${Date.now()}-${randomUUID()}.mp3`;

        const tee = new PassThrough();
        const uploadStreamLocal = new PassThrough();
        const metadataStreamLocal = new PassThrough();
        teeStream = tee;
        uploadStream = uploadStreamLocal;
        metadataStream = metadataStreamLocal;

        tee.on('data', (chunk) => {
          fileSizeBytes += chunk.length;
        });

        tee.pipe(uploadStreamLocal);
        tee.pipe(metadataStreamLocal);

        const uploadHandle = startArchiveUploadToS3({
          body: uploadStreamLocal,
          filename,
          contentType: file.mimetype ?? 'audio/mpeg',
        });

        uploadPromise = uploadHandle.done;
        uploadAbort = uploadHandle.abort;

        metadataPromise = parseStream(
          metadataStreamLocal,
          { mimeType: file.mimetype ?? 'audio/mpeg' },
          { duration: true },
        );

        return tee;
      },
    });

    form.on('field', (name, value) => {
      if (!userId && name === 'userId') {
        userId = value;
      }

      if (!scheduleId && name === 'streamScheduleId') {
        scheduleId = value;
      }

      if (!instanceId && name === 'streamInstanceId') {
        instanceId = value;
      }
    });

    const nodeStream = Readable.fromWeb(req.body as ReadableStream<Uint8Array>);
    (nodeStream as { headers?: Record<string, string> }).headers = Object.fromEntries(req.headers);
    (nodeStream as { method?: string }).method = req.method;
    (nodeStream as { url?: string }).url = req.url;

    try {
      await new Promise<void>((resolve, reject) => {
        form.parse(nodeStream as never, (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        });
      });
    } catch (err) {
      if (uploadAbort) {
        uploadAbort();
      }
      teeStream?.destroy(err instanceof Error ? err : undefined);
      uploadStream?.destroy(err instanceof Error ? err : undefined);
      metadataStream?.destroy(err instanceof Error ? err : undefined);
      void uploadPromise?.catch(() => {});
      void metadataPromise?.catch(() => {});
      if (filename) {
        await deleteArchiveFileFromS3(filename);
      }
      throw err;
    }

    if (!fileReceived) {
      return new Response(JSON.stringify({ error: 'File is required' }), { status: 400 });
    }

    if (fileError) {
      return new Response(JSON.stringify({ error: fileError }), { status: 400 });
    }

    if (!uploadPromise || !metadataPromise || !filename) {
      return new Response(JSON.stringify({ error: 'Failed to process upload stream' }), {
        status: 500,
      });
    }

    const [uploadResult, metadataResult] = await Promise.allSettled([
      uploadPromise,
      metadataPromise,
    ]);

    if (uploadResult.status === 'fulfilled' && uploadResult.value.type === 'success') {
      uploadLocation = uploadResult.value.data.location;
    }

    if (metadataResult.status === 'rejected') {
      if (uploadLocation) {
        await deleteArchiveFileFromS3(uploadLocation);
      }
      throw metadataResult.reason;
    }

    if (uploadResult.status === 'rejected') {
      throw uploadResult.reason;
    }

    const result = uploadResult.value;

    const missingHeaderError = getMissingHeaderError(userId, scheduleId, instanceId);
    if (missingHeaderError) {
      if (uploadLocation) {
        await deleteArchiveFileFromS3(uploadLocation);
      }
      return new Response(JSON.stringify({ error: missingHeaderError }), { status: 400 });
    }

    if (result.type === 'error') {
      return new Response(JSON.stringify({ error: result.message }), { status: 501 });
    }

    const metadata = metadataResult.value;
    const data = {
      userId: userId!,
      streamScheduleId: scheduleId!,
      streamInstanceId: instanceId!,
      url: result.data.location,
      durationInSeconds: metadata.format.duration
        ? Math.round(metadata.format.duration)
        : null,
      fileSizeBytes,
      format: fileMimeType || null,
      createdAt: new Date(),
    };

    const archive = await createStreamArchive(data);

    if (!archive) {
      const errMessages = ['Error creating archive in DB'];

      const deleteResult = await deleteArchiveFileFromS3(result.data.location);

      if (deleteResult.type === 'error') {
        console.log(deleteResult.message);
        errMessages.push(deleteResult.message);
      }

      return new Response(JSON.stringify({ error: errMessages.join(', ') }), { status: 501 });
    }

    return new Response(JSON.stringify({ success: true, url: archive.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), { status: 500 });
  }
}
