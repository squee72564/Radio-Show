"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStreamStatus } from '@/hooks/use-streamstatus';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomPlayer } from "@/components/audio-player";

export default function LiveStreamPlayer() {
  const streamUrl: string = "http://localhost:3000/api/live";
  const status = useStreamStatus(() => "ws://localhost:3000/api/ws");
  const [loading, setLoading] = useState<boolean>(true);
  const [isStreamLive, setIsStreamLive] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    let retries = 3;
    let timeoutId: NodeJS.Timeout;

    const checkStream = async () => {
      try {
        const response = await fetch("/api/stream_status");
        console.log(response);
        const data = await response.json();
        if (response.ok && data.status === 200) {
          setIsStreamLive(true);
          setLoading(false);
        } else {
          retry();
        }
      } catch (err) {
        console.log("error");
        retry();
      }
    };

    const retry = () => {
      if (retries > 0) {
        retries--;
        timeoutId = setTimeout(checkStream, 3000);
      } else {
        setIsStreamLive(false);
        setLoading(true);
      }
    };

    checkStream();

    return () => clearTimeout(timeoutId);
  }, [status, hasMounted]);

  return (
    <div className="flex flex-col flex-1 gap-4 w-full">
      <CustomPlayer streamUrl={streamUrl} isStreamLive={hasMounted && isStreamLive} showControls={false} />
      
      { !isStreamLive ? (
        <Alert variant="default" className="w-full">
          <AlertTitle>Stream appears to be offline</AlertTitle>
          <AlertDescription className="text-base">
            <p className="text-center">
              The live stream connection may be down or no stream is scheduled for now.
            </p>
            <p className="ml-10">Check back later or visit the <Link className="text-blue-700/80" href="/archive">archives</Link>.</p>
          </AlertDescription>
        </Alert>
      
      ): loading ? (
        <Alert variant="default" className="w-full">
          <AlertTitle>Loading...</AlertTitle>
        </Alert>
      ) : (
        <Alert variant="default" className="w-full">
          <AlertTitle>Stream is online</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
