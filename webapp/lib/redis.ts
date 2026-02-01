import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

let clientPromise: Promise<RedisClientType> | null = null;
let subscriberPromise: Promise<RedisClientType> | null = null;

function getRedisUrl() {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL is not set');
  }
  return url;
}

async function connectClient() {
  const client = createClient({ url: getRedisUrl() });
  client.on('error', (err) => console.error('Redis client error:', err));
  await client.connect();
  return client;
}

export function getRedisClient() {
  if (!clientPromise) {
    clientPromise = connectClient();
  }
  return clientPromise;
}

export function getRedisSubscriber() {
  if (!subscriberPromise) {
    subscriberPromise = connectClient();
  }
  return subscriberPromise;
}
