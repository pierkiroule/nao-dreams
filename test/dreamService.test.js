import assert from "node:assert/strict";
import test from "node:test";
import { networkEmojis } from "../src/data/resources.js";
import { FORBIDDEN_TERMS, generateCoCreativeDream, generateDream, generateDreamTitles } from "../src/services/dreamService.js";

test("the poetic network contains exactly sixteen selectable symbols", () => {
  assert.equal(networkEmojis.length, 16);
  assert.equal(new Set(networkEmojis.map(({ id }) => id)).size, 16);
});

test("dream titles are three deterministic invitations", () => {
  const first = generateDreamTitles({ emojis: networkEmojis.slice(0, 4), seed: "fixed-seed" });
  assert.deepEqual(first, generateDreamTitles({ emojis: networkEmojis.slice(0, 4), seed: "fixed-seed" }));
  assert.equal(first.length, 3);
});

test("co-created dream integrates a title, a resonance and previous seeds", () => {
  const dream = generateCoCreativeDream({ emojis: networkEmojis.slice(0, 3), title: "La chambre où la lune apprend à nager", resonance: "une porte bleue", seedCount: 2, seed: "fixed-seed" });
  assert.match(dream.text, /La chambre où la lune apprend à nager/);
  assert.match(dream.text, /2 graines/);
  assert.match(dream.text, /une porte bleue/);
  FORBIDDEN_TERMS.forEach((term) => assert.equal(dream.text.toLowerCase().includes(term), false));
});

test("one symbol produces a short non-interpretive dream", () => {
 const dream = generateDream({ chosenEmoji: networkEmojis[0], constellation: networkEmojis.slice(0, 2), seed: "metadata-free" });
 assert.match(dream.text, /🌙/);
 assert.ok(dream.text.length < 700);
});
