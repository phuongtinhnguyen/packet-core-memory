import { scratchContent } from "../data/content.js";
import { useScratchCard } from "../hooks/useScratchCard.js";

const revealImage = `${import.meta.env.BASE_URL}assets/photos/0.jpg`;

export default function ScratchCard({ hasUnlocked, onOpen, onUnlock }) {
  const { cardRef, canvasRef, isUnlocked, startScratch, moveScratch } = useScratchCard({
    isInitiallyUnlocked: hasUnlocked,
    onUnlock,
  });

  const canOpen = hasUnlocked || isUnlocked;

  function updateCardPress(event) {
    if (!canOpen) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tiltX = (y / rect.height - 0.5) * -9;
    const tiltY = (x / rect.width - 0.5) * 9;

    card.style.setProperty("--press-x", `${x}px`);
    card.style.setProperty("--press-y", `${y}px`);
    card.style.setProperty("--tilt-x", `${tiltX}deg`);
    card.style.setProperty("--tilt-y", `${tiltY}deg`);
    card.style.setProperty("--shine-x", `${tiltY * -0.8}px`);
    card.style.setProperty("--shine-y", `${tiltX * -0.8}px`);
    card.classList.add("is-hovered");
  }

  function pressCard(event) {
    if (!canOpen) return;

    updateCardPress(event);
    cardRef.current?.classList.add("is-pressing");
  }

  function releaseCard() {
    cardRef.current?.classList.remove("is-pressing");
  }

  function resetCardPress() {
    const card = cardRef.current;
    if (!card) return;

    card.classList.remove("is-hovered", "is-pressing");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <section className="gift-stage" aria-label={scratchContent.sectionLabel}>
      <div
        ref={cardRef}
        className={`gift-card ${canOpen ? "unlocked" : ""}`}
        onPointerMove={updateCardPress}
        onPointerDown={pressCard}
        onPointerUp={releaseCard}
        onPointerCancel={resetCardPress}
        onPointerLeave={resetCardPress}
      >
        <div className="reveal-panel" style={{ backgroundImage: `url("${revealImage}")` }}>
          {canOpen ? (
            <button className="open-badge" type="button" onClick={onOpen}>
              {scratchContent.openButton}
            </button>
          ) : null}
        </div>
        {!canOpen ? (
          <canvas
            ref={canvasRef}
            aria-label={scratchContent.canvasLabel}
            onMouseDown={startScratch}
            onMouseMove={moveScratch}
            onTouchStart={startScratch}
            onTouchMove={moveScratch}
          />
        ) : null}
      </div>
    </section>
  );
}
