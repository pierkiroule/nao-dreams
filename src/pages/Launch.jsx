import { useState } from "react";
import NestedGraphJourney from "../components/NestedGraphJourney";

export default function Launch({
  journey,
  actions,
}) {
  const [loading, setLoading] = useState(false);

  async function handleLaunch(selections) {
    if (
      !selections.bubbleIds?.length ||
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
      <NestedGraphJourney journey={journey} onComplete={handleLaunch} loading={loading} />
    </section>
  );
}
