import { useEffect } from "react";
import { splashContent } from "../data/content.js";

const SPLASH_DURATION_MS = 2600;

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onComplete?.();
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [onComplete]);

  return (
    <section className="splash-screen" aria-label={splashContent.label}>
      <span className="splash-panel splash-panel-left" aria-hidden="true" />
      <span className="splash-panel splash-panel-right" aria-hidden="true" />
      <div className="splash-copy">
        <p>{splashContent.subtitle}</p>
        <h1>{splashContent.title}</h1>
      </div>
      <div className="splash-scratches" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
