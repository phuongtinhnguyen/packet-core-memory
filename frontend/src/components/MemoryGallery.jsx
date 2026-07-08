import { useEffect, useMemo, useRef, useState } from "react";

const PATTERN_COLUMNS = 11;
const PATTERN_ROWS = 7;
const COPIES = [-1, 0, 1];
const AUTO_SPEED = { x: -26, y: -18 };
const MEMORY_STEP = 17;

function wrapOffset(value, size) {
  if (!size) return 0;
  return ((value % size) + size) % size;
}

function buildPatternTiles(memories) {
  if (memories.length === 0) {
    return [];
  }

  return Array.from({ length: PATTERN_ROWS * PATTERN_COLUMNS }, (_, tileIndex) => {
    const row = Math.floor(tileIndex / PATTERN_COLUMNS);
    const column = tileIndex % PATTERN_COLUMNS;
    const memory = memories[(tileIndex * MEMORY_STEP) % memories.length];

    return {
      ...memory,
      key: `${row}-${column}-${memory.title}`,
    };
  });
}

export default function MemoryGallery({ memories }) {
  const firstPatternRef = useRef(null);
  const frameRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, x: 0, y: 0 });
  const [patternSize, setPatternSize] = useState({ width: 1, height: 1 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const patternTiles = useMemo(
    () => buildPatternTiles(memories),
    [memories],
  );

  useEffect(() => {
    const pattern = firstPatternRef.current;
    if (!pattern) return undefined;

    function measure() {
      const rect = pattern.getBoundingClientRect();
      setPatternSize({ width: rect.width, height: rect.height });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pattern);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let previousTime = performance.now();

    function tick(currentTime) {
      const delta = (currentTime - previousTime) / 1000;
      previousTime = currentTime;

      if (!dragRef.current.isDragging) {
        const next = {
          x: offsetRef.current.x + AUTO_SPEED.x * delta,
          y: offsetRef.current.y + AUTO_SPEED.y * delta,
        };
        offsetRef.current = next;
        setOffset(next);
      }

      frameRef.current = window.requestAnimationFrame(tick);
    }

    frameRef.current = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameRef.current);
  }, []);

  function startDrag(event) {
    dragRef.current = {
      ...dragRef.current,
      isDragging: true,
      startX: event.clientX - offsetRef.current.x,
      startY: event.clientY - offsetRef.current.y,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event) {
    if (!dragRef.current.isDragging) return;

    const next = {
      x: event.clientX - dragRef.current.startX,
      y: event.clientY - dragRef.current.startY,
    };

    dragRef.current.x = next.x;
    dragRef.current.y = next.y;
    offsetRef.current = next;
    setOffset(next);
  }

  function stopDrag(event) {
    if (!dragRef.current.isDragging) return;

    dragRef.current.isDragging = false;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const wrappedOffset = {
    x: wrapOffset(offset.x, patternSize.width),
    y: wrapOffset(offset.y, patternSize.height),
  };

  return (
    <div
      className={`gallery-runway ${isDragging ? "dragging" : ""}`}
      style={{
        "--pattern-width": `${patternSize.width}px`,
        "--pattern-height": `${patternSize.height}px`,
        "--loop-x": `${wrappedOffset.x}px`,
        "--loop-y": `${wrappedOffset.y}px`,
      }}
      aria-label="Loạt ảnh kỷ niệm đang chạy"
      onPointerDown={startDrag}
      onPointerMove={drag}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onLostPointerCapture={stopDrag}
    >
      <div className="gallery-world">
        {COPIES.flatMap((rowCopy) =>
          COPIES.map((columnCopy) => (
            <div
              className="gallery-pattern"
              key={`${rowCopy}-${columnCopy}`}
              ref={rowCopy === 0 && columnCopy === 0 ? firstPatternRef : null}
            >
              {patternTiles.map((memory) => (
                <article className="photo-card" key={`${rowCopy}-${columnCopy}-${memory.key}`}>
                  <img src={memory.image} alt={memory.alt} draggable="false" />
                </article>
              ))}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
