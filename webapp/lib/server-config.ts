import 'server-only';
import { z } from 'zod';

const ServerConfigSchema = z.object({
  APP_ENV: z.enum(['development', 'test', 'production']),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_USER: z.string().min(1),
  REDIS_URL: z.string().min(1),
  ICECAST_HOST_WEBAPP: z.string().min(1),
  ICECAST_PORT: z.coerce.number().int().positive(),
  ICECAST_MOUNT: z.string().min(1),
  STREAM_STATUS_SECRET: z.string().min(1),
  SECRET_ARCHIVE_TOKEN: z.string().min(1),
  S3_ENDPOINT: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  S3_ROOT_USER: z.string().min(1),
  S3_ROOT_PASSWORD: z.string().min(1),
  S3_REGION: z.string().min(1),
});

const parsed = ServerConfigSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid server configuration: ${JSON.stringify(details)}`);
}

export const serverConfig = {
  appEnv: parsed.data.APP_ENV,
  nodeEnv: parsed.data.NODE_ENV,
  databaseUrl: parsed.data.DATABASE_URL,
  postgresHost: parsed.data.POSTGRES_HOST,
  postgresPort: parsed.data.POSTGRES_PORT,
  postgresUser: parsed.data.POSTGRES_USER,
  redisUrl: parsed.data.REDIS_URL,
  icecastHost: parsed.data.ICECAST_HOST_WEBAPP,
  icecastPort: parsed.data.ICECAST_PORT,
  icecastMount: parsed.data.ICECAST_MOUNT,
  streamStatusSecret: parsed.data.STREAM_STATUS_SECRET,
  secretArchiveToken: parsed.data.SECRET_ARCHIVE_TOKEN,
  s3Endpoint: parsed.data.S3_ENDPOINT,
  s3BucketName: parsed.data.S3_BUCKET_NAME,
  s3RootUser: parsed.data.S3_ROOT_USER,
  s3RootPassword: parsed.data.S3_ROOT_PASSWORD,
  s3Region: parsed.data.S3_REGION,
};

export type ServerConfig = typeof serverConfig;
