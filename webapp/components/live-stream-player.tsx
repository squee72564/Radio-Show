"use client";

import { useEffect, useState, useRef } from "react";
import { useStreamStatus } from '@/hooks/use-streamstatus';
import { useAudioVisualizer } from "@/hooks/use-audiovisualizer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function WaveformVisualizer({
  audioRef,
  audioCtxRef,
  sourceNodeRef,
  analyserRef,
  isTimeDomain
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioCtxRef: React.RefObject<AudioContext | null>;
  sourceNodeRef: React.RefObject<MediaElementAudioSourceNode | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  isTimeDomain: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");
    const source = sourceNodeRef.current;
    const analyser = analyserRef.current;

    if (!audio || !canvas || !canvasCtx || !audioCtxRef.current || !source || !analyser)
      return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#181363";

      if (isTimeDomain) {
        analyser.getByteTimeDomainData(dataArray);
        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        canvasCtx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) canvasCtx.moveTo(x, y);
          else canvasCtx.lineTo(x, y);
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      } else {
        analyser.getByteFrequencyData(dataArray);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const y = canvas.height - barHeight;
          canvasCtx.fillStyle = "#070a2e";
          canvasCtx.fillRect(x, y, barWidth, barHeight);
          x += barWidth + 1;
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioRef, audioCtxRef, analyserRef, isTimeDomain]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-full aspect-[4/1] bg-primary/50 rounded-xl"
    />
  );
}

function CustomPlayer({ streamUrl, isStreamLive }: { streamUrl: string, isStreamLive: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const {
    audioCtxRef,
    analyserRef,
    sourceNodeRef,
    isInitialized,
    initAudioGraph,
    resumeIfSuspended,
  } = useAudioVisualizer(audioRef);

  const [isTimeDomain, setIsTimeDomain] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isStreamLive) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio.src = streamUrl;
      audio.load();
    } else {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  }, [isStreamLive]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = async () => {
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setIsPlaying(false);
    }

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, []);

  const changeVolume = (val: number[]) => {
    const audio = audioRef.current;
    const vol = val[0] / 100;
    setVolume(val[0]);
    if (audio) audio.volume = vol;
  };

  return (
    <div className="flex flex-col items-center text-center w-full gap-4 bg-muted p-4 rounded-xl">
      <div
        className="flex flex-col justify-center items-center w-full max-w-full aspect-[4/1] bg-primary/10 rounded-xl"
      >
      { !isStreamLive ? (
        <>
          <p>{"乁( ⁰͡ Ĺ̯ ⁰͡ ) ㄏ"}</p>
          <p>Offline.</p>
        </>
      ) : isLoading ? (
          <>
            <p>{"( ͡~ ͜ʖ ͡°)"}</p>
            <p>Loading...</p>
          </>
      ) : !isPlaying ? (
        <div
          onClick={async () => {
            const audio = audioRef.current;
            if (!audio) return;

            if (!isInitialized) initAudioGraph();
            await resumeIfSuspended();

            try {
              await audio.play();
              setIsPlaying(true);
            } catch (err) {
              console.error("Playback failed:", err);
            }
          }}
        >
          <>
            <p>{"(♡´౪`♡)"}</p>
            <p>Click to Play!</p>
          </>
        </div>
      ) : (
        audioRef &&
          <WaveformVisualizer
            audioRef={audioRef}
            audioCtxRef={audioCtxRef}
            sourceNodeRef={sourceNodeRef}
            analyserRef={analyserRef}
            isTimeDomain={isTimeDomain}
          />
      )}
      </div>
      <Button
        className="p-1 text-xs"
        variant="outline"
        onClick={() => setIsTimeDomain((prev) => !prev)}
      >
        View: {isTimeDomain ? "Time Domain" : "Frequency Domain"}
      </Button>
      <div className="w-full">
        <Badge variant={"outline"} className="text-sm text-muted-foreground mb-1">
          {!isStreamLive ? "Offline" : isLoading ? "Loading..." : `Volume: ${volume}%`}
        </Badge>
        <Slider
          id="volume"
          defaultValue={[100]}
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={changeVolume}
        />
      </div>

      <audio ref={audioRef} src={streamUrl} />
    </div>
  );
}

export default function LiveStreamPlayer() {
  const streamUrl: string = "http://localhost:3000/api/live";
  const status = useStreamStatus(() => "ws://localhost:3000/api/ws");
  const [loading, setLoading] = useState<boolean>(true);
  const [isStreamLive, setIsStreamLive] = useState<boolean>(true);

  useEffect(() => {
    let retries = 3;
    let timeoutId: NodeJS.Timeout;

    const checkStream = () => {
      fetch(streamUrl, { method: "HEAD" })
        .then((res) => {
          const isAudio = res.ok && res.headers.get("content-type")?.includes("audio");
          if (isAudio) {
            setIsStreamLive(true);
            setLoading(false);
          } else {
            retry();
          }
        })
        .catch(retry);
    };

    const retry = () => {
      if (retries > 0) {
        retries--;
        timeoutId = setTimeout(checkStream, 3000);
      } else {
        setIsStreamLive(false);
        setLoading(false);
      }
    };

    if (status === 'live') {
      checkStream();
    } else {
      setIsStreamLive(false);
      setLoading(false);
    }

    return () => clearTimeout(timeoutId);
  }, [status]);


  return (
    <div className="flex flex-col gap-4 w-full">
      <CustomPlayer streamUrl={streamUrl} isStreamLive={isStreamLive}/>

      {loading ? (
        <Alert variant="default" className="w-full">
          <AlertTitle>Loading...</AlertTitle>
        </Alert>
      ): !isStreamLive ? (
        <Alert variant="default" className="w-full">
          <AlertTitle>Stream appears to be offline</AlertTitle>
          <AlertDescription className="text-base">
            <p className="text-center">
              The live stream connection may be down.
              <br />
              Check back later or visit the <Link className="text-blue-700/80" href="/archive">archives</Link>.
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default" className="w-full">
          <AlertTitle>Stream is online</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
