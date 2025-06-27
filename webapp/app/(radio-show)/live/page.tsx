import type { Metadata } from "next";
import { Music } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import LiveStreamPlayer from "@/app/(radio-show)/live/live-stream-player";
import { getCurrentStreamInstance } from "@/lib/db/actions/streamscheduleActions";
import { StreamInstance, StreamSchedule } from "@prisma/client";

export const metadata: Metadata = {
  title: "Live",
};

export default async function Live() {

  const currentStream = await getCurrentStreamInstance({
    include: { streamSchedule: true}
  }) as (StreamInstance & {streamSchedule: StreamSchedule}) | null;

  return (
    <div className="flex flex-col min-h-screen w-full p-6 gap-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Music className="w-6 h-6" /> {currentStream ? `Live: ${currentStream.streamSchedule.title}` : "Live"}
      </h1>
      <Separator/>
      <LiveStreamPlayer />
    </div>
  );
}