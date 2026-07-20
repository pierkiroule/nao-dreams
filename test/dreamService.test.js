import test from "node:test";
import assert from "node:assert/strict";
import { constellations, getConstellation } from "../src/data/resources.js";
import { FORBIDDEN_TERMS, generateDream } from "../src/services/dreamService.js";

const forest = constellations[0];
const mushroom = forest.emojis[0];

test("every constellation exposes exactly twelve of its own symbols", () => {
  const ocean = getConstellation("ocean");
  assert.equal(forest.emojis.length, 12);
  assert.equal(ocean.emojis.length, 12);
  assert.equal(forest.emojis.some((item) => item.id.startsWith("ocean-")), false);
});

test("one symbol produces a deterministic, short, non-interpretive dream", () => {
  const first = generateDream({ chosenEmoji: mushroom, constellation: forest.emojis, seed: "fixed-seed" });
  const second = generateDream({ chosenEmoji: mushroom, constellation: forest.emojis, seed: "fixed-seed" });
  assert.deepEqual(first, second);
  assert.match(first.text, /🍄/);
  assert.ok(first.text.split(/\s+/).length <= 70);
  FORBIDDEN_TERMS.forEach((term) => assert.doesNotMatch(first.text.toLowerCase(), new RegExp(term)));
});

test("the same symbol can receive different narrative roles and seeds vary scenes", () => {
  const texts = new Set(Array.from({ length: 40 }, (_, index) => generateDream({ chosenEmoji: mushroom, constellation: forest.emojis, seed: `seed-${index}` }).text));
  assert.ok(texts.size > 10);
  assert.ok([...texts].some((text) => text.startsWith("🍄")));
  assert.ok([...texts].some((text) => text.includes("à l'intérieur de 🍄") || text.includes("Sous 🍄")));
});

test("generation works without optional metadata and makes no external request", () => {
  const dream = generateDream({ chosenEmoji: { id: "alone", emoji: "🪁" }, constellation: [], seed: "metadata-free" });
  assert.match(dream.text, /🪁/);
});
