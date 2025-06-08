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
