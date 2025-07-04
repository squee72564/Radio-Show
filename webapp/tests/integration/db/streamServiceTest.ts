// tests/integration/db/streamService.test.ts

import * as streamService from "@/lib/db/services/streamscheduleService";
import { prisma } from "@/lib/db/prismaClient";
import { $Enums } from "@prisma/client";

describe("Stream Service Integration", () => {
  beforeEach(async () => {
    await prisma.streamArchive.deleteMany();
    await prisma.streamInstance.deleteMany();
    await prisma.streamSchedule.deleteMany();
    await prisma.user.deleteMany();
  });

  describe("StreamSchedule", () => {
    it("creates and retrieves a stream schedule", async () => {
        const user = await prisma.user.create({
            data: {name: "test user", email: "test@gmail.com"}
        });

      const scheduleData = {
        status: $Enums.ScheduleStatus.PENDING,
        userId: user.id,
        submittedAt: new Date(),
        reviewedAt: null,
        title: "Test Stream",
        description: "Test Description",
        tags: ["test"],
        startTime: new Date(2025, 0, 1, 12),
        endTime: new Date(2025, 0, 1, 14),
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 0, 2),
        rrule: "RRULE:FREQ=DAILY;INTERVAL=1",
        password: "pass123"
      };

      const created = await streamService.createStreamSchedule(scheduleData);
      expect(created).toBeTruthy();
      expect(created?.title).toBe("Test Stream");

      const fetched = await streamService.findStreamScheduleByIdAndPass(created!.id, "pass123");
      expect(fetched).not.toBeNull();
      expect(fetched?.id).toBe(created?.id);
    });

    it("updates reviewedAt and status", async () => {
      const user = await prisma.user.create({
          data: {name: "test user", email: "test@gmail.com"}
      });

      const created = await streamService.createStreamSchedule({
        status: $Enums.ScheduleStatus.PENDING,
        userId: user.id,
        submittedAt: new Date(),
        reviewedAt: null,
        title: "Update Stream",
        description: "Update Desc",
        tags: [],
        startTime: new Date(2025, 0, 1, 12),
        endTime: new Date(2025, 0, 1, 14),
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 0, 2),
        rrule: "RRULE:FREQ=DAILY;INTERVAL=1",
        password: "pass123"
      });

      expect(created).not.toBeNull();

      const reviewedAt = new Date();
      const updatedReview = await streamService.setStreamScheduleReviewedAt(created!.id, reviewedAt);
      expect(updatedReview?.reviewedAt?.getTime()).toBe(reviewedAt.getTime());

      const updatedStatus = await streamService.setStreamScheduleStatus(created!.id, $Enums.ScheduleStatus.APPROVED);
      expect(updatedStatus.status).toBe($Enums.ScheduleStatus.APPROVED);
    });
  });

  describe("StreamInstance", () => {
    it("populates, detects conflicts, and revokes instances", async () => {
      const user = await prisma.user.create({
          data: {name: "test user", email: "test@gmail.com"}
      });
      
      const streamSchedule = await streamService.createStreamSchedule({
        status: $Enums.ScheduleStatus.APPROVED,
        userId: user.id,
        submittedAt: new Date(),
        reviewedAt: null,
        title: "Instance Stream",
        description: "For Instance",
        tags: [],
        startTime: new Date(),
        endTime: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        rrule: "RRULE:FREQ=DAILY;INTERVAL=1",
        password: "abc123",
      });

      const instances = [
        {
          scheduledStart: new Date(Date.now() + 3600000),
          scheduledEnd: new Date(Date.now() + 7200000),
          userId: user.id,
          streamScheduleId: streamSchedule!.id,
        }
      ];

      await streamService.populateStreamInstances(instances);

      const conflicts = await streamService.isStreamInstancesConflicting([
        {
          scheduledStart: new Date(Date.now() + 3700000), // overlaps
          scheduledEnd: new Date(Date.now() + 7400000),
        }
      ]);
      expect(conflicts).toBe(true);

      await streamService.revokeStreamInstances(streamSchedule!.id);
      const remaining = await streamService.getStreamInstancesByDateRange(
        new Date(Date.now()),
        new Date(Date.now() + 86400000)
      );
      expect(remaining.length).toBe(0);
    });
  });

  describe("StreamArchive", () => {
    it("creates and deletes a stream archive", async () => {
      const user = await prisma.user.create({
          data: {name: "test user", email: "test@gmail.com"}
      });
      
      const streamSchedule = await streamService.createStreamSchedule({
        status: $Enums.ScheduleStatus.APPROVED,
        userId: user.id,
        submittedAt: new Date(),
        reviewedAt: null,
        title: "Instance Stream",
        description: "For Instance",
        tags: [],
        startTime: new Date(),
        endTime: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        rrule: "RRULE:FREQ=DAILY;INTERVAL=1",
        password: "abc123",
      });

      const instance = await prisma.streamInstance.create({
        data: {
          userId: user.id,
          streamScheduleId: streamSchedule?.id!,
          scheduledStart: new Date(),
          scheduledEnd: new Date()
        }
      });

      const archive = await streamService.createStreamArchive({
        userId: user.id,
        streamScheduleId: streamSchedule?.id!,
        streamInstanceId: instance.id,
        url: "https://archive.example.com",
        createdAt: new Date(),
        durationInSeconds: null,
        format: null,
        fileSizeBytes: null,
      });

      expect(archive).toBeTruthy();

      const deleted = await streamService.deleteArchiveById(archive!.id);
      expect(deleted).not.toBeNull();

      const all = await streamService.findAllStreamArchives();
      expect(all.length).toBe(0);
    });
  });
});
