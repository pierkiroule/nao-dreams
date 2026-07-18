import {
  useEffect,
  useMemo,
  useState,
} from "react";

function getChoiceLabel(choice) {
  return (
    choice?.label ??
    choice?.name ??
    choice?.title ??
    choice?.value ??
    ""
  );
}

function getChoiceEmoji(choice) {
  return (
    choice?.emoji ??
    choice?.icon ??
    choice?.symbol ??
    "✦"
  );
}

export default function ResonantPorthole({
  categories,
  resources,
  selections,
  personalEcho,
  onEchoChange,
  onContinue,
  onBack,
  loading = false,
}) {
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppeared(true);
    }, 80);

    return () => window.clearTimeout(timer);
  }, []);

  const fragments = useMemo(
    () =>
      categories
        .map((category) => {
          const selectedValue = selections[category];

          const choice = resources[category]?.find(
            (item) => item.value === selectedValue,
          );

          if (!choice) {
            return null;
          }

          return {
            category,
            value: selectedValue,
            emoji: getChoiceEmoji(choice),
            label: getChoiceLabel(choice),
          };
        })
        .filter(Boolean),
    [
      categories,
      resources,
      selections,
    ],
  );

  return (
    <section
      className={[
        "resonant-review",
        appeared ? "is-visible" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="resonant-review-header">
        <p className="resonant-review-kicker">
          Les fragments se rassemblent
        </p>

        <h2 className="resonant-review-title">
          Ton hublot résonant
        </h2>

        <p className="resonant-review-intro">
          Regarde un instant ce qui apparaît,
          sans chercher à l’expliquer.
        </p>
      </header>

      <div className="resonant-porthole-wrap">
        <div
          className="resonant-porthole-halo"
          aria-hidden="true"
        />

        <div className="resonant-porthole">
          <div
            className="resonant-porthole-stars"
            aria-hidden="true"
          />

          <div
            className="resonant-porthole-reflection"
            aria-hidden="true"
          />

          <div
            className="resonant-fragments"
            aria-label="Fragments de ton futur rêve"
          >
            {fragments.map(
              (fragment, index) => (
                <div
                  key={fragment.category}
                  className={`resonant-fragment fragment-${index + 1}`}
                  style={{
                    "--fragment-delay": `${index * 0.45}s`,
                  }}
                  title={fragment.label}
                >
                  <span
                    className="resonant-fragment-emoji"
                    aria-hidden="true"
                  >
                    {fragment.emoji}
                  </span>

                  <span className="sr-only">
                    {fragment.label}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <div
          className="resonant-porthole-ring"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div
        className="resonant-words"
        aria-label="Mots choisis"
      >
        {fragments.map(
          (fragment, index) => (
            <span
              key={fragment.category}
              className="resonant-word-group"
            >
              <span className="resonant-word">
                {fragment.label}
              </span>

              {index < fragments.length - 1 && (
                <span
                  className="resonant-ellipsis"
                  aria-hidden="true"
                >
                  …
                </span>
              )}
            </span>
          ),
        )}
      </div>

      <div className="personal-echo-card">
        <label
          className="personal-echo-label"
          htmlFor="personal-dream-echo"
        >
          Ton écho
        </label>

        <textarea
          id="personal-dream-echo"
          className="personal-echo-input"
          value={personalEcho}
          onChange={(event) =>
            onEchoChange(event.target.value)
          }
          rows="4"
          maxLength="500"
          placeholder={
            "Un mot, une image, une sensation…\nOu laisse simplement le rêve respirer."
          }
        />

        <div className="personal-echo-footer">
          <span>
            Facultatif
          </span>

          {personalEcho.length > 0 && (
            <span>
              {personalEcho.length}/500
            </span>
          )}
        </div>
      </div>

      <div className="resonant-review-actions">
        <button
          type="button"
          className="resonant-back-button"
          onClick={onBack}
          disabled={loading}
        >
          Modifier mes fragments
        </button>

        <button
          type="button"
          className="resonant-continue-button"
          onClick={onContinue}
          disabled={loading}
        >
          {loading
            ? "Le rêve prend le large…"
            : "Laisser le rêve poursuivre sa traversée"}
        </button>
      </div>
    </section>
  );
}
