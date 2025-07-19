export const runtime = 'nodejs';
export const dynamic = "force-dynamic";
export const revalidate = 0;

import client from 'prom-client';

const globalForPrometheus = globalThis as unknown as {
  prometheusMetricsInitialized?: boolean;
};

if (!globalForPrometheus.prometheusMetricsInitialized) {
  client.collectDefaultMetrics();
  globalForPrometheus.prometheusMetricsInitialized = true;
}

export async function GET() {
  const metrics = await client.register.metrics();

  return new Response(metrics, {
    status: 200,
    headers: {
      'Content-Type': client.register.contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
