import test from "node:test";
import assert from "node:assert/strict";
import {EMOJIS} from "../src/data/dreamCultures.js";
import {PROJECTIVE_DREAM_PATTERNS_COUNT,fillProjectiveDream,generateProjectiveDream} from "../src/lib/projectiveDreamEngine.js";

test("trois emojis produisent toujours le même rêve structuré",()=>{const sequence=["🌊","🦋","🌙"],first=generateProjectiveDream(sequence),second=generateProjectiveDream(sequence);assert.deepEqual(first,second);assert.equal(first.emojiSequence.join(""),sequence.join(""));assert.equal(first.parts.length,first.gaps.length+1);assert.ok(first.gaps.length>=4);assert.ok(first.gaps.every(gap=>gap.choices.length===3&&gap.prompt))});
test("chaque emoji disponible peut nourrir un rêve",()=>{for(let index=0;index<EMOJIS.length;index++){const sequence=[EMOJIS[index],EMOJIS[(index+1)%EMOJIS.length],EMOJIS[(index+2)%EMOJIS.length]],dream=generateProjectiveDream(sequence);assert.ok(dream.title);assert.ok(dream.parts.join(" ").length>120);assert.equal(dream.gaps.length,4);assert.ok(dream.gaps.every(gap=>gap.choices.length===3))}});
test("les réponses personnalisent le texte sans modifier sa structure",()=>{const dream=generateProjectiveDream(["🚪","🌙","🌊"]),filled=fillProjectiveDream(dream,["REVENIR","de velours","Où vas-tu ?","J’attends"]);assert.match(filled,/REVENIR/);assert.match(filled,/de velours/);assert.doesNotMatch(filled,/undefined/)});
test("les trous peuvent rester ouverts",()=>{const dream=generateProjectiveDream(["🌳","🪶","✨"]);assert.match(fillProjectiveDream(dream,[]),/…/)});
test("le moteur refuse une séquence incomplète ou répétée",()=>{assert.throws(()=>generateProjectiveDream(["🌊","🌙"]),/Trois emojis différents/);assert.throws(()=>generateProjectiveDream(["🌊","🌊","🌙"]),/Trois emojis différents/)});
test("plusieurs architectures de rêve sont disponibles",()=>assert.ok(PROJECTIVE_DREAM_PATTERNS_COUNT>=6));
