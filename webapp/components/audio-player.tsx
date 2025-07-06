"use client";

import { useAudioNodeGraph } from "@/hooks/use-audionodegraph";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Skeleton } from "./ui/skeleton";
import { LoaderIcon, PauseIcon, PlayIcon } from "lucide-react";

import { formatTime } from "@/lib/utils";

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
      canvasCtx.lineWidth = 1;
      
      const styles = getComputedStyle(canvas);
      const chart1 = styles.getPropertyValue("--chart-5").trim() || "#181363";
      const chart2 = styles.getPropertyValue("--chart-2").trim() || "#181363";

      canvasCtx.strokeStyle = chart1;
      canvasCtx.fillStyle = chart2;

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
  }, [sourceNodeRef, audioRef, audioCtxRef, analyserRef, isTimeDomain]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-[4/1] rounded-xl bg-white/80 border-black/40 border-1"
    />
  );
}

export function CustomPlayer({
  streamUrl,
  isStreamLive,
  showControls,
}: {
  streamUrl: string,
  isStreamLive: boolean
  showControls: boolean
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const {
    audioCtxRef,
    analyserRef,
    sourceNodeRef,
    isInitialized,
    initAudioGraph,
    resumeIfSuspended,
  } = useAudioNodeGraph(audioRef);

  const [isTimeDomain, setIsTimeDomain] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    return () => setHasMounted(false);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasMounted) return;

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
  }, [streamUrl, isStreamLive, hasMounted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasMounted) return;

    const handleCanPlay = async () => {
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setIsPlaying(false);
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadstart", handleLoadStart);

      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [hasMounted]);

  const changeVolume = (val: number[]) => {
    const audio = audioRef.current;
    const vol = val[0] / 100;
    setVolume(val[0]);
    if (audio) audio.volume = vol;
  };

  if (!hasMounted) {
    return (
    <div className="flex flex-col items-center justify-center text-center w-full gap-4 bg-muted p-4 rounded-xl">
      <div
        className="flex flex-col justify-center items-center w-full max-w-full aspect-[4/1] bg-primary/10 rounded-xl"
      >
        <p>{"乁( ⁰͡ Ĺ̯ ⁰͡ ) ㄏ"}</p>
        <p>Loading...</p>

      </div>
      <Button
        className="p-1 text-xs"
        variant="outline"
      >
        Loading...
      </Button>
      <div className="w-full flex flex-row gap-2">
        <Badge variant={"outline"} className="text-sm text-muted-foreground mb-1">
          Loading...
        </Badge>
        <Slider
          id="volume"
          defaultValue={[100]}
          value={[volume]}
          min={0}
          max={100}
        />
      </div>
      {showControls && 
      <>
        <div className="w-full flex flex-row gap-2 justify-center items-center">
          <Badge variant="outline" className="text-xs mt-1">
            Loading...
          </Badge>
          <Skeleton className="w-full h-2"/>
        </div>
        <Button
          className="p-1 text-xs"
          variant="outline"
        >
          <LoaderIcon/>
        </Button>
      </>
      }
    </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center text-center w-full gap-4 bg-muted p-4 rounded-xl border-1 border-black/20 ">
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
            className="flex flex-col justify-center w-full h-full hover:font-bold"
          >
            <p>{"(♡´౪`♡)"}</p>
            <p>Click to Play!</p>
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
      <div className="w-full flex flex-row gap-2">
        <Badge variant={"outline"} className="text-sm mb-1">
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
      {showControls && 
      <>
        <div className="w-full flex flex-row gap-2 justify-center items-center">
          <Badge variant="outline" className="text-xs mt-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </Badge>
          {isLoading ? (
            <Skeleton className="w-full h-2"/>
          ): (
            <Slider
              id="seek"
              value={[currentTime]}
              min={0}
              max={duration || 0}
              step={0.1}
              onValueChange={(val) => {
                const audio = audioRef.current;
                if (audio) {
                  audio.currentTime = val[0];
                  setCurrentTime(val[0]);
                }
              }}
            />
          )}

        </div>
        <Button
          className="p-1 text-xs"
          variant="outline"
          onClick={async () => {
            const audio = audioRef.current;
            if (!audio || isLoading) return;

            if (!isInitialized) initAudioGraph();
            await resumeIfSuspended();

            if (audio.paused) {
              try {
                await audio.play();
                setIsPlaying(true);
              } catch (err) {
                console.error("Playback failed:", err);
              }
            } else {
              audio.pause();
              setIsPlaying(false);
            }
          }}
        >
          {isLoading ? <LoaderIcon/> : isPlaying ? <PauseIcon/> : <PlayIcon/>}
        </Button>
      </>
      }
      <audio ref={audioRef} src={streamUrl} />
    </div>
  );
}