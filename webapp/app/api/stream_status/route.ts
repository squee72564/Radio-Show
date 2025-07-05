import { LiveState } from '@/lib/live-state';

export async function POST(request: Request) {
  const body = await request.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (parsed !== 'live' && parsed !== 'offline') {
    return new Response('Invalid status', { status: 400 });
  }

  LiveState.setStatus(parsed);
  console.log("Broadcasting status:", LiveState.getStatus());
  LiveState.broadcastStatus();

  return new Response('Status updated');
}

export async function GET() { 
  const {
    ICECAST_HOST_WEBAPP,
    ICECAST_PORT,
    ICECAST_MOUNT,
  } = process.env;

  if (!ICECAST_HOST_WEBAPP || !ICECAST_PORT || !ICECAST_MOUNT) {
    return new Response("Env vars not set on server", { status: 500 });
  }

  try {
    const upstream = await fetch(`http://${ICECAST_HOST_WEBAPP}:${ICECAST_PORT}/${ICECAST_MOUNT}`, {
      headers: { Range: "bytes=0-0" },
    });

    const status: "live" | "offline" = (upstream.ok) ? "live" : "offline";

    LiveState.setStatus(status);
    console.log("Broadcasting status:", LiveState.getStatus());
    LiveState.broadcastStatus();

    return new Response(JSON.stringify({ status: upstream.status }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ status: "error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
