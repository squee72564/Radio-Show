export const runtime = 'nodejs';

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
    },
  });
}
