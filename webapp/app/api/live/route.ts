const icecastHost = process.env.ICECAST_HOST || "localhost";
const icecastPort = process.env.ICECAST_PORT || "8000";
const icecastMount = process.env.ICECAST_MOUNT || "live";

export async function GET() {
  try {
    const upstream = await fetch(`http://${icecastHost}:${icecastPort}/${icecastMount}`);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`Stream not available: ${err}`, { status: 502 });
  }
}
