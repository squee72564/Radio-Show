import { ArchiveIcon } from "lucide-react";
import type { Metadata } from "next";
import { findAllStreamArchives } from "@/lib/db/actions/streamscheduleActions";

import { Separator } from "@/components/ui/separator";
import ArchiveDataTable, { columns } from "@/app/(radio-show)/archive/archive-table";
import { StreamArchive } from "@prisma/client";
import { StreamArchiveRelations } from "@/types/prisma-relations";

export const metadata: Metadata = {
  title: "MugenBeat - Archive",
  description: "Archive page of past live streams"
};

export default async function Archive() {
  const data = await findAllStreamArchives({
    include: {
      user: true,
      streamSchedule: true,
    }
  }) as (StreamArchive & Omit<StreamArchiveRelations, "streamInstance">)[];

  return (
    <main className="flex flex-col min-h-screen w-full p-6 gap-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ArchiveIcon className="w-6 h-6" /> Archive
      </h1>
      <Separator />
      <ArchiveDataTable columns={columns} data={data} />
    </main>
  );
};