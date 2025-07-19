"use server";

import { Suspense } from "react";
import { ShieldUserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SkeletonCountCard from "@/app/(admin)/admin/dashboard/skeleton-card";
import UserCountCard from "@/app/(admin)/admin/dashboard/user-count-card";
import ApprovedSchedulesCountCard from "@/app/(admin)/admin/dashboard/approved-schedules-count-card";
import PendingSchedulesCard from "@/app/(admin)/admin/dashboard/pending-schedules-count-card";

export default async function AdminDashboard() {
  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShieldUserIcon className="w-6 h-6" /> Admin: Dashboard
      </h1>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Suspense fallback={<SkeletonCountCard title="Pending Schedules" />}>
          <PendingSchedulesCard />
        </Suspense>

        <Suspense fallback={<SkeletonCountCard title="Approved Schedules" />}>
          <ApprovedSchedulesCountCard />
        </Suspense>

        <Suspense fallback={<SkeletonCountCard title="Registered Users" />}>
          <UserCountCard />
        </Suspense>
      </div>
    </div>
  );
}
