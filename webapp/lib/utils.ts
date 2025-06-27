import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { $Enums } from "@prisma/client";
import { RRule, rrulestr } from "rrule";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function saltAndHashPassword(password: string): string {
  return password;
}

export function isUserRole(userStatus: $Enums.Role, role: $Enums.Role) {
  return userStatus == role;
}

export function isUserAdmin(status: $Enums.Role) {
  return (status === $Enums.Role.ADMIN|| status === $Enums.Role.OWNER)
}

export function isUserOwner(status: $Enums.Role) {
  return (status === $Enums.Role.OWNER)
}

export async function generateStreamInstances({
  dtstart,
  until,
  durationMs,
  rrule
} : {
  dtstart: Date,
  until: Date,
  durationMs: number,
  rrule: string
}) {

  const rule = rrulestr(rrule, {
    dtstart,
  }) as RRule;

  const occurrences = rule.between(dtstart, until, true);

  return occurrences.map((scheduledStart) => {
    const scheduledEnd = new Date(scheduledStart.getTime() + durationMs);

    return {
      scheduledStart,
      scheduledEnd,
    };
  })
}

export function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}