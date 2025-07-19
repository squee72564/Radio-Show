import { CalendarCogIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AdminScheduleTabs from "./admin-schedule-tabs";

export default async function AdminSchedulePage() {
  return (
    <div className="flex flex-col gap-6 p-6 min-w-0 w-full">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarCogIcon className="w-6 h-6" /> Admin: Schedule Management
      </h1>
      <Separator />
      <AdminScheduleTabs />
    </div>
  );
}
