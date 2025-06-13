import { StreamSchedule } from "@prisma/client";
import { CalendarRange, Clock4, Repeat } from "lucide-react";
import { RRule } from "rrule";

export default function StreamInfoCard({stream}: {stream: StreamSchedule}) {
  const startTime = stream.startTime.toISOString().slice(11, 16);
  const endTime = stream.endTime.toISOString().slice(11, 16);
  const startDate = stream.startDate.toDateString();
  const endDate = stream.endDate.toDateString();
  const recurrence = RRule.fromString(stream.rrule).toText();

  return (
  <div
    className="border rounded-xl p-4 shadow-sm bg-muted/50 space-y-2"
  >
    <div className="text-lg font-semibold">{stream.title}</div>

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
  </div>
  );
}