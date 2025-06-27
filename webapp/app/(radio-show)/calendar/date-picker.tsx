"use client";

import { useState, useTransition, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { StreamInstance, StreamSchedule, User } from "@prisma/client";
import { motion } from "framer-motion";

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
import LocalDate from "@/components/localdate";

export function DatePicker() {
  const [schedule, setSchedule] = useState<(StreamInstance & {user: User, streamSchedule: StreamSchedule})[] | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDateParam = searchParams.get("date");

  const [date, setDate] = useState<Date | undefined>(() => {
    return initialDateParam ? new Date(initialDateParam) : new Date();
  });

  useEffect(() => {
    if (!date) return;

    const timeout = setTimeout(() => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      startTransition(async () => {
        setSchedule(
          await getStreamInstancesByDateRange(
            startOfDay,
            endOfDay,
            {
              include: {
                user: true,
                streamSchedule: true,
              }
            }
          ) as (StreamInstance & {user: User, streamSchedule: StreamSchedule})[]
        );
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [date]);

  const changeDay = (offset: number) => {
    if (!date) return;

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    setDate(newDate);

    const formatted = newDate.toLocaleDateString();
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", formatted);
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col flex-1">
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
              {date ? <LocalDate date={date}/> : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                  const formatted = selectedDate.toLocaleDateString();
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("date", formatted);

                  router.replace(`?${params.toString()}`);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="flex flex-row gap-5">
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
      </div>
      
      <div className="flex flex-col space-y-4 overflow-y-auto p-5 min-h-80 max-h-[calc(100vh-200px)]">
        {pending ? (
          <Badge variant="outline">Loading...</Badge>
        ) : schedule && schedule.length > 0 ? (
          schedule.map((streamInstance, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: idx * 0.12,
                ease: "easeOut"
              }}
            >
              <StreamInstanceInfoCard streamInstance={streamInstance} />
            </motion.div>
          ))

        ) : (
          <Badge variant="outline">No scheduled Streams</Badge>
        )}
      </div>
    </div>
  );
}
