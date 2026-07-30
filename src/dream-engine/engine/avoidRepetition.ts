import type {DreamFragment,WeightedDreamFragment} from "../types/dream.ts";
export function applyRecencyPenalty(candidates:DreamFragment[],recentFragmentIds:string[]):WeightedDreamFragment[]{return candidates.map(fragment=>{const index=recentFragmentIds.lastIndexOf(fragment.id);return{fragment,weight:index<0?1:Math.max(.03,(recentFragmentIds.length-index)/recentFragmentIds.length*.12)}})}
