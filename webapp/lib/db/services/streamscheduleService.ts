import { prisma } from "@/lib/db/prismaClient";
import { $Enums, StreamInstance, StreamSchedule } from "@prisma/client";
import { RRule, rrulestr } from 'rrule'

export async function findAllPendingApprovalSchedules() {
  return await prisma.streamSchedule.findMany({
    where: { status: "PENDING" },
    orderBy: { submittedAt: "desc" },
  });
}

export async function findAllStreamsByTypeAndUser(userId: string, status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.findMany({
    where: {status: status, userId: userId},
  })
}

export async function getStreamCountByStatus(status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.count({
    where: { status: status },
  });
}

export async function generateStreamInstances(schedule: StreamSchedule) {
  const {
    startTime,
    endTime,
    startDate,
    endDate,
    rrule,
    id: streamScheduleId,
    userId,
  } = schedule;

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

  const data = occurrences.map((scheduledStart) => {
    const scheduledEnd = new Date(scheduledStart.getTime() + durationMs);

    return {
      scheduledStart,
      scheduledEnd,
      userId,
      streamScheduleId,
    };
  })

  await prisma.streamInstance.createMany({
    data,
    skipDuplicates: true,
  })
}