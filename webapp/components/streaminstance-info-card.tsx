import { CalendarRange, Clock4 } from "lucide-react";
import Link from "next/link";
import { StreamInstance, StreamSchedule, User } from "@prisma/client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Badge } from "./ui/badge";
import LocalTime from "@/components/localtime";
import LocalDate  from "@/components/localdate";
import LiveTag from "./live-tag";
import UserAvatar from "./user-avatar";

export default function StreamInstanceInfoCard({streamInstance}: {streamInstance: StreamInstance & {streamSchedule: StreamSchedule, user: User}}) {
  const MAX_VISIBLE_TAGS = 15;
  const tags = streamInstance.streamSchedule.tags.filter(t => t.trim() !== "");
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTags = tags.slice(MAX_VISIBLE_TAGS);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">
          {streamInstance.streamSchedule.title}
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarRange className="w-4 h-4" />
            <LocalDate date={streamInstance.scheduledStart}/>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            <LocalTime date={streamInstance.scheduledStart} /> - <LocalTime date={streamInstance.scheduledEnd}/>
            <LiveTag liveStart={streamInstance.scheduledStart} liveEnd={streamInstance.scheduledEnd} />
          </div>
        </CardDescription>
        <CardAction className="space-y-2">
          <Link
            className="flex flex-col items-center justify-center hover:text-muted-foreground"
            href={`/user/${streamInstance.userId}`}
          >
            <UserAvatar user={streamInstance.user} className="flex flex-col items-center justify-center"/>
            {streamInstance.user.name}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="truncate">{streamInstance.streamSchedule.description}</p>
      </CardContent>
      <CardFooter className="flex flex-row gap-2 flex-wrap">
        <span>Tags: </span>
        {tags.length === 0 ? (
          <Badge variant="outline">N/A</Badge>
        ) : (
          <>
            {visibleTags.map((tag, idx) => (
              <Badge variant="outline" key={idx} className="max-w-50">
                <span className="truncate">{tag.trim()}</span>
              </Badge>
            ))}
            {hiddenTags.length > 0 && (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger asChild>
                  <Badge variant="secondary" className="cursor-pointer">
                    +{hiddenTags.length} more
                  </Badge>
                </HoverCardTrigger>

                <HoverCardContent className="max-w-64 max-h-56 overflow-auto p-4">
                  <div className="flex flex-wrap flex-1 gap-1 justify-between">
                    {hiddenTags.map((tag, idx) => (
                      <Badge variant="outline" key={idx} className="max-w-50">
                        <span className="truncate">{tag.trim()}</span>
                      </Badge>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )

}