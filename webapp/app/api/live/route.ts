import { serverConfig } from '@/lib/server-config';

export async function GET() {
  try {
    const upstream = await fetch(
      `http://${serverConfig.icecastHost}:${serverConfig.icecastPort}/${serverConfig.icecastMount}`,
    );

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(`Stream not available: ${err}`, { status: 502 });
  }
}
