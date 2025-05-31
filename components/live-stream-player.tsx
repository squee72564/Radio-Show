"use client";

import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

import { PlayIcon, PauseIcon, LoaderIcon } from "lucide-react";

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
  const [isTimeDomain, setIsTimeDomain] = useState(true);
  const modeRef = useRef(true); // <-- holds latest mode

  // Sync ref with state
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

    if (!sourceRef.current) {
      sourceRef.current = audioCtx.createMediaElementSource(audio);
    }

    if (!analyserRef.current) {
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      sourceRef.current.connect(analyser);
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
    };

    draw();
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        className="w-full max-w-full aspect-[4/1] rounded-md bg-secondary border border-border"
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

function CustomPlayer({ streamUrl }: { streamUrl: string }) {
const audioRef = useRef<HTMLAudioElement>(null);
const audioCtxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => setIsLoading(false);
    const handleLoadStart = () => setIsLoading(true);

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadstart", handleLoadStart);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, [streamUrl]);

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
    <div className="flex flex-col items-center w-full gap-4 bg-muted p-4 rounded-xl shadow">
      {audioRef && <WaveformVisualizer audioRef={audioRef} audioCtxRef={audioCtxRef} />}
      
      <Button onClick={togglePlay} disabled={isLoading}>
        {isLoading ? <LoaderIcon/> : isPlaying ? <PauseIcon/> : <PlayIcon/>}
      </Button>
      
      <div className="w-full">
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
  const [loading, setLoading] = useState<boolean>(true);
  const icecastUrl: string = "http://localhost:3000/api/live"
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkStream = () => {
      fetch(icecastUrl, { method: "HEAD" })
        .then((res) => {
          const isAudio = res.ok && res.headers.get("content-type")?.includes("audio");
          setStreamUrl(isAudio ? icecastUrl : null);
        })
        .catch(() => setStreamUrl(null))
        .finally(() => setLoading(false));
    };

    checkStream(); // Initial check
    intervalId = setInterval(checkStream, 15000); // Check every 15 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);


  return (
    <>
      {loading ? (
        <Skeleton className=" w-full aspect-[4/1] rounded-md" />
      ) : streamUrl ? (
        <CustomPlayer streamUrl={icecastUrl}/>
      ) : (
        <Alert variant="default" className="w-full aspect-[4/1]">
          <AlertTitle>No Live Stream</AlertTitle>
          <AlertDescription className="text-base">
            <p className="text-center w-full">
              There’s nothing live right now. Check back later or browse the
                <a className="text-blue-700/80" href="/archive"> archives</a>
              .
            </p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
