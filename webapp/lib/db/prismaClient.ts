import { PrismaClient } from '@prisma/client';
import { serverConfig } from '@/lib/server-config';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (serverConfig.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}
