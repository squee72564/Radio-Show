'use server';

import * as streamScheduleService from "@/lib/db/services/streamscheduleService";
import * as userService from "@/lib/db/services/userService";

import { StreamScheduleFormState, Weekday } from "@/app/types/stream-schedule";
import { streamScheduleSchema } from "@/validations/stream-schedule";
import { generateStreamInstances } from "@/lib/utils";

import { $Enums, StreamSchedule, User } from "@prisma/client";

export async function getStreamInstancesByDateRange(dateStart: Date, dateEnd: Date) {
  return streamScheduleService.getStreamInstancesByDateRange(dateStart, dateEnd);
}

export async function deleteStreamById(streamId: string) {
  return await streamScheduleService.deleteStreamById(streamId);
}

export async function setStreamStatus(stream: StreamSchedule & {user: User}, status: $Enums.ScheduleStatus) {
  if (status == $Enums.ScheduleStatus.APPROVED) {
    
    const proposedInstances = await generateStreamInstances({
      startTime: stream.startTime,
      endTime: stream.endTime,
      startDate: stream.startDate,
      endDate: stream.endDate,
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

    await streamScheduleService.setStreamScheduleReviewedAt(stream.id, new Date());

    await streamScheduleService.setStreamScheduleStatus(stream.id, status);

    if (stream.user.status === $Enums.Role.USER) {
      await userService.changeUserRole(stream.userId, $Enums.Role.STREAMER);
    }

    return {success: true, message: "Stream Approved", error: ""}

  } else if (status == $Enums.ScheduleStatus.REJECTED) {

    await streamScheduleService.setStreamScheduleStatus(stream.id, status);
    await streamScheduleService.setStreamScheduleReviewedAt(stream.id, new Date());
    await streamScheduleService.revokeStreamInstances(stream.id);
    return {success: true, message: "Stream Rejected", error: ""}
  }

  await streamScheduleService.setStreamScheduleStatus(stream.id, status);
  await streamScheduleService.setStreamScheduleReviewedAt(stream.id, new Date());
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

  const startTime = new Date(`1970-01-01T${validatedData["start-time"]}:00Z`);
  const endTime = new Date(`1970-01-01T${validatedData["end-time"]}:00Z`);

  if (startTime >= endTime) {
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

  const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  if (durationInHours > 4.0 * 60.0 * 60.0) {
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

  const startDate = new Date(validatedData["start-date"]);
  const endDate = new Date(validatedData["end-date"]);

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
    startTime,
    endTime,
    startDate,
    endDate,
    rrule,
  });

  const conflicts = await streamScheduleService.isStreamInstancesConflicting(proposedInstances)

  if (conflicts) {
    console.log(proposedInstances);
    console.log(conflicts);
    return {
      ...prevState,
      success: false,
      message: "Conflicting stream schedules",
      errors: {
        conflicts: ["Cannot schedule for this time, there would be conflicting streams!"]
      },
      values: merged,
    }
  }

  // Create Stream Schedule Here
  const scheduleData: Omit<StreamSchedule, "id"> = {
    status: $Enums.ScheduleStatus.PENDING,
    submittedAt: new Date(),
    
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