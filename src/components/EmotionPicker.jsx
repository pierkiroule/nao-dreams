import { emotions } from "../data/emotions";
export default function EmotionPicker({ selected, onChange }) { return <div className="picker-grid">{emotions.map((item) => <button key={item.id} className={`option-card ${selected.includes(item.id) ? "selected" : ""}`} onClick={() => onChange(item.id)} aria-pressed={selected.includes(item.id)}><span>{item.icon}</span>{item.label}</button>)}</div>; }
