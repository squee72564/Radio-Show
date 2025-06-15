import { prisma } from "@/lib/db/prismaClient";
import { $Enums } from "@prisma/client";

export async function findAllStreamsByStatus(status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.findMany({
    where: {status: status}
  })
}

export async function findAllStreamsByStatusAndUser(userId: string, status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.findMany({
    where: {status: status, userId: userId},
  })
}

export async function getStreamCountByStatus(status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.count({
    where: { status: status },
  });
}

export async function populateStreamInstances(
  validatedInstances: {
    scheduledStart: Date;
    scheduledEnd: Date;
    userId: string;
    streamScheduleId: string;
  }[]
) {
  return await prisma.streamInstance.createMany({
    data: validatedInstances,
    skipDuplicates: true,
  });
}

export async function getStreamInstanceConflicts(
  proposedInstances: {
    scheduledStart: Date;
    scheduledEnd: Date;
  }[]
) {
  const orConditions = proposedInstances.map(({ scheduledStart, scheduledEnd }) => ({
    AND: [
      { scheduledStart: { lt: scheduledEnd } },
      { scheduledEnd: { gt: scheduledStart } },
    ],
  }));

  const conflicts = await prisma.streamInstance.findMany({
    where: {
      OR: orConditions,
      streamSchedule: {
        status: $Enums.ScheduleStatus.APPROVED,
      },
    },
  });

  return conflicts;
}

export async function isStreamInstancesConflicting(
  proposedInstances: {
    scheduledStart: Date;
    scheduledEnd: Date;
  }[]
) {
  const orConditions = proposedInstances.map(({ scheduledStart, scheduledEnd }) => ({
    AND: [
      { scheduledStart: { lt: scheduledEnd } },
      { scheduledEnd: { gt: scheduledStart } },
    ],
  }));

  const conflicts = await prisma.streamInstance.findFirst({
    where: {
      OR: orConditions,
      streamSchedule: {
        status: $Enums.ScheduleStatus.APPROVED,
      },
    },
  });

  return !!conflicts;
}

export async function createStreamSchedule(data: {
  userId: string;
  status: $Enums.ScheduleStatus;
  submittedAt: Date;
  title: string;
  description: string;
  tags: string[];
  startTime: Date;
  endTime: Date;
  startDate: Date;
  endDate: Date;
  rrule: string;
}) {
  return prisma.streamSchedule.create({
    data
  });
}