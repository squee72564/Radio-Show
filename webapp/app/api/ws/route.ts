import type { WebSocket, WebSocketServer } from 'ws';
import type { NextRequest } from 'next/server';
import type { RouteContext } from 'next-ws/server';
import { getRedisSubscriber } from '@/lib/redis';
import { getStreamStatus, STREAM_STATUS_CHANNEL } from '@/lib/stream-status';

let wsServer: WebSocketServer | null = null;
let subscriberInitialized = false;

async function initSubscriber() {
  if (subscriberInitialized) return;
  subscriberInitialized = true;

  try {
    const subscriber = await getRedisSubscriber();
    await subscriber.subscribe(STREAM_STATUS_CHANNEL, (message) => {
      if (!wsServer) return;

      for (const client of wsServer.clients) {
        if (client.readyState === client.OPEN) {
          client.send(message);
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize Redis subscriber:', err);
  }
}

void initSubscriber();

export function GET() {
  const headers = new Headers();
  headers.set('Connection', 'Upgrade');
  headers.set('Upgrade', 'websocket');
  return new Response('Upgrade Required', { status: 426, headers });
}

export function UPGRADE(
  client: WebSocket,
  server: WebSocketServer,
  _request: NextRequest,
  _context: RouteContext<'/api/ws'>,
) {
  wsServer = server;
  void initSubscriber();

  void (async () => {
    try {
      const status = (await getStreamStatus()) ?? 'offline';
      client.send(JSON.stringify({ status }));
    } catch (err) {
      console.error('Failed to load stream status:', err);
      client.send(JSON.stringify({ status: 'offline' }));
    }
  })();

  return () => {
    if (wsServer === server && server.clients.size === 0) {
      wsServer = null;
    }
  };
}
