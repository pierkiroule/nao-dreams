import assert from "node:assert/strict";
import test from "node:test";
import { constellations, selectConstellation } from "../src/data/constellations.js";
import { buildDreamPrompt } from "../src/utils/buildDreamPrompt.js";
import { getDreamEffect, initialScene, nextScene } from "../src/utils/dreamScene.js";
import { generateLocalDream } from "../src/utils/generateLocalDream.js";

test("six constellations each offer twelve single-choice dream signs", () => { assert.equal(constellations.length, 6); constellations.forEach((constellation) => { assert.equal(constellation.emojis.length, 12); constellation.emojis.forEach((emoji) => { assert.ok(emoji.symbol); assert.ok(emoji.label); assert.ok(emoji.possibleRoles.length); }); }); });
test("constellation selection is stable from contribution count", () => { assert.equal(selectConstellation(7).id, selectConstellation(7).id); assert.notEqual(selectConstellation(0).id, selectConstellation(1).id); });
test("a sign transforms the inherited scene with an immediate consequence", () => { const [, consequence] = getDreamEffect({ symbol:"🐋", label:"La présence immense" }); assert.match(initialScene(), /porte au milieu de la mer/); assert.match(consequence, /baleine/); assert.match(nextScene(consequence), /baleine/); });
test("local reveal composes collected signs into a short dream", () => { const dream=generateLocalDream([{emoji:"🌙"},{emoji:"🚪"},{emoji:"🦋"}]); assert.match(dream.text,/🌙/);assert.match(dream.text,/🚪/);assert.match(dream.text,/🦋/);assert.ok(dream.title); });
test("future AI prompt preserves private echoes without interpretation", () => { const prompt=buildDreamPrompt([{emoji:"🌙",label:"La présence nocturne",echo:"refuge"}]); assert.match(prompt,/250 à 400 mots/);assert.match(prompt,/aucune explication psychologique/);assert.match(prompt,/refuge/); });
