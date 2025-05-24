import prisma from "@/lib/db/prismaClient";

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findAllUsers() {
  return prisma.user.findMany();
}

export async function createUser(data: { email: string; name?: string }) {
  return prisma.user.create({ data });
}