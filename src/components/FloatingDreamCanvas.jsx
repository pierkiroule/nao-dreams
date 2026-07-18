import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FloatingDreamBubble from "./FloatingDreamBubble";

const MIN_SIZE = 92;
const MAX_SIZE = 116;
const SPEED_MIN = 0.12;
const SPEED_MAX = 0.28;
const COLLISION_PADDING = 8;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createVelocity() {
  const angle = Math.random() * Math.PI * 2;
  const speed = randomBetween(SPEED_MIN, SPEED_MAX);

  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
}

function normaliseChoice(choice, index) {
  if (typeof choice === "string") {
    return {
      key: `choice-${index}-${choice}`,
      selectionValue: choice,
      label: choice,
      emoji: "✦",
    };
  }

  const label =
    choice.label ??
    choice.name ??
    choice.title ??
    choice.word ??
    choice.value ??
    choice.id ??
    `Choix ${index + 1}`;

  const selectionValue =
    choice.value ??
    choice.id ??
    choice.slug ??
    choice.key ??
    label;

  const emoji =
    choice.emoji ??
    choice.icon ??
    choice.symbol ??
    "✦";

  return {
    ...choice,
    key: `choice-${index}-${String(selectionValue)}`,
    selectionValue,
    label,
    emoji,
  };
}

function createInitialBodies(choices, width, height) {
  const safeWidth = Math.max(width, 280);
  const safeHeight = Math.max(height, 350);

  const columns =
    choices.length <= 4
      ? 2
      : Math.ceil(Math.sqrt(choices.length));

  const rows = Math.ceil(choices.length / columns);

  return choices.map((choice, index) => {
    const maximumAllowedSize = Math.min(
      MAX_SIZE,
      safeWidth / columns - 18,
      safeHeight / rows - 18,
    );

    const size = Math.max(
      78,
      randomBetween(
        Math.min(MIN_SIZE, maximumAllowedSize),
        maximumAllowedSize,
      ),
    );

    const column = index % columns;
    const row = Math.floor(index / columns);

    const cellWidth = safeWidth / columns;
    const cellHeight = safeHeight / rows;

    const baseX =
      column * cellWidth +
      (cellWidth - size) / 2;

    const baseY =
      row * cellHeight +
      (cellHeight - size) / 2;

    const jitterX = Math.min(14, cellWidth * 0.08);
    const jitterY = Math.min(14, cellHeight * 0.08);

    return {
      id: choice.key,
      selectionValue: choice.selectionValue,
      x: Math.min(
        safeWidth - size,
        Math.max(
          0,
          baseX + randomBetween(-jitterX, jitterX),
        ),
      ),
      y: Math.min(
        safeHeight - size,
        Math.max(
          0,
          baseY + randomBetween(-jitterY, jitterY),
        ),
      ),
      size,
      ...createVelocity(),
    };
  });
}

function resolveCollision(first, second) {
  const firstRadius = first.size / 2;
  const secondRadius = second.size / 2;

  const firstCenterX = first.x + firstRadius;
  const firstCenterY = first.y + firstRadius;
  const secondCenterX = second.x + secondRadius;
  const secondCenterY = second.y + secondRadius;

  const dx = secondCenterX - firstCenterX;
  const dy = secondCenterY - firstCenterY;
  const distance = Math.hypot(dx, dy) || 0.001;

  const minimumDistance =
    firstRadius +
    secondRadius +
    COLLISION_PADDING;

  if (distance >= minimumDistance) {
    return;
  }

  const normalX = dx / distance;
  const normalY = dy / distance;
  const overlap = minimumDistance - distance;

  first.x -= normalX * overlap * 0.5;
  first.y -= normalY * overlap * 0.5;
  second.x += normalX * overlap * 0.5;
  second.y += normalY * overlap * 0.5;

  const relativeVelocityX =
    second.vx - first.vx;

  const relativeVelocityY =
    second.vy - first.vy;

  const velocityAlongNormal =
    relativeVelocityX * normalX +
    relativeVelocityY * normalY;

  if (velocityAlongNormal > 0) {
    return;
  }

  first.vx -= velocityAlongNormal * normalX;
  first.vy -= velocityAlongNormal * normalY;
  second.vx += velocityAlongNormal * normalX;
  second.vy += velocityAlongNormal * normalY;
}

export default function FloatingDreamCanvas({
  title,
  category,
  choices = [],
  selectedValue,
  onSelect,
}) {
  const containerRef = useRef(null);
  const bodiesRef = useRef([]);
  const frameRef = useRef(null);
  const previousTimeRef = useRef(null);

  const dimensionsRef = useRef({
    width: 0,
    height: 0,
  });

  const [positions, setPositions] = useState([]);

  const normalisedChoices = useMemo(
    () =>
      choices.map((choice, index) =>
        normaliseChoice(choice, index),
      ),
    [choices],
  );

  const initialiseBodies = useCallback(() => {
    const container = containerRef.current;

    if (
      !container ||
      normalisedChoices.length === 0
    ) {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width <= 0 || height <= 0) {
      return;
    }

    dimensionsRef.current = {
      width,
      height,
    };

    bodiesRef.current = createInitialBodies(
      normalisedChoices,
      width,
      height,
    );

    setPositions(
      bodiesRef.current.map((body) => ({
        ...body,
      })),
    );
  }, [normalisedChoices]);

  useLayoutEffect(() => {
    initialiseBodies();

    const retryTimer = window.setTimeout(
      initialiseBodies,
      120,
    );

    const container = containerRef.current;

    if (!container) {
      return () =>
        window.clearTimeout(retryTimer);
    }

    const observer = new ResizeObserver(() => {
      initialiseBodies();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      window.clearTimeout(retryTimer);
    };
  }, [initialiseBodies]);

  useEffect(() => {
    function animate(time) {
      const previousTime =
        previousTimeRef.current ?? time;

      const delta = Math.min(
        (time - previousTime) / 16.67,
        2,
      );

      previousTimeRef.current = time;

      const { width, height } =
        dimensionsRef.current;

      const bodies = bodiesRef.current;

      for (const body of bodies) {
        const selected =
          body.selectionValue === selectedValue;

        const speedFactor = selected ? 0.25 : 1;

        body.x +=
          body.vx * delta * speedFactor;

        body.y +=
          body.vy * delta * speedFactor;

        if (body.x <= 0) {
          body.x = 0;
          body.vx = Math.abs(body.vx);
        }

        if (body.x + body.size >= width) {
          body.x = Math.max(
            0,
            width - body.size,
          );

          body.vx = -Math.abs(body.vx);
        }

        if (body.y <= 0) {
          body.y = 0;
          body.vy = Math.abs(body.vy);
        }

        if (body.y + body.size >= height) {
          body.y = Math.max(
            0,
            height - body.size,
          );

          body.vy = -Math.abs(body.vy);
        }
      }

      for (
        let firstIndex = 0;
        firstIndex < bodies.length;
        firstIndex += 1
      ) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < bodies.length;
          secondIndex += 1
        ) {
          resolveCollision(
            bodies[firstIndex],
            bodies[secondIndex],
          );
        }
      }

      setPositions(
        bodies.map((body) => ({
          id: body.id,
          x: body.x,
          y: body.y,
          size: body.size,
        })),
      );

      frameRef.current =
        requestAnimationFrame(animate);
    }

    frameRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(
          frameRef.current,
        );
      }

      previousTimeRef.current = null;
    };
  }, [selectedValue]);

  return (
    <section
      className="dream-selection-stage"
      aria-labelledby={`dream-stage-${category}`}
    >
      <h2
        id={`dream-stage-${category}`}
        className="dream-selection-question"
      >
        {title}
      </h2>

      <div
        ref={containerRef}
        className="dream-floating-canvas"
      >
        <div
          className="dream-floating-glow"
          aria-hidden="true"
        />

        {normalisedChoices.map((choice) => {
          const position = positions.find(
            (item) => item.id === choice.key,
          );

          if (!position) {
            return null;
          }

          return (
            <FloatingDreamBubble
              key={choice.key}
              choice={choice}
              position={position}
              selected={
                selectedValue ===
                choice.selectionValue
              }
              onSelect={(value) =>
                onSelect(category, value)
              }
            />
          );
        })}
      </div>

      <p className="dream-selection-hint">
        {selectedValue
          ? "Ton choix résonne dans le hublot."
          : "Touche la bulle qui t’appelle."}
      </p>
    </section>
  );
}
