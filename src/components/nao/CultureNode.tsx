type Culture = {
  id: string;
  culture: string;
  emojis: string[];
};

type Props = {
  culture: Culture;
  position: { x: number; y: number };
  delay: number;
  onSelect: (culture: Culture) => void;
};

export default function CultureNode({ culture, position, delay, onSelect }: Props) {
  const name = culture.culture.split(/[,(]/)[0].trim();

  return (
    <button
      className="culture-node"
      style={{
        "--node-x": `${position.x}%`,
        "--node-y": `${position.y}%`,
        "--float-delay": `${delay}s`,
      } as React.CSSProperties}
      onClick={() => onSelect(culture)}
      aria-label={`Choisir ${culture.emojis[0]} pour découvrir une ressource de ${name}`}
    >
      <span aria-hidden="true">{culture.emojis[0]}</span>
    </button>
  );
}
