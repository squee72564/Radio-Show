'use server';

import { $Enums } from "@prisma/client";

import * as streamScheduleService from "@/lib/db/services/streamscheduleService";

export async function findAllPendingApprovalSchedules() {
  return streamScheduleService.findAllPendingApprovalSchedules();
}

export async function findAllStreamsByTypeAndUser(userId: string, status: $Enums.ScheduleStatus) {
  return streamScheduleService.findAllStreamsByTypeAndUser(userId, status);
}

export async function getStreamCountByStatus(status: $Enums.ScheduleStatus) {
  return streamScheduleService.getStreamCountByStatus(status);
}