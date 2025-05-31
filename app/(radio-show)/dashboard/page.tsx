import type { Metadata } from "next";

import RecentUsers from "@/components/recent-users";
import RecentArchives from "@/components/recent-archives";
import NextShow from "@/components/next-show";
import { Suspense } from "react";
import RecentUsersSkeleton from "@/components/recent-users-skeleton";
import RecentArchivesSkeleton from "@/components/recent-archives-skeleton";
import NextShowSkeleton from "@/components/next-show-skeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-16 bg-background text-foreground font-sans w-full">
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      </div>

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
