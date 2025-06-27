import fs from "fs";
import path from "path";
//import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const STORAGE_BACKEND = process.env.STORAGE_BACKEND;

export async function uploadStreamFile({
  fileBuffer,
  filename,
}: {
  fileBuffer: Buffer;
  filename: string;
}) {
  if (STORAGE_BACKEND === "local") {
    const uploadPath = "public/uploads";
    const fullPath = path.join(uploadPath, filename);

    // Ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    // Write to disk
    fs.writeFileSync(fullPath, fileBuffer);

    return { location: path.join("uploads", filename) };
  }

  // if (STORAGE_BACKEND === "s3") {
  //   const s3 = new S3Client({
  //     region: process.env.S3_REGION,
  //     endpoint: process.env.S3_ENDPOINT, // optional for AWS
  //     credentials: {
  //       accessKeyId: process.env.S3_ACCESS_KEY!,
  //       secretAccessKey: process.env.S3_SECRET_KEY!,
  //     },
  //   });

  //   await s3.send(
  //     new PutObjectCommand({
  //       Bucket: process.env.S3_BUCKET_NAME!,
  //       Key: filename,
  //       Body: fileBuffer,
  //       ContentType: "audio/mpeg",
  //     })
  //   );

  //   const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${filename}`;
  //   console.log("Uploaded to S3:", fileUrl);
  //   return { location: fileUrl };
  // }

  throw new Error("Unsupported storage backend");
}
