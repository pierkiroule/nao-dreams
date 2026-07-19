import { useState } from "react";
import DreamConstellation from "../components/DreamConstellation";
import { dreamResources } from "../data/resources";

export default function Launch({
  journey,
  actions,
}) {
  const [loading, setLoading] = useState(false);

  async function handleLaunch(selections) {
    if (
      selections.symbols.length !== 3 ||
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
        network={dreamResources.network}
        initialSelections={journey.selections ?? {}}
        onContinue={handleLaunch}
        loading={loading}
      />
    </section>
  );
}
