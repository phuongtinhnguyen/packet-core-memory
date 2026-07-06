import { useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { musicContent } from "../data/content.js";

export default function MusicToggle() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [label, setLabel] = useState(musicContent.play);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setLabel(musicContent.stop);
      } catch {
        setLabel(musicContent.missing);
      }
      return;
    }

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
