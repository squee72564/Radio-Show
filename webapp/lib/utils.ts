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
  startTime,
  endTime,
  startDate,
  endDate,
  rrule
} : {
  startTime: Date,
  endTime: Date,
  startDate: Date,
  endDate: Date,
  rrule: string
}) {
  const dtstart = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate(),
      startTime.getUTCHours(),
      startTime.getUTCMinutes()
    )
  );

  const until = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate(),
      endTime.getUTCHours(),
      endTime.getUTCMinutes()
    )
  );

  const rule = rrulestr(rrule, {
    dtstart,
  }) as RRule;

  const occurrences = rule.between(dtstart, until, true);
  const durationMs = endTime.getTime() - startTime.getTime()

  return occurrences.map((scheduledStart) => {
    const scheduledEnd = new Date(scheduledStart.getTime() + durationMs);

    return {
      scheduledStart,
      scheduledEnd,
    };
  })
}