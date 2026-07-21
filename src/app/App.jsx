import { useEffect, useState } from "react";
import { nightmares, punklines } from "../data/nowa";

const playStamp = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(115, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(56, context.currentTime + 0.08);
  gain.gain.setValueAtTime(0.055, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.11);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
};

const playScrountch = () => {
  playStamp();
  window.setTimeout(playStamp, 240);
};

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [nightmareId, setNightmareId] = useState("");
  const [punklineId, setPunklineId] = useState("");
  const [customLine, setCustomLine] = useState("");
  const [isCrunching, setIsCrunching] = useState(false);
  const chosenNightmare = nightmares.find((nightmare) => nightmare.id === nightmareId);
  const choices = punklines.filter((punkline) => punkline.nightmare_id === nightmareId);
  const selectedLine = customLine || punklines.find((punkline) => punkline.id === punklineId)?.text;

  useEffect(() => {
    if (!isCrunching) return undefined;
    const timer = window.setTimeout(() => { setIsCrunching(false); setScreen("punklines"); }, 1900);
    return () => window.clearTimeout(timer);
  }, [isCrunching]);

  const chooseNightmare = (id) => { setNightmareId(id); playStamp(); };
  const choosePunkline = (id) => { setPunklineId(id); setCustomLine(""); playStamp(); };
  const scrountch = () => { playScrountch(); setIsCrunching(true); setScreen("scrountch"); };

  if (screen === "intro") return <main className="nowa-app intro"><div className="corner-mark">N° 01</div><div className="logo"><span>NOWA</span><small>NOW FUTURE</small></div><div className="intro-copy"><p className="kicker">PETITE NOIX · GRAND DÉSORDRE</p><h1>La p'tite noix punk qui réveille les futurs alternatifs.</h1></div><button className="primary-button" onClick={() => { playStamp(); setScreen("nightmares"); }}>Commencer <i>→</i></button><p className="footer-note">Mange les cauchemars. Crache des futurs.</p></main>;

  if (screen === "nightmares") return <main className="nowa-app"><header className="topbar"><div className="mini-logo">NOWA <span>NOW FUTURE</span></div><span>01 / 03</span></header><section className="flow-screen"><p className="kicker">UN SEUL À LA FOIS</p><h1>Choisis un<br/><em>cauchemar.</em></h1><div className="choice-stack">{nightmares.map((nightmare, index) => <button key={nightmare.id} className={`nightmare-card ${nightmareId === nightmare.id ? "is-selected" : ""}`} onClick={() => chooseNightmare(nightmare.id)} aria-pressed={nightmareId === nightmare.id}><b>0{index + 1}</b><span>{nightmare.title}</span></button>)}</div><button className="primary-button" disabled={!nightmareId} onClick={scrountch}>Scrountch <i>→</i></button></section></main>;

  if (screen === "scrountch") return <main className="nowa-app crunch-screen"><div className={`crunch-nut ${isCrunching ? "is-crunching" : ""}`} aria-label="NOWA mastique le cauchemar"><span className="nut-eye left"/><span className="nut-eye right"/><span className="nightmare-slip">{chosenNightmare?.title}</span><b>SCROUNTCH</b></div><p className="crunch-count">Scrountch.<br/>Scrountch.</p></main>;

  if (screen === "punklines") return <main className="nowa-app"><header className="topbar"><div className="mini-logo">NOWA <span>NOW FUTURE</span></div><span>02 / 03</span></header><section className="flow-screen punkline-screen"><p className="kicker">RÉGURGITÉ PAR NOWA</p><h1>Un futur<br/><em>se défend.</em></h1><div className="punkline-stack">{choices.map((line, index) => <button key={line.id} className={`punkline-card ${punklineId === line.id ? "is-selected" : ""}`} onClick={() => choosePunkline(line.id)} aria-pressed={punklineId === line.id}><b>PUNKLINE 0{index + 1}</b><span>{line.text}</span><i>↗</i></button>)}</div><button className="primary-button" onClick={() => setScreen("choose")} disabled={!punklineId}>Choisir cette Punkline <i>→</i></button></section></main>;

  if (screen === "choose") return <main className="nowa-app"><header className="topbar"><div className="mini-logo">NOWA <span>NOW FUTURE</span></div><span>03 / 03</span></header><section className="flow-screen choose-screen"><p className="kicker">ELLE PARTIRA AVEC NOWA</p><h1>Choisis la Punkline qui mérite de <em>voyager.</em></h1><article className="chosen-line"><span>{selectedLine}</span></article><label className="edit-line">Tu peux changer quelques mots.<textarea value={customLine} placeholder="Ou laisse la Punkline comme ça." onChange={(event) => setCustomLine(event.target.value)} /></label><button className="primary-button" onClick={() => { playStamp(); setScreen("thanks"); }}>Passer NOWA <i>→</i></button></section></main>;

  return <main className="nowa-app thanks"><div className="thanks-nut"><span>NOWA</span></div><section className="thanks-copy"><p className="kicker">BIEN REÇU</p><h1>Merci.</h1><p>Ta Punkline rejoint le voyage de NOWA.</p></section><div className="stats"><div><b>128</b><span>gardiens</span></div><div><b>1 486</b><span>kilomètres</span></div><div><b>384</b><span>Punklines</span></div></div><button className="primary-button" onClick={() => { playStamp(); setScreen("intro"); setNightmareId(""); setPunklineId(""); setCustomLine(""); }}>Suivre cette NOWA <i>→</i></button></main>;
}
