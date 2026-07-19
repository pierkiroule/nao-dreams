import { useEffect, useState } from "react";
import DreamConstellation from "../components/DreamConstellation";
import { getResonanceNetwork } from "../services/bubbleNetworkService";

export default function Launch({
  journey,
  actions,
}) {
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState(null);
  const [networkError, setNetworkError] = useState("");

  useEffect(() => {
    getResonanceNetwork().then(setNetwork).catch((error) => {
      console.error("Le réseau de bulles n’a pas pu être chargé.", error);
      setNetworkError("Le réseau onirique est indisponible. Réessaie dans un instant.");
    });
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
      {networkError ? <p className="form-error" role="alert">{networkError}</p> : network ? (
        <DreamConstellation network={network} initialSelections={journey.selections ?? {}} onContinue={handleLaunch} loading={loading} />
      ) : <p className="page-text" aria-live="polite">Le réseau onirique apparaît…</p>}
    </section>
  );
}
