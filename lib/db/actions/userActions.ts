'use server';

import * as userService from "../services/userService";

export async function listUsers() {
  return userService.findAllUsers();
}

export async function deleteUsers() {
  return userService.deleteAllUsers();
}

export async function findUserById(id: string) {
  return userService.findUserById(id);
}