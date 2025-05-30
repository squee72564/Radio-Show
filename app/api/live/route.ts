import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("http://localhost:8000/live");
  const body = res.body;
  return new NextResponse(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "audio/mpeg",
    },
  });
}