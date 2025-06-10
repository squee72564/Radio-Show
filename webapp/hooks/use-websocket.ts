'use client';

import { useEffect, useRef } from 'react';

export function useWebSocket(urlFn: () => string) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(urlFn());
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('[WebSocket] Connected');
    };

    ws.onerror = (e) => {
      console.log('[WebSocket] Error:', e);
    };

    ws.onclose = (e) => {
      console.log('[WebSocket] Closed:', e.reason);
    };

    return () => {
      ws.close(1000, 'Component unmounted');
      socketRef.current = null;
    };
  }, []);

  return socketRef;
}
