"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import Link from "next/link";

export default function LiveStreamPlayer() {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const icecastUrl = "http://localhost:3000/api/live"
  useEffect(() => {
    fetch(icecastUrl, { method: "HEAD" })
      .then((res) => {
        if (res.ok && res.headers.get("content-type")?.includes("audio")) {
          setStreamUrl(icecastUrl);
        } else {
          throw new Error("No live stream at this time.");
        }
      })
      .catch(() => {
        setStreamUrl(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
      <Skeleton className="w-full min-w-110 min-h-23 h-12 rounded-md" />
    ) : streamUrl ? (
      <audio
        controls
        autoPlay
        className="w-full outline-none rounded-md min-w-110"
        src={streamUrl}
      >
        Your browser does not support the audio element.
      </audio>
    ) : (
      <Alert variant="default" className="min-w-110">
        <AlertTitle>No Live Stream</AlertTitle>
        <AlertDescription>
          There’s nothing live right now. Check back later or browse the <Link className="inline" href="/archive">archives</Link>
        </AlertDescription>
      </Alert>
    )}
    </>

  );
}
