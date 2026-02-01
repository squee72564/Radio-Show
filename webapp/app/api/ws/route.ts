import type { WebSocket, WebSocketServer } from 'ws';
import type { NextRequest } from 'next/server';
import type { RouteContext } from 'next-ws/server';
import { LiveState } from '@/lib/live-state';

export function GET() {
  const headers = new Headers();
  headers.set('Connection', 'Upgrade');
  headers.set('Upgrade', 'websocket');
  return new Response('Upgrade Required', { status: 426, headers });
}

export function UPGRADE(
  client: WebSocket,
  _server: WebSocketServer,
  _request: NextRequest,
  _context: RouteContext<'/api/ws'>,
) {
  LiveState.addClient(client);
  client.send(JSON.stringify({ status: LiveState.getStatus() }));

  return () => LiveState.removeClient(client);
}
