export type DreamFragmentKind="threshold"|"place"|"presence"|"movement"|"sensation"|"matter"|"voice"|"anomaly"|"emotion"|"memory"|"transformation"|"trace"|"silence";
export type GrammaticalShape="sentence"|"nominal"|"dialogue"|"enumeration"|"ellipsis";
export type FragmentAlignment="left"|"center"|"right"|"soft-left"|"soft-right";
export type DreamFragment={id:string;text:string;kind:DreamFragmentKind;themes:string[];atmosphere:string[];intensity:1|2|3|4|5;rarity?:1|2|3|4|5;grammaticalShape:GrammaticalShape;compatibleBefore?:DreamFragmentKind[];compatibleAfter?:DreamFragmentKind[];avoidThemes?:string[];sourceEmoji?:string;source?:"emoji"|"pair"|"triad"|"generic"};
export type EmojiDreamEntry={id:string;emoji:string;label:string;families:string[];themes:string[];atmospheres:string[];fragments:DreamFragment[];affinities?:string[];tensions?:string[];avoidWith?:string[]};
export type DreamBubble={id:string;seed:string;emojiIds:[string,string,string];fragmentIds:string[];fragments:DreamFragment[];patternId:string;alignments:FragmentAlignment[];libraryVersion:number;createdAt:string};
export type StoredDreamBubble={id:string;nutId?:string;sessionId:string;emojiIds:[string,string,string];seed:string;fragmentIds:string[];patternId:string;createdAt:string;revealedCount:number;completedAt?:string;resonanceType?:string;resonanceWord?:string;releasedAt?:string};
export type WeightedDreamFragment={fragment:DreamFragment;weight:number};
