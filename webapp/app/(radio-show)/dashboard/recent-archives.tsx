"use server";

import { Badge } from "@/components/ui/badge";
import { findRecentArchives } from "@/lib/db/services/streamscheduleService";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import StreamArchiveInfoCard from "@/components/streamarchive-info-card";

export default async function RecentArchives() {
  const archives = await findRecentArchives(5, {
    include: {
      streamSchedule: true,
      streamInstance: true,
      user: true
    }
  }) as (StreamArchive & {
    streamSchedule: StreamSchedule,
    streamInstance: StreamInstance
    user: User
  })[];

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-medium">Recent Archives</h2>
      {archives.length > 0 ? (
        <div className="flex flex-col gap-2 min-h-41 max-h-41 overflow-auto">
          {archives.map((archive, idx) => (
            <StreamArchiveInfoCard key={idx} streamArchive={archive}/>
          ))}
        </div>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          No previous archives
        </Badge>
      )}
    </div>  
  );
}