import { z } from 'zod';
import { setStreamStatus } from '@/lib/stream-status';

const StreamStatusSchema = z.object({
  status: z.enum(['live', 'offline']),
});

export async function POST(request: Request) {
  const auth = request.headers.get('Authorization') || '';

  if (auth !== `Bearer ${process.env.STREAM_STATUS_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.text();

  let parsed;
  try {
    parsed = StreamStatusSchema.safeParse(JSON.parse(body));
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!parsed.success) {
    return new Response('Invalid Stream Status', { status: 400 });
  }

  const { status } = parsed.data;

  await setStreamStatus(status);
  console.log('Broadcasting status:', status);

  return new Response('Status updated');
}

export async function GET() {
  const { ICECAST_HOST_WEBAPP, ICECAST_PORT, ICECAST_MOUNT } = process.env;

  if (!ICECAST_HOST_WEBAPP || !ICECAST_PORT || !ICECAST_MOUNT) {
    return new Response('Env vars not set on server', { status: 500 });
  }

  try {
    const upstream = await fetch(`http://${ICECAST_HOST_WEBAPP}:${ICECAST_PORT}/${ICECAST_MOUNT}`);
    const status = upstream.ok ? 'live' : 'offline';
    await setStreamStatus(status);
    console.log('Broadcasting status:', status);

    return new Response(JSON.stringify({ status: status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ status: 'error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
