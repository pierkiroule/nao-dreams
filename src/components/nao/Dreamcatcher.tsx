import CultureNode from "./CultureNode";

type Culture = {
  id: string;
  culture: string;
  emojis: string[];
};

type Props = {
  cultures: Culture[];
  onSelect: (culture: Culture) => void;
  onBack: () => void;
};

const positions = [
  { x: 12, y: 18 }, { x: 36, y: 11 }, { x: 68, y: 17 }, { x: 88, y: 31 },
  { x: 18, y: 48 }, { x: 48, y: 39 }, { x: 75, y: 52 }, { x: 35, y: 67 },
  { x: 8, y: 78 }, { x: 60, y: 78 }, { x: 88, y: 73 }, { x: 44, y: 91 },
];

export default function Dreamcatcher({ cultures, onSelect, onBack }: Props) {
  return (
    <main className="dreamcatcher-screen">
      <button className="quiet-back" onClick={onBack} aria-label="Retour vers le Grand O">←</button>
      <div className="flow-copy">
        <p>Quelle image t’appelle&nbsp;?</p>
        <small>Choisis une seule bulle, sans chercher à l’interpréter.</small>
      </div>
      <div className="dreamcatcher floating-cultures" role="group" aria-label="Images ouvrant vers une ressource culturelle">
        {cultures.map((culture, index) => (
          <CultureNode
            key={culture.id}
            culture={culture}
            position={positions[index % positions.length]}
            delay={-(index * 1.7)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </main>
  );
}
