import { useState } from "react";

export default function Bloom({ resources, onContinue }) {
  const [selected, setSelected] = useState([]);
  const toggle = (item) => setSelected((current) => current.some(({ id }) => id === item.id) ? current.filter(({ id }) => id !== item.id) : [...current, item]);
  return <main className="screen bloom-screen">
    <div className="bloom-heading"><p className="eyebrow">Ce qui a poussé</p><h1>Prends les pétales<br />qui résonnent.</h1><p>Il n’y a rien à comprendre, seulement quelque chose à cueillir.</p></div>
    <div className="flower" role="group" aria-label="Ressources à cueillir">
      <div className="stem" aria-hidden="true"><i /></div>
      <div className="flower-heart" aria-hidden="true">NOA</div>
      {resources.map((item, index) => <button key={item.id} style={{ "--petal": index, "--total": resources.length }} className={`petal${selected.some(({ id }) => id === item.id) ? " selected" : ""}`} aria-pressed={selected.some(({ id }) => id === item.id)} onClick={() => toggle(item)}><span>{item.emoji}</span><strong>{item.title}</strong><small>{item.text}</small></button>)}
    </div>
    <div className="bloom-action"><span>{selected.length ? `${selected.length} pétale${selected.length > 1 ? "s" : ""} cueilli${selected.length > 1 ? "s" : ""}` : "Touche un pétale pour le cueillir"}</span><button className="primary" disabled={!selected.length} onClick={() => onContinue(selected)}>Composer <span aria-hidden="true">→</span></button></div>
  </main>;
}
