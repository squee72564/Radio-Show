import LiveStreamPlayer from "@/components/live-stream-player";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Live",
};

export default function Live() {

  return (
    <div className="min-h-screen w-full">
      <Card className="flex justify-center w-full max-w-full min-h-screen">
        <CardContent className="flex flex-col items-center justify-center">
          <LiveStreamPlayer />
        </CardContent>
      </Card>
    </div>
  );
}