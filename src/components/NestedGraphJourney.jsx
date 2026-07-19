import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../api/analytics";
import { getChildNodes, getPublishedNetwork, getRootNodes } from "../services/bubbleNetworkService";
import { createOrResumeJourney, replaceJourneyChoice } from "../services/syncService";
import { getLinkVisualStrength, getNetworkPositions, getVisualScale } from "./graphMath";
import { TRANSITION_DURATIONS, TRANSITION_STATES } from "./graphTransition";

const QUESTION = "Quel emoji résonne le plus avec tes besoins du moment ?";
const DEPTH_LABELS = ["Première résonance sur trois", "Deuxième résonance sur trois", "Résonance finale"];

export default function NestedGraphJourney({ journey, onComplete, loading = false }) {
  const [network, setNetwork] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [path, setPath] = useState([]);
  const [phase, setPhase] = useState(TRANSITION_STATES.IDLE);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const reducedMotion = useReducedMotion();
  const timers = useRef([]);
  const depth = path.length + 1;
  const positions = useMemo(() => getNetworkPositions(network?.id, path.at(-1)?.bubbleId, depth), [network?.id, path, depth]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    let active = true;
    async function begin() {
      try {
        const nextNetwork = await getPublishedNetwork();
        const roots = await getRootNodes(nextNetwork.id);
        if (!active) return;
        setNetwork(nextNetwork); setNodes(roots);
        trackEvent("graph_journey_started", { network_id: nextNetwork.id, depth: 1, reduced_motion: reducedMotion });
        createOrResumeJourney(journey, nextNetwork.id).catch((syncError) => console.warn("Journey distant différé.", syncError));
      } catch (loadError) {
        if (active) setError(loadError.message || "Le réseau n’a pas pu émerger.");
      }
    }
    begin();
    return () => { active = false; };
  }, [journey, reducedMotion]);

  useEffect(() => {
    const escape = (event) => { if (event.key === "Escape" && path.length && phase === "idle") goBack(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  });

  async function selectNode(node) {
    if (phase !== "idle" || !network) return;
    const chosen = { bubbleId: node.id, emoji: node.emoji, label: node.label, depth };
    const nextPath = [...path, chosen];
    setSelected(node.id); setError(""); setPhase(TRANSITION_STATES.FOCUSING);
    trackEvent("graph_node_selected", { network_id: network.id, bubble_id: node.id, depth, reduced_motion: reducedMotion });
    try { await replaceJourneyChoice(journey.id, nextPath); } catch { setError("Le choix reste dans ce rêve, mais sa sauvegarde sera réessayée."); }
    const focus = reducedMotion ? 130 : TRANSITION_DURATIONS.focusing;
    timers.current.push(window.setTimeout(async () => {
      setPhase(TRANSITION_STATES.ENTERING);
      timers.current.push(window.setTimeout(async () => {
        if (depth === 3) {
          setPath(nextPath); setPhase(TRANSITION_STATES.COMPLETED);
          trackEvent("graph_journey_completed", { network_id: network.id, depth: 3 });
          timers.current.push(window.setTimeout(() => onComplete({ networkId: network.id, bubbleIds: nextPath.map((item) => item.bubbleId), choices: nextPath.map((item) => ({ id: item.bubbleId, emoji: item.emoji, text: item.label })) }), reducedMotion ? 220 : 850));
          return;
        }
        try {
          const children = await getChildNodes(network.id, node.id);
          setPath(nextPath); setNodes(children); setSelected(null); setPhase(TRANSITION_STATES.REVEALING);
          trackEvent("graph_depth_entered", { network_id: network.id, bubble_id: node.id, depth: depth + 1 });
          timers.current.push(window.setTimeout(() => setPhase(TRANSITION_STATES.IDLE), reducedMotion ? 160 : TRANSITION_DURATIONS.revealing));
        } catch (loadError) { setPhase(TRANSITION_STATES.IDLE); setSelected(null); setError(loadError.message || "Cette résonance ne peut pas être ouverte."); }
      }, reducedMotion ? 160 : TRANSITION_DURATIONS.entering));
    }, focus));
  }

  async function goBack() {
    if (!path.length || phase !== "idle" || !network) return;
    const previousPath = path.slice(0, -1);
    setPhase(TRANSITION_STATES.ENTERING); setError("");
    try {
      const previousNodes = previousPath.length ? await getChildNodes(network.id, previousPath.at(-1).bubbleId) : await getRootNodes(network.id);
      await replaceJourneyChoice(journey.id, previousPath);
      setPath(previousPath); setNodes(previousNodes); setPhase(TRANSITION_STATES.REVEALING);
      trackEvent("graph_depth_returned", { network_id: network.id, depth: path.length });
      timers.current.push(window.setTimeout(() => setPhase(TRANSITION_STATES.IDLE), reducedMotion ? 160 : TRANSITION_DURATIONS.revealing));
    } catch (backError) { setPhase(TRANSITION_STATES.IDLE); setError(backError.message || "Impossible de revenir à la résonance précédente."); }
  }

  if (error && !network) return <p className="page-text" role="alert">{error}</p>;
  if (!network) return <p className="page-text" aria-live="polite">Le réseau onirique apparaît…</p>;
  const locked = phase !== "idle" || loading;
  return <section className={`nested-graph ${phase !== "idle" ? `nested-graph--${phase}` : ""}`}>
    <header className="nested-graph__header"><p className="network-eyebrow">L’inconscient partagé de NAO</p><h1>{QUESTION}</h1></header>
    <p className="sr-only" aria-live="polite">{DEPTH_LABELS[depth - 1]}</p>
    <div className="graph-progress" aria-hidden="true">{[0, 1, 2].map((item) => <i key={item} className={item < path.length ? "is-complete" : ""} />)}</div>
    {path.length > 0 && <button type="button" className="graph-back" onClick={goBack} disabled={locked}>Revenir à la résonance précédente</button>}
    <div className="graph-scene">
      <div className="graph-stars" aria-hidden="true" />
      <svg className="graph-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{nodes.slice(1).map((node, index) => { const first = positions[0]; const next = positions[index + 1]; const style = getLinkVisualStrength(node.cooccurrenceCount); return <line key={node.id} x1={first.left} y1={first.top} x2={next.left} y2={next.top} style={{ opacity: style.opacity, strokeWidth: style.width }} />; })}</svg>
      {nodes.map((node, index) => { const point = positions[index]; return <button key={node.id} type="button" className={`graph-node ${selected === node.id ? "is-selected" : ""}`} style={{ left: `${point.left}%`, top: `${point.top}%`, "--node-scale": getVisualScale(node.resonanceScore) }} onClick={() => selectNode(node)} disabled={locked} aria-label={`Choisir ${node.label}`}><span className="graph-node__orb"><span aria-hidden="true">{node.emoji}</span></span><span className="graph-node__label">{node.label}</span></button>; })}
    </div>
    <div className="graph-accessible-list" aria-label="Résonances disponibles">{nodes.map((node) => <button key={node.id} type="button" onClick={() => selectNode(node)} disabled={locked}>{node.emoji} {node.label}</button>)}</div>
    {error && <p className="graph-message" role="status">{error}</p>}
  </section>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  useEffect(() => { const query = window.matchMedia?.("(prefers-reduced-motion: reduce)"); if (!query) return undefined; const change = () => setReduced(query.matches); query.addEventListener("change", change); return () => query.removeEventListener("change", change); }, []);
  return reduced;
}
