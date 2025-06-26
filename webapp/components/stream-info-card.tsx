import { StreamSchedule } from "@prisma/client";
import { CalendarRange, Clock4, Repeat } from "lucide-react";
import { RRule } from "rrule";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import LocalTime from "@/components/localtime";
import LocalDate  from "./localdate";

export default function StreamInfoCard({stream}: {stream: StreamSchedule}) {
  const recurrence = RRule.fromString(stream.rrule).toText();

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-bold text-lg">
          {stream.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock4 className="w-4 h-4" />
          <LocalTime date={stream.startTime} /> - <LocalTime date={stream.endTime} />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarRange className="w-4 h-4" />
          <LocalDate date={stream.startDate} /> to <LocalDate date={stream.endDate} />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Repeat className="w-4 h-4" />
          <span>{recurrence}</span>
        </div>
      </CardContent>

    </Card>
  );
}