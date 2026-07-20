import { useState } from "react";
import Button from "../components/Button";
export default function Titles({ journey, actions }) {
 const [title,setTitle]=useState(""); const [resonance,setResonance]=useState("");
 return <section className="page title-page"><p className="eyebrow">Graine de rêve</p><h2 className="page-title">Lequel résonne ? Lequel t’appelle ?</h2><p className="page-text">Trois titres ont émergé de ta constellation.</p><div className="title-options">{journey.dreamTitles.map((item)=><button className={`title-option ${title===item?"is-selected":""}`} aria-pressed={title===item} type="button" key={item} onClick={()=>setTitle(item)}>{item}</button>)}</div><label className="resonance-field" htmlFor="resonance">Tes résonances <span>facultatif</span><textarea id="resonance" value={resonance} onChange={(event)=>setResonance(event.target.value)} maxLength="280" placeholder="Un souvenir, une image, un frisson…" /></label><Button disabled={!title} onClick={()=>actions.saveTitle(title,resonance)}>Continuer avec ce titre</Button></section>
}
