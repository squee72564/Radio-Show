"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStreamStatus } from '@/hooks/use-streamstatus';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomPlayer } from "@/components/audio-player";
import { ErrorBoundary } from "react-error-boundary";

export default function LiveStreamPlayer() {
  const streamUrl: string = "http://localhost:3000/api/live";
  const status = useStreamStatus(() => "ws://localhost:3000/api/ws");
  const [isStreamLive, SetStreamLive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    return () => setHasMounted(false);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    let retries = 2;
    let timeoutId: NodeJS.Timeout;

    const checkStream = async () => {
      try {
        const response = await fetch("/api/stream_status");
        const data = await response.json();
        if (response.ok && data.status === "live") {
          setLoading(false);
          SetStreamLive(true);
        } else {
          retry();
        }
      } catch (err) {
        console.log(err);
        retry();
      }
    };

    const retry = () => {
      if (retries > 0) {
        retries--;
        timeoutId = setTimeout(checkStream, 3000);
      } else {
        setLoading(true);
        SetStreamLive(false);
      }
    };

    if (status === "offline") {
      setLoading(true);
      SetStreamLive(false);
    }

    checkStream();

    return () => clearTimeout(timeoutId);
  }, [status, hasMounted]);

  return (
    <div className="flex flex-col flex-1 gap-4 w-full">
      <ErrorBoundary fallback={<></>}>
        <CustomPlayer streamUrl={streamUrl} isStreamLive={hasMounted && isStreamLive} showControls={false} />
      </ErrorBoundary>
      
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
