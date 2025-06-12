import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs";
import { $Enums } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function saltAndHashPassword(password: string): string {
  return password;
}

export function encryptSync(password: string) {
  const saltRounds = Number(process.env.SALT_ROUNDS || 10); // 10 is default and safe
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function isUserAdmin(status: $Enums.Role) {
  return (status === $Enums.Role.ADMIN|| status === $Enums.Role.OWNER)
}