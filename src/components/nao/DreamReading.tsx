import { useState } from "react";
import DreamBubble from "./DreamBubble";
import ResonancePicker from "./ResonancePicker";

type Culture = {
  id: string;
  title: string;
  culture: string;
  country: string;
  region: string;
  summary: string;
  fullStory: string;
  culturalContext: string;
  dreamFunction: string;
  symbols: string[];
  emojis: string[];
  sourceLabels: string[];
};

type Props = {
  culture: Culture;
  suggestions: string[];
  onRelease: (suggestion: string) => void;
};

export default function DreamReading({ culture, suggestions, onRelease }: Props) {
  const [selectedSuggestion, setSelectedSuggestion] = useState("");

  return (
    <main className="reading-screen resource-reading">
      <p className="ocean-whisper">Une ressource culturelle émerge.</p>
      <DreamBubble size="large" intensity={.72}>
        <article>
          <small>{culture.culture} · {culture.region}</small>
          <h1>{culture.title}</h1>
          <p>{culture.summary}</p>
          <footer>{culture.country}</footer>
        </article>
      </DreamBubble>

      <section className="cultural-resource" aria-labelledby="resource-details-title">
        <p className="step">LA RESSOURCE</p>
        <h2 id="resource-details-title">Découvrir avant de laisser résonner</h2>
        <h3>Le récit</h3>
        <p>{culture.fullStory}</p>
        <h3>Son contexte culturel</h3>
        <p>{culture.culturalContext}</p>
        <h3>La place du rêve</h3>
        <p>{culture.dreamFunction}</p>
        <p className="resource-symbols">{culture.symbols.join(" · ")}</p>
        <footer>Source&nbsp;: {culture.sourceLabels.join(" · ")}</footer>
      </section>

      <ResonancePicker
        choices={suggestions}
        value={selectedSuggestion}
        onChange={setSelectedSuggestion}
        onRelease={() => onRelease(selectedSuggestion)}
      />
    </main>
  );
}
