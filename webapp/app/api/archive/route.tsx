import { findStreamArchiveById } from "@/lib/db/actions/streamscheduleActions";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const referer = req.headers.get("referer");
  const allowedHosts = [process.env.SITE_URL!];

  if (!referer || !allowedHosts.some(host => referer.startsWith(host))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const url = new URL(req.url);
  const archiveId = url.searchParams.get("archiveId");

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

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: archive.url,
  });

  try {
    const { Body, ContentLength, ContentType } = await s3.send(command);

    const headers = new Headers();
    headers.set("Content-Type", ContentType || "audio/mpeg");
    headers.set("Cache-Control", "public, max-age=31536000");

    if (ContentLength !== undefined) {
      headers.set("Content-Length", ContentLength.toString());
    }

    return new NextResponse(Body as ReadableStream, {
      headers,
    });

  } catch (err) {
    console.error("S3 fetch error", err);
    return new NextResponse("File not found or inaccessible", { status: 404 });
  }
}
