'use server';

import * as streamScheduleService from "@/lib/db/services/streamscheduleService";
import * as userService from "@/lib/db/services/userService";

import { StreamScheduleFormState, StreamScheduleFormValues } from "@/types/stream-schedule";
import { generateStreamInstances } from "@/lib/utils";

import { $Enums, StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import { StreamArchiveRelations, StreamInstanceRelations, StreamScheduleRelations } from "@/types/prisma-relations";
import { Result } from "@/types/generic";
import { deleteArchiveFileFromS3 } from "@/lib/S3Utils";

export async function deleteArchiveById(id: string) {
  return await streamScheduleService.deleteArchiveById(id);
}

export async function findAllStreamArchives(
  options?: { include?: { [K in keyof StreamArchiveRelations]?: true } }
): Promise<(StreamArchive & Partial<StreamArchiveRelations>)[]> {
  return await streamScheduleService.findAllStreamArchives(options);
}

export async function findStreamArchiveById(
  id: string,
  options?: { include?: { [K in keyof StreamArchiveRelations]?: true } }
): Promise<(StreamArchive & Partial<StreamArchiveRelations>) | null> {
  return await streamScheduleService.findStreamArchiveById(id, options);
}

export async function findStreamScheduleByIdAndPass(
  id: string,
  password: string,
  options?: {include?: {[K in keyof StreamScheduleRelations]?: true}}
): Promise<(StreamSchedule & Partial<StreamScheduleRelations>) | null> {
  return await streamScheduleService.findStreamScheduleByIdAndPass(id, password, options);
}

export async function deleteStreamScheduleById(streamId: string): Promise<Result<StreamSchedule>> {
  const deletedStream = await streamScheduleService.deleteStreamScheduleById(streamId);

  if (!deletedStream) {
    return {type: "error", message: "Error deleting stream"}
  }

  return {type: "success", data: deletedStream};
}

export async function getStreamInstancesByDateRange(
  dateStart: Date,
  dateEnd: Date,
  options?: { include: { [K in keyof StreamInstanceRelations]?: true } },
): Promise<(StreamInstance & Partial<StreamInstanceRelations>)[]> {
  return await streamScheduleService.getStreamInstancesByDateRange(dateStart, dateEnd, options);
}

export async function getCurrentStreamInstance(
  options?: { include?: { [K in keyof StreamInstanceRelations]?: true } }
): Promise<(StreamInstance & Partial<StreamInstanceRelations>) | null> {
  return await streamScheduleService.getCurrentStreamInstance(options);
}

export async function setStreamScheduleReviewedAt(id: string, reviewedAt: Date) {
  return await streamScheduleService.setStreamScheduleReviewedAt(id, reviewedAt);
}

export async function setStreamStatus(
  stream: StreamSchedule & {user: User},
  status: $Enums.ScheduleStatus
): Promise<Result<{message: string}>> {
  const nowUTC = new Date();
  if (status == $Enums.ScheduleStatus.APPROVED) {

    const proposedInstances = await generateStreamInstances({
      dtstart: new Date(stream.startDate.getTime()),
      until: new Date(stream.endDate.getTime()),
      durationMs: Math.abs(stream.endTime.getTime() - stream.startTime.getTime()),
      rrule: stream.rrule
    });

    const conflicts = await streamScheduleService.isStreamInstancesConflicting(proposedInstances)

    if (conflicts) {
      return {type: "error", message: "There are already approved schedules that would conflict"}
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
      const result = await userService.changeUserRole(stream.userId, $Enums.Role.STREAMER);

      if (!result) {
        console.error("Error changing user role.");
      }
    }

    return {type: "success", data: {message: "Stream Approved"} }

  } else if (status == $Enums.ScheduleStatus.REJECTED) {

    await streamScheduleService.setStreamScheduleStatus(stream.id, status);
    await streamScheduleService.setStreamScheduleReviewedAt(stream.id, nowUTC);
    await streamScheduleService.revokeStreamInstances(stream.id);
    return {type: "success", data: {message: "Stream Rejected"} }
  }

  await streamScheduleService.setStreamScheduleStatus(stream.id, status);
  await streamScheduleService.setStreamScheduleReviewedAt(stream.id, nowUTC);
  await streamScheduleService.revokeStreamInstances(stream.id);
  return {type: "success", data: {message: "Stream set to pending"} }
}

export async function findAllStreamsByStatus(
  status: $Enums.ScheduleStatus,
  options?: {include: {[K in keyof StreamScheduleRelations]?: true}}
): Promise<(StreamSchedule & Partial<StreamScheduleRelations>)[]> {
  return await streamScheduleService.findAllStreamsByStatus(status, options);
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
  merged: Partial<StreamScheduleFormValues>,
  validatedData: StreamScheduleFormValues,
  prevState: StreamScheduleFormState,
  formData: FormData
): Promise<StreamScheduleFormState> {

  const startISOString = formData.get("UTC-start") as string;
  const endISOString = formData.get("UTC-end") as string;

  const startTimeISOString = formData.get("UTC-start-time") as string;
  const endTimeISOString = formData.get("UTC-end-time") as string;

  const startDate = new Date(startISOString);
  const endDate = new Date(endISOString);

  const startTime = new Date(startTimeISOString);
  const endTime   = new Date(endTimeISOString);
  const durationMs = (endTime.getTime() - startTime.getTime());

  const interval = formData.get("interval") as string;

  const rrule = `FREQ=WEEKLY;BYDAY=${validatedData.days.join(",")};INTERVAL=${interval}`;

  if (!(endTime > startTime)) {
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

  if (!(endDate > startDate)) {
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
      message: "Error checking instances of stream",
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
    submittedAt: new Date(),
    
    title: validatedData.title,
    description: validatedData.description,
    tags: [...new Set(
      validatedData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
        .map(tag =>
          tag
            .toLowerCase()
            .replace(/([^\s\-\/]+)/g, word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            )
        )
    )],

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

  if (!pendingSchedule) {
    return {
      ...prevState,
      success: false,
      message: "Error creating new stream schedule",
      errors: {
        conflicts: ["Error creating new stream schedule"]
      },
      values: merged,
    }
  }

  return {
    success: true,
    message: `Success! Your schedule for ${pendingSchedule.title} has been submitted for approval.`,
    errors: {},
    values: {}
  };
};

export async function findFirstStreamInstanceAfterDate(date: Date) {
  return streamScheduleService.findFirstStreamInstanceAfterDate(date);
}

export async function createStreamArchive(data: Omit<StreamArchive, "id">) {
  return streamScheduleService.createStreamArchive(data);
}

export async function adminDeleteArchive(id: string): Promise<Result<StreamArchive>> {
  const archive = await deleteArchiveById(id);

  if (!archive) {
    return {type: "error", message: "Error deleting archive"}
  }

  const result = await deleteArchiveFileFromS3(archive.url)

  if (result.type === "error") {
    console.error("Error: Could not delete archive from S3!");
  }

  return {type: "success", data: archive }
}