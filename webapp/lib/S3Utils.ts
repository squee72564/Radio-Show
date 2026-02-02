import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Result } from '@/types/generic';
import { serverConfig } from '@/lib/server-config';

export async function uploadArchiveFileToS3({
  fileBuffer,
  filename,
}: {
  fileBuffer: Buffer;
  filename: string;
}): Promise<Result<{ location: string }>> {
  const s3 = new S3Client({
    endpoint: serverConfig.s3Endpoint,
    credentials: {
      accessKeyId: serverConfig.s3RootUser,
      secretAccessKey: serverConfig.s3RootPassword,
    },
    forcePathStyle: true,
    region: serverConfig.s3Region,
  });

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: serverConfig.s3BucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: 'audio/mpeg',
      }),
    );

    return { type: 'success', data: { location: filename } };
  } catch (err) {
    return {
      type: 'error',
      message: `S3 upload failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function deleteArchiveFileFromS3(
  streamArchiveURL: string,
): Promise<Result<{ success: boolean }>> {
  const s3 = new S3Client({
    endpoint: serverConfig.s3Endpoint,
    credentials: {
      accessKeyId: serverConfig.s3RootUser,
      secretAccessKey: serverConfig.s3RootPassword,
    },
    forcePathStyle: true,
    region: serverConfig.s3Region,
  });

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
