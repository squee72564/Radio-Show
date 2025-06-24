'use server';

import * as userService from "@/lib/db/services/userService";
import { $Enums, User } from "@prisma/client";
import { UserRelations } from "@/types/prisma-relations";

export async function listUsers() {
  return userService.findAllUsers();
}

export async function listUsersByRole(roleOrRoles: $Enums.Role | $Enums.Role[]) {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  return userService.findUsersByRole(roles);
}

export async function deleteUsers() {
  return userService.deleteAllUsers();
}

export async function findUserById(
  id: string,
  options?: { include?: { [K in keyof UserRelations]?: true } }
): Promise<(User & Partial<UserRelations>) | null> {
  return userService.findUserById(id, options);
}

export async function findUserByEmail(
  email: string,
  options?: { include?: { [K in keyof UserRelations]?: true } }
): Promise<(User & Partial<UserRelations>) | null> {
  return userService.findUserByEmail(email, options);
}

export async function findRecentUsers(count: number) {
  return userService.findRecentUsers(count);
}

export async function updateUserBio(userId: string | undefined, newBio: string) {
  if (userId === undefined)  return;
  return userService.updateUserBio(userId, newBio);
}

export async function getUserCount() {
  return await userService.getUserCount();
}

export async function changeUserRole(userId: string, newRole: $Enums.Role) {
  return await userService.changeUserRole(userId, newRole);
}