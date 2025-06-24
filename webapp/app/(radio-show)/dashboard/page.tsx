import type { Metadata } from "next";
import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RecentUsersSkeleton from "@/app/(radio-show)/dashboard/recent-users-skeleton";
import RecentArchivesSkeleton from "@/app/(radio-show)/dashboard/recent-archives-skeleton";
import RecentUsers from "@/app/(radio-show)/dashboard/recent-users";
import RecentArchives from "@/app/(radio-show)/dashboard/recent-archives";
import NextShow from "@/app/(radio-show)/dashboard/next-show";
import { StreamInstanceInfoCardSkeleton } from "@/components/streaminstance-info-skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  return (
    <main className="flex flex-col min-w-0 w-full gap-6 p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6" /> Dashboard
      </h1>
      <Separator/>

      <div className="flex-1 flex flex-col gap-10">
        <div className="flex flex-row flex-1 w-full gap-10">
          <Suspense fallback={<RecentUsersSkeleton/>}>
            <RecentUsers/>
          </Suspense>

          <Suspense fallback={<RecentArchivesSkeleton />}>
            <RecentArchives/>
          </Suspense>
        </div>

        <h1 className="text-lg font-medium">Next Scheduled Show</h1>
        <Suspense fallback={<StreamInstanceInfoCardSkeleton />}>
          <NextShow/>
        </Suspense>
      </div>
    </main>
  );
}
