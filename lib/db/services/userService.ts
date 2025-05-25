import { prisma } from "@/lib/db/prismaClient";

export async function deleteAllUsers() {
  return prisma.user.deleteMany();
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findAllUsers() {
  return prisma.user.findMany();
}