import { z } from 'zod';
import { setStreamStatus } from '@/lib/stream-status';
import { serverConfig } from '@/lib/server-config';

const StreamStatusSchema = z.object({
  status: z.enum(['live', 'offline']),
});

export async function POST(request: Request) {
  const auth = request.headers.get('Authorization') || '';

  if (auth !== `Bearer ${serverConfig.streamStatusSecret}`) {
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
  try {
    const upstream = await fetch(
      `http://${serverConfig.icecastHost}:${serverConfig.icecastPort}/${serverConfig.icecastMount}`,
    );
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
