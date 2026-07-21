import assert from "node:assert/strict";
import test from "node:test";
import { constellations, selectConstellation } from "../src/data/constellations.js";
import { buildDreamPrompt } from "../src/utils/buildDreamPrompt.js";
import { buildIntuitionChoices, getDreamEffect, selectIntuitionTarget } from "../src/utils/dreamScene.js";
import { createSeededJourney } from "../src/services/localDreamRepository.js";
import { generateLocalDream } from "../src/utils/generateLocalDream.js";

test("six constellations each offer twelve single-choice dream signs", () => { assert.equal(constellations.length, 6); constellations.forEach((constellation) => assert.equal(constellation.emojis.length, 12)); });
test("every demo journey is born with an administrator seed contribution", () => { const data=createSeededJourney({seedEmoji:"🚪",seedLabel:"Ce qui s'ouvre",openingScene:"Une porte flotte.",revealThreshold:10}); assert.equal(data.journey.contributionCount,1);assert.equal(data.journey.status,"active");assert.equal(data.contributions.length,1);assert.equal(data.seed.isSeed,true);assert.equal(data.seed.openingScene,"Une porte flotte."); });
test("intuition can target the seed and includes it in choices", () => { const target={id:"seed",emoji:"🚪",label:"Ce qui s'ouvre",constellationId:"passages"};assert.equal(selectIntuitionTarget([target]),target);assert.ok(buildIntuitionChoices(target,constellations[1]).some((choice)=>choice.symbol==="🚪")); });
test("a sign transforms the inherited scene with an immediate consequence", () => { const [, consequence]=getDreamEffect({symbol:"🐋",label:"La présence immense"});assert.match(consequence,/baleine/); });
test("local reveal composes collected signs into a short dream", () => { const dream=generateLocalDream([{emoji:"🌙"},{emoji:"🚪"},{emoji:"🦋"}]);assert.match(dream.text,/🌙/);assert.match(dream.text,/🚪/);assert.match(dream.text,/🦋/); });
test("future AI prompt preserves private echoes without interpretation", () => { const prompt=buildDreamPrompt([{emoji:"🌙",label:"La présence nocturne",echo:"refuge"}]);assert.match(prompt,/aucune explication psychologique/);assert.match(prompt,/refuge/); });
test("constellation selection remains stable", () => { assert.equal(selectConstellation(7).id,selectConstellation(7).id); });
