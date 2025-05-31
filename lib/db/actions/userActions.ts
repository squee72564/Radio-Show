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

export async function findRecentUsers(count: number) {
  return userService.findRecentUsers(count);
}