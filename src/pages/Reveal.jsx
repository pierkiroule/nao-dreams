import Bubble from "../components/Bubble";
import Button from "../components/Button";

export default function Reveal({ journey, actions }) {
  return <section className="page reveal-page">
    <p className="eyebrow">Le rêve</p>
    <Bubble><p className="dream-text">{journey.dream}</p></Bubble>
    <Button onClick={actions.restart}>Faire un autre rêve</Button>
  </section>;
}
