import type { Metadata } from "next";

import ArchiveList from "@/components/archive-list";
import ArchiveListSkeleton from "@/components/archive-list-skeleton";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Archive",
};

export default async function Archive() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-16 bg-background text-foreground font-sans w-full">
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Archives</h1>
      </div>

      <div className="w-full gap-5">
        <Suspense fallback={<ArchiveListSkeleton />}>
          <ArchiveList/>
        </Suspense>
      </div>
    </main>
  );
};