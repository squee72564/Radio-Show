'use server';

import { $Enums } from "@prisma/client";

import * as streamScheduleService from "@/lib/db/services/streamscheduleService";
import { StreamScheduleFormState } from "@/app/types/stream-schedule";
import { streamScheduleSchema } from "@/validations/stream-schedule";
import { generateStreamInstances } from "@/lib/utils";

export async function findAllPendingApprovalSchedules() {
  return streamScheduleService.findAllPendingApprovalSchedules();
}

export async function findAllStreamsByTypeAndUser(userId: string, status: $Enums.ScheduleStatus) {
  return streamScheduleService.findAllStreamsByTypeAndUser(userId, status);
}

export async function getStreamCountByStatus(status: $Enums.ScheduleStatus) {
  return streamScheduleService.getStreamCountByStatus(status);
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
  return streamScheduleService.createStreamSchedule(data);
}

export async function populateStreamInstances(
  data: {
    scheduledStart: Date;
  scheduledEnd: Date;
    userId: string;
    streamScheduleId: string;
  }[]
) {
  return streamScheduleService.populateStreamInstances(data);
}

export async function checkStreamInstanceConflicts(
  proposedInstances: {
    scheduledStart: Date;
    scheduledEnd: Date;
  }[]
) {
  return streamScheduleService.isStreamInstancesConflicting(proposedInstances);
}

export async function streamScheduleFormSubmit(
  userId: string,
  prevState: StreamScheduleFormState,
  formData: FormData
): Promise<StreamScheduleFormState> {

  const days = formData.getAll("days") as ["MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU", ...("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[]];
  const raw = Object.fromEntries(formData.entries());
  const clean = Object.fromEntries(
    Object.entries(raw).filter(([key]) => !key.startsWith("$ACTION_") && !key.startsWith("$"))
  );

  const merged = { ...clean, days };
  const result = streamScheduleSchema.safeParse(merged);

  if (!result.success) {
    return {
      ...prevState,
      success: false,
      message: "Error validating schedule",
      errors: result.error.flatten().fieldErrors,
      values: merged,
    };
  }

  const validatedData = result.data;

  const startTime = new Date(`1970-01-01T${validatedData["start-time"]}:00Z`);
  const endTime = new Date(`1970-01-01T${validatedData["end-time"]}:00Z`);

  if (startTime >= endTime) {
    return {
      ...prevState,
      success: false,
      message: "Start time cannot be before end time",
      errors: {["start-time"]: ["Start time must be before end time"], ["end-time"]: ["End time must be after start time"]},
      values: merged,
    }
  }

  const startDate = new Date(validatedData["start-date"]);
  const endDate = new Date(validatedData["end-date"]);

  if (startDate >= endDate) {
    return {
      ...prevState,
      success: false,
      message: "Start time cannot be before end time",
      errors: {["start-date"]: ["Start date must be before end date"], ["end-date"]: ["End date must be after start date"]},
      values: merged,
    }
  }

  const rrule = `FREQ=WEEKLY;BYDAY=${validatedData.days.join(",")};INTERVAL=1`;

  const proposedInstances = await generateStreamInstances({
    startTime,
    endTime,
    startDate,
    endDate,
    rrule,
  });

  console.log("Generated instances:");
  proposedInstances.forEach(i =>
    console.log(i.scheduledStart.toISOString(), "-", i.scheduledEnd.toISOString())
  );
  
  const conflicts = await checkStreamInstanceConflicts(proposedInstances)

  if (conflicts) {
    console.log(proposedInstances);
    console.log(conflicts);
    return {
      ...prevState,
      success: false,
      message: "Conflicting stream schedules",
      errors: {conflicts: ["Cannot schedule for this time, there would be conflicting streams!"] },
      values: merged,
    }
  }

  // Create Stream Schedule Here
  const scheduleData = {
    status: $Enums.ScheduleStatus.PENDING,
    submittedAt: new Date(),
    
    title: validatedData.title,
    description: validatedData.description,
    tags: validatedData.tags.split(","),

    startTime: startTime,
    endTime: endTime,

    startDate: startDate,
    endDate: endDate,

    rrule: rrule,
    userId: userId,
  };

  const pendingSchedule = await createStreamSchedule(scheduleData);

  const streamInstances = await populateStreamInstances(
    proposedInstances.map((instance) => {
      return {
        scheduledStart: instance.scheduledStart,
        scheduledEnd: instance.scheduledEnd,
        userId: userId,
        streamScheduleId: pendingSchedule.id
      };
    }
  ));

  return {
    success: true,
    message: `Broadcast application created successfully for ${streamInstances.count} instances.`,
    errors: {},
    values: {}
  };
};