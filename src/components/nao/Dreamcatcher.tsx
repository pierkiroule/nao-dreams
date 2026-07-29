import CultureNode from "./CultureNode";
import DreamBubble from "./DreamBubble";

type Culture={id:string;title:string;culture:string;emojis:string[];summary:string};
type Props={cultures:Culture[];selected:Culture[];onToggle:(culture:Culture)=>void;onBack:()=>void};
export default function Dreamcatcher({cultures,selected,onToggle,onBack}:Props){
 const points=cultures.map((_,index)=>{const angle=-Math.PI/2+index*Math.PI*2/cultures.length;return{x:50+42*Math.cos(angle),y:50+42*Math.sin(angle)}});
 const selectedPoints=selected.map(culture=>points[cultures.findIndex(item=>item.id===culture.id)]).filter(Boolean);
 return <main className="dreamcatcher-screen"><button className="quiet-back" onClick={onBack} aria-label="Retour vers le Grand O">←</button><div className="flow-copy"><p>Choisis trois emojis.</p><small>Laisse-toi guider par ceux qui t’inspirent.</small></div><div className="dreamcatcher" role="group" aria-label="Emojis d’inspiration"><svg viewBox="0 0 100 100" aria-hidden="true"><polyline points={selectedPoints.map(p=>`${p.x},${p.y}`).join(" ")} className={selectedPoints.length===3?"complete":""}/>{selectedPoints.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r=".7"/>)}</svg>{cultures.map((culture,index)=><CultureNode key={culture.id} culture={culture} selected={selected.some(item=>item.id===culture.id)} position={points[index]} onSelect={onToggle}/>)}<DreamBubble size="medium" intensity={selected.length/3}><span className="echo-count">{[1,2,3].map(n=><i className={selected.length>=n?"lit":""} key={n}>{n}</i>)}</span></DreamBubble></div></main>
}
