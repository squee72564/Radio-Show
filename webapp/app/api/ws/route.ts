import type { WebSocket, WebSocketServer } from 'ws';
import type { NextRequest } from 'next/server';
import type { RouteContext } from 'next-ws/server';
import { getRedisSubscriber } from '@/lib/redis';
import { getStreamStatus, STREAM_STATUS_CHANNEL } from '@/lib/stream-status';

let wsServer: WebSocketServer | null = null;
let subscriberInitialized = false;
let subscriberInitPromise: Promise<void> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let retryAttempts = 0;
let activeSubscriber: Awaited<ReturnType<typeof getRedisSubscriber>> | null = null;
let subscriberListenersAttached = false;

const BASE_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 15000;

function scheduleSubscriberRetry() {
  if (retryTimer) return;

  const delay = Math.min(BASE_RETRY_DELAY_MS * 2 ** retryAttempts, MAX_RETRY_DELAY_MS);
  retryAttempts += 1;

  console.warn(`Redis subscriber retry scheduled in ${delay}ms`);
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void initSubscriber();
  }, delay);
}

function attachSubscriberListeners(subscriber: Awaited<ReturnType<typeof getRedisSubscriber>>) {
  if (subscriberListenersAttached) return;
  subscriberListenersAttached = true;

  subscriber.on('end', () => {
    console.warn('Redis subscriber connection ended. Scheduling retry.');
    subscriberInitialized = false;
    activeSubscriber = null;
    subscriberListenersAttached = false;
    scheduleSubscriberRetry();
  });
}

async function initSubscriber() {
  if (subscriberInitialized) return;
  if (subscriberInitPromise) return subscriberInitPromise;

  subscriberInitPromise = (async () => {
    try {
      const subscriber = await getRedisSubscriber();
      activeSubscriber = subscriber;
      attachSubscriberListeners(subscriber);

      await subscriber.subscribe(STREAM_STATUS_CHANNEL, (message) => {
        if (!wsServer) return;

        for (const client of wsServer.clients) {
          if (client.readyState === client.OPEN) {
            client.send(message);
          }
        }
      });

      subscriberInitialized = true;
      retryAttempts = 0;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      console.log('Redis subscriber initialized');
    } catch (err) {
      subscriberInitialized = false;
      if (activeSubscriber) {
        try {
          await activeSubscriber.quit();
        } catch {
          // Ignore cleanup errors; retry will rebuild the subscriber.
        }
      }
      activeSubscriber = null;
      subscriberListenersAttached = false;
      console.error('Failed to initialize Redis subscriber:', err);
      scheduleSubscriberRetry();
    } finally {
      subscriberInitPromise = null;
    }
  })();

  return subscriberInitPromise;
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
