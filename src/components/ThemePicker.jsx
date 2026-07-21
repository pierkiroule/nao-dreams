import { themes } from "../data/themes";
export default function ThemePicker({ selected, onChange }) { return <div className="theme-grid">{themes.map((item) => <button key={item.id} className={`theme-chip ${selected.includes(item.id) ? "selected" : ""}`} onClick={() => onChange(item.id)} aria-pressed={selected.includes(item.id)}>{item.label}</button>)}</div>; }
