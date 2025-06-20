"use client";

import { useState, useTransition, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CalendarRange, Clock4 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { StreamInstance, StreamSchedule, User } from "@prisma/client";

import { cn } from "@/lib/utils";
import { getStreamInstancesByDateRange } from "@/lib/db/actions/streamscheduleActions";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import StreamInstanceInfoCard from "@/components/streaminstance-info-card";

function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function DatePicker() {
  const [schedule, setSchedule] = useState<(StreamInstance & {user: User, streamSchedule: StreamSchedule})[] | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDateParam = searchParams.get("date");

  const [date, setDate] = useState<Date | undefined>(() => {
    return initialDateParam ? parseLocalDateString(initialDateParam) : new Date();
  });

  useEffect(() => {
    if (!date) return;

    const timeout = setTimeout(() => {
      const startOfDay = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
      ));

      const endOfDay = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23, 59, 59, 999
      ));

      startTransition(async () => {
        setSchedule(await getStreamInstancesByDateRange(startOfDay, endOfDay));
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [date]);

  const changeDay = (offset: number) => {
    if (!date) return;

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    setDate(newDate);

    const formatted = newDate.toISOString().split("T")[0];
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", formatted);
    router.replace(`?${params.toString()}`);
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row relative mb-8 ml-5 gap-5 items-center justify-center">
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
              onSelect={(selectedDate) => {
                setDate(selectedDate);

                if (selectedDate) {
                  const formatted = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("date", formatted);

                  router.replace(`?${params.toString()}`);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          className="max-w-25"
          variant="outline"
          onClick={() => changeDay(-1)}
        >
          Prev Day
        </Button>

        <Button
          className="max-w-25"
          variant="outline"
          onClick={() => changeDay(1)}
        >
          Next Day
        </Button>
      </div>

      <div className="space-y-4 w-full overflow-auto max-h-110 p-5">
        {pending ? (
          <Badge variant="outline">Loading...</Badge>
        ) : schedule && schedule.length > 0 ? (
          schedule.map((streamInstance) => (
            <StreamInstanceInfoCard streamInstance={streamInstance} />
          ))
        ) : (
          <Badge variant="outline">No scheduled Streams</Badge>
        )}
      </div>
    </>
  );
}
