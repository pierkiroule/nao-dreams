import { useEffect, useMemo, useState } from "react";
import { DREAM_CARDS } from "../../data/dreamCultures";
import { saveLocalDream } from "../../services/dreamSyncService";
import TestEnvironmentPanel from "../TestEnvironmentPanel";
import Dreamcatcher from "./Dreamcatcher";
import DreamReading from "./DreamReading";
import DreamWeaving from "./DreamWeaving";
import GrandOBackground from "./GrandOBackground";
import NaoBoat from "./NaoBoat";
import NaoLogo from "./NaoLogo";
import "../../styles/nao.css";

type Culture = {
  id: string;
  title: string;
  culture: string;
  country: string;
  region: string;
  summary: string;
  fullStory: string;
  culturalContext: string;
  dreamFunction: string;
  symbols: string[];
  emojis: string[];
  sourceLabels: string[];
};

type Phase = "entry" | "choosing" | "weaving" | "reading" | "released";
type Props = { onLeave?: () => void };

const featured = DREAM_CARDS.slice(0, 12) as Culture[];

function makeSuggestions(culture: Culture) {
  const [first = "une image", second = "un passage", third = "une sensation"] = culture.symbols;

  return [
    `Et cette nuit, peut-être que ${first} pourrait apparaître autrement, juste assez pour éveiller ta curiosité…`,
    `Tu pourrais laisser l’image de ${second} rester quelque part en toi, sans chercher à savoir où elle conduit…`,
    `Et si ${third} devenait une sensation, un mouvement ou une couleur, ton imaginaire saurait peut-être quoi en faire…`,
  ];
}

export default function NaoOdyssey({ onLeave }: Props) {
  const [phase, setPhase] = useState<Phase>("entry");
  const [selected, setSelected] = useState<Culture | null>(null);
  const [departing, setDeparting] = useState(false);
  const suggestions = useMemo(() => selected ? makeSuggestions(selected) : [], [selected]);

  useEffect(() => {
    if (!selected || phase !== "choosing") return;
    const id = setTimeout(() => setPhase("weaving"), 380);
    return () => clearTimeout(id);
  }, [selected, phase]);

  useEffect(() => {
    if (phase !== "weaving") return;
    const id = setTimeout(() => setPhase("reading"), 1600);
    return () => clearTimeout(id);
  }, [phase]);

  const release = (suggestion: string) => {
    if (!selected || !suggestion) return;
    saveLocalDream({
      title: selected.title,
      dreamText: suggestion,
      cultureIds: [selected.id],
    }).catch(() => {});
    setDeparting(true);
    setTimeout(() => setPhase("released"), 900);
  };

  let content;
  if (phase === "entry") {
    content = (
      <main className="grand-o-entry">
        <NaoLogo/>
        <div className="boat-horizon"><NaoBoat size="hero"/></div>
        <section className="odyssey-introduction">
          <h1>L’Odyssée de Nao Dream</h1>
          <p className="odyssey-subtitle">La petite noix qui voyage de main en main pour réveiller et relier les rêves du monde•°</p>
          <div className="odyssey-story">
            <p>Chaque noix porte en elle une invitation.</p>
            <p>Choisis une image qui t’inspire. Elle ouvrira une ressource onirique issue d’une culture du monde, avec son récit, son contexte et sa source.</p>
            <p>De cette rencontre naîtront trois suggestions. Elles ne racontent pas ton rêve et ne l’interprètent pas&nbsp;: elles laissent simplement une image, une sensation ou un passage stimuler ton propre imaginaire.</p>
            <p>Écoute celle qui résonne le plus pour toi, puis laisse-la poursuivre son voyage dans le Grand O•°.</p>
            <p>Quand ton odyssée est terminée, passe la noix à quelqu’un d’autre.</p>
          </div>
        </section>
        <button className="enter-ocean" onClick={() => setPhase("choosing")}>
          <span>Choisir une image</span><i/>
        </button>
        <details className="system-tide"><summary>État du courant</summary><TestEnvironmentPanel/></details>
        {onLeave && <button className="leave-ocean" onClick={onLeave}>Explorer autrement</button>}
      </main>
    );
  } else if (phase === "choosing") {
    content = <Dreamcatcher cultures={featured} onSelect={culture => setSelected(culture as Culture)} onBack={() => setPhase("entry")}/>;
  } else if (phase === "weaving") {
    content = <DreamWeaving/>;
  } else if (phase === "reading" && selected) {
    content = <div className={departing ? "dream-departing" : ""}><DreamReading culture={selected} suggestions={suggestions} onRelease={release}/></div>;
  } else {
    content = (
      <main className="released-screen">
        <div className="released-bubble">○</div>
        <NaoBoat size="medium" motion="depart"/>
        <p>Ta résonance rejoint le Grand O•°.</p>
        <button onClick={() => { setSelected(null); setDeparting(false); setPhase("entry"); }}>Revenir au rivage</button>
      </main>
    );
  }

  return <div className={`nao-odyssey phase-${phase}`}><GrandOBackground/>{content}</div>;
}
