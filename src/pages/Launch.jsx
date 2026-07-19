import { useEffect, useState } from "react";
import DreamConstellation from "../components/DreamConstellation";
import { getResonanceNetwork } from "../services/bubbleNetworkService";

export default function Launch({
  journey,
  actions,
}) {
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    getResonanceNetwork().then(setNetwork);
  }, []);

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
      {network ? (
        <DreamConstellation network={network} initialSelections={journey.selections ?? {}} onContinue={handleLaunch} loading={loading} />
      ) : <p className="page-text" aria-live="polite">Le réseau onirique apparaît…</p>}
    </section>
  );
}
