import ResonanceReveal from "../components/ResonanceReveal";
export default function ResonancePage({ resonance, next }) { return <section className="page"><ResonanceReveal resonance={resonance}/><button onClick={next}>La transmettre à son tour</button></section>; }
