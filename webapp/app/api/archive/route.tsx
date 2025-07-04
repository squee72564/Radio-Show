import { findStreamArchiveById } from "@/lib/db/actions/streamscheduleActions";
import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const url = new URL(req.url);
  const archiveId = url.searchParams.get("archiveId");
  const range = req.headers.get("range");


  if (!archiveId) {
    return new NextResponse("Missing filename", { status: 400 });
  }

  const archive = await findStreamArchiveById(archiveId);

  if (!archive) {
    return new NextResponse("Archive not found", {status: 404});
  }

  const {
    S3_ENDPOINT,
    S3_REGION,
    S3_ROOT_USER,
    S3_ROOT_PASSWORD,
    S3_BUCKET_NAME
  } = process.env;

  if (!S3_ENDPOINT || !S3_REGION || !S3_ROOT_USER || !S3_ROOT_PASSWORD || !S3_BUCKET_NAME) {
    console.log("Missing env vars")
    return new NextResponse("Missing env vars", {status: 500});
  }

  const s3 = new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ROOT_USER,
      secretAccessKey: S3_ROOT_PASSWORD,
    },
    forcePathStyle: true,
  });

  const s3Data = {
    Bucket: S3_BUCKET_NAME,
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
        headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
        headers.set("Content-Length", (end - start + 1).toString());
      }
    } else {
      headers.set("Content-Length", fileSize.toString());
    }

    const command = new GetObjectCommand({
      ...s3Data,
      Range: `bytes=${start}-${end}`,
    });

    const { Body, ContentType } = await s3.send(command);

    headers.set("Content-Type", ContentType || "audio/mpeg");
    headers.set("Cache-Control", "public, max-age=31536000");
    headers.set("Accept-Ranges", "bytes");

    return new NextResponse(Body as ReadableStream, {
      status: range ? 206 : 200,
      headers,
    });

  } catch (err) {
    console.error("S3 fetch error", err);
    return new NextResponse("File not found or inaccessible", { status: 404 });
  }
}
