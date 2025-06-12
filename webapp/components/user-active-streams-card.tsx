import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { findAllStreamsByTypeAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums } from "@prisma/client";
import { Badge } from "./ui/badge";

export default async function UserActiveStreamsCard({userId}: {userId: string}) {
  const activeStreams = await findAllStreamsByTypeAndUser(userId, $Enums.ScheduleStatus.APPROVED);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Active Streams</CardTitle>
      </CardHeader>
      <CardContent>
        {activeStreams.length == 0 ? (
          <Badge variant={"outline"}>No Active Streams</Badge>
        ) : (
            activeStreams.map((stream) => (
              <div key={stream.id}>
                {stream.metadata.title}
              </div>
            ))
        )}
      </CardContent>
    </Card>
  )
}