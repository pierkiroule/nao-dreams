type Props = {
  choices: string[];
  value: string;
  onChange: (value: string) => void;
  onRelease: () => void;
};

export default function ResonancePicker({ choices, value, onChange, onRelease }: Props) {
  return (
    <section className="resonance-picker">
      <h2>Laquelle résonne le plus pour toi&nbsp;?</h2>
      <p>Il n’y a pas de bonne réponse. Choisis simplement celle qui retient ton attention.</p>
      <div className="oneiric-suggestions">
        {choices.map((choice, index) => (
          <button
            key={choice}
            aria-pressed={value === choice}
            onClick={() => onChange(choice)}
          >
            <small>SUGGESTION {index + 1}</small>
            {choice}
          </button>
        ))}
      </div>
      <button className="release-dream" disabled={!value} onClick={onRelease}>
        Confier cette résonance au Grand O•° <span>○</span>
      </button>
    </section>
  );
}
