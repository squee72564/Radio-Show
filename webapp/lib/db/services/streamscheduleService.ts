import { prisma } from "@/lib/db/prismaClient";
import { StreamArchiveRelations, StreamInstanceRelations, StreamScheduleRelations } from "@/types/prisma-relations";
import { $Enums, StreamArchive, StreamInstance, StreamSchedule } from "@prisma/client";

export async function findStreamArchiveById(
  id: string,
  options?: { include?: { [K in keyof StreamArchiveRelations]?: true } }
): Promise<(StreamArchive & Partial<StreamArchiveRelations>) | null> {
  return await prisma.streamArchive.findUnique({
    where: { id },
    ...(options ?? {}),
  });
}

export async function findStreamScheduleByIdAndPass(
  id: string,
  password: string,
  options?: {include?: {[K in keyof StreamScheduleRelations]?: true}}
): Promise<(StreamSchedule & Partial<StreamScheduleRelations>) | null> {
  return await prisma.streamSchedule.findUnique({
    where: {
      id_password: {
        id,
        password
      },
      ...(options ?? {}),
    }
  });
}

export async function deleteStreamById(id: string) {
  return await prisma.streamSchedule.delete({
    where: {id}
  })
}

export async function getStreamInstancesByDateRange(
  dateStart: Date, 
  dateEnd: Date,
  options?: { include: { [K in keyof StreamInstanceRelations]?: true } },
): Promise<(StreamInstance & Partial<StreamInstanceRelations>)[]> {
  return prisma.streamInstance.findMany({
    where: {
      scheduledStart: {
        gte: dateStart,
        lte: dateEnd,
      },
    },
    orderBy: {
      scheduledStart: 'asc',
    },
    ...(options ?? {}),
  });
}

export async function setStreamScheduleReviewedAt(id: string, reviewedAt: Date) {
  return prisma.streamSchedule.update({
    where: {id},
    data: {
      reviewedAt
    }
  });
}

export async function getCurrentStreamInstance(
  options?: { include?: { [K in keyof StreamInstanceRelations]?: true } }
): Promise<(StreamInstance & Partial<StreamInstanceRelations>) | null> {
  const now = new Date();
  return prisma.streamInstance.findFirst({
    where: {
      AND: [
        {
          scheduledStart: {
            lte: now
          }
        },
        {
          scheduledEnd: {
            gte: now
          }
        }
      ]
    },
    ...(options ?? {}),
  });
}

export async function setStreamScheduleStatus(id: string, status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.update({
    where: {id},
    data: {status}
  });
}

export async function revokeStreamInstances(streamId: string) {
  return await prisma.streamInstance.deleteMany({
    where: {streamScheduleId: streamId}
  })
}

export async function findAllStreamsByStatus(
  status: $Enums.ScheduleStatus,
  options?: {include: {[K in keyof StreamScheduleRelations]?: true}}
): Promise<(StreamSchedule & Partial<StreamScheduleRelations>)[]> {
  return await prisma.streamSchedule.findMany({
    where: {status: status},
    ...(options ?? {}),
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

export async function createStreamSchedule(data: Omit<StreamSchedule, "id">) {
  return prisma.streamSchedule.create({
    data
  });
}

export async function getStreamScheduleById(id: string) {
  return prisma.streamSchedule.findUnique({
    where: {id: id}
  })
}

export async function findAllStreamArchivesWithUserAndSchedule() {
  return prisma.streamArchive.findMany({
    include : {
      user: true,
      streamSchedule: true
    }
  });
}

export async function findArchivesByUserId(
  userId: string,
  options?: {include: {[K in keyof StreamArchiveRelations]?: true}}
): Promise<(StreamArchive & Partial<StreamArchiveRelations>)[]> {
  return prisma.streamArchive.findMany({
    where: {userId},
    ...(options ?? {}),
  }); 
}

export async function findRecentArchives(
  count: number,
  options?: {include: {[K in keyof StreamArchiveRelations]?: true}}
): Promise<(StreamArchive & Partial<StreamArchiveRelations>)[]> {
  return prisma.streamArchive.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    ...(options ?? {}),
    take: count,
  });
}

export async function findFirstStreamInstanceAfterDate(date: Date) {
  return prisma.streamInstance.findFirst({
    where: {
      OR: [
        {
          scheduledStart: {
            lte: date
          },
          scheduledEnd: {
            gte: date
          }
        },
        {
          scheduledStart: {
            gt: date
          }
        }
      ]
    },
    orderBy: {
      scheduledStart: 'asc'
    },
    include: {
      streamSchedule: true,
      user: true
    }
  });
}

export async function createStreamArchive(data: Omit<StreamArchive, "id">) {
  return await prisma.streamArchive.create({
    data
  });
}
