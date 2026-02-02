import { z } from 'zod';

const PublicConfigSchema = z.object({
  NEXT_PUBLIC_WS_URL: z.string().min(1).optional(),
});

const parsed = PublicConfigSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid public configuration: ${JSON.stringify(details)}`);
}

export const publicConfig = {
  wsUrl: parsed.data.NEXT_PUBLIC_WS_URL,
};

export type PublicConfig = typeof publicConfig;
