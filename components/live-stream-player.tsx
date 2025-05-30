"use client";

import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

import Link from "next/link";

function WaveformVisualizer({
  audioRef,
  audioCtxRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioCtxRef: React.RefObject<AudioContext | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    if (!audio || !canvasCtx) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const audioCtx = audioCtxRef.current;

    if (!sourceRef.current) {
      sourceRef.current = audioCtx.createMediaElementSource(audio);
    }

    const source = sourceRef.current;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {

      if (!canvas) return;

      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.clearRect(0, 0, canvas?.width, canvas?.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#4F45E5";

      canvasCtx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

    return () => {
      try {
        analyser.disconnect();
        source.disconnect();
        audioCtx.suspend();
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
  }, [audioRef]);

  return <canvas ref={canvasRef} className="w-full h-24 rounded-md bg-secondary border border-border" />;
}

function CustomPlayer({ streamUrl }: { streamUrl: string }) {
const audioRef = useRef<HTMLAudioElement>(null);
const audioCtxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Resume AudioContext on user gesture
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Play interrupted: ", err);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
};

  const changeVolume = (val: number[]) => {
    const audio = audioRef.current;
    const vol = val[0] / 100;
    setVolume(val[0]);
    if (audio) audio.volume = vol;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md bg-muted p-4 rounded-xl shadow">
      {audioRef && <WaveformVisualizer audioRef={audioRef} audioCtxRef={audioCtxRef} />}
      <Button onClick={togglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </Button>
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="volume" className="text-sm text-muted-foreground">
          Volume: {volume}%
        </label>
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
      <audio ref={audioRef} src={streamUrl} autoPlay />
    </div>
  );
}


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
      <CustomPlayer streamUrl={icecastUrl}/>
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
