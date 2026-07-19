import { useState } from "react";
import Bubble from "../components/Bubble";
import Button from "../components/Button";

export default function Reveal({ journey, actions }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [trailOpen, setTrailOpen] = useState(false);

  return <section className="page reveal-page">
    <p className="eyebrow">La bulle choisie</p>
    <Bubble><p className="dream-text">{journey.dream}</p></Bubble>
    {trailOpen && <p className="trail-note">Trois fils invisibles frémissent déjà derrière cette bulle.</p>}
    <Button variant="secondary" onClick={() => setModalOpen(true)}>Ouvrir le sillage</Button>
    <Button onClick={actions.openPass}>Passer la noix</Button>

    {modalOpen && <div className="dream-modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}>
      <section className="dream-modal" role="dialog" aria-modal="true" aria-labelledby="trail-title" onMouseDown={(event) => event.stopPropagation()}>
        <p className="eyebrow">Dans ton sillage</p>
        <h2 id="trail-title">Veux-tu découvrir comment ton rêve se tisse avec les rêveurs précédents&nbsp;?</h2>
        <p>Des fragments attendent dans l’ombre, sans explication.</p>
        <Button onClick={() => { setTrailOpen(true); setModalOpen(false); }}>Voir les fils</Button>
        <Button variant="secondary" onClick={() => setModalOpen(false)}>Pas maintenant</Button>
      </section>
    </div>}
  </section>;
}
