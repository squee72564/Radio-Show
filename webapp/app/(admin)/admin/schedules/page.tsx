import { CalendarCogIcon } from "lucide-react";
import { isUserAdmin } from "@/lib/utils";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { User } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import AdminScheduleTabs from "./admin-schedule-tabs";

export default async function AdminSchedulePage() {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !isUserAdmin(user.status)) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarCogIcon className="w-6 h-6" /> Admin: Schedule Management
      </h1>
      <Separator />
      <AdminScheduleTabs />
    </div>
  );
}
