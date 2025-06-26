"use server";

import { auth } from "@/auth";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StreamSchedule } from "@prisma/client";
import { redirect } from "next/navigation";
import { getStreamScheduleById } from "@/lib/db/services/streamscheduleService";
import { RRule } from "rrule";
import { CalendarRange, Clock4, Repeat } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LocalTime from "@/components/localtime";
import LocalDate from "@/components/localdate";

export default async function UserProfilePage({
  params
} : {
    params: Promise<{stream_id:string}>
}) {
  const { stream_id }: { stream_id: string } = await params;

  const session = await auth();
  const user = session?.user;
  const signedIn = !!user;

  const streamSchedule = await getStreamScheduleById(stream_id) as StreamSchedule | null;
  
  if (!streamSchedule || !signedIn) {
    redirect("/dashboard");
  }

  const isStreamOwnerViewing = signedIn ? streamSchedule.userId === user.id : false;
  const recurrence = RRule.fromString(streamSchedule.rrule).toText();

  return (
    <Card className="w-full h-auto m-10">
      <CardHeader>
        <CardTitle className="pb-10">
          <h1 className="font-bold text-2xl">{streamSchedule.title}</h1>
        </CardTitle>
        <CardDescription className="flex flex-col gap-2 text-muted-foreground text-lg">
          <div className="flex items-center gap-2 ">
            <Clock4 className="w-4 h-4" />
            <LocalTime date={streamSchedule.startTime} /> - <LocalTime date={streamSchedule.endTime} />
          </div>
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4" />
            <LocalDate date={streamSchedule.startDate} /> - <LocalDate date={streamSchedule.endDate} />
          </div>

          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            <span>{recurrence}</span>
          </div>
        </CardDescription>
        <CardAction>
          <Badge variant={"outline"}>{streamSchedule.status}</Badge>
        </CardAction>
      </CardHeader>
      <Separator/>
      <CardContent className="mb-auto">
        <p>{streamSchedule.description}</p>
      </CardContent>
      { isStreamOwnerViewing &&
        <>
          <Separator/>
          <CardFooter className="flex flex-col gap-2">
            <span>Streaming Authentication Information:</span>
            <div className="w-full">
              <span>Credential: </span>
              {streamSchedule.id}
            </div>
            <div className="w-full">
              <span>Password: </span>
              {streamSchedule.password}
            </div>
          </CardFooter>
        </>
      }
    </Card>
  );
}