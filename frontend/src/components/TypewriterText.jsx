import { useEffect, useMemo, useState } from "react";

export default function TypewriterText({ text, active = true, delay = 0, speed = 18 }) {
  const characters = useMemo(() => Array.from(text), [text]);
  const [visibleCount, setVisibleCount] = useState(0);
  const shouldShowCaret = active && visibleCount > 0 && visibleCount < characters.length;

  useEffect(() => {
    setVisibleCount(0);

    if (!active) {
      return undefined;
    }

    let intervalId;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setVisibleCount((count) => {
          if (count >= characters.length) {
            window.clearInterval(intervalId);
            return count;
          }

          return count + 1;
        });
      }, speed);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [active, characters.length, delay, speed, text]);

  return (
    <p className="typewriter-text" aria-label={text}>
      {characters.slice(0, visibleCount).join("")}
      {shouldShowCaret ? <span className="typewriter-caret" aria-hidden="true" /> : null}
    </p>
  );
}
