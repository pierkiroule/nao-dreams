import { movements } from "../data/movements";
export default function MovementPicker({ selected, onChange }) { return <div className="picker-grid">{movements.map((item) => <button key={item.id} className={`option-card ${selected === item.id ? "selected" : ""}`} onClick={() => onChange(item.id)} aria-pressed={selected === item.id}><span>{item.icon}</span>{item.label}</button>)}</div>; }
