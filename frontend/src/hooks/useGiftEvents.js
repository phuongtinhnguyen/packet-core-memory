import { useEffect, useState } from "react";

export function useGiftEvents(url) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!url || typeof EventSource === "undefined") return undefined;

    const source = new EventSource(url);
    source.onmessage = (message) => {
      setEvent(message.data);
    };

    return () => {
      source.close();
    };
  }, [url]);

  return event;
}
