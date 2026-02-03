import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Result } from '@/types/generic';
import { serverConfig } from '@/lib/server-config';
import { Readable } from 'node:stream';

function createS3Client() {
  return new S3Client({
    endpoint: serverConfig.s3Endpoint,
    credentials: {
      accessKeyId: serverConfig.s3RootUser,
      secretAccessKey: serverConfig.s3RootPassword,
    },
    forcePathStyle: true,
    region: serverConfig.s3Region,
  });
}

export type ArchiveUploadHandle = {
  abort: () => void;
  done: Promise<Result<{ location: string }>>;
};

export function startArchiveUploadToS3({
  body,
  filename,
  contentType,
  contentLength,
}: {
  body: Readable;
  filename: string;
  contentType: string;
  contentLength?: number;
}): ArchiveUploadHandle {
  const s3 = createS3Client();

  const upload = new Upload({
    client: s3,
    leavePartsOnError: false,
    params: {
      Bucket: serverConfig.s3BucketName,
      Key: filename,
      Body: body,
      ContentType: contentType,
      ...(contentLength ? { ContentLength: contentLength } : {}),
    },
  });

  const done = upload
    .done()
    .then(() => ({ type: 'success', data: { location: filename } }) as const)
    .catch((err) => ({
      type: 'error',
      message: `S3 upload failed: ${err instanceof Error ? err.message : String(err)}`,
    }));

  return {
    done,
    abort: () => upload.abort(),
  };
}

export async function deleteArchiveFileFromS3(
  streamArchiveURL: string,
): Promise<Result<{ success: boolean }>> {
  const s3 = createS3Client();

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: serverConfig.s3BucketName,
        Key: streamArchiveURL,
      }),
    );

    return { type: 'success', data: { success: true } };
  } catch (err) {
    return {
      type: 'error',
      message: `S3 delete failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
