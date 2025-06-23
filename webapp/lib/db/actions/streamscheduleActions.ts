'use server';

import * as streamScheduleService from "@/lib/db/services/streamscheduleService";
import * as userService from "@/lib/db/services/userService";

import { StreamScheduleFormState, Weekday } from "@/types/stream-schedule";
import { streamScheduleSchema } from "@/validations/stream-schedule";
import { dateToUTC, generateStreamInstances } from "@/lib/utils";

import { $Enums, StreamSchedule, User } from "@prisma/client";

export async function getStreamInstancesByDateRange(dateStart: Date, dateEnd: Date) {
  return streamScheduleService.getStreamInstancesByDateRange(dateStart, dateEnd);
}

export async function deleteStreamById(streamId: string) {
  return await streamScheduleService.deleteStreamById(streamId);
}

export async function setStreamStatus(stream: StreamSchedule & {user: User}, status: $Enums.ScheduleStatus) {
  const nowUTC = dateToUTC(new Date());
  if (status == $Enums.ScheduleStatus.APPROVED) {
    
    const proposedInstances = await generateStreamInstances({
      dtstart: stream.startDate,
      until: stream.endDate,
      durationMs: Math.abs(stream.endTime.getTime() - stream.startTime.getTime()),
      rrule: stream.rrule
    });

    const conflicts = await streamScheduleService.isStreamInstancesConflicting(proposedInstances)

    if (conflicts) {
      return {success: false, message: "", error: "There are already approved schedules that would conflict"}
    }

    await streamScheduleService.populateStreamInstances(
      proposedInstances.map((instance) => {
        return {
          scheduledStart: instance.scheduledStart,
          scheduledEnd: instance.scheduledEnd,
          userId: stream.userId,
          streamScheduleId: stream.id
        };
      }
    ));

    await streamScheduleService.setStreamScheduleReviewedAt(stream.id, nowUTC);

    await streamScheduleService.setStreamScheduleStatus(stream.id, status);

    if (stream.user.status === $Enums.Role.USER) {
      await userService.changeUserRole(stream.userId, $Enums.Role.STREAMER);
    }

    return {success: true, message: "Stream Approved", error: ""}

  } else if (status == $Enums.ScheduleStatus.REJECTED) {

    await streamScheduleService.setStreamScheduleStatus(stream.id, status);
    await streamScheduleService.setStreamScheduleReviewedAt(stream.id, nowUTC);
    await streamScheduleService.revokeStreamInstances(stream.id);
    return {success: true, message: "Stream Rejected", error: ""}
  }

  await streamScheduleService.setStreamScheduleStatus(stream.id, status);
  await streamScheduleService.setStreamScheduleReviewedAt(stream.id, nowUTC);
  await streamScheduleService.revokeStreamInstances(stream.id);

  return {success: true, message: "Stream set to pending", error: ""};
}

export async function findAllStreamsByStatus(status: $Enums.ScheduleStatus) {
  return await streamScheduleService.findAllStreamsByStatus(status);
}

export async function findAllStreamsByStatusWithUser(status: $Enums.ScheduleStatus) {
  return await streamScheduleService.findAllStreamsByStatusWithUser(status);
}

export async function findAllStreamsByStatusAndUser(userId: string, status: $Enums.ScheduleStatus) {
  return streamScheduleService.findAllStreamsByStatusAndUser(userId, status);
}

export async function getStreamCountByStatus(status: $Enums.ScheduleStatus) {
  return streamScheduleService.getStreamCountByStatus(status);
}

export async function createStreamSchedule(data: Omit<StreamSchedule, "id">) {
  return streamScheduleService.createStreamSchedule(data);
}

export async function streamScheduleFormSubmit(
  userId: string,
  prevState: StreamScheduleFormState,
  formData: FormData
): Promise<StreamScheduleFormState> {

  const days = formData.getAll("days") as [Weekday, ...(Weekday)[]];
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

  const [startYear, startMonth, startDay] = validatedData["start-date"].split("-").map(Number);
  const [endYear, endMonth, endDay] = validatedData["end-date"].split("-").map(Number);
  const [startHour, startMinute] = validatedData["start-time"].split(":").map(Number);
  const [endHour, endMinute] = validatedData["end-time"].split(":").map(Number);

  const startDateTimeLocal = new Date(startYear, startMonth - 1, startDay, startHour, startMinute);
  const endDateTimeLocal = new Date(endYear, endMonth - 1, endDay, endHour, endMinute);

  const startDate = new Date(startDateTimeLocal.getTime());
  const endDate = new Date(endDateTimeLocal.getTime());

  const startTimeLocal = new Date(1970, 0, 1, startHour, startMinute);
  const endTimeLocal = new Date(1970, 0, 1, endHour, endMinute);

  const startTime = new Date(startTimeLocal.getTime())
  const endTime = new Date(endTimeLocal.getTime())

  if (startTimeLocal >= endTimeLocal) {
    return {
      ...prevState,
      success: false,
      message: "Start time cannot be before end time",
      errors: {
        ["start-time"]: ["Start time must be before end time"],
        ["end-time"]: ["End time must be after start time"]
      },
      values: merged,
    }
  }

  const durationMs = (endTimeLocal.getTime() - startTimeLocal.getTime());

  if (durationMs > 4.0 * 3.6e+6) {
    return {
      ...prevState,
      success: false,
      message: "Total Stream time cannot exceed 4 hours",
      errors: {
        ["start-time"]: ["Total Stream time cannot exceed 4 hours"],
        ["end-time"]: ["Total Stream time cannot exceed 4 hours"]
      },
      values: merged,

    }
  }

  if (startDate >= endDate) {
    return {
      ...prevState,
      success: false,
      message: "Start time cannot be before end time",
      errors: {
        ["start-date"]: ["Start date must be before end date"],
        ["end-date"]: ["End date must be after start date"]
      },
      values: merged,
    }
  }

  const rrule = `FREQ=WEEKLY;BYDAY=${validatedData.days.join(",")};INTERVAL=1`;

  const proposedInstances = await generateStreamInstances({
    dtstart: startDate,
    until: endDate,
    durationMs,
    rrule,
  });

  if (!proposedInstances || proposedInstances.length == 0) {
    return {
      ...prevState,
      success: false,
      message: "Start time cannot be before end time",
      errors: {
        conflicts: ["The date range and weekly repeat values results in 0 scheduled events."],
      },
      values: merged,
    }
  }

  const conflicts = await streamScheduleService.isStreamInstancesConflicting(proposedInstances)

  if (conflicts) {
    return {
      ...prevState,
      success: false,
      message: "Conflicting stream schedules",
      errors: {
        conflicts: ["Cannot schedule as it would conflict with other approved streams."]
      },
      values: merged,
    }
  }

  const scheduleData: Omit<StreamSchedule, "id"> = {
    status: $Enums.ScheduleStatus.PENDING,
    submittedAt: dateToUTC(new Date()),
    
    title: validatedData.title,
    description: validatedData.description,
    tags: validatedData.tags.split(","),

    startTime: startTime,
    endTime: endTime,

    startDate: startDate,
    endDate: endDate,
    reviewedAt: null,

    rrule: rrule,
    userId: userId,

    password: validatedData.password,
  };

  const pendingSchedule = await createStreamSchedule(scheduleData);

  return {
    success: true,
    message: `Broadcast application created successfully for ${pendingSchedule.title}.`,
    errors: {},
    values: {}
  };
};

export async function findFirstStreamInstanceAfterDate(date: Date) {
  return streamScheduleService.findFirstStreamInstanceAfterDate(date);
}