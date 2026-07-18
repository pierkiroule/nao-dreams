import { useMemo, useState } from "react";
import { DREAM_CONFIG } from "../config/dream";

const POSITIONS = [
  [50, 12], [23, 22], [77, 23], [12, 46],
  [50, 42], [88, 47], [25, 67], [74, 68],
  [50, 87], [8, 82], [92, 83], [37, 29],
  [64, 31], [35, 55], [66, 55], [50, 64],
];

function selectedLinks(items) {
  return items.flatMap((item, index) =>
    items.slice(index + 1).map((other) => [item.id, other.id]),
  );
}

export default function DreamConstellation({
  symbols,
  sensations,
  initialSelections,
  onContinue,
  loading,
}) {
  const [selectedSymbols, setSelectedSymbols] = useState(
    initialSelections.symbols ?? [],
  );
  const [sensation, setSensation] = useState(
    initialSelections.sensation ?? "",
  );

  const complete =
    selectedSymbols.length === DREAM_CONFIG.selectionCount;
  const visibleSymbols = complete
    ? symbols.filter(({ id }) => selectedSymbols.includes(id))
    : symbols;
  const links = useMemo(
    () => selectedLinks(visibleSymbols),
    [visibleSymbols],
  );

  function toggleSymbol(id) {
    setSelectedSymbols((current) => {
      if (current.includes(id)) {
        return current.filter((symbol) => symbol !== id);
      }

      if (current.length === DREAM_CONFIG.selectionCount) {
        return current;
      }

      return [...current, id];
    });
  }

  function getPosition(symbol, index) {
    if (!complete) {
      return POSITIONS[symbols.findIndex(({ id }) => id === symbol.id)];
    }

    return [[50, 20], [23, 68], [77, 68]][index];
  }

  return (
    <section className="constellation-selection">
      <header className="constellation-header">
        <h1 className="page-title">
          Choisis {DREAM_CONFIG.selectionCount} bulles oniriques
        </h1>
        <p className="page-text">Celles qui t’inspirent ici et maintenant.</p>
      </header>

      <div className={`constellation-canvas ${complete ? "is-complete" : ""}`}>
        <svg className="constellation-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {links.map(([from, to]) => {
            const fromIndex = visibleSymbols.findIndex(({ id }) => id === from);
            const toIndex = visibleSymbols.findIndex(({ id }) => id === to);
            const [x1, y1] = getPosition(visibleSymbols[fromIndex], fromIndex);
            const [x2, y2] = getPosition(visibleSymbols[toIndex], toIndex);

            return <line key={`${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>

        {visibleSymbols.map((symbol, index) => {
          const [left, top] = getPosition(symbol, index);
          const selected = selectedSymbols.includes(symbol.id);

          return (
            <button
              key={symbol.id}
              type="button"
              className={`constellation-orb ${selected ? "is-selected" : ""}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => toggleSymbol(symbol.id)}
              aria-label={symbol.label}
              aria-pressed={selected}
              disabled={complete && selected}
            >
              <span aria-hidden="true">{symbol.emoji}</span>
            </button>
          );
        })}
      </div>

      {!complete ? (
        <p className="constellation-count">
          {selectedSymbols.length} / {DREAM_CONFIG.selectionCount}
        </p>
      ) : (
        <div className="constellation-resonance">
          <p className="page-text">Prends le temps de ressentir comment ce trio•° résonne dans ton corps.</p>
          <h2 className="constellation-tag-title">Choisis la sensation principale à faire circuler dans l’Océan de ton corps.</h2>
          <div className="sensation-orbs" role="group" aria-label="Sensation à partager">
            {sensations.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className={`sensation-orb ${sensation === tag.id ? "is-selected" : ""}`}
                onClick={() => setSensation(tag.id)}
                aria-label={tag.label}
                aria-pressed={sensation === tag.id}
              >
                <span aria-hidden="true">{tag.emoji}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="constellation-continue"
            disabled={!sensation || loading}
            onClick={() => onContinue({ symbols: selectedSymbols, sensation })}
          >
            {loading ? "La bulle se forme…" : "Partager cette sensation"}
          </button>
        </div>
      )}
    </section>
  );
}
