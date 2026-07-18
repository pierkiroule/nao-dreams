import {
  useEffect,
  useRef,
  useState,
} from "react";
import FloatingDreamCanvas from "./FloatingDreamCanvas";

const SWIPE_THRESHOLD = 65;

export default function DreamSwipeNavigator({
  categories,
  questions,
  resources,
  selections,
  onSelect,
  onComplete,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("idle");
  const [dragOffset, setDragOffset] = useState(0);

  const touchStartRef = useRef(null);
  const draggingRef = useRef(false);

  const currentCategory = categories[currentIndex];
  const currentSelection = selections[currentCategory];
  const isLastStep = currentIndex === categories.length - 1;

  useEffect(() => {
    setDragOffset(0);
    setDirection("idle");
  }, [currentIndex]);

  function goToNext() {
    if (!currentSelection) {
      return;
    }

    if (isLastStep) {
      onComplete();
      return;
    }

    setDirection("leaving-right");

    window.setTimeout(() => {
      setCurrentIndex((index) =>
        Math.min(index + 1, categories.length - 1),
      );

      setDirection("entering-left");

      window.setTimeout(() => {
        setDirection("idle");
      }, 420);
    }, 280);
  }

  function goToPrevious() {
    if (currentIndex === 0) {
      return;
    }

    setDirection("leaving-left");

    window.setTimeout(() => {
      setCurrentIndex((index) =>
        Math.max(index - 1, 0),
      );

      setDirection("entering-right");

      window.setTimeout(() => {
        setDirection("idle");
      }, 420);
    }, 280);
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    draggingRef.current = true;
    setDirection("dragging");
  }

  function handleTouchMove(event) {
    if (!draggingRef.current || !touchStartRef.current) {
      return;
    }

    const touch = event.touches[0];
    const deltaX =
      touch.clientX - touchStartRef.current.x;
    const deltaY =
      touch.clientY - touchStartRef.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    if (deltaX > 0 && currentSelection) {
      setDragOffset(
        Math.min(deltaX, window.innerWidth * 0.38),
      );
    }

    if (deltaX < 0 && currentIndex > 0) {
      setDragOffset(
        Math.max(deltaX, -window.innerWidth * 0.28),
      );
    }
  }

  function handleTouchEnd() {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;

    if (dragOffset >= SWIPE_THRESHOLD) {
      setDragOffset(0);
      goToNext();
      return;
    }

    if (
      dragOffset <= -SWIPE_THRESHOLD &&
      currentIndex > 0
    ) {
      setDragOffset(0);
      goToPrevious();
      return;
    }

    setDragOffset(0);
    setDirection("idle");
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      goToNext();
    }

    if (event.key === "ArrowLeft") {
      goToPrevious();
    }
  }

  const stageStyle =
    direction === "dragging"
      ? {
          transform: `translate3d(${dragOffset}px, 0, 0)`,
          opacity:
            1 -
            Math.min(
              Math.abs(dragOffset) /
                (window.innerWidth * 1.8),
              0.24,
            ),
        }
      : undefined;

  return (
    <section
      className="dream-swipe-navigator"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Sélection des fragments du rêve"
    >
      <header className="dream-swipe-header">
        <div
          className="dream-step-dots"
          aria-label={`Étape ${currentIndex + 1} sur ${categories.length}`}
        >
          {categories.map((category, index) => {
            const completed = Boolean(selections[category]);
            const active = index === currentIndex;

            return (
              <span
                key={category}
                className={[
                  "dream-step-dot",
                  completed ? "is-complete" : "",
                  active ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            );
          })}
        </div>

        <p className="dream-step-counter">
          Fragment {currentIndex + 1}
          <span aria-hidden="true"> · </span>
          {categories.length}
        </p>
      </header>

      <div className="dream-swipe-window">
        <div
          className={[
            "dream-swipe-stage",
            direction,
          ]
            .filter(Boolean)
            .join(" ")}
          style={stageStyle}
        >
          <FloatingDreamCanvas
            title={questions[currentCategory]}
            category={currentCategory}
            choices={resources[currentCategory]}
            selectedValue={currentSelection}
            onSelect={onSelect}
          />
        </div>

        <div
          className={[
            "dream-swipe-trail",
            dragOffset > 20 ? "is-visible" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden="true"
        />
      </div>

      <footer className="dream-swipe-footer">
        <div className="dream-swipe-guidance">
          {currentSelection ? (
            <>
              <span className="dream-swipe-arrow">
                →
              </span>

              <span>
                Glisse vers la droite pour poursuivre
              </span>
            </>
          ) : (
            <span>
              Choisis d’abord la bulle qui t’appelle
            </span>
          )}
        </div>

        <div className="dream-swipe-controls">
          <button
            type="button"
            className="dream-nav-button dream-nav-back"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            Retour
          </button>

          <button
            type="button"
            className="dream-nav-button dream-nav-next"
            onClick={goToNext}
            disabled={!currentSelection}
          >
            {isLastStep
              ? "Réunir mes fragments"
              : "Poursuivre"}
          </button>
        </div>
      </footer>
    </section>
  );
}
