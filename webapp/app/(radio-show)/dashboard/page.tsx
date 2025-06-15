import type { Metadata } from "next";

import RecentUsers from "@/components/recent-users";
import RecentArchives from "@/components/recent-archives";
import NextShow from "@/components/next-show";
import { Suspense } from "react";
import RecentUsersSkeleton from "@/components/recent-users-skeleton";
import RecentArchivesSkeleton from "@/components/recent-archives-skeleton";
import NextShowSkeleton from "@/components/next-show-skeleton";
import { LayoutDashboard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  return (
    <main className="min-h-screen w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6" /> Dashboard
      </h1>
      <Separator/>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <Suspense fallback={<RecentUsersSkeleton/>}>
          <RecentUsers/>
        </Suspense>

        <Suspense fallback={<RecentArchivesSkeleton />}>
          <RecentArchives/>
        </Suspense>

        <Suspense fallback={<NextShowSkeleton />}>
          <NextShow/>
        </Suspense>

      </div>
    </main>
  );
}
