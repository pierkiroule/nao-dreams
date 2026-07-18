export default function FloatingDreamBubble({
  choice,
  selected,
  position,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={`dream-orb ${selected ? "is-selected" : ""}`}
      style={{
        width: `${position.size}px`,
        height: `${position.size}px`,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      aria-pressed={selected}
      aria-label={`Choisir ${choice.label}`}
      onClick={() => onSelect(choice.selectionValue)}
    >
      <span className="dream-orb-emoji" aria-hidden="true">
        {choice.emoji}
      </span>

      <span className="dream-orb-label">
        {choice.label}
      </span>
    </button>
  );
}
