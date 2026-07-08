import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AmbientBackground from "./components/AmbientBackground.jsx";
import MemoryGallery from "./components/MemoryGallery.jsx";
import MusicToggle from "./components/MusicToggle.jsx";
import ScratchCard from "./components/ScratchCard.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import TypewriterText from "./components/TypewriterText.jsx";
import { giftContent, memoriesPageContent } from "./data/content.js";
import { memories } from "./data/memories.js";

const shouldResetUnlockOnInitialLoad = wasPageReloaded() && isGiftRouteHash();
let hasHandledInitialUnlockReset = false;

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <>
      <Routes>
        <Route path="/" element={<GiftPage canPlayIntro={!isSplashVisible} />} />
        <Route path="/memories" element={<MemoriesPage />} />
      </Routes>
      <MusicToggle />
      {isSplashVisible ? <SplashScreen onComplete={() => setIsSplashVisible(false)} /> : null}
    </>
  );
}

function wasPageReloaded() {
  const navigation = performance.getEntriesByType("navigation")[0];
  return navigation?.type === "reload";
}

function isGiftRouteHash() {
  return window.location.hash === "" || window.location.hash === "#" || window.location.hash === "#/";
}

function getInitialUnlockedState() {
  if (shouldResetUnlockOnInitialLoad && !hasHandledInitialUnlockReset) {
    hasHandledInitialUnlockReset = true;
    sessionStorage.removeItem(giftContent.unlockStorageKey);
    return false;
  }

  hasHandledInitialUnlockReset = true;

  return sessionStorage.getItem(giftContent.unlockStorageKey) === "true";
}

function GiftPage({ canPlayIntro = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnlockedGift, setHasUnlockedGift] = useState(getInitialUnlockedState);
  const [shouldShowFullLetter] = useState(() => Boolean(location.state?.showFullLetter));
  let paragraphDelay = 300;

  useEffect(() => {
    if (location.state?.showFullLetter) {
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  function openMemories() {
    navigate("/memories");
  }

  function handleUnlock() {
    sessionStorage.setItem(giftContent.unlockStorageKey, "true");
    setHasUnlockedGift(true);
  }

  return (
    <>
      <AmbientBackground />
      <main className="gift-page">
        <section className="wish-card" aria-label={giftContent.cardLabel}>
          <div className="wish-copy">
            <p className="farewell-kicker">{giftContent.kicker}</p>
            <h1>{giftContent.title}</h1>
            <div className="wish-scroll">
              {giftContent.paragraphs.map((paragraph) => {
                const delay = paragraphDelay;
                paragraphDelay += Array.from(paragraph).length * 18 + 260;

                return (
                  <TypewriterText
                    key={paragraph}
                    active={canPlayIntro}
                    instant={shouldShowFullLetter}
                    text={paragraph}
                    delay={delay}
                  />
                );
              })}
            </div>
          </div>
          <ScratchCard
            hasUnlocked={hasUnlockedGift}
            onOpen={openMemories}
            onUnlock={handleUnlock}
          />
          {giftContent.caption ? <p className="wish-caption">{giftContent.caption}</p> : null}
        </section>
      </main>
    </>
  );
}

function MemoriesPage() {
  const navigate = useNavigate();

  function returnToGift() {
    navigate("/", { state: { showFullLetter: true } });
  }

  return (
    <>
      <main className="memories-page">
        <MemoryGallery memories={memories} />
        <div className="memory-exit">
          <p>{memoriesPageContent.hint}</p>
          <button type="button" onClick={returnToGift}>
            {memoriesPageContent.backLabel}
          </button>
        </div>
      </main>
    </>
  );
}
