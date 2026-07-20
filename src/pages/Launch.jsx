import { useMemo, useState } from "react";
import Button from "../components/Button";
import { networkEmojis, networkLinks } from "../data/resources";

const positions = [[50,8],[23,18],[76,19],[11,37],[39,34],[64,36],[89,38],[27,52],[51,52],[75,55],[10,68],[38,70],[61,69],[89,70],[25,87],[71,88]];

export default function Launch({ actions }) {
  const [selected, setSelected] = useState([]);
  const [drawn, setDrawn] = useState(false);
  const selectedItems = useMemo(() => networkEmojis.filter((item) => selected.includes(item.id)), [selected]);
  function toggle(item) {
    if (drawn) return;
    setSelected((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : current.length < 8 ? [...current, item.id] : current);
  }
  function draw() { if (selected.length) setDrawn(true); }
  return <section className="page network-page">
    <div className="network-heading"><p className="eyebrow">Réseau poétique</p><h2 className="page-title">Compose ta constellation.</h2><p className="page-text">Choisis jusqu’à 8 émojis qui t’appellent dans cette nuit.</p></div>
    <div className={`poetic-network ${drawn ? "is-drawn" : ""}`} aria-label="Réseau de 16 émojis">
      <svg className="network-links" viewBox="0 0 100 100" aria-hidden="true">{networkLinks.map(([from, to]) => { const a=positions[from]; const b=positions[to]; const active=selected.includes(networkEmojis[from].id)&&selected.includes(networkEmojis[to].id); return <line key={`${from}-${to}`} className={active ? "is-active" : ""} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />; })}</svg>
      {networkEmojis.map((item,index) => <button key={item.id} type="button" className={`network-node ${selected.includes(item.id) ? "is-selected" : ""}`} style={{ left:`${positions[index][0]}%`, top:`${positions[index][1]}%` }} aria-pressed={selected.includes(item.id)} aria-label={item.label} onClick={() => toggle(item)}><span>{item.emoji}</span></button>)}
    </div>
    <p className="network-count" aria-live="polite">{selected.length} / 8 émojis choisis</p>
    {!drawn ? <Button disabled={!selected.length} onClick={draw}>Dessiner ma constellation</Button> : <div className="network-confirm"><p>Ta constellation apparaît. Les autres signes se retirent doucement.</p><Button onClick={() => actions.saveConstellation(selectedItems)}>Générer une graine de rêve</Button></div>}
  </section>;
}
