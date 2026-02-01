export function getWebSocketUrl(path = '/api/ws') {
  const override = process.env.NEXT_PUBLIC_WS_URL;
  if (override) return override;

  if (typeof window === 'undefined') return '';

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}${path}`;
}
