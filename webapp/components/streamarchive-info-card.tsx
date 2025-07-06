import { CalendarRange, Clock4 } from "lucide-react";
import Link from "next/link";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LocalDate  from "@/components/localdate";
import { formatTime } from "@/lib/utils";
import UserAvatar from "./user-avatar";

export default function StreamArchiveInfoCard({
  streamArchive
}: {
  streamArchive: (StreamArchive & {streamInstance: StreamInstance, streamSchedule: StreamSchedule, user: User})
}) {

  return (
    <Link href={`/archive/${streamArchive.id}`}>
      <Card className="py-2 text-center">
        <CardContent className="flex items-center justify-between gap-2">
            <p className="truncate">{streamArchive.streamSchedule.title}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground hidden md:block">
              <p>Duration: {streamArchive.durationInSeconds ? formatTime(streamArchive.durationInSeconds) : "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarRange className="w-4 h-4 hidden lg:block" />
              <LocalDate date={streamArchive.streamInstance.scheduledStart}/>
            </div>
            <div className="hidden md:block">
              <UserAvatar user={streamArchive.user}/>

            </div>
        </CardContent>
      </Card>
    </Link>

  )
}