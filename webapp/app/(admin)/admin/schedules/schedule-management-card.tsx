"use client"

import { useState, useTransition } from "react";
import { CalendarRange, Clock4, Repeat, UserIcon, PenIcon} from "lucide-react";
import { deleteStreamById, setStreamStatus } from "@/lib/db/actions/streamscheduleActions";
import { RRule } from "rrule";
import { $Enums, StreamSchedule, User } from "@prisma/client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LocalTime from "@/components/localtime";
import LocalDate from "@/components/localdate";
import { Result } from "@/types/generic";

export default function ScheduleManagementCard({
  stream,
  scheduleAction
}: {
  stream: StreamSchedule & {user: User};
  scheduleAction: (scheduleId: string) => void
}) {
  const recurrence = RRule.fromString(stream.rrule).toText();

  const [pending, startTransition] = useTransition()
  const [submissionstate, SetSubmissionState] = useState<Result<{message: string}>>({type: "error", message: ""});
  const [disabled, setDisabled] = useState(false);

  const handleApproval = () => {
    startTransition(async () => {
      const result = await setStreamStatus(stream, $Enums.ScheduleStatus.APPROVED);
      SetSubmissionState(result);
      if (result.type === "success") {
        setDisabled(true);
        scheduleAction(stream.id);
      }
    });
  };

  const handleRejection = () => {
    startTransition(async () => {
      const result = await setStreamStatus(stream, $Enums.ScheduleStatus.REJECTED);
      SetSubmissionState(result);
      if (result.type === "success") {
        setDisabled(true);
        scheduleAction(stream.id);
      }
    });
  };

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await setStreamStatus(stream, $Enums.ScheduleStatus.PENDING)
      SetSubmissionState(result);
      if (result.type === "success") {
        setDisabled(true);
        scheduleAction(stream.id);
      }
    });
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteStreamById(stream.id);
      
      if (result.type === "success") {
        setDisabled(true);
        SetSubmissionState({type: result.type, data: {message: "Stream Deleted"}})
        scheduleAction(stream.id);
      }
      
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">
          {stream.title}
        </CardTitle>
        <CardAction className="flex sm:flex-row flex-col justify-center gap-5">
          { stream.status === $Enums.ScheduleStatus.PENDING ? (
            <>
              <Button variant={"outline"} onClick={handleApproval} disabled={pending || disabled}>
                {pending ? "Pending..." : "Approve"}
              </Button>
              <Button variant={"destructive"} onClick={handleRejection} disabled={pending || disabled}>
                {pending ? "Pending..." : "Reject"}
              </Button>
            </>
          ): stream.status === $Enums.ScheduleStatus.APPROVED ? (
            <>
              <Button variant={"destructive"} onClick={handleRevoke} disabled={pending || disabled}>
                {pending ? "Pending..." : "Revoke"}
              </Button>
            </>
          ): (
            <>
              <Button variant={"outline"} onClick={handleDelete} disabled={pending || disabled}>
                {pending ? "Pending..." : "Delete"}
              </Button>
            </>
          )}
        </CardAction>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            <LocalTime date={stream.startTime}/> - <LocalTime date={stream.endTime}/>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarRange className="w-4 h-4" />
            <LocalDate date={stream.startDate}/> to <LocalDate date={stream.endDate}/>
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
            Created At: <LocalDate date={stream.submittedAt}/>
          </div>
          
          { stream.reviewedAt && 
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PenIcon className="w-4 h-4" />
              Reviewed At:  <LocalDate date={stream.reviewedAt}/>
            </div>
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 truncate">
          {stream.description}
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2 text-sm">
        {submissionstate.type === "success" && submissionstate.data.message && (
          <p className="text-green-600">{submissionstate.data.message}</p>
        )}
        {submissionstate.type === "error" && submissionstate.message && (
          <p className="text-red-600">Error: {submissionstate.message}</p>
        )}
      </CardFooter>
    </Card>
  );
}