import { CalendarRange, Clock4 } from "lucide-react";
import Link from "next/link";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
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
          <CardTitle className="mb-2">{streamArchive.streamSchedule.title}</CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarRange className="w-4 h-4" />
              <LocalDate date={streamArchive.streamInstance.scheduledStart}/>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock4 className="w-4 h-4" />
              <p>{streamArchive.durationInSeconds ? formatTime(streamArchive.durationInSeconds) : "N/A"}</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="truncate">{streamArchive.streamSchedule.description}</p>
        </CardContent>
      </Card>
    </Link>

  )
}