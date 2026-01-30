'use client';

import { useMemo } from 'react';
import useWebSocket from 'react-use-websocket';

export function useStreamStatus(getUrl: () => string) {
  const { lastMessage, readyState } = useWebSocket(getUrl(), {
    shouldReconnect: () => true,
    retryOnError: true,
  });

  const status = useMemo(() => {
    if (readyState === WebSocket.CLOSED || readyState === WebSocket.CLOSING) {
      return 'offline';
    }

    if (!lastMessage) return 'offline';

    try {
      const data =
        typeof lastMessage.data === 'string'
          ? lastMessage.data
          : JSON.stringify(lastMessage.data);

      const payload = JSON.parse(data);
      if (payload.status === 'live' || payload.status === 'offline') {
        return payload.status;
      }
    } catch {
      return 'offline';
    }

    return 'offline';
  }, [lastMessage, readyState]);

  return status;
}
