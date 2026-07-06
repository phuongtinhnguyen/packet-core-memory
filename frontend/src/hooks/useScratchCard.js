import { useCallback, useEffect, useRef, useState } from "react";
import { scratchContent } from "../data/content.js";

const UNLOCK_PERCENT = 62;

export function useScratchCard({ isInitiallyUnlocked = false, onUnlock }) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const progressFrameRef = useRef(null);
  const unlockedRef = useRef(isInitiallyUnlocked);
  const [progress, setProgress] = useState(isInitiallyUnlocked ? 100 : 0);
  const [isHintVisible, setIsHintVisible] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(isInitiallyUnlocked);

  const paintCover = useCallback((ctx, width, height) => {
    const cover = ctx.createLinearGradient(0, 0, width, height);
    cover.addColorStop(0, "#f7c3d2");
    cover.addColorStop(0.42, "#ff7aa2");
    cover.addColorStop(1, "#5fdac2");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = cover;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.22)";
    for (let i = 0; i < 60; i += 1) {
      const x = (i * 71) % width;
      const y = (i * 47) % height;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(36,16,24,0.74)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "800 22px Segoe UI, sans-serif";
    ctx.fillText(
      scratchContent.coverTitle,
      width / 2,
      scratchContent.coverSubtitle ? height / 2 - 14 : height / 2,
    );

    if (scratchContent.coverSubtitle) {
      ctx.font = "600 14px Segoe UI, sans-serif";
      ctx.fillText(scratchContent.coverSubtitle, width / 2, height / 2 + 18);
    }
  }, []);

  const fitCanvas = useCallback(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas || unlockedRef.current) return;

    const rect = card.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    paintCover(ctx, rect.width, rect.height);
  }, [paintCover]);

  const getPoint = useCallback((event) => {
    const source = event.touches ? event.touches[0] : event;
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: source.clientX - rect.left,
      y: source.clientY - rect.top,
    };
  }, []);

  const scratchBetween = useCallback((from, to) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 58;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(to.x, to.y, 29, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const getScratchedPercent = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = image.data;
    const sampleStep = 16;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
      if (pixels[i] < 40) transparent += 1;
    }

    return Math.min(100, Math.round((transparent / (pixels.length / 4 / sampleStep)) * 100));
  }, []);

  const unlock = useCallback(() => {
    unlockedRef.current = true;
    setIsUnlocked(true);
    setProgress(100);
    onUnlock?.();
  }, [onUnlock]);

  const updateProgress = useCallback(() => {
    const nextProgress = getScratchedPercent();
    setProgress(nextProgress);

    if (nextProgress > 8) {
      setIsHintVisible(false);
    }

    if (nextProgress >= UNLOCK_PERCENT && !unlockedRef.current) {
      unlock();
    }
  }, [getScratchedPercent, unlock]);

  const scheduleProgressUpdate = useCallback(() => {
    if (progressFrameRef.current) return;

    progressFrameRef.current = window.requestAnimationFrame(() => {
      progressFrameRef.current = null;
      updateProgress();
    });
  }, [updateProgress]);

  const startScratch = useCallback(
    (event) => {
      if (unlockedRef.current) return;
      isDrawingRef.current = true;
      const point = getPoint(event);
      lastPointRef.current = point;
      scratchBetween(point, point);
      scheduleProgressUpdate();
    },
    [getPoint, scheduleProgressUpdate, scratchBetween],
  );

  const moveScratch = useCallback(
    (event) => {
      if (!isDrawingRef.current || unlockedRef.current) return;
      event.preventDefault();

      const coalescedEvents = event.nativeEvent?.getCoalescedEvents?.() ?? [event];

      coalescedEvents.forEach((scratchEvent) => {
        const point = getPoint(scratchEvent);
        const lastPoint = lastPointRef.current ?? point;
        scratchBetween(lastPoint, point);
        lastPointRef.current = point;
      });

      scheduleProgressUpdate();
    },
    [getPoint, scheduleProgressUpdate, scratchBetween],
  );

  const stopScratch = useCallback(() => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }, []);

  useEffect(() => {
    unlockedRef.current = isInitiallyUnlocked;
    setIsUnlocked(isInitiallyUnlocked);
    setProgress(isInitiallyUnlocked ? 100 : 0);
  }, [isInitiallyUnlocked]);

  useEffect(() => {
    if (isInitiallyUnlocked) return undefined;

    fitCanvas();
    window.addEventListener("resize", fitCanvas);
    window.addEventListener("mouseup", stopScratch);
    window.addEventListener("touchend", stopScratch);

    return () => {
      if (progressFrameRef.current) {
        window.cancelAnimationFrame(progressFrameRef.current);
      }
      window.removeEventListener("resize", fitCanvas);
      window.removeEventListener("mouseup", stopScratch);
      window.removeEventListener("touchend", stopScratch);
    };
  }, [fitCanvas, isInitiallyUnlocked, stopScratch]);

  return {
    cardRef,
    canvasRef,
    progress,
    isHintVisible,
    isUnlocked,
    startScratch,
    moveScratch,
    stopScratch,
  };
}
