import { createStreamArchive } from "@/lib/db/actions/streamscheduleActions";
import { deleteArchiveFileFromS3, uploadArchiveFileToS3 } from "@/lib/S3Utils";
import { parseBuffer } from "music-metadata";
import { Result } from "@/types/generic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization") || "";
    if (authHeader !== `Bearer ${process.env.SECRET_ARCHIVE_TOKEN}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "File is required" }), { status: 400 });
    }

    if (file.type !== "audio/mpeg") {
      return new Response(JSON.stringify({ error: "Invalid file type" }), { status: 400 });
    }

    const userId = req.headers.get("userId") || formData.get("userId")?.toString();
    const scheduleId = req.headers.get("streamScheduleId") || formData.get("streamScheduleId")?.toString();
    const instanceId = req.headers.get("streamInstanceId") || formData.get("streamInstanceId")?.toString();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing header `userId`" }), { status: 400 });
    }

    if (!scheduleId) {
      return new Response(JSON.stringify({ error: "Missing header `streamScheduleId`" }), { status: 400 });
    }

    if (!instanceId) {
      return new Response(JSON.stringify({ error: "Missing header `streamInstanceId`" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await parseBuffer(buffer, file.type);

    const durationInSeconds = metadata.format.duration
      ? Math.round(metadata.format.duration)
      : undefined;

    const result = await uploadArchiveFileToS3({
      fileBuffer: buffer,
      filename: `archive-${userId}-${scheduleId}-${instanceId}-${Date.now()}.mp3`,
    }) as Result<{location: string}>;

    if (result.type === "error") {
      return new Response(JSON.stringify({ error: result.message }), { status: 501 });
    }

    const data = {
      userId,
      streamScheduleId: scheduleId,
      streamInstanceId: instanceId,
      url: result.data.location,
      durationInSeconds: durationInSeconds || null,
      fileSizeBytes: buffer.length,
      format: file.type || null,
      createdAt: new Date(),
    };

    const archive = await createStreamArchive(data);

    if (!archive) {
      const errMessages = ["Error creating archive in DB"];

      const deleteResult = await deleteArchiveFileFromS3(result.data.location);

      if (deleteResult.type === "error") {
        console.log(deleteResult.message)
        errMessages.push(deleteResult.message)
      }

      return new Response(JSON.stringify({ error: errMessages.join(", ") }), { status: 501 });
    }

    return new Response(JSON.stringify({ success: true, url: archive.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), { status: 500 });
  }
}