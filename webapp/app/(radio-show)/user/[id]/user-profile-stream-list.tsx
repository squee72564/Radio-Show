import { findAllStreamsByStatusAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums, User } from "@prisma/client";

import StreamInfoCard from "@/components/stream-info-card";
import { Badge } from "@/components/ui/badge";


export default async function UserProfileStreamList({userProfileInfo}: {userProfileInfo: User}) {
  const shows = await findAllStreamsByStatusAndUser(userProfileInfo?.id, $Enums.ScheduleStatus.APPROVED);
  
  return (
    <>
      {shows.length === 0 ? (
        <Badge variant="outline" className="text-center mx-3 p-2">No Active Streams</Badge>
      ): (
        <div className="space-y-2 p-2">
          {shows.map((stream, idx) => (
            <StreamInfoCard key={idx} stream={stream} />
          ))}
        </div>
      )}
    </>
  );
}