"use client";

import { useEffect, useState } from "react";
import { StreamSchedule, User, $Enums } from "@prisma/client";
import { findAllStreamsByStatusWithUser } from "@/lib/db/actions/streamscheduleActions";
import { Badge } from "@/components/ui/badge";
import ScheduleManagementCard from "./schedule-management-card";

export default function UserGroupTabContent({
  status,
}: {
  status: $Enums.ScheduleStatus;
}) {
  const [schedules, setSchedules] = useState<(StreamSchedule & { user: User })[] | null>(null);

  useEffect(() => {
    findAllStreamsByStatusWithUser(status).then(setSchedules);
  }, [status]);

  return (
    <div className="space-y-2">
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
        schedules.map((schedule) => <ScheduleManagementCard key={schedule.id} stream={schedule} />)
      )}
    </div>
  );
}
