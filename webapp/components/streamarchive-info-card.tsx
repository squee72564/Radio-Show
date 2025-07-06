import { CalendarRange, Clock4 } from "lucide-react";
import Link from "next/link";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LocalDate  from "@/components/localdate";
import { formatTime } from "@/lib/utils";

export default function StreamArchiveInfoCard({
  streamArchive
}: {
  streamArchive: (StreamArchive & {streamInstance: StreamInstance, streamSchedule: StreamSchedule, user: User})
}) {

  return (
    <Link href={`/archive/${streamArchive.id}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-5">
            {streamArchive.streamSchedule.title}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock4 className="w-4 h-4" />
              <p>{streamArchive.durationInSeconds ? formatTime(streamArchive.durationInSeconds) : "N/A"}</p>
            </div>
          </CardTitle>
          <CardAction>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarRange className="w-4 h-4" />
              <LocalDate date={streamArchive.streamInstance.scheduledStart}/>
            </div>
          </CardAction>
        </CardHeader>
      </Card>
    </Link>

  )
}