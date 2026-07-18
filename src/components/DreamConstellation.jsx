import { useMemo, useState } from "react";
import {
  dreamGraph,
  dreamLevels,
  dreamQuestions,
  findGraphNode,
  findSensation,
  sensationNodes,
} from "../data/resources";
import {
  FINAL_SYMBOL_COUNT,
  canContinue,
  isFinalPathComplete,
  parentPath,
} from "./dreamConstellationModel";

function graphForPath(path) {
  const branch = path.filter((item) => item.level !== "atmosphere" && item.level !== "sensation");
  if (branch.length === 0) return dreamGraph;
  return findGraphNode(branch.at(-1).id)?.children ?? [];
}

export default function DreamConstellation({ initialPath = [], onComplete }) {
  const [path, setPath] = useState(initialPath);
  const [transitioning, setTransitioning] = useState(false);
  const finalReady = isFinalPathComplete(path);
  const currentLevel = finalReady ? "sensation" : dreamLevels[Math.min(path.filter((item) => item.level !== "atmosphere" && item.level !== "sensation").length, dreamLevels.length - 1)];
  const nodes = useMemo(() => finalReady ? sensationNodes : graphForPath(path), [finalReady, path]);
  const selectedAtmospheres = path.filter((item) => item.level === "atmosphere");

  function changeGraph(update) {
    setTransitioning(true);
    window.setTimeout(() => {
      setPath(update);
      setTransitioning(false);
    }, 180);
  }

  function selectNode(selected) {
    if (currentLevel === "sensation") {
      setPath((current) => [...current.filter((item) => item.level !== "sensation"), { level: "sensation", id: selected.id }]);
      return;
    }
    if (currentLevel === "atmosphere") {
      setPath((current) => {
        const exists = current.some((item) => item.level === "atmosphere" && item.id === selected.id);
        if (exists) return current.filter((item) => !(item.level === "atmosphere" && item.id === selected.id));
        if (selectedAtmospheres.length >= FINAL_SYMBOL_COUNT) return current;
        return [...current, { level: "atmosphere", id: selected.id }];
      });
      return;
    }
    changeGraph([...path.filter((item) => item.level !== "atmosphere" && item.level !== "sensation"), { level: currentLevel, id: selected.id }]);
  }

  const finalSymbols = selectedAtmospheres.map((item) => findGraphNode(item.id)).filter(Boolean);
  const sensation = findSensation(path.find((item) => item.level === "sensation")?.id);

  return <section className="dream-constellation" aria-label="Constellation onirique">
    <header className="dream-constellation-header">
      <p className="dream-constellation-path" aria-live="polite">{path.length} fragments choisis</p>
      <h1 className="page-title">{dreamQuestions[currentLevel]}</h1>
      {path.length > 0 && <button type="button" className="dream-constellation-back" onClick={() => changeGraph(parentPath(path))}>← Retour au réseau parent</button>}
    </header>
    {currentLevel === "sensation" && <div className="dream-final-symbols" aria-label="Tes trois symboles terminaux">{finalSymbols.map((item) => <span key={item.id} className="dream-final-symbol" aria-label={item.label}>{item.emoji}</span>)}</div>}
    {currentLevel === "sensation" ? <div className="dream-sensation-tags" aria-label="Choix de sensation">{nodes.map((item) => {
      const selected = sensation?.id === item.id;
      return <button key={item.id} type="button" className={`dream-sensation-tag ${selected ? "is-selected" : ""}`} onClick={() => selectNode(item)} aria-label={item.label} aria-pressed={selected}>{item.emoji} {item.label}</button>;
    })}</div> : <div className={`dream-constellation-graph ${transitioning ? "is-transitioning" : ""}`}>
      <svg className="dream-constellation-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M15 70 L50 25 L85 70 M15 70 L85 70" /></svg>
      {nodes.map((item, index) => {
        const selected = currentLevel === "atmosphere" ? selectedAtmospheres.some((entry) => entry.id === item.id) : currentLevel === "sensation" ? sensation?.id === item.id : false;
        return <button key={item.id} type="button" className={`dream-constellation-bubble bubble-${index + 1} ${selected ? "is-selected" : ""}`} onClick={() => selectNode(item)} aria-label={item.label} aria-pressed={selected}><span aria-hidden="true">{item.emoji}</span><span className="sr-only">{item.label}</span></button>;
      })}
    </div>}
    {currentLevel === "atmosphere" && <p className="dream-constellation-hint" aria-live="polite">{selectedAtmospheres.length} sur {FINAL_SYMBOL_COUNT} symboles terminaux choisis</p>}
    {finalReady && <button type="button" className="dream-constellation-continue" disabled={!canContinue(path)} onClick={() => onComplete({ path, sensation: sensation?.id ?? null })}>Poursuivre avec cette sensation</button>}
  </section>;
}
