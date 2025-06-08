import type WebSocket from 'ws';
import { LiveState } from '@/lib/live-state';

export function GET() {
  const headers = new Headers();
  headers.set('Connection', 'Upgrade');
  headers.set('Upgrade', 'websocket');
  return new Response('Upgrade Required', { status: 426, headers });
}

export function SOCKET(client: WebSocket) {
  LiveState.addClient(client);
  client.send(JSON.stringify({ status: LiveState.getStatus() }));

  return () => LiveState.removeClient(client);
}
