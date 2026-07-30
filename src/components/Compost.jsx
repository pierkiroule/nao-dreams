import { useEffect, useState } from "react";
import Nut from "./Nut";

export default function Compost({ onComplete }) {
  const [germinating, setGerminating] = useState(false);
  useEffect(() => {
    const reveal = setTimeout(() => setGerminating(true), 2400);
    const finish = setTimeout(onComplete, 5200);
    return () => { clearTimeout(reveal); clearTimeout(finish); };
  }, [onComplete]);
  return <main className={`screen compost-screen${germinating ? " has-settled" : ""}`} aria-live="polite">
    <div className="soil-scene"><Nut composting /><div className="soil-line" /></div>
    <p className="sound">Scrountch.</p>
    <p className="compost-copy">NOA composte ton souci.</p>
    {germinating && <h1>Et si, de ce compost,<br />quelque chose commençait à germer&nbsp;?</h1>}
    <button className="skip" onClick={onComplete}>Continuer sans attendre</button>
  </main>;
}
