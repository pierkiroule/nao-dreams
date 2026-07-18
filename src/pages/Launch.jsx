import { useState } from "react";
import DreamConstellation from "../components/DreamConstellation";
import { DREAM_CONFIG } from "../config/dream";
import { dreamResources } from "../data/resources";

export default function Launch({
  journey,
  actions,
}) {
  const [loading, setLoading] = useState(false);

  async function handleLaunch(selections) {
    if (
      selections.symbols.length !== DREAM_CONFIG.selectionCount ||
      !selections.sensation ||
      loading
    ) {
      return;
    }

    try {
      setLoading(true);

      await actions.launch(selections);
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
      <DreamConstellation
        symbols={dreamResources.symbols}
        sensations={dreamResources.sensations}
        initialSelections={journey.selections ?? {}}
        onContinue={handleLaunch}
        loading={loading}
      />
    </section>
  );
}
