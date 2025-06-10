'use server';

import { $Enums } from "@prisma/client";

import * as streamScheduleService from "@/lib/db/services/streamscheduleService";

export async function findAllPendingApprovalSchedules() {
  return await streamScheduleService.findAllPendingApprovalSchedules();
}

export async function getStreamCountByStatus(status: $Enums.ScheduleStatus) {
  return await streamScheduleService.getStreamCountByStatus(status);
}