import { prisma } from "@/lib/db/prismaClient";
import { $Enums, StreamSchedule } from "@prisma/client";

export async function getStreamInstancesByDateRange(dateStart: Date, dateEnd: Date) {
  return prisma.streamInstance.findMany({
    where: {
      scheduledStart: {
        gte: dateStart,
        lte: dateEnd,
      },
    },
    include: {
      user: true,
      streamSchedule: true,
    },
  });
}

export async function approveStream(streamId: string) {
  return await prisma.streamSchedule.update({
    where: {id: streamId},
    data: {status: $Enums.ScheduleStatus.APPROVED}
  });
}

export async function rejectStream(streamId: string) {
  return await prisma.streamSchedule.update({
    where: {id: streamId},
    data: {status: $Enums.ScheduleStatus.REJECTED}
  });
}

export async function revokeStreamInstances(streamId: string) {
  return await prisma.streamInstance.deleteMany({
    where: {streamScheduleId: streamId}
  })
}

export async function findAllStreamsByStatus(status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.findMany({
    where: {status: status}
  })
}

export async function findAllStreamsByStatusWithUser(status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.findMany({
    where: { status },
    include: {
      user: true,
    },
  });
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

export async function createStreamSchedule(data: Omit<StreamSchedule, "id">) {
  return prisma.streamSchedule.create({
    data
  });
}