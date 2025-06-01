import LiveStreamPlayer from "@/components/live-stream-player";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Live",
};

export default function Live() {

  return (
    <div className="flex flex-col items-center pt-20 px-4 min-h-screen w-full">
      <Card className="mt-12 w-full max-w-2xl shadow-xl border-muted">
        <CardHeader className="flex items-center gap-2">
          <Volume2 className="text-primary" />
          <CardTitle className="text-2xl font-semibold tracking-tight">Now Playing</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <LiveStreamPlayer />
        </CardContent>
      </Card>
    </div>
  );
}