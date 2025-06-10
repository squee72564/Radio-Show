'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';

export function useStreamStatus(url: () => string) {
  const socketRef = useWebSocket(url);
  const [status, setStatus] = useState<'live' | 'offline'>('offline');

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessage = async (event: MessageEvent) => {
      console.log("WS message received:", event.data);

      try {
        const data = typeof event.data === 'string'
          ? event.data
          : await event.data.text();
        const payload = JSON.parse(data);
        if (payload.status === 'live' || payload.status === 'offline') {
          setStatus(payload.status);
        }
      } catch {
        setStatus('offline');
      }
    };

    const handleError = () => setStatus('offline');
    const handleClose = (event: CloseEvent) => {
      if (!event.wasClean) setStatus('offline');
    };

    socket.addEventListener('message', handleMessage);
    socket.addEventListener('error', handleError);
    socket.addEventListener('close', handleClose);

    return () => {
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('error', handleError);
      socket.removeEventListener('close', handleClose);
    };
  }, [socketRef.current]);

  return status;
}
