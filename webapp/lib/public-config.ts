import { z } from 'zod';

const PublicConfigSchema = z.object({
  NEXT_PUBLIC_WS_URL: z.string().min(1).optional(),
});

const rawPublicEnv = {
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
};

const parsed = PublicConfigSchema.safeParse(rawPublicEnv);

if (!parsed.success) {
  throw new Error(
    `Invalid public configuration: ${JSON.stringify(
      parsed.error.flatten().fieldErrors
    )}`
  );
}

export const publicConfig = {
  wsUrl: parsed.data.NEXT_PUBLIC_WS_URL,
};

