const choices=["une image","une sensation","un mot","un silence"];
type Props={value:string;onChange:(value:string)=>void;onRelease:()=>void};
export default function ResonancePicker({value,onChange,onRelease}:Props){return <section className="resonance-picker"><h2>Qu’est-ce qui résonne encore&nbsp;?</h2><div>{choices.map(choice=><button key={choice} aria-pressed={value===choice} onClick={()=>onChange(value===choice?"":choice)}>{choice}</button>)}</div><button className="release-dream" onClick={onRelease}>Laisser ce rêve rejoindre le Grand O•° <span>○</span></button></section>}
