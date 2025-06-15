import type { Metadata } from "next";

import ArchiveList from "@/components/archive-list";
import ArchiveListSkeleton from "@/components/archive-list-skeleton";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { ArchiveIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Archive",
};

export default async function Archive() {
  return (
    <main className="min-h-screen min-h-screen w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ArchiveIcon className="w-6 h-6" /> Archive
      </h1>
      <Separator />

      <div className="w-full gap-5">
        <Suspense fallback={<ArchiveListSkeleton />}>
          <ArchiveList/>
        </Suspense>
      </div>
    </main>
  );
};