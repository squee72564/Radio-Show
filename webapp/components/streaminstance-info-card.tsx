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

export default function StreamInstanceInfoCard({streamInstance}: {streamInstance: StreamInstance & {streamSchedule: StreamSchedule, user: User}}) {
  const instanceStartDate = streamInstance.scheduledStart.toISOString().split("T")[0]
  const instanceStartTime = streamInstance.scheduledStart.toISOString().split("T")[1].slice(0,5)
  const instanceEndTime = streamInstance.scheduledEnd.toISOString().split("T")[1].slice(0,5)
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="mb-2">{streamInstance.streamSchedule.title}</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarRange className="w-4 h-4" />
            <span>{instanceStartDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            <span>{instanceStartTime} – {instanceEndTime}</span>
          </div>
        </CardDescription>
        <CardAction>
          <Link className="flex flex-col items-center justify-center" href={`/user/${streamInstance.userId}`}>
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
      <CardFooter className="space-x-2">
        <span>Tags: </span>
        {streamInstance.streamSchedule.tags.map((tag, idx) => (
          <span key={idx}>{tag}</span>
        ))}
      </CardFooter>
    </Card>
  )

}