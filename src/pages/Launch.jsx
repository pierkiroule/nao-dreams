import { useMemo, useState } from "react";
import { constellations, getConstellation } from "../data/resources";

export default function Launch({ actions }) {
  const [constellationId, setConstellationId] = useState(null);
  const constellation = useMemo(() => getConstellation(constellationId), [constellationId]);

  function selectConstellation(id) {
    setConstellationId(id);
  }
  function chooseEmoji(item) {
    actions.chooseEmoji(constellation, item);
  }

  return (
    <section className="page constellation-page">
      <div>
        <p className="eyebrow">Choisis une constellation</p>
        <div className="constellation-list" aria-label="Constellations">
          {constellations.map((item) => <button key={item.id} type="button" className={`constellation-button ${item.id === constellationId ? "is-selected" : ""}`} aria-pressed={item.id === constellationId} onClick={() => selectConstellation(item.id)}><span>{item.emoji}</span>{item.name}</button>)}
        </div>
      </div>

      {constellation && <div className="emoji-choice" aria-live="polite">
        <p className="eyebrow">Choisis le symbole qui appelle ton regard•°</p>
        <div className="emoji-grid">
          {constellation.emojis.map((item) => {
            return <button key={item.id} type="button" className="emoji-button" aria-label={item.keywords.join(", ")} onClick={() => chooseEmoji(item)}><span aria-hidden="true">{item.emoji}</span></button>;
          })}
        </div>
      </div>}
    </section>
  );
}
