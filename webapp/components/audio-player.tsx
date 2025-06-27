"use client";

import { useAudioNodeGraph } from "@/hooks/use-audionodegraph";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Skeleton } from "./ui/skeleton";
import { LoaderIcon, PauseIcon, PlayIcon } from "lucide-react";

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

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
  }, [sourceNodeRef, audioRef, audioCtxRef, analyserRef, isTimeDomain]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-[4/1] bg-primary/50 rounded-xl"
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
  }, [streamUrl, isStreamLive]);

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
  }, []);

  const changeVolume = (val: number[]) => {
    const audio = audioRef.current;
    const vol = val[0] / 100;
    setVolume(val[0]);
    if (audio) audio.volume = vol;
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full gap-4 bg-muted p-4 rounded-xl">
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