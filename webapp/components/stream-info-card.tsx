import { StreamSchedule } from "@prisma/client";
import { CalendarRange, Clock4, Repeat } from "lucide-react";
import { RRule } from "rrule";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function StreamInfoCard({stream}: {stream: StreamSchedule}) {
  const startTime = stream.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = stream.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const startDate = stream.startDate.toLocaleDateString();
  const endDate = stream.endDate.toLocaleDateString();
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
      </CardContent>

    </Card>
  );
}