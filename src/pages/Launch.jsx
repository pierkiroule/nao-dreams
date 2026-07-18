import { useState } from "react";
import DreamConstellation from "../components/DreamConstellation";

export default function Launch({
  journey,
  actions,
}) {
  const [loading, setLoading] = useState(false);

  async function handleComplete(selection) {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await actions.launch(selection);
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
        initialPath={journey.selections?.path ?? []}
        onComplete={handleComplete}
      />
    </section>
  );
}
