import LiveStreamPlayer from "@/components/live-stream-player";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Live",
};

export default async function Live() {

  return (
    <div className="flex flex-col items-center pt-20 min-h-screen w-full">
      <h1 className="text-3xl font-bold">Live Stream</h1>
      <Card className="w-full max-w-xl shadow-xl border-muted mt-20">
        <CardHeader className="flex items-center gap-2">
          <Volume2 className="text-primary" />
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Now Playing
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <LiveStreamPlayer />
        </CardContent>
      </Card>
    </div>
  );
}