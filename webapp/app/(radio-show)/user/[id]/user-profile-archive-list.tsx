import { findArchivesByUserId } from "@/lib/db/services/streamscheduleService";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import StreamArchiveInfoCard from "@/components/streamarchive-info-card";


export default async function UserProfileArchiveList({userProfileInfo}: {userProfileInfo: User}) {
  const archives = await findArchivesByUserId(userProfileInfo.id,{
    include: {
      streamInstance: true,
      streamSchedule: true,
      user: true,
    }
  }) as (StreamArchive & {streamInstance: StreamInstance, streamSchedule: StreamSchedule, user: User})[];
  
  return (
    <>
      {archives.length === 0 ? (
        <Badge variant="outline" className="text-center mx-3 p-2">No Past Archives</Badge>
      ): (
        <div className="space-y-2 p-2">
          {archives.map((archive, idx) => (
            <StreamArchiveInfoCard key={idx} streamArchive={archive}/>
          ))}
        </div>
      )}
    </>
  );
}