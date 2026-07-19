import { useEffect, useMemo, useState } from "react";

const NETWORK_POSITIONS = [
  [50, 15], [20, 31], [80, 31], [18, 70], [50, 83], [82, 70],
];

function getLevelChoices(network, path) {
  return path.reduce(
    (choices, selectedId) =>
      choices.find(({ id }) => id === selectedId)?.children ?? [],
    network.roots,
  );
}

function networkLinks(choices) {
  return choices.slice(1).map((choice) => [choices[0].id, choice.id]);
}

export default function DreamConstellation({
  network,
  initialSelections,
  onContinue,
  loading,
}) {
  const [path, setPath] = useState(
    initialSelections.bubbleIds ?? initialSelections.symbols ?? [],
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const choices = useMemo(
    () => getLevelChoices(network, path),
    [network, path],
  );
  const level = path.length + 1;
  const links = useMemo(() => networkLinks(choices), [choices]);
  const complete = path.length === network.maxDepth || choices.length === 0;

  useEffect(() => {
    if (!isTransitioning) {
      return undefined;
    }

    const timer = window.setTimeout(
      () => setIsTransitioning(false),
      520,
    );

    return () => window.clearTimeout(timer);
  }, [isTransitioning]);

  function selectChoice(choice) {
    if (isTransitioning || loading || complete) {
      return;
    }

    setIsTransitioning(true);
    window.setTimeout(() => {
      setPath((current) => [...current, choice.id]);
    }, 190);
  }

  function returnToLevel(index) {
    if (isTransitioning || loading) {
      return;
    }

    setPath((current) => current.slice(0, index));
    setIsTransitioning(true);
  }

  const chosenItems = path.reduce((items, id) => {
    const item = getLevelChoices(network, items.map(({ id: itemId }) => itemId))
      .find((choice) => choice.id === id);
    return item ? [...items, item] : items;
  }, []);

  if (complete) {
    return (
      <section className="resonance-network resonance-network--complete">
        <header className="constellation-header">
          <p className="network-eyebrow">Ta résonance se précise</p>
          <h1 className="page-title">Voici le chemin qui t’appelle.</h1>
        </header>

        <div className="resonance-path" aria-label="Chemin de résonance choisi">
          {chosenItems.map((item, index) => (
            <div className="resonance-path-item" key={item.id}>
              <span aria-hidden="true">{item.emoji}</span>
              <strong>{item.label}</strong>
              {index < chosenItems.length - 1 && <i aria-hidden="true">→</i>}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="constellation-continue"
          disabled={loading}
          onClick={() => onContinue({
            networkId: network.id,
            bubbleIds: path,
            choices: chosenItems.map(({ id, emoji, label }) => ({ id, emoji, text: label })),
          })}
        >
          {loading ? "La bulle se forme…" : "Faire émerger mon rêve"}
        </button>
        <button type="button" className="network-back" onClick={() => returnToLevel(2)}>
          Modifier mon dernier choix
        </button>
      </section>
    );
  }

  return (
    <section className="resonance-network">
      <header className="constellation-header">
        <p className="network-eyebrow">Niveau {level} sur {network.maxDepth}</p>
        <h1 className="page-title">{network.question}</h1>
        <p className="page-text">Choisis celui qui t’attire, sans chercher à l’expliquer.</p>
      </header>

      <div className={`network-canvas ${isTransitioning ? "is-zooming" : ""}`} aria-live="polite">
        <svg className="network-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(([from, to]) => {
            const first = choices.findIndex(({ id }) => id === from);
            const second = choices.findIndex(({ id }) => id === to);
            const [x1, y1] = NETWORK_POSITIONS[first];
            const [x2, y2] = NETWORK_POSITIONS[second];
            return <line key={to} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>

        {choices.map((choice, index) => {
          const [left, top] = NETWORK_POSITIONS[index];
          return (
            <button
              key={choice.id}
              type="button"
              className="network-node"
              style={{ left: `${left}%`, top: `${top}%`, "--node-index": index }}
              onClick={() => selectChoice(choice)}
              disabled={isTransitioning}
              aria-label={`Choisir ${choice.label}`}
            >
              <span className="network-node-emoji" aria-hidden="true">{choice.emoji}</span>
              <span className="network-node-label">{choice.label}</span>
            </button>
          );
        })}
      </div>

      {path.length > 0 && (
        <div className="network-steps" aria-label="Niveaux déjà choisis">
          {chosenItems.map((item, index) => (
            <button type="button" key={item.id} onClick={() => returnToLevel(index)}>
              <span aria-hidden="true">{item.emoji}</span> {item.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
