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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { LocalDate } from "@/components/localdate";
import { LocalTime } from "@/components/localtime";

export default function StreamInstanceInfoCard({streamInstance}: {streamInstance: StreamInstance & {streamSchedule: StreamSchedule, user: User}}) {
    
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-2">{streamInstance.streamSchedule.title}</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarRange className="w-4 h-4" />
            <LocalDate date={streamInstance.scheduledStart}/>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            <LocalTime date={streamInstance.scheduledStart} /> - <LocalTime date={streamInstance.scheduledEnd}/>
          </div>
        </CardDescription>
        <CardAction className="space-y-2">
          <Link
            className="flex flex-col items-center justify-center hover:text-muted-foreground"
            href={`/user/${streamInstance.userId}`}
          >
            <Avatar className="flex flex-col items-center justify-center">
              <AvatarImage className="w-10 h-10 rounded-xl" src={streamInstance.user.image || ""}/>
              <AvatarFallback className="font-bold text-2xl rounded-xl">
                {streamInstance.user.name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            {streamInstance.user.name}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="truncate">{streamInstance.streamSchedule.description}</p>
      </CardContent>
      <CardFooter className="flex flex-row gap-2 flex-wrap">
        <span>Tags: </span>
        {streamInstance.streamSchedule.tags.map((tag, idx) => (
          <Badge variant={"outline"} key={idx}>{tag}</Badge>
        ))}
      </CardFooter>
    </Card>
  )

}