import { ArchiveIcon } from "lucide-react";
import type { Metadata } from "next";
import { findAllStreamArchivesWithUserAndSchedule } from "@/lib/db/services/streamscheduleService";

import { Separator } from "@/components/ui/separator";
import ArchiveDataTable, { columns } from "@/app/(radio-show)/archive/archive-table";

export const metadata: Metadata = {
  title: "Archive",
};

export default async function Archive() {
  const data = await findAllStreamArchivesWithUserAndSchedule();

  return (
    <main className="min-h-screen min-h-screen w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ArchiveIcon className="w-6 h-6" /> Archive
      </h1>
      <Separator />

      <div className="w-full gap-5">
        <ArchiveDataTable columns={columns} data={data} />
      </div>
    </main>
  );
};