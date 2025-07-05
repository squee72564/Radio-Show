export async function GET() {
  const {
    ICECAST_HOST_WEBAPP,
    ICECAST_PORT,
    ICECAST_MOUNT,
  } = process.env;

  if (!ICECAST_HOST_WEBAPP || !ICECAST_PORT || !ICECAST_MOUNT) {
    return new Response("Env vars not set on server", {status: 500});
  }

  try {
    const upstream = await fetch(`http://${ICECAST_HOST_WEBAPP}:${ICECAST_PORT}/${ICECAST_MOUNT}`);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`Stream not available: ${err}`, { status: 502 });
  }
}