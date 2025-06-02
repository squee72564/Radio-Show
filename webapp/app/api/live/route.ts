export async function GET() {
  const upstream = await fetch("http://icecast:8000/live");

  if (!upstream.body) {
    return new Response("Stream not available", { status: 502 });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
