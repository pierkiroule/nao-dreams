import { useMemo, useState } from "react";
import Button from "../components/Button";
import { constellations, getConstellation } from "../data/resources";

export default function Launch({ actions }) {
  const [constellationId, setConstellationId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const constellation = useMemo(() => getConstellation(constellationId), [constellationId]);

  function selectConstellation(id) {
    setConstellationId(id);
    setSelectedIds([]);
  }

  function toggleEmoji(id) {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : current.length === 3 ? current : [...current, id]);
  }

  async function reveal() {
    if (!constellation || selectedIds.length !== 3 || loading) return;
    setLoading(true);
    const choices = constellation.emojis.filter(({ id }) => selectedIds.includes(id));
    try {
      await actions.reveal({ networkId: constellation.id, bubbleIds: selectedIds, choices });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page constellation-page">
      <div>
        <p className="eyebrow">1 · Choisis une constellation</p>
        <div className="constellation-list" aria-label="Constellations">
          {constellations.map((item) => <button key={item.id} type="button" className={`constellation-button ${item.id === constellationId ? "is-selected" : ""}`} aria-pressed={item.id === constellationId} onClick={() => selectConstellation(item.id)}><span>{item.emoji}</span>{item.name}</button>)}
        </div>
      </div>

      {constellation && <div className="emoji-choice" aria-live="polite">
        <p className="eyebrow">2 · Choisis trois signes <span>{selectedIds.length}/3</span></p>
        <div className="emoji-grid">
          {constellation.emojis.map((item) => {
            const selected = selectedIds.includes(item.id);
            return <button key={item.id} type="button" className={`emoji-button ${selected ? "is-selected" : ""}`} aria-label={item.keywords.join(", ")} aria-pressed={selected} onClick={() => toggleEmoji(item.id)}><span aria-hidden="true">{item.emoji}</span></button>;
          })}
        </div>
      </div>}

      {constellation && <Button onClick={reveal} disabled={selectedIds.length !== 3 || loading}>{loading ? "Le rêve arrive…" : "Ouvrir le rêve"}</Button>}
    </section>
  );
}
