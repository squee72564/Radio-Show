"use server";

import { findAllStreamArchives } from "@/lib/db/actions/streamscheduleActions";
import { StreamArchive } from "@prisma/client";
import { StreamArchiveRelations } from "@/types/prisma-relations";
import ArchiveAdminTable from "./archive-table-admin";

export default async function AdminArchiveList() {
  const archives = await findAllStreamArchives({
    include: {
      streamSchedule: true,
      streamInstance: true,
      user: true
    }
  }) as (StreamArchive & StreamArchiveRelations)[];

  return (
      <ArchiveAdminTable data={archives} />
  );
}