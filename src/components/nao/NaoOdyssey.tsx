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
function makeResonance(cultures:Culture[]){const [first,second,third]=cultures;return {title:`${first.emojis[0]} ${second.emojis[0]} ${third.emojis[0]} · Trois horizons en résonance`,text:`Entre « ${first.title} », « ${second.title} » et « ${third.title} », trois traditions se rencontrent sans se confondre. Laisse leurs images se rapprocher librement. Et cette nuit, ton imaginaire pourrait peut-être faire résonner ${first.emojis[0]} avec ${second.emojis[0]}, puis laisser ${third.emojis[0]} ouvrir un passage… Peut-être une figure, une sensation ou un mouvement apparaîtra-t-il. Il n’y a aucun rêve à trouver : accueille simplement ce qui vient, ou ne vient pas.`}}

export default function NaoOdyssey({onLeave}:Props){
 const[phase,setPhase]=useState<Phase>("entry"),[selected,setSelected]=useState<Culture[]>([]),[departing,setDeparting]=useState(false),saved=useRef(false),resonance=useMemo(()=>selected.length===3?makeResonance(selected):null,[selected]);
 const toggle=(culture:Culture)=>setSelected(current=>current.some(item=>item.id===culture.id)?current.filter(item=>item.id!==culture.id):current.length<3?[...current,culture]:current);
 useEffect(()=>{if(selected.length!==3||phase!=="choosing")return;const id=setTimeout(()=>setPhase("weaving"),380);return()=>clearTimeout(id)},[selected,phase]);
 useEffect(()=>{if(phase!=="weaving")return;const id=setTimeout(()=>setPhase("reading"),2200);return()=>clearTimeout(id)},[phase]);
 useEffect(()=>{if(phase!=="reading"||!resonance||saved.current)return;saved.current=true;saveLocalDream({title:resonance.title,dreamText:resonance.text,cultureIds:selected.map(item=>item.id)}).catch(()=>{})},[phase,resonance,selected]);
 const release=()=>{setDeparting(true);setTimeout(()=>setPhase("released"),900)};
 let content;
 if(phase==="entry")content=<main className="grand-o-entry"><NaoLogo/><div className="boat-horizon"><NaoBoat size="hero"/></div><section className="odyssey-introduction"><h1>L’Odyssée de Nao Dream</h1><p className="odyssey-subtitle">La petite noix qui voyage de main en main pour réveiller et relier les rêves du monde•°</p><div className="odyssey-story"><p>Chaque noix porte en elle une invitation.</p><p>Scanne-la. Choisis trois horizons oniriques parmi les grandes cultures du monde. Trois récits, mythes ou traditions réels se rapprochent alors pour montrer comment leurs figures, leurs images et leurs sensations peuvent résonner entre elles.</p><p>Nao n’écrit pas un rêve à ta place. De ces trois sources naissent des suggestions, directes ou indirectes, qui ouvrent des passages et stimulent ton propre imaginaire.</p><p>Et cette nuit, ton inconscient pourrait peut-être résonner avec une figure, une image, une sensation… sans rien imposer, sans rien dévoiler d’avance.</p><p>Puis laisse cette résonance rejoindre le Grand O•°, un océan vivant où les imaginaires se répondent, se croisent et continuent leur voyage.</p><p>Quand ton odyssée est terminée, passe la noix à quelqu’un d’autre.</p><p>Car les plus beaux rêves sont ceux qui voyagent de main en main.</p></div></section><button className="enter-ocean" onClick={()=>setPhase("choosing")}><span>Relier trois horizons</span><i/></button><details className="system-tide"><summary>État du courant</summary><TestEnvironmentPanel/></details>{onLeave&&<button className="leave-ocean" onClick={onLeave}>Explorer autrement</button>}</main>;
 else if(phase==="choosing")content=<Dreamcatcher cultures={featured} selected={selected} onToggle={toggle} onBack={()=>{setSelected([]);setPhase("entry")}}/>;
 else if(phase==="weaving")content=<DreamWeaving/>;
 else if(phase==="reading"&&resonance)content=<div className={departing?"dream-departing":""}><DreamReading cultures={selected} title={resonance.title} text={resonance.text} onRelease={release}/></div>;
 else content=<main className="released-screen"><div className="released-bubble">○</div><NaoBoat size="medium" motion="depart"/><p>Nao reprend son voyage.</p><button onClick={()=>{saved.current=false;setSelected([]);setPhase("entry")}}>Revenir au rivage</button></main>;
 return <div className={`nao-odyssey phase-${phase}`}><GrandOBackground/>{content}</div>
}
