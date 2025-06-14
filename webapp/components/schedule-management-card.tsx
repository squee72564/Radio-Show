"use client"

import { $Enums, StreamSchedule, User } from "@prisma/client";
import { CalendarRange, Clock4, Repeat, UserIcon, PenIcon} from "lucide-react";
import { RRule } from "rrule";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { setStreamStatus } from "@/lib/db/actions/streamscheduleActions";

export default function ScheduleManagementCard({stream}: {stream: StreamSchedule & {user: User} }) {
  const startTime = stream.startTime.toISOString().slice(11, 16);
  const endTime = stream.endTime.toISOString().slice(11, 16);
  const startDate = stream.startDate.toDateString();
  const endDate = stream.endDate.toDateString();
  const recurrence = RRule.fromString(stream.rrule).toText();

  const [pending, startTransition] = useTransition()
  const [submissionstate, SetSubmissionState] = useState({success: false, message: "", error: ""});

  const handleApproval = () => {
    startTransition(async () => {
      SetSubmissionState(await setStreamStatus(stream, $Enums.ScheduleStatus.APPROVED))
    });
  };

  const handleRejection = () => {
    startTransition(async () => {
      SetSubmissionState(await setStreamStatus(stream, $Enums.ScheduleStatus.REJECTED))
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">
          {stream.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
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
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserIcon className="w-4 h-4" />
          <span>User: {stream.user.name}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <PenIcon className="w-4 h-4" />
          <span>Created At: {stream.submittedAt.toDateString()}</span>
        </div>
      </CardContent>
      {stream.status !== $Enums.ScheduleStatus.REJECTED &&
        <CardFooter className="flex sm:flex-row flex-col justify-center gap-5">
          <Button variant={"outline"} onClick={handleApproval}>
            {pending ? "Pending..." : "Approve"}
          </Button>
          <Button variant={"destructive"} onClick={handleRejection}>
            {pending ? "Pending..." : "Reject"}
          </Button>
          {submissionstate.error && <p>Error {submissionstate.error}</p>}
        </CardFooter>
      }
    </Card>
  );
}