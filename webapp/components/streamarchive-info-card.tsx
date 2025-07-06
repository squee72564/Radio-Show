import { CalendarRange } from "lucide-react";
import Link from "next/link";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import {
  Card,
  CardContent,
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
      <Card className="p-0 py-2 text-center">
        <CardContent className="flex items-center justify-between gap-2">
            <p className="truncate">{streamArchive.streamSchedule.title}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground hidden md:block">
              <p>Duration: {streamArchive.durationInSeconds ? formatTime(streamArchive.durationInSeconds) : "N/A"}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarRange className="w-4 h-4 hidden lg:block" />
              <LocalDate date={streamArchive.streamInstance.scheduledStart}/>
            </div>
            <UserAvatar className="hidden md:block" user={streamArchive.user}/>
        </CardContent>
      </Card>
    </Link>

  )
}