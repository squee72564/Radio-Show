import { auth } from "@/auth";
import { User } from "@prisma/client";

import { Suspense } from "react";
import SkeletonCard from "@/components/skeleton-card";
import UserCountCard from "@/components/user-count-card";
import ApprovedSchedulesCard from "@/components/approved-schedules-count-card";
import PendingSchedulesCard from "@/components/pending-schedules-count-card";
import { redirect } from "next/navigation";
import { isUserAdmin } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !isUserAdmin(user.status)) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Suspense fallback={<SkeletonCard title="Pending Schedules" />}>
          <PendingSchedulesCard />
        </Suspense>

        <Suspense fallback={<SkeletonCard title="Approved Schedules" />}>
          <ApprovedSchedulesCard />
        </Suspense>

        <Suspense fallback={<SkeletonCard title="Registered Users" />}>
          <UserCountCard />
        </Suspense>
      </div>
    </div>
  );
}
