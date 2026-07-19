import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../api/analytics";
import { getChildNodes, getNetworkEdges, getPublishedNetwork, getRootNodes } from "../services/bubbleNetworkService";
import { createOrResumeJourney, markJourneyExposureSelected, replaceJourneyChoice, syncJourneyExposures } from "../services/syncService";
import { getLinkVisualStrength, getNetworkPositions, getVisualScale } from "./graphMath";
import { TRANSITION_DURATIONS, TRANSITION_STATES } from "./graphTransition";
import { MAX_REFLECTION_LENGTH, SCREEN_RESONANCE, SELECTION_PROMPTS } from "./journeyNarrative";
import { createOrResumeDreamSeed, saveDreamReflection } from "../services/dreamSeedService";


export default function NestedGraphJourney({ journey, onComplete, loading = false }) {
  const [network, setNetwork] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [path, setPath] = useState([]);
  const [phase, setPhase] = useState(TRANSITION_STATES.IDLE);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [dreamSeed, setDreamSeed] = useState(null);
  const [finalPhase, setFinalPhase] = useState(null);
  const [syncNotice, setSyncNotice] = useState("");
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
        setEdges(await getNetworkEdges(nextNetwork.id, roots.map((node) => node.id)));
        trackEvent("graph_journey_started", { network_id: nextNetwork.id, depth: 1, reduced_motion: reducedMotion });
        createOrResumeJourney(journey, nextNetwork.id)
          .then(() => syncJourneyExposures({ journeyId: journey.id, networkId: nextNetwork.id, step: 1, nodes: roots }))
          .catch((syncError) => { console.warn("Journey distant différé.", syncError); setSyncNotice("Mode hors ligne : tes choix seront conservés sur cet appareil."); });
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
    try {
      await Promise.all([
        replaceJourneyChoice(journey.id, nextPath),
        markJourneyExposureSelected({ journeyId: journey.id, step: depth, bubbleId: node.id }),
      ]);
    } catch { setError("Le choix reste dans ce rêve, mais sa sauvegarde sera réessayée."); }
    const focus = reducedMotion ? 130 : TRANSITION_DURATIONS.focusing;
    timers.current.push(window.setTimeout(async () => {
      setPhase(TRANSITION_STATES.ENTERING);
      timers.current.push(window.setTimeout(async () => {
        if (depth === 3) {
          setPath(nextPath); setPhase(TRANSITION_STATES.COMPLETED);
          setFinalPhase("revealing_trio");
          trackEvent("emoji_trio_completed", { network_id: network.id, depth: 3 });
          trackEvent("trio_constellation_revealed", { network_id: network.id, reduced_motion: reducedMotion });
          timers.current.push(window.setTimeout(async () => {
            setFinalPhase("loading_dream_seed");
            try {
              trackEvent("dream_seed_requested", { network_id: network.id });
              const seed = await createOrResumeDreamSeed({ journeyId: journey.id, networkId: network.id, bubbleIds: nextPath.map((item) => item.bubbleId) });
              setDreamSeed(seed); setFinalPhase("collecting_reflection");
              trackEvent("dream_seed_revealed", { network_id: network.id, generation_mode: seed.generationMode, reduced_motion: reducedMotion });
            } catch { setError("La bulle n’a pas pu émerger pour le moment."); setFinalPhase("revealing_trio"); trackEvent("dream_seed_failed", { network_id: network.id }); }
          }, reducedMotion ? 180 : 700));
          return;
        }
        try {
          const children = await getChildNodes(network.id, node.id);
          setPath(nextPath); setNodes(children); setEdges(await getNetworkEdges(network.id, children.map((child) => child.id))); setSelected(null); setPhase(TRANSITION_STATES.REVEALING);
          syncJourneyExposures({ journeyId: journey.id, networkId: network.id, step: depth + 1, nodes: children }).catch(() => setSyncNotice("Mode hors ligne : tes choix seront conservés sur cet appareil."));
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
      setPath(previousPath); setNodes(previousNodes); setEdges(await getNetworkEdges(network.id, previousNodes.map((node) => node.id))); setPhase(TRANSITION_STATES.REVEALING);
      trackEvent("graph_depth_returned", { network_id: network.id, depth: path.length });
      timers.current.push(window.setTimeout(() => setPhase(TRANSITION_STATES.IDLE), reducedMotion ? 160 : TRANSITION_DURATIONS.revealing));
    } catch (backError) { setPhase(TRANSITION_STATES.IDLE); setError(backError.message || "Impossible de revenir à la résonance précédente."); }
  }

  if (error && !network) return <p className="page-text" role="alert">{error}</p>;
  if (!network) return <p className="page-text" aria-live="polite">Le réseau onirique apparaît…</p>;
  if (finalPhase) return <DreamSeedReveal path={path} seed={dreamSeed} phase={finalPhase} journey={journey} network={network} onComplete={onComplete} />;
  const locked = phase !== "idle" || loading;
  const maximumCooccurrence = Math.max(1, ...edges.map((edge) => edge.cooccurrenceCount ?? 0));
  return <section className={`nested-graph ${phase !== "idle" ? `nested-graph--${phase}` : ""}`}>
    <header className="nested-graph__header"><p className="network-eyebrow">{network.question}</p><h1>{SELECTION_PROMPTS[depth - 1]}</h1></header>
    <p className="sr-only" aria-live="polite">{SCREEN_RESONANCE[depth - 1]}</p>
    <div className="graph-progress" aria-hidden="true">{[0, 1, 2].map((item) => <i key={item} className={item < path.length ? "is-complete" : ""} />)}</div>
    {path.length > 0 && <button type="button" className="graph-back" onClick={goBack} disabled={locked}>Revenir à la résonance précédente</button>}
    <div className="graph-scene">
      <div className="graph-stars" aria-hidden="true" />
      <svg className="graph-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {getStructuralEdges(nodes).map((edge) => <GraphLink key={`structural-${edge.sourceId}-${edge.targetId}`} edge={edge} nodes={nodes} positions={positions} maximumCooccurrence={maximumCooccurrence} structural />)}
        {edges.map((edge) => <GraphLink key={`observed-${edge.sourceId}-${edge.targetId}`} edge={edge} nodes={nodes} positions={positions} maximumCooccurrence={maximumCooccurrence} />)}
      </svg>
      {nodes.map((node, index) => { const point = positions[index]; return <button key={node.id} type="button" className={`graph-node ${selected === node.id ? "is-selected" : ""}`} style={{ left: `${point.left}%`, top: `${point.top}%`, "--node-scale": getVisualScale(node.resonanceScore) }} onClick={() => selectNode(node)} disabled={locked} aria-label={`Choisir ${node.label}`}><span className="graph-node__orb"><span aria-hidden="true">{node.emoji}</span></span><span className="graph-node__label">{node.label}</span></button>; })}
    </div>
    <div className="graph-accessible-list" aria-label="Résonances disponibles">{nodes.map((node) => <button key={node.id} type="button" onClick={() => selectNode(node)} disabled={locked}>{node.emoji} {node.label}</button>)}</div>
    {error && <p className="graph-message" role="status">{error}</p>}
    {syncNotice && <p className="graph-sync-notice" role="status">{syncNotice}</p>}
  </section>;
}

function getStructuralEdges(nodes) {
  return nodes.map((node, index) => ({ sourceId: node.id, targetId: nodes[(index + 1) % nodes.length]?.id })).filter((edge) => edge.targetId);
}

function GraphLink({ edge, nodes, positions, maximumCooccurrence, structural = false }) {
  const source = positions[nodes.findIndex((node) => node.id === edge.sourceId)];
  const target = positions[nodes.findIndex((node) => node.id === edge.targetId)];
  if (!source || !target) return null;
  const visual = structural ? { opacity: 0.1, width: 0.7 } : getLinkVisualStrength(edge.cooccurrenceCount, maximumCooccurrence);
  const score = Number.isFinite(edge.strength) ? edge.strength : null;
  return <line className={structural ? "graph-link--structural" : "graph-link--observed"} x1={source.left} y1={source.top} x2={target.left} y2={target.top} style={{ opacity: score === null ? visual.opacity : 0.12 + score * 0.68, strokeWidth: score === null ? visual.width : 0.4 + score * 3.2 }} />;
}

function DreamSeedReveal({ path, seed, phase, journey, network, onComplete }) {
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const reflectionStarted = useRef(false);

  async function release() {
    if (!seed || saving) return;
    setSaving(true); setMessage("");
    try {
      if (reflection.trim()) {
        await saveDreamReflection({ dreamSeedId: seed.id, journeyId: journey.id, content: reflection });
        trackEvent("dream_reflection_saved", { network_id: network.id, length_bucket: reflection.length > 500 ? "501-1000" : "1-500" });
      } else {
        trackEvent("dream_reflection_skipped", { network_id: network.id });
      }
      trackEvent("dream_bubble_released", { network_id: network.id, has_reflection: Boolean(reflection.trim()) });
      onComplete({ networkId: network.id, bubbleIds: path.map((item) => item.bubbleId), choices: path.map((item) => ({ id: item.bubbleId, emoji: item.emoji, text: item.label })), dreamSeedId: seed.id });
    } catch {
      setMessage("Les mots restent ici. Tu peux réessayer quand la connexion reviendra.");
      setSaving(false);
    }
  }

  return <section className={`dream-seed-reveal dream-seed-reveal--${phase}`}>
    <p className="sr-only" aria-live="polite">{seed ? "Ton trio est apparu. Une bulle de rêve vient d’émerger." : "Ton trio est apparu."}</p>
    <div className="trio-constellation" aria-label="Ton trio symbolique">
      {path.map((item) => <span key={item.bubbleId} aria-label={item.label}>{item.emoji}</span>)}
    </div>
    <h1 className="page-title">•° Voici ton trio. Trois symboles réunis qui nous transportent un peu plus loin dans l’Odyssée O•°.</h1>
    {!seed ? <p className="page-text" aria-live="polite">Une petite bulle de rêve approche…</p> : <>
      <p className="dream-seed-transition">Poursuivons l’Odyssée O•° en découvrant la petite bulle de rêve née de cette constellation.</p>
      <article className="dream-seed-bubble" tabIndex="-1">
        <span aria-hidden="true">◌</span>
        <p>{seed.phrase}</p>
      </article>
      <div className="reflection-field">
        <label htmlFor="dream-reflection">Tu peux noter ici les sensations, images ou mots spontanés qui émergent en découvrant cette petite bulle.</label>
        <textarea id="dream-reflection" value={reflection} maxLength={MAX_REFLECTION_LENGTH} rows="5" onChange={(event) => { setReflection(event.target.value); if (event.target.value && !reflectionStarted.current) { reflectionStarted.current = true; trackEvent("dream_reflection_started", { network_id: network.id }); } }} placeholder="Une image, une couleur, une matière, un mot, une sensation, un souvenir…" />
        <p>Tu peux aussi laisser cet espace vide.</p>
      </div>
      <p className="dream-seed-flight">Cette petite bulle poursuivra bientôt son voyage vers d’autres Rêveurs de ton Réso•°.</p>
      {message && <p className="graph-message" role="status">{message}</p>}
      <button type="button" className="dream-seed-release" disabled={saving} onClick={release}>{saving ? "La bulle prend son élan…" : "Laisser s’envoler la bulle"}</button>
    </>}
  </section>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  useEffect(() => { const query = window.matchMedia?.("(prefers-reduced-motion: reduce)"); if (!query) return undefined; const change = () => setReduced(query.matches); query.addEventListener("change", change); return () => query.removeEventListener("change", change); }, []);
  return reduced;
}
