type Culture={id:string;title:string;culture:string;emojis:string[];summary:string};
type Props={culture:Culture;selected:boolean;position:{x:number;y:number};onSelect:(culture:Culture)=>void};
export default function CultureNode({culture,selected,position,onSelect}:Props){return <button className={`culture-node${selected?" selected":""}`} style={{"--node-x":`${position.x}%`,"--node-y":`${position.y}%`} as React.CSSProperties} onClick={()=>onSelect(culture)} aria-pressed={selected} aria-label={`Choisir ${culture.emojis[0]}`}><span aria-hidden="true">{culture.emojis[0]}</span></button>}
