"use client"

import { useState, useTransition } from "react";
import { CalendarRange, Clock4, Repeat, UserIcon, PenIcon} from "lucide-react";
import { deleteStreamById, setStreamStatus } from "@/lib/db/actions/streamscheduleActions";
import { RRule } from "rrule";
import { $Enums, StreamSchedule, User } from "@prisma/client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ScheduleManagementCard({stream}: {stream: StreamSchedule & {user: User} }) {
  const startTime = stream.startTime.toISOString().slice(11, 16);
  const endTime = stream.endTime.toISOString().slice(11, 16);
  const startDate = stream.startDate.toDateString();
  const endDate = stream.endDate.toDateString();
  const recurrence = RRule.fromString(stream.rrule).toText();

  const [pending, startTransition] = useTransition()
  const [submissionstate, SetSubmissionState] = useState({success: false, message: "", error: ""});
  const [disabled, setDisabled] = useState(false);

  const handleApproval = () => {
    startTransition(async () => {
      const result = await setStreamStatus(stream, $Enums.ScheduleStatus.APPROVED);
      SetSubmissionState(result);
      if (result.success) setDisabled(true);
    });
  };

  const handleRejection = () => {
    startTransition(async () => {
      const result = await setStreamStatus(stream, $Enums.ScheduleStatus.REJECTED);
      SetSubmissionState(result);
      if (result.success) setDisabled(true);
    });
  };

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await setStreamStatus(stream, $Enums.ScheduleStatus.PENDING)
      SetSubmissionState(result);
      if (result.success) setDisabled(true);
    });
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteStreamById(stream.id)
      SetSubmissionState({success: true, message: `Stream deleted.`, error: ""})
      setDisabled(true);
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
        
        { stream.reviewedAt && 
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PenIcon className="w-4 h-4" />
            <span>Reviewed At: {stream.reviewedAt?.toDateString()}</span>
          </div>
        }

      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2 text-sm">
        {submissionstate.message && (
          <p className="text-green-600">{submissionstate.message}</p>
        )}
        {submissionstate.error && (
          <p className="text-red-600">Error: {submissionstate.error}</p>
        )}
      </CardFooter>
    </Card>
  );
}