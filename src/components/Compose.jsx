import { useState } from "react";

export default function Compose({ initialItems, onBack, onComplete }) {
  const [items, setItems] = useState(initialItems);
  const [dragged, setDragged] = useState(null);
  const move = (index, offset) => setItems((current) => { const next = [...current]; const target = index + offset; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const drop = (target) => { if (dragged === null || dragged === target) return; setItems((current) => { const next = [...current]; const [item] = next.splice(dragged, 1); next.splice(target, 0, item); return next; }); setDragged(null); };
  return <main className="screen compose-screen">
    <button className="back" onClick={onBack}>← Recueillir</button>
    <p className="eyebrow">Composer</p><h1>Fais-en quelque chose<br />qui te ressemble.</h1><p className="intro">Déplace, ordonne ou retire. Tu restes co-auteur·ice.</p>
    <div className="bricks">
      {items.map((item, index) => <article key={item.id} draggable onDragStart={() => setDragged(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(index)}>
        <span className="handle" title="Déplacer">⠿</span><b>{item.emoji}</b><div><h2>{item.title}</h2><p>{item.text}</p></div>
        <div className="brick-actions"><button disabled={!index} onClick={() => move(index, -1)} aria-label={`Monter ${item.title}`}>↑</button><button disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label={`Descendre ${item.title}`}>↓</button><button onClick={() => setItems((current) => current.filter(({ id }) => id !== item.id))} aria-label={`Retirer ${item.title}`}>×</button></div>
      </article>)}
      {!items.length && <p className="empty">Tous les pétales ont été retirés.<br /><button onClick={onBack}>Retourner à la fleur</button></p>}
    </div>
    <button className="primary" disabled={!items.length} onClick={() => onComplete(items)}>Faire éclore mon texte <span aria-hidden="true">→</span></button>
  </main>;
}
