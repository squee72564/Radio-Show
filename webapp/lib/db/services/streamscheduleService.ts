import { prisma } from "@/lib/db/prismaClient";
import { $Enums } from "@prisma/client";

export async function findAllPendingApprovalSchedules() {
  return await prisma.streamSchedule.findMany({
    where: { status: "PENDING" },
    include: {
      metadata: true,
      user: true,
    },
    orderBy: { submittedAt: "desc" },
  });
}
export async function getStreamCountByStatus(status: $Enums.ScheduleStatus) {
  return await prisma.streamSchedule.count({
    where: { status: status },
  });
}