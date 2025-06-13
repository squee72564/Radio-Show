import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { findAllStreamsByTypeAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums } from "@prisma/client";
import { Badge } from "./ui/badge";
import { RRule } from "rrule";
import { CalendarRange, Clock4, Repeat } from "lucide-react";

export default async function UserPendingStreamsCard({userId}: {userId: string}) {
  const pendingStreams = await findAllStreamsByTypeAndUser(userId, $Enums.ScheduleStatus.PENDING);
  
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Streams Pending Approval</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingStreams.length == 0 ? (
          <Badge variant={"outline"}>No Pending Streams</Badge>
        ) : (
          <div className="space-y-2">
            {pendingStreams.map((stream) => {
              const startTime = stream.startTime.toISOString().slice(11, 16);
              const endTime = stream.endTime.toISOString().slice(11, 16);
              const startDate = stream.startDate.toDateString();
              const endDate = stream.endDate.toDateString();
              const recurrence = RRule.fromString(stream.rrule).toText();

              return (
                <div
                  key={stream.id}
                  className="border rounded-xl p-4 shadow-sm bg-muted/50 space-y-2"
                >
                  <div className="text-lg font-semibold">{stream.title}</div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock4 className="w-4 h-4" />
                    <span>{startTime} – {endTime}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarRange className="w-4 h-4" />
                    <span>{startDate} to {endDate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Repeat className="w-4 h-4" />
                    <span>{recurrence}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}