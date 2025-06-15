"use client";

import { useState, useTransition, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStreamInstancesByDateRange } from "@/lib/db/actions/streamscheduleActions";
import { StreamInstance, StreamSchedule, User } from "@prisma/client";


export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [schedule, setSchedule] = useState<(StreamInstance & {user: User, streamSchedule: StreamSchedule})[] | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!date) return;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    startTransition(async () => {
      setSchedule(await getStreamInstancesByDateRange(startOfDay, endOfDay))
    });
  }, [date]);

  return (
    <>
      <div className="relative mb-8 ml-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4 w-full overflow-auto max-h-110 p-5">
        {pending ? (
          <Badge variant="outline">Loading...</Badge>
        ) : schedule && schedule.length > 0 ? (
          schedule.map((streamInstance) => (
            <Card key={streamInstance.id} className="transition-transform hover:-translate-y-1 duration-300 w-full">
              <CardHeader>
                <CardTitle>{streamInstance.streamSchedule.title}</CardTitle>
                <CardDescription>
                  Scheduled for: {format(date!, "PPP")}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <p className="text-sm text-muted-foreground">ID: {streamInstance.streamSchedule.id}</p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Badge variant="outline">No scheduled Streams</Badge>
        )}
      </div>
    </>
  );
}
