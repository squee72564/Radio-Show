import { Suspense } from "react";
import { auth } from "@/auth";
import { isUserAdmin } from "@/lib/utils";
import { $Enums, StreamSchedule, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCogIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { findAllStreamsByStatusWithUser } from "@/lib/db/actions/streamscheduleActions";
import ScheduleManagementCard from "@/components/schedule-management-card";

export function UserGroupTabContent({
  loader,
}: {
  loader: () => Promise<(StreamSchedule & {user: User})[]>;
}) {
  const LazyList = async () => {
    const schedules = await loader();
    return <ScheduleList schedules={schedules} />;
  };

  return (
    <Suspense fallback={<UserListSkeleton />}>
      <LazyList />
    </Suspense>
  );
}

function ScheduleList({ schedules }: { schedules: (StreamSchedule & {user: User})[] }) {
  if (schedules.length === 0) {
    return <p className="text-sm text-muted-foreground">No schedules found.</p>;
  }

  return (
    <div className="space-y-2">
      {schedules.map((schedule, idx) => (
        <ScheduleManagementCard key={idx} stream={schedule}/>
      ))}
    </div>
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default async function AdminSchedulePage() {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !isUserAdmin(user.status)) {
    redirect("/dashboard");
  }

  const scheduleTabs = [
    {
      value: "pending",
      label: "Pending",
      loader: () => findAllStreamsByStatusWithUser($Enums.ScheduleStatus.PENDING),
    },
    {
      value: "approved",
      label: "Approved",
      loader: () => findAllStreamsByStatusWithUser($Enums.ScheduleStatus.APPROVED),
    },
    {
      value: "rejected",
      label: "Rejected",
      loader: () => findAllStreamsByStatusWithUser($Enums.ScheduleStatus.REJECTED),
    },
  ];


  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarCogIcon className="w-6 h-6" /> Admin: Schedule Management
      </h1>
      <Separator />

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="flex space-x-2">
          {scheduleTabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="capitalize">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {scheduleTabs.map(({ value, loader }) => (
          <TabsContent key={value} value={value} className="space-y-4">
            <UserGroupTabContent loader={loader} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}