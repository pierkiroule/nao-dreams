import Bubble from "../components/Bubble";
import Button from "../components/Button";
export default function Reveal({ journey, actions }) { return <section className="page reveal-page"><p className="eyebrow">Le rêve est apparu</p><h2 className="page-title dream-title">{journey.chosenTitle}</h2><Bubble><p className="dream-text">{journey.dream}</p></Bubble><p className="credit-balance">✦ 3 crédits consommés · il te reste <strong>{journey.creditsRemaining} crédits</strong></p><Button onClick={actions.restart}>Composer un autre rêve</Button></section>; }
