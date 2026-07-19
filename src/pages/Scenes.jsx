import Button from "../components/Button";

export default function Scenes({ journey, actions }) {
  return <section className="page scenes-page">
    <p className="eyebrow">Cadavre exquis · 3 scènes</p>
    <h2 className="page-title">Laquelle partira avec la noix&nbsp;?</h2>
    <div className="scene-list">
      {journey.scenes.map((scene, index) => <button key={scene} type="button" className="scene-card" onClick={() => actions.reveal(scene, journey.networkId)}>
        <span className="scene-number">0{index + 1}</span>
        <span>{scene}</span>
        <span className="scene-send" aria-hidden="true">→</span>
      </button>)}
    </div>
    <p className="small-text">Choisis une scène à glisser dans le rêve suivant.</p>
    <Button variant="secondary" onClick={actions.restart}>Recommencer</Button>
  </section>;
}
