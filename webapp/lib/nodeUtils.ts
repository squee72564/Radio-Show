import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const STORAGE_BACKEND = process.env.STORAGE_BACKEND;

export type UploadResult =
  | {
      type: "success";
      location: string;
    }
  | {
      type: "error";
      message: string;
    };

export async function uploadStreamFile({
  fileBuffer,
  filename,
}: {
  fileBuffer: Buffer;
  filename: string;
}): Promise<UploadResult> {

  if (STORAGE_BACKEND === "local") {
    const uploadPath = "public/uploads";
    const fullPath = path.join(uploadPath, filename);

    try {
      fs.mkdirSync(uploadPath, { recursive: true });
      fs.writeFileSync(fullPath, fileBuffer);
      return { type: "success", location: path.join("uploads", filename) };
    } catch (err) {
      return { type: "error", message: `Local upload failed: ${String(err)}` };
    }
  }

  if (STORAGE_BACKEND === "s3") {
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

      return { type: "success", location: filename };
    } catch (err) {
      return { type: "error", message: `S3 upload failed: ${String(err)}` };
    }
  }

  return { type: "error", message: "Unsupported storage backend" };
}