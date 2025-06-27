import { prisma } from "@/lib/db/prismaClient";
import { $Enums, User } from "@prisma/client";
import { UserRelations } from "@/types/prisma-relations";

export async function deleteAllUsers() {
  return prisma.user.deleteMany();
}

export async function findUserById(
  id: string,
  options?: { include?: { [K in keyof UserRelations]?: true } }
): Promise<(User & Partial<UserRelations>) | null> {
  return await prisma.user.findUnique({
    where: { id },
    ...(options ?? {}),
  });
}

export async function findUserByEmail(
  email: string,
  options?: { include?: { [K in keyof UserRelations]?: true } }
): Promise<(User & Partial<UserRelations>) | null> {
  return await prisma.user.findUnique({
    where: { email },
    ...(options ?? {}),
  });
}

export async function findUsersByRole(
  roles: $Enums.Role[],
  options?: {include: {[K in keyof UserRelations]?: true}}
): Promise<(User & Partial<UserRelations>)[]> {
  return prisma.user.findMany({
    where: {
      status: {
        in: roles,
      },
      ...(options ?? {}),
    },
  });
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