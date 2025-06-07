"use client";

import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

import { PlayIcon, PauseIcon, LoaderIcon } from "lucide-react";
import { Badge } from "./ui/badge";

function WaveformVisualizer({
  audioRef,
  audioCtxRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioCtxRef: React.RefObject<AudioContext | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const hasConnectedAudioSource = useRef<boolean>(false);
  const [isTimeDomain, setIsTimeDomain] = useState<boolean>(true);
  const modeRef = useRef<boolean>(true);

  useEffect(() => {
    modeRef.current = isTimeDomain;
  }, [isTimeDomain]);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    if (!audio || !canvas || !canvasCtx) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const audioCtx = audioCtxRef.current;

    if (!sourceRef.current && !hasConnectedAudioSource.current) {
      sourceRef.current = audioCtx.createMediaElementSource(audio);
      hasConnectedAudioSource.current = true;
    }

    if (!analyserRef.current) {
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      sourceRef.current?.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyserRef.current = analyser;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#4F45E5";

      if (modeRef.current) {
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
          canvasCtx.fillStyle = "#4F45E5";
          canvasCtx.fillRect(x, y, barWidth, barHeight);
          x += barWidth + 1;
        }
      }

      return () => {
        analyser?.disconnect();
        sourceRef.current?.disconnect();
      };
    };

    draw();
  }, [audioCtxRef, audioRef]);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        className="w-full max-w-full aspect-[4/1] bg-primary/50 rounded-xl"
      />
      <Button
        className="p-1 text-xs"
        variant="outline"
        onClick={() => setIsTimeDomain((prev) => !prev)}
      >
        View: {isTimeDomain ? "Time Domain" : "Frequency Domain"}
      </Button>
    </div>
  );
}

function CustomPlayer({ streamUrl, isStreamLive }: { streamUrl: string, isStreamLive: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [volume, setVolume] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current?.state === "running") {
        audioCtxRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isStreamLive) {
      console.log("Stream is live — reloading audio");
      audio.src = streamUrl; // reset in case stream is re-enabled
      audio.load();
    } else {
      console.log("Stream is offline — stopping audio");
      setIsLoading(true);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  }, [isStreamLive, streamUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = async () => {

      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }

      if (audio.paused) {
        try {
          await audio.play();
        } catch (err) {
          console.warn("Autoplay failed: ", err);
        }
      }

      setIsLoading(false);
    };

    const handleLoadStart = () => setIsLoading(true);

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
    <div className="flex flex-col items-center w-full gap-4 bg-muted p-4">
      {audioRef && <WaveformVisualizer audioRef={audioRef} audioCtxRef={audioCtxRef} />}
      
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isStreamLive, setIsStreamLive] = useState<boolean>(true);

  useEffect(() => {
    const checkStream = () => {
      fetch(streamUrl, { method: "HEAD" })
        .then((res) => {
          const isAudio = (res.ok && res.headers.get("content-type")?.includes("audio") || false);
          setIsStreamLive(isAudio);
        })
        .catch(() => setIsStreamLive(false))
        .finally(() => setLoading(false));
    };

    checkStream();
    const intervalId = setInterval(checkStream, 1000 * 5);
    return () => clearInterval(intervalId);
  }, [streamUrl]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <CustomPlayer streamUrl={streamUrl} isStreamLive={isStreamLive}/>

      {loading || !isStreamLive ? (
        <Alert variant="default" className="w-full">
          <AlertTitle>Stream appears to be offline</AlertTitle>
          <AlertDescription className="text-base">
            <p className="text-center">
              The live stream connection may be down.
              <br />
              Check back later or visit the <a className="text-blue-700/80" href="/archive">archives</a>.
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
