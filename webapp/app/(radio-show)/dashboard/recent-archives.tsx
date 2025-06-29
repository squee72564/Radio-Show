"use server";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { findRecentArchives } from "@/lib/db/services/streamscheduleService";
import { StreamArchive, StreamInstance, StreamSchedule } from "@prisma/client";
import LocalDate from "@/components/localdate";

export default async function RecentArchives() {
  const archives = await findRecentArchives(5, {
    include: {
      streamSchedule: true,
      streamInstance: true
    }
  }) as (StreamArchive & {streamSchedule: StreamSchedule, streamInstance: StreamInstance})[];

  return (
    <section className="min-h-41 max-h-41 w-full">
      <h2 className="text-lg font-medium mb-4">Recent Archives</h2>
      {archives.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 overflow-auto">
          {archives.map((archive, idx) => (
            <li key={idx}>
              <Link href={`archive/${archive.id}`} className="flex flex-row gap-2 hover:underline text-primary">
                {archive.streamSchedule.title} - <LocalDate date={archive.streamInstance.scheduledStart}/>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          No previous archives
        </Badge>
      )}
    </section>  
  );
}