'use server';

import * as userService from "@/lib/db/services/userService";

export async function listUsers() {
  return userService.findAllUsers();
}

export async function deleteUsers() {
  return userService.deleteAllUsers();
}

export async function findUserById(id: string) {
  return userService.findUserById(id);
}

export async function findUserByEmail(email: string) {
  return userService.findUserByEmail(email);
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