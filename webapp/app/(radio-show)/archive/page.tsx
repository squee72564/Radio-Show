import type { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import { ArchiveIcon } from "lucide-react";
import ArchiveDataTable, { columns } from "@/components/archive-table";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";

let archive =   {
  id: "testid",
  userId: "userid",
  streamScheduleId: "ssid",
  streamInstanceId: "sid",
  url: "www.test.com",
  durationInSeconds: null,
  fileSizeBytes: null,
  format: null,
  createdAt: new Date(),
  user: {name: "username"},
  streamInstance: {},
  streamSchedule: {title: "test title"},
};

const data: (StreamArchive & {
    user: Partial<User>,
    streamSchedule: Partial<StreamSchedule>,
    streamInstance : Partial<StreamInstance>
})[] = [];

for (let i = 0; i < 100; i++) {
  const newDate = archive.createdAt.setDate(archive.createdAt.getDate() - 1);
  const newTitle = archive.streamSchedule.title + i;
  data.push({...archive, createdAt: new Date(newDate), streamSchedule: {title: newTitle}});
}

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
        <ArchiveDataTable columns={columns} data={data} />
      </div>
    </main>
  );
};