import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { findAllStreamsByStatusAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums } from "@prisma/client";
import { Badge } from "./ui/badge";
import StreamInfoCard from "./stream-info-card";
import Link from "next/link";

export default async function UserActiveStreamsCard({userId}: {userId: string}) {
  const activeStreams = await findAllStreamsByStatusAndUser(userId, $Enums.ScheduleStatus.APPROVED);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Active Streams</CardTitle>
      </CardHeader>
      <CardContent>
        {activeStreams.length == 0 ? (
          <Badge variant={"outline"}>No Pending Streams</Badge>
        ) : (
          <div className="space-y-2 overflow-y-auto">
            {activeStreams.map((stream, idx) => (
              <Link key={idx} href={`/user/stream/${stream.id}`}>
                <StreamInfoCard stream={stream} />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}