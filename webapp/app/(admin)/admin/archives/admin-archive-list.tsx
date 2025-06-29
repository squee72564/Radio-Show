import { Badge } from "@/components/ui/badge";
import { findAllStreamArchives } from "@/lib/db/actions/streamscheduleActions";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import ArchiveManagementCard from "./archive-management.card";

export default async function AdminArchiveList() {
  const archives = await findAllStreamArchives({
    include: {
      streamSchedule: true,
      streamInstance: true,
      user: true
    }
  }) as (StreamArchive & {
    streamSchedule: StreamSchedule,
    streamInstance: StreamInstance,
    user: User
  })[];

  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      {archives.length === 0 ? (
        <Badge variant={"outline"}>No archives found</Badge>
      ): (
        archives.map((archive,idx) => (
          <ArchiveManagementCard key={idx} archive={archive}/>
        ))
      )}
    </div>
  );
}