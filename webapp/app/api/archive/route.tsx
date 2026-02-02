import { findStreamArchiveById } from '@/lib/db/actions/streamscheduleActions';
import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { serverConfig } from '@/lib/server-config';
import { Readable } from 'node:stream';

function toResponseBody(body: unknown): ReadableStream<Uint8Array> | Uint8Array | null {
  if (!body) return null;

  if (body instanceof Readable) {
    return Readable.toWeb(body) as ReadableStream<Uint8Array>;
  }

  if (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream) {
    return body;
  }

  if (body instanceof Uint8Array) {
    return body;
  }

  if (body instanceof ArrayBuffer) {
    return new Uint8Array(body);
  }

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return body.stream();
  }

  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const archiveId = url.searchParams.get('archiveId');
  const range = req.headers.get('range');

  if (!archiveId) {
    return new NextResponse('Missing archiveId', { status: 400 });
  }

  const archive = await findStreamArchiveById(archiveId);

  if (!archive) {
    return new NextResponse('Archive not found', { status: 404 });
  }

  const s3 = new S3Client({
    endpoint: serverConfig.s3Endpoint,
    region: serverConfig.s3Region,
    credentials: {
      accessKeyId: serverConfig.s3RootUser,
      secretAccessKey: serverConfig.s3RootPassword,
    },
    forcePathStyle: true,
  });

  const s3Data = {
    Bucket: serverConfig.s3BucketName,
    Key: archive.url,
  };

  try {
    const headCommand = new HeadObjectCommand(s3Data);

    const headData = await s3.send(headCommand);
    const fileSize = headData.ContentLength ?? 0;

    let start = 0;
    let end = fileSize - 1;

    const headers = new Headers();

    if (range) {
      const match = range.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        start = parseInt(match[1], 10);
        end = match[2] ? parseInt(match[2], 10) : end;
        headers.set('Content-Range', `bytes ${start}-${end}/${fileSize}`);
        headers.set('Content-Length', (end - start + 1).toString());
      }
    } else {
      headers.set('Content-Length', fileSize.toString());
    }

    const command = new GetObjectCommand({
      ...s3Data,
      Range: `bytes=${start}-${end}`,
    });

    const { Body, ContentType } = await s3.send(command);
    const responseBody = toResponseBody(Body);

    if (!responseBody) {
      return new NextResponse('File not found or inaccessible', { status: 404 });
    }

    headers.set('Content-Type', ContentType || 'audio/mpeg');
    headers.set('Cache-Control', 'public, max-age=31536000');
    headers.set('Accept-Ranges', 'bytes');

    return new NextResponse(responseBody, {
      status: range ? 206 : 200,
      headers,
    });
  } catch (err) {
    console.error('S3 fetch error', err);
    return new NextResponse('File not found or inaccessible', { status: 404 });
  }
}
