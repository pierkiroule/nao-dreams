import { useState } from "react";
import Button from "../components/Button";
import { dreamPassers, getNextPasser } from "../data/dreamPassers";

export default function PassDream({ journey, actions }) {
  const [chosenId, setChosenId] = useState(journey.passedTo?.id ?? "");
  const chosen = dreamPassers.find(({ id }) => id === chosenId);
  const next = chosen && getNextPasser(chosen.position);

  function pass() {
    if (chosen) actions.passDream(chosen);
  }

  if (journey.passedTo) {
    const following = getNextPasser(journey.passedTo.position);
    return <section className="page pass-page">
      <p className="eyebrow">La noix est en chemin</p>
      <h2 className="page-title">{journey.passedTo.name} la gardera jusqu’au prochain rêve.</h2>
      <p className="page-text">Dans la ronde, {following.name} recevra le fil suivant. Lila rejoint Aube au commencement de la prochaine ronde.</p>
      <Button onClick={actions.restart}>Faire un autre rêve</Button>
    </section>;
  }

  return <section className="page pass-page">
    <p className="eyebrow">La ronde des 12 passeurs</p>
    <h2 className="page-title">Trouve la personne inspirante à qui passer la noix.</h2>
    <div className="passer-grid">
      {dreamPassers.map((passer) => <button key={passer.id} type="button" className={`passer-button ${chosenId === passer.id ? "is-selected" : ""}`} aria-pressed={chosenId === passer.id} onClick={() => setChosenId(passer.id)}><span>{passer.position}</span>{passer.name}</button>)}
    </div>
    {next && <p className="small-text">Puis {next.name} reprendra le fil.</p>}
    <Button disabled={!chosen} onClick={pass}>Passer la noix à {chosen?.name ?? "…"}</Button>
  </section>;
}
