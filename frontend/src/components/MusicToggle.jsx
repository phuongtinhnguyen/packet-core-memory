import { useCallback, useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { musicContent } from "../data/content.js";

export default function MusicToggle() {
  const audioRef = useRef(null);
  const userStoppedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [label, setLabel] = useState(musicContent.play);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      setIsPlaying(true);
      setLabel(musicContent.stop);
      return true;
    } catch {
      setIsPlaying(false);
      setLabel(musicContent.play);
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    playMusic();

    function resumeAfterGesture() {
      if (!userStoppedRef.current && audio.paused) {
        playMusic();
      }
    }

    window.addEventListener("pointerdown", resumeAfterGesture, { capture: true });
    window.addEventListener("keydown", resumeAfterGesture, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", resumeAfterGesture, { capture: true });
      window.removeEventListener("keydown", resumeAfterGesture, { capture: true });
    };
  }, [playMusic]);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userStoppedRef.current = false;
      await playMusic();
      return;
    }

    userStoppedRef.current = true;
    audio.pause();
    setIsPlaying(false);
    setLabel(musicContent.play);
  }

  return (
    <>
      <button
        className="music-toggle"
        type="button"
        aria-pressed={isPlaying}
        onClick={toggleMusic}
      >
        {isPlaying ? <VolumeX size={18} aria-hidden="true" /> : <Music size={18} aria-hidden="true" />}
        <span>{label}</span>
      </button>
      <audio ref={audioRef} loop preload="none">
        <source src={musicContent.source} type="audio/mpeg" />
      </audio>
    </>
  );
}
