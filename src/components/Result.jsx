export default function Result({ items, onRestart }) {
  return <main className="screen result-screen">
    <p className="eyebrow">Ta floraison</p>
    <div className="result-flower" aria-hidden="true">{items.map((item) => <i key={item.id}>{item.emoji}</i>)}</div>
    <blockquote>{items.map((item) => item.text).join(" ")}</blockquote>
    <p className="authorship">Ce texte est né uniquement des pétales que tu as choisis.</p>
    <button className="primary" onClick={onRestart}>Confier un autre souci <span aria-hidden="true">↺</span></button>
  </main>;
}
