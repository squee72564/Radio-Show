import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Result } from "@/types/generic";
import { StreamArchive } from "@prisma/client";

export async function uploadArchiveFileToS3({
  fileBuffer,
  filename,
}: {
  fileBuffer: Buffer;
  filename: string;
}): Promise<Result<{location: string}>> {
  const {
    S3_ENDPOINT,
    S3_BUCKET_NAME,
    S3_ROOT_USER,
    S3_ROOT_PASSWORD,
    S3_REGION,
  } = process.env;

  if (!S3_ENDPOINT || !S3_BUCKET_NAME || !S3_ROOT_USER || !S3_ROOT_PASSWORD || !S3_REGION) {
    return {
      type: "error",
      message: "Missing required S3 environment variables",
    };
  }

  const s3 = new S3Client({
    endpoint: S3_ENDPOINT,
    credentials: {
      accessKeyId: S3_ROOT_USER,
      secretAccessKey: S3_ROOT_PASSWORD,
    },
    forcePathStyle: true,
    region: S3_REGION,
  });

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: filename,
        Body: fileBuffer,
        ContentType: "audio/mpeg",
      })
    );

    return { type: "success", data: {location: filename} };
  } catch (err) {
    return {
      type: "error",
      message: `S3 upload failed: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}

export async function deleteArchiveFileFromS3(
  streamArchive: StreamArchive
): Promise<Result<{success: boolean}>> {
  const {
    S3_ENDPOINT,
    S3_BUCKET_NAME,
    S3_ROOT_USER,
    S3_ROOT_PASSWORD,
    S3_REGION,
  } = process.env;

  if (!S3_ENDPOINT || !S3_BUCKET_NAME || !S3_ROOT_USER || !S3_ROOT_PASSWORD || !S3_REGION) {
    return {
      type: "error",
      message: "Missing required S3 environment variables",
    };
  }

  const s3 = new S3Client({
    endpoint: S3_ENDPOINT,
    credentials: {
      accessKeyId: S3_ROOT_USER,
      secretAccessKey: S3_ROOT_PASSWORD,
    },
    forcePathStyle: true,
    region: S3_REGION,
  });

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: streamArchive.url,
      })
    );

    return { type: "success", data: {success: true} };
  } catch (err) {
    return {
      type: "error",
      message: `S3 delete failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}