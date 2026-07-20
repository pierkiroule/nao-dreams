import assert from "node:assert/strict";
import test from "node:test";
import { constellations, selectConstellation } from "../src/data/constellations.js";
import { buildDreamPrompt } from "../src/utils/buildDreamPrompt.js";
import { generateLocalDream } from "../src/utils/generateLocalDream.js";

test("six constellations each offer twelve single-choice dream signs", () => {
  assert.equal(constellations.length, 6);
  constellations.forEach((constellation) => {
    assert.equal(constellation.emojis.length, 12);
    constellation.emojis.forEach((emoji) => {
      assert.ok(emoji.symbol);
      assert.ok(emoji.label);
      assert.ok(emoji.possibleRoles.length);
    });
  });
});

test("constellation selection is stable from the contribution count", () => {
  assert.equal(selectConstellation(7).id, selectConstellation(7).id);
  assert.notEqual(selectConstellation(0).id, selectConstellation(1).id);
});

test("local reveal composes the collected signs into a short dream", () => {
  const dream = generateLocalDream([{ emoji: "🌙" }, { emoji: "🚪" }, { emoji: "🦋" }]);
  assert.match(dream.text, /🌙/);
  assert.match(dream.text, /🚪/);
  assert.match(dream.text, /🦋/);
  assert.ok(dream.title);
});

test("future AI prompt requests safe, open-ended surreal narration", () => {
  const prompt = buildDreamPrompt([{ emoji: "🌙", label: "La présence nocturne" }]);
  assert.match(prompt, /250 à 400 mots/);
  assert.match(prompt, /aucune explication psychologique/);
  assert.match(prompt, /🌙/);
});
