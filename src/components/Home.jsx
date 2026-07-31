import Nut from "./Nut";

export default function Home({ onStart }) {
  return <main className="screen home-screen">
    <div className="hero-nut"><Nut /></div>
    <p className="eyebrow">Un rituel pour déposer ce qui pèse</p>
    <h1>NOA <em>SOUCI</em></h1>
    <p className="signature">Et si nos soucis<br />pouvaient se composter&nbsp;?</p>
    <button className="primary" onClick={onStart}>Confier un souci <span aria-hidden="true">→</span></button>
  </main>;
}
