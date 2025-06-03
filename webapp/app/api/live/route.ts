const icecastHost = process.env.ICECAST_HOST || "localhost";
const icecastPort = process.env.ICECAST_PORT || "8000";
const icecastMount = process.env.ICECAST_MOUNT || "live";

export async function GET() {
  const upstream = await fetch(`http://${icecastHost}:${icecastPort}/${icecastMount}`);

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
