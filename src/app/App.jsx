import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import InvitationScreen from "../screens/InvitationScreen";
import ConstellationScreen from "../screens/ConstellationScreen";
import IntegrationScreen from "../screens/IntegrationScreen";
import TransmissionScreen from "../screens/TransmissionScreen";
import ProgressScreen from "../screens/ProgressScreen";
import RevealScreen from "../screens/RevealScreen";
import { selectConstellation } from "../data/constellations";
import { LocalDreamRepository } from "../services/localDreamRepository";
import { USE_LOCAL_DEMO } from "../services/dreamRepository";
import { generateLocalDream } from "../utils/generateLocalDream";
import { trackEvent } from "../api/analytics";

const SCREENS = { INVITATION: "invitation", CONSTELLATION: "constellation", INTEGRATION: "integration", TRANSMISSION: "transmission", PROGRESS: "progress", REVEAL: "reveal" };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.INVITATION);
  const [journey, setJourney] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [selected, setSelected] = useState(null);

  const loadJourney = useCallback(async () => {
    if (!USE_LOCAL_DEMO) return;
    const [nextJourney, nextContributions] = await Promise.all([LocalDreamRepository.getJourney(), LocalDreamRepository.getContributions()]);
    setJourney(nextJourney); setContributions(nextContributions);
  }, []);
  useEffect(() => { loadJourney(); }, [loadJourney]);

  const constellation = useMemo(() => selectConstellation(journey?.contributionCount ?? 0), [journey?.contributionCount]);
  const enter = useCallback(() => { setScreen(SCREENS.CONSTELLATION); trackEvent("dream_entered"); }, []);
  const confirm = useCallback(async () => {
    if (!selected || !journey) return;
    const contribution = { id: crypto.randomUUID(), journeyId: journey.id, constellationId: constellation.id, emoji: selected.symbol, label: selected.label, position: journey.contributionCount, createdAt: new Date().toISOString() };
    await LocalDreamRepository.addContribution(contribution); setContributions((current) => [...current, contribution]); setJourney((current) => ({ ...current, contributionCount: current.contributionCount + 1, status: current.contributionCount + 1 >= current.revealThreshold ? "ready" : "active" })); setScreen(SCREENS.INTEGRATION); trackEvent("dream_fragment_added", { constellation: constellation.id });
  }, [constellation.id, journey, selected]);
  const showProgress = useCallback(() => setScreen(SCREENS.PROGRESS), []);
  const reset = useCallback(async () => { const next = await LocalDreamRepository.reset(); setJourney(next); setContributions(await LocalDreamRepository.getContributions()); setSelected(null); setScreen(SCREENS.INVITATION); }, []);
  const shareDream = useCallback(async () => { const data = { title: "NOA DREAMS", text: "The dream is ready.", url: window.location.href }; if (navigator.share) await navigator.share(data); else await navigator.clipboard?.writeText(data.url); }, []);
  const dream = useMemo(() => generateLocalDream(contributions), [contributions]);
  if (!journey) return <Layout><p className="small-text">Le rêve se réveille…</p></Layout>;
  return <Layout>{screen === SCREENS.INVITATION && <InvitationScreen onEnter={enter}/>} {screen === SCREENS.CONSTELLATION && <ConstellationScreen constellation={constellation} selected={selected} onSelect={setSelected} onConfirm={confirm}/>} {screen === SCREENS.INTEGRATION && <IntegrationScreen emoji={selected} onDone={() => setScreen(SCREENS.TRANSMISSION)}/>} {screen === SCREENS.TRANSMISSION && <TransmissionScreen onLater={showProgress}/>} {screen === SCREENS.PROGRESS && <ProgressScreen journey={journey} onReveal={() => setScreen(SCREENS.REVEAL)} onQuit={() => setScreen(SCREENS.INVITATION)} onReset={reset}/>} {screen === SCREENS.REVEAL && <RevealScreen dream={dream} onShare={shareDream} onQuit={() => setScreen(SCREENS.INVITATION)}/>}</Layout>;
}
