import SymbolPulse from "./SymbolPulse";
export default function BlackSail({ active = false }) { return <div className={`black-sail ${active ? "is-active" : ""}`}><SymbolPulse /></div>; }
