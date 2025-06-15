import { DatePicker } from "@/components/date-picker";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
};


export default function Calendar() {
  return (
    <div className="min-h-screen w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarIcon className="w-6 h-6" /> Calendar
      </h1>
      <Separator/>

      <DatePicker />
    </div>
  );
}
