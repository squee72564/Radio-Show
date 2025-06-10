import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { findAllStreamsByTypeAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums } from "@prisma/client";
import { Badge } from "./ui/badge";

export default async function UserPendingStreamsCard({userId}: {userId: string}) {
  const pendingStreams = await findAllStreamsByTypeAndUser(userId, $Enums.ScheduleStatus.PENDING);
  await new Promise(resolve => setTimeout(resolve, 2000));

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Streams Pending Approval</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingStreams.length == 0 ? (
          <Badge variant={"outline"}>No Pending Streams</Badge>
        ) : (
            pendingStreams.map((stream, idx) => (
              <div key={stream.id}>
                {stream.metadata.title}
              </div>
            ))
        )}
      </CardContent>
    </Card>
  )
}