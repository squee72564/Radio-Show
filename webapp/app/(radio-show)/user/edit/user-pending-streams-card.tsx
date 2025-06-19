"use server";

import { findAllStreamsByStatusAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import StreamInfoCard from "@/components/stream-info-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UserPendingStreamsCard({userId}: {userId: string}) {
  const pendingStreams = await findAllStreamsByStatusAndUser(userId, $Enums.ScheduleStatus.PENDING);
  
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Streams Pending Approval</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingStreams.length == 0 ? (
          <Badge variant={"outline"}>No Pending Streams</Badge>
        ) : (
          <div className="space-y-2 overflow-y-auto">
            {pendingStreams.map((stream, idx) => (
              <StreamInfoCard key={idx} stream={stream} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}