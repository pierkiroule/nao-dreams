export default function ChoiceGrid({
  title,
  category,
  choices,
  selectedValue,
  onSelect,
}) {
  return (
    <section className="choice-section">
      <h2>{title}</h2>

      <div className="choice-grid">
        {choices.map((choice) => {
          const selected = selectedValue === choice.id;

          return (
            <button
              key={choice.id}
              type="button"
              className={`choice-button ${selected ? "is-selected" : ""}`}
              onClick={() => onSelect(category, choice.id)}
            >
              {choice.emoji} {choice.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
