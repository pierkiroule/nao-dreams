import test from "node:test";
import assert from "node:assert/strict";
import { DREAM_CARDS } from "../src/data/dreamCultures.js";
import { scoreDreamCultureCard, selectDreamCultureCard } from "../src/lib/resonanceEngine.js";
import { buildResonanceText, RESONANCE_TEMPLATES } from "../src/lib/resonanceText.js";
import { RESEARCH_PRINCIPLES, RESEARCH_REFERENCES } from "../src/data/researchReferences.js";

const input={emojis:["🌊"],tags:["voyage","passage"]};
const journey={scanCount:5,recentCardIds:[],discoveredRegions:["Asie"],discoveredCultures:[],lastCategory:"vision"};

test("la bibliothèque contient 36 cartes complètes",()=>{assert.equal(DREAM_CARDS.length,36);for(const card of DREAM_CARDS){assert.ok(card.title&&card.fullStory&&card.culturalContext);assert.ok(card.symbols.length>=3);assert.ok(card.sourceNotes.length>=2)}});
test("le score valorise les tags et emojis correspondants",()=>{const matching=DREAM_CARDS.find(c=>c.id==="barque-reves");const other=DREAM_CARDS.find(c=>c.id==="japon-baku");assert.ok(scoreDreamCultureCard(matching,input,journey)>scoreDreamCultureCard(other,input,journey))});
test("les cinq cartes récentes sont exclues",()=>{const first=selectDreamCultureCard(input,journey,DREAM_CARDS);const selected=selectDreamCultureCard(input,{...journey,recentCardIds:[first.id]},DREAM_CARDS);assert.notEqual(selected.id,first.id)});
test("une région nouvelle reçoit le bonus de diversité",()=>{const card=DREAM_CARDS.find(c=>c.id==="barque-reves");assert.ok(scoreDreamCultureCard(card,input,{...journey,discoveredRegions:[]})>scoreDreamCultureCard(card,input,{...journey,discoveredRegions:[card.region]}))});
test("le résultat reste stable pour une contribution donnée",()=>{assert.equal(selectDreamCultureCard(input,journey,DREAM_CARDS).id,selectDreamCultureCard(input,journey,DREAM_CARDS).id)});
test("les phrases restent locales et prudentes",()=>{assert.equal(RESONANCE_TEMPLATES.length,36);const text=buildResonanceText(input,DREAM_CARDS[0]);assert.doesNotMatch(text,/signifie|prouve|révèle que tu es/i)});
test("la démarche anthropologique expose ses repères et ses limites",()=>{assert.equal(RESEARCH_REFERENCES.length,6);assert.ok(RESEARCH_PRINCIPLES.length>=4);assert.ok(RESEARCH_REFERENCES.every(reference=>reference.author&&reference.work&&reference.focus))});
