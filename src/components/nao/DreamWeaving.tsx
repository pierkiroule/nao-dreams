import DreamBubble from "./DreamBubble";

export default function DreamWeaving() {
  return (
    <main className="weaving-screen" aria-live="polite">
      <div className="weaving-threads single-source" aria-hidden="true">
        <DreamBubble size="large" intensity={.8}/>
      </div>
      <p>Une ressource émerge.</p>
      <small>Prends le temps de la rencontrer.</small>
    </main>
  );
}
