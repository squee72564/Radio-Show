"use client";

import { useEffect, useState } from "react";
import { StreamSchedule, User, $Enums } from "@prisma/client";
import { findAllStreamsByStatus } from "@/lib/db/actions/streamscheduleActions";
import { Badge } from "@/components/ui/badge";
import ScheduleManagementCard from "./schedule-management-card";

export default function ScheduleGroupTabContent({
  status,
}: {
  status: $Enums.ScheduleStatus;
}) {
  const [schedules, setSchedules] = useState<(StreamSchedule & { user: User })[] | null>(null);

  const handleScheduleAction = (scheduleId: string) => {
    if (!schedules) return;
    
    setSchedules(prev => prev?.filter(schedule => schedule.id !== scheduleId) || null)
  }

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedules = await findAllStreamsByStatus(status,{
        include: {
          user: true
        }
      }) as (StreamSchedule & { user: User })[];
      setSchedules(schedules);
    };

    fetchSchedules();
  }, [status]);

  return (
    <div className="flex flex-col gap-4">
      {!schedules ? (
        <Badge variant={"outline"}>Loading...</Badge>
      ) : schedules.length === 0 ? (
        <Badge
          variant={"outline"}
          className="text-sm text-muted-foreground"
        >
          No {status.toLowerCase()} schedules found
        </Badge>
      ) : (
        schedules.map((schedule) => 
          <ScheduleManagementCard
            key={schedule.id}
            stream={schedule}
            scheduleAction={handleScheduleAction}
          />
        )
      )}
    </div>
  );
}
