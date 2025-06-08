"use client"

import { useEffect, useRef, useState } from "react";

export default function useAudioVisualizer(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initAudioGraph = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }

    sourceNodeRef.current?.disconnect();
    analyserRef.current?.disconnect();

    const ctx = audioCtxRef.current;
    sourceNodeRef.current = ctx.createMediaElementSource(audio);
    analyserRef.current = ctx.createAnalyser();
    analyserRef.current.fftSize = 2048;

    sourceNodeRef.current.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);

    setIsInitialized(true);
  };

  const resumeIfSuspended = async () => {
    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }
  };

  const cleanup = () => {
    sourceNodeRef.current?.disconnect();
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    sourceNodeRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current = null;
    setIsInitialized(false);
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return {
    audioCtxRef,
    sourceNodeRef,
    analyserRef,
    isInitialized,
    initAudioGraph,
    resumeIfSuspended,
  };
}
