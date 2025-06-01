import { prisma } from "@/lib/db/prismaClient";

export async function findConfigById(id: string) {
  return prisma.systemConfig.findUnique({ where: { id } });
}

export async function findServerById (id: string) {
  return prisma.icecastServer.findUnique({ where: { id } });
}