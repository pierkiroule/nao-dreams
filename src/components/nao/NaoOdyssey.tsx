import {useEffect,useMemo,useRef,useState} from "react";
import {DREAM_CARDS} from "../../data/dreamCultures";
import {saveLocalDream} from "../../services/dreamSyncService";
import TestEnvironmentPanel from "../TestEnvironmentPanel";
import Dreamcatcher from "./Dreamcatcher";
import DreamReading from "./DreamReading";
import DreamWeaving from "./DreamWeaving";
import GrandOBackground from "./GrandOBackground";
import NaoBoat from "./NaoBoat";
import NaoLogo from "./NaoLogo";
import "../../styles/nao.css";

type Culture={id:string;title:string;culture:string;emojis:string[];summary:string};
type Phase="entry"|"choosing"|"weaving"|"reading"|"released";
type Props={onLeave?:()=>void};

const featured=DREAM_CARDS.slice(0,12) as Culture[];
function makeDream(cultures:Culture[]){const [first,second,third]=cultures;return {title:`L’écho de ${first.emojis[0]} ${second.emojis[0]} ${third.emojis[0]}`,text:`Trois signes ont traversé la même nuit. ${first.emojis[0]} a ouvert un passage, ${second.emojis[0]} en a gardé la mémoire, puis ${third.emojis[0]} a guidé le voyage jusqu’à une rive inconnue. Au matin, il ne restait qu’un fil lumineux entre ces trois horizons, assez solide pour porter le rêve plus loin.`}}

export default function NaoOdyssey({onLeave}:Props){
 const[phase,setPhase]=useState<Phase>("entry"),[selected,setSelected]=useState<Culture[]>([]),[departing,setDeparting]=useState(false),saved=useRef(false),dream=useMemo(()=>selected.length===3?makeDream(selected):null,[selected]);
 const toggle=(culture:Culture)=>setSelected(current=>current.some(item=>item.id===culture.id)?current.filter(item=>item.id!==culture.id):current.length<3?[...current,culture]:current);
 useEffect(()=>{if(selected.length!==3||phase!=="choosing")return;const id=setTimeout(()=>setPhase("weaving"),380);return()=>clearTimeout(id)},[selected,phase]);
 useEffect(()=>{if(phase!=="weaving")return;const id=setTimeout(()=>setPhase("reading"),2200);return()=>clearTimeout(id)},[phase]);
 useEffect(()=>{if(phase!=="reading"||!dream||saved.current)return;saved.current=true;saveLocalDream({title:dream.title,dreamText:dream.text,cultureIds:selected.map(item=>item.id)}).catch(()=>{})},[phase,dream,selected]);
 const release=()=>{setDeparting(true);setTimeout(()=>setPhase("released"),900)};
 let content;
 if(phase==="entry")content=<main className="grand-o-entry">
  <NaoLogo/>
  <div className="odyssey-intro">
   <div className="boat-horizon"><NaoBoat size="hero"/></div>
   <h1>L’Odyssée de Nao Dream</h1>
   <p className="odyssey-subtitle">La petite noix qui voyage de main en main pour réveiller les rêves du monde <span>•°</span></p>
   <div className="odyssey-story">
    <p>Choisis trois emojis qui t’inspirent. De leur tissage émergera un rêve unique, en écho aux mythes, aux légendes et aux traditions du monde.</p>
    <p>Une fois le rêve révélé, découvre les récits culturels qui l’ont inspiré.</p>
   </div>
   <button className="enter-ocean" onClick={()=>setPhase("choosing")}><span>Entrer dans le Grand O•°</span><i/></button>
  </div>
  <details className="system-tide"><summary>État du courant</summary><TestEnvironmentPanel/></details>
  {onLeave&&<button className="leave-ocean" onClick={onLeave}>Explorer autrement</button>}
 </main>;
 else if(phase==="choosing")content=<Dreamcatcher cultures={featured} selected={selected} onToggle={toggle} onBack={()=>{setSelected([]);setPhase("entry")}}/>;
 else if(phase==="weaving")content=<DreamWeaving/>;
 else if(phase==="reading"&&dream)content=<div className={departing?"dream-departing":""}><DreamReading cultures={selected} title={dream.title} text={dream.text} onRelease={release}/></div>;
 else content=<main className="released-screen"><div className="released-bubble">○</div><NaoBoat size="medium" motion="depart"/><p>Nao reprend son voyage.</p><button onClick={()=>{saved.current=false;setSelected([]);setPhase("entry")}}>Revenir au rivage</button></main>;
 return <div className={`nao-odyssey phase-${phase}`}><GrandOBackground/>{content}</div>
}
