"use client"

import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LocalTime from "@/components/localtime";
import LocalDate from "@/components/localdate";
import { useState, useTransition } from "react";
import { Clock4, PenIcon, UserIcon } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Result } from "@/types/generic";
import { adminDeleteArchive } from "@/lib/db/actions/streamscheduleActions";

export default function ArchiveManagementCard({
  archive
}: {
  archive: StreamArchive & {
    streamSchedule: StreamSchedule,
    streamInstance: StreamInstance,
    user: User
  }
}) {
  const [pending, startTransition] = useTransition()
  const [submissionstate, SetSubmissionState] = useState<Result<StreamArchive> | null>(null);
  const [disabled, setDisabled] = useState(false);
  
  const handleDeletion = () => {
    startTransition( async () => {
      const response = await adminDeleteArchive(archive.id)
      SetSubmissionState(response)
      setDisabled(true);
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {archive.streamSchedule.title}
        </CardTitle>
        <CardAction>
          <Button variant={"outline"} onClick={handleDeletion} disabled={pending || disabled}>
            {pending ? "Pending..." : "Delete"}
          </Button>
        </CardAction>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            <LocalTime 
              date={archive.streamInstance.scheduledStart}
            />
              -
            <LocalTime
              date={archive.streamInstance.scheduledEnd}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock4 className="w-4 h-4" />
            Duration: {archive.durationInSeconds ? formatTime(archive.durationInSeconds) : "N/A"}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="w-4 h-4" />
            <span>User: {archive.user.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <PenIcon className="w-4 h-4" />
            Streamed at: <LocalDate date={archive.streamInstance.scheduledStart} />
          </div>
        </CardDescription>
      </CardHeader>
      {submissionstate !== null && (
        <CardFooter className="flex flex-row justify-center">
          {submissionstate.type === "error" ? (
            <p className="text-red-600">Error: {submissionstate.message}</p>
          ): (
            <p className="text-green-600">{"Stream Archive Deleted"}</p>
          )}
        </CardFooter>
      )}
    </Card>
  )
}