'use client';

import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

export function useStreamStatus(getUrl: () => string) {
  const [status, setStatus] = useState<'live' | 'offline'>('offline');

  const { lastMessage, readyState } = useWebSocket(getUrl(), {
    shouldReconnect: () => true,
    retryOnError: true,
  });

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data =
        typeof lastMessage.data === 'string'
          ? lastMessage.data
          : JSON.stringify(lastMessage.data); // Fallback if not string (shouldn't happen with react-use-websocket)

      const payload = JSON.parse(data);
      if (payload.status === 'live' || payload.status === 'offline') {
        setStatus(payload.status);
      }
    } catch {
      setStatus('offline');
    }
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === WebSocket.CLOSED || readyState === WebSocket.CLOSING) {
      setStatus('offline');
    }
  }, [readyState]);

  return status;
}
