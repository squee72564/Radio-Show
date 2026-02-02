import { publicConfig } from '@/lib/public-config';

export function getWebSocketUrl(path = '/api/ws') {
  if (publicConfig.wsUrl) return publicConfig.wsUrl;

  if (typeof window === 'undefined') return '';

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}${path}`;
}
