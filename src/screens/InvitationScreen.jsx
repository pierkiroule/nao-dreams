import Button from "../components/Button";
import FloatingNut from "../components/FloatingNut";
export default function InvitationScreen({ scene, onEnter }) { return <section className="page invitation-screen"><FloatingNut/><p className="eyebrow">NOA DREAMS</p><h2 className="page-title">Someone chose you.</h2><p className="scene-fragment">{scene}</p><p className="page-text">Quelque chose est déjà entré dans ce rêve.</p><Button onClick={onEnter}>Écouter le rêve</Button></section>; }
