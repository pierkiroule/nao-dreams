import { useState } from "react";
import DreamSwipeNavigator from "../components/DreamSwipeNavigator";
import ResonantPorthole from "../components/ResonantPorthole";
import { dreamResources } from "../data/resources";
import { DREAM_CONFIG } from "../config/dream";

const DREAM_QUESTIONS = {
  landscape: "Quel horizon t’appelle ?",
  presence: "Quelle présence apparaît ?",
  object: "Quel objet dérive vers toi ?",
  atmosphere:
    "Quelle atmosphère envelopperait ton futur rêve ?",
};

export default function Launch({
  journey,
  actions,
}) {
  const [selections, setSelections] = useState(
    journey.selections ?? {},
  );

  const [personalEcho, setPersonalEcho] =
    useState(
      journey.personalEcho ??
        journey.echo ??
        "",
    );

  const [showResonance, setShowResonance] =
    useState(false);

  const [loading, setLoading] = useState(false);

  function handleSelect(category, value) {
    setSelections((currentSelections) => ({
      ...currentSelections,
      [category]: value,
    }));
  }

  function handleFragmentsComplete() {
    const isComplete =
      DREAM_CONFIG.selectionCategories.every(
        (category) =>
          Boolean(selections[category]),
      );

    if (!isComplete) {
      return;
    }

    setShowResonance(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleBackToFragments() {
    setShowResonance(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleLaunch() {
    const isComplete =
      DREAM_CONFIG.selectionCategories.every(
        (category) =>
          Boolean(selections[category]),
      );

    if (!isComplete || loading) {
      return;
    }

    try {
      setLoading(true);

      await actions.launch({
        ...selections,
        personalEcho: personalEcho.trim(),
      });
    } catch (error) {
      console.error(
        "La Bulle Onirique n’a pas pu être créée.",
        error,
      );

      setLoading(false);
    }
  }

  return (
    <section className="page dream-launch-page">
      {!showResonance && (
        <header className="dream-launch-header">
          <h1 className="page-title">
            Compose ton futur rêve
          </h1>

          <p className="page-text">
            Laisse quatre fragments venir à toi.
            <br />
            Ne cherche pas encore à les comprendre.
          </p>
        </header>
      )}

      {showResonance ? (
        <ResonantPorthole
          categories={
            DREAM_CONFIG.selectionCategories
          }
          resources={dreamResources}
          selections={selections}
          personalEcho={personalEcho}
          onEchoChange={setPersonalEcho}
          onContinue={handleLaunch}
          onBack={handleBackToFragments}
          loading={loading}
        />
      ) : (
        <DreamSwipeNavigator
          categories={
            DREAM_CONFIG.selectionCategories
          }
          questions={DREAM_QUESTIONS}
          resources={dreamResources}
          selections={selections}
          onSelect={handleSelect}
          onComplete={handleFragmentsComplete}
        />
      )}
    </section>
  );
}
