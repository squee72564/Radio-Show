'use server';

import * as userService from "../services/userService";

export async function listUsers() {
  return userService.findAllUsers();
}

export async function deleteUsers() {
  return userService.deleteAllUsers();
}

export async function registerUser(email: string, name: string, password: string) {
  const existing = await userService.findUserByEmail(email);
  if (existing) throw new Error('User already exists');
  return userService.createUser({ email, name, password});
}

export async function CreateUserTest() {
  return userService.createdUserIncrement();
}