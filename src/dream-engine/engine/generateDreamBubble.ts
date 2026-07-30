import emojiLibrary from "../data/emojis/library.json" with {type:"json"};
import genericFragments from "../data/generic/fragments.json" with {type:"json"};
import pairResonances from "../data/relations/pair-resonances.json" with {type:"json"};
import triadResonances from "../data/relations/triad-resonances.json" with {type:"json"};
import patterns from "../data/patterns/dream-patterns.json" with {type:"json"};
import type {DreamBubble,DreamFragment,EmojiDreamEntry,FragmentAlignment} from "../types/dream.ts";
import {applyRecencyPenalty} from "./avoidRepetition.ts";
import {seededId,seededRandom} from "./seededRandom.ts";
import {validateDreamBubble} from "./validateDreamBubble.ts";

export const DREAM_LIBRARY_VERSION=2;
const entries=emojiLibrary as EmojiDreamEntry[];
const generic=genericFragments as DreamFragment[];
const pairs=pairResonances as {pair:string[];fragments:DreamFragment[]}[];
const triads=triadResonances as {triad:string[];fragments:DreamFragment[]}[];
export const DREAM_EMOJIS=entries.map(({id,emoji,label})=>({id,emoji,label}));
export const DREAM_FRAGMENT_LIBRARY=[...entries.flatMap(entry=>entry.fragments),...generic,...pairs.flatMap(pair=>pair.fragments),...triads.flatMap(triad=>triad.fragments)];
export const DREAM_PATTERNS=patterns as {id:string;kinds:DreamFragment["kind"][];alignments:FragmentAlignment[]}[];

type Options={emojiIds:[string,string,string]|string[];seed:string;history?:string[];locale?:"fr";disablePairResonance?:boolean;patternId?:string;createdAt?:string};
const pairKey=(ids:string[])=>[...ids].sort().join("|");
function weightedPick(pool:DreamFragment[],history:string[],random:()=>number,used:Set<string>,previous?:DreamFragment){const viable=pool.filter(item=>!used.has(item.id)&&!(previous?.grammaticalShape==="dialogue"&&item.grammaticalShape==="dialogue")&&!(previous?.grammaticalShape==="enumeration"&&item.grammaticalShape==="enumeration"));const weighted=applyRecencyPenalty(viable.length?viable:pool.filter(item=>!used.has(item.id)),history);let total=weighted.reduce((sum,item)=>sum+item.weight,0),cursor=random()*total;for(const item of weighted){cursor-=item.weight;if(cursor<=0)return item.fragment}return weighted.at(-1)?.fragment}
export function generateDreamBubble(options:Options):DreamBubble{if(options.locale&&options.locale!=="fr")throw new Error("Seule la bibliothèque française est disponible.");if(options.emojiIds.length!==3||new Set(options.emojiIds).size!==3)throw new Error("Trois signes différents sont requis.");const emojiIds=options.emojiIds as [string,string,string],chosen=emojiIds.map(id=>entries.find(entry=>entry.id===id));if(chosen.some(entry=>!entry))throw new Error("Signe onirique inconnu.");const random=seededRandom(options.seed),history=options.history||[],pattern=options.patternId?DREAM_PATTERNS.find(item=>item.id===options.patternId):DREAM_PATTERNS[Math.floor(random()*DREAM_PATTERNS.length)];if(!pattern)throw new Error("Patron onirique inconnu.");const selected:DreamFragment[]=[],used=new Set<string>();
 // Garantit une voix propre à chaque signe, dans l’ordre choisi.
 chosen.forEach((entry,index)=>{const desired=pattern.kinds[Math.min(index+1,pattern.kinds.length-2)],pool=entry!.fragments.filter(fragment=>fragment.kind===desired),fragment=weightedPick(pool.length?pool:entry!.fragments,history,random,used,selected.at(-1));if(fragment){selected.push({...fragment,source:"emoji"});used.add(fragment.id)}});
 const availablePairs=options.disablePairResonance?[]:pairs.filter(item=>emojiIds.some((id,i)=>emojiIds.slice(i+1).some(other=>pairKey(item.pair)===pairKey([id,other]))));if(availablePairs.length){const relation=availablePairs[Math.floor(random()*availablePairs.length)],fragment=weightedPick(relation.fragments,history,random,used,selected.at(-1));if(fragment){selected.push({...fragment,source:"pair"});used.add(fragment.id)}}
 const triad=triads.find(item=>pairKey(item.triad)===pairKey(emojiIds));if(triad&&random()<.45){const fragment=weightedPick(triad.fragments,history,random,used,selected.at(-1));if(fragment){selected.push({...fragment,source:"triad"});used.add(fragment.id)}}
 for(const kind of pattern.kinds){if(selected.length>=pattern.kinds.length)break;const own=chosen.flatMap(entry=>entry!.fragments).filter(fragment=>fragment.kind===kind),fallback=generic.filter(fragment=>fragment.kind===kind),pool=own.length?own:fallback.length?fallback:chosen.flatMap(entry=>entry!.fragments);const fragment=weightedPick(pool,history,random,used,selected.at(-1));if(fragment){selected.push({...fragment,source:own.includes(fragment)?"emoji":"generic"});used.add(fragment.id)}}
 // Replace the ending with an open trace and arrange fragments around the pattern's breath.
 const tracePool=[...chosen.flatMap(entry=>entry!.fragments),...generic].filter(fragment=>fragment.kind==="trace");const trace=weightedPick(tracePool,history,random,used,selected.at(-1));if(trace){if(selected.length>=pattern.kinds.length)selected.pop();selected.push({...trace,source:generic.includes(trace)?"generic":"emoji"})}
 const fragments=selected.slice(0,Math.max(7,Math.min(11,pattern.kinds.length)));const bubble:DreamBubble={id:seededId(options.seed),seed:options.seed,emojiIds,fragments,fragmentIds:fragments.map(fragment=>fragment.id),patternId:pattern.id,alignments:pattern.alignments.slice(0,fragments.length),libraryVersion:DREAM_LIBRARY_VERSION,createdAt:options.createdAt||new Date().toISOString()};return validateDreamBubble(bubble)}
