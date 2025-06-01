import { DatePicker } from "@/components/date-picker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
};


export default function Calendar() {
  return (
    <div className="flex flex-col items-center justify-items-center gap-16 w-full">
      <DatePicker />
    </div>
  );
}
