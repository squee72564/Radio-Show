import { getRedisClient } from '@/lib/redis';

export const STREAM_STATUS_KEY = 'stream_status';
export const STREAM_STATUS_CHANNEL = 'stream_status_updates';

export type StreamStatus = 'live' | 'offline';

function isStreamStatus(value: string | null): value is StreamStatus {
  return value === 'live' || value === 'offline';
}

export async function getStreamStatus(): Promise<StreamStatus | null> {
  const client = await getRedisClient();
  const value = await client.get(STREAM_STATUS_KEY);
  return isStreamStatus(value) ? value : null;
}

export async function setStreamStatus(status: StreamStatus): Promise<void> {
  const client = await getRedisClient();
  const payload = JSON.stringify({ status });
  await client.set(STREAM_STATUS_KEY, status);
  await client.publish(STREAM_STATUS_CHANNEL, payload);
}
