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
      <Card className="p-0 py-2 text-center min-w-0">
        <CardContent className="flex items-center justify-between gap-4 px-4 h-8">
          <div className="flex-1 min-w-0">
            <p className="truncate text-left text-base font-medium">
              {streamArchive.streamSchedule.title}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
            <p>Duration: {streamArchive.durationInSeconds ? formatTime(streamArchive.durationInSeconds) : "N/A"}</p>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
            <CalendarRange className="w-4 h-4 hidden lg:inline" />
            <LocalDate date={streamArchive.streamInstance.scheduledStart}/>
          </div>

          <div className="hidden md:block flex-shrink-0">
            <UserAvatar user={streamArchive.user} />
          </div>
        </CardContent>
      </Card>
    </Link>

  )
}