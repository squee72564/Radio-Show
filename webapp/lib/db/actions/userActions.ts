'use server';

import * as userService from "@/lib/db/services/userService";
import { $Enums, User } from "@prisma/client";
import { UserRelations } from "@/types/prisma-relations";
import { Result } from "@/types/generic";

export async function findUsersByRole(
  roleOrRoles: $Enums.Role | $Enums.Role[],
  options?: {include: {[K in keyof UserRelations]?: true}}
): Promise<(User & Partial<UserRelations>)[]> {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  return userService.findUsersByRole(roles, options);
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

export async function updateUserBio(
  userId: string,
  newBio: string
): Promise<Result<User>> {
  const result = await userService.updateUserBio(userId, newBio);

  if (!result) {
    return {type:"error", message: "User bio not updated!"}
  }

  return {type: "success", data: result};
}

export async function getUserCount() {
  return await userService.getUserCount();
}

export async function changeUserRole(
  userId: string,
  newRole: $Enums.Role
): Promise<Result<{message: string}>> {
  const result = await userService.changeUserRole(userId, newRole);
  if (!result) {
    return {type: "error", message: "Error changing user role"}
  }

  return {type: "success", data: {message: "User role successfully changed"}}
}