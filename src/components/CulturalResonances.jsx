import { getCulturalResonances } from "../data/culturalResonances";

export default function CulturalResonances({ choices }) {
  const references = getCulturalResonances(choices);

  if (!references.length) return null;

  return (
    <section className="cultural-resonances" aria-labelledby="cultural-resonances-title">
      <div className="cultural-resonances__heading">
        <p>Autour de tes symboles</p>
        <h2 id="cultural-resonances-title">Résonances culturelles</h2>
      </div>
      <div className="cultural-resonances__list">
        {references.map((reference, index) => (
          <article className="cultural-resonance" key={`${reference.emoji}-${reference.tradition}-${index}`}>
            <span className="cultural-resonance__emoji" aria-hidden="true">{reference.emoji}</span>
            <div>
              <h3>{reference.tradition}</h3>
              <p>{reference.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
