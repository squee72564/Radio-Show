import type { Metadata } from "next";
import { Music } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LiveStreamPlayer from "@/app/(radio-show)/live/live-stream-player";

export const metadata: Metadata = {
  title: "Live",
};

export default function Live() {

  return (
    <div className="flex flex-col min-h-screen w-full p-6 gap-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Music className="w-6 h-6" /> Live
      </h1>
      <Separator/>
      <LiveStreamPlayer />
    </div>
  );
}