import { prisma } from "@/lib/db/prismaClient";
import { $Enums } from "@prisma/client";

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

export async function findUsersByRole(role: $Enums.Role) {
  return prisma.user.findMany({where: {status: role}});
}

export async function findRecentUsers(count: number) {
  return prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: count,
  });
}

export async function updateUserBio(userId: string, newBio: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { bio: newBio }
  });
}

export async function getUserCount() {
  return await prisma.user.count();
}

export async function changeUserRole(userId: string, newRole: $Enums.Role) {
  return await prisma.user.update({
    where: {id: userId},
    data: {status: newRole}
  });
}