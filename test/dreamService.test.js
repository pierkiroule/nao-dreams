import assert from "node:assert/strict";
import test from "node:test";
import { networkEmojis } from "../src/data/resources.js";
import { FORBIDDEN_TERMS, generateCoCreativeDream, generateDream, generateDreamTitles } from "../src/services/dreamService.js";

test("the poetic network contains exactly sixteen selectable symbols", () => {
  assert.equal(networkEmojis.length, 16);
  assert.equal(new Set(networkEmojis.map(({ id }) => id)).size, 16);
});

test("dream titles are three deterministic, forward-looking invitations", () => {
  const first = generateDreamTitles({ emojis: networkEmojis.slice(0, 4), seed: "fixed-seed" });
  assert.deepEqual(first, generateDreamTitles({ emojis: networkEmojis.slice(0, 4), seed: "fixed-seed" }));
  assert.equal(first.length, 3);
  assert.match(first.join(" "), /horizon|départ|venir|souffle|jour|grandir/);
});

test("co-created dream integrates a title, resonance, shared traces and sensory language", () => {
  const dream = generateCoCreativeDream({ emojis: networkEmojis.slice(0, 3), title: "Le chemin de la lune vers l'horizon", resonance: "une porte bleue", seedCount: 2, seed: "fixed-seed" });
  assert.match(dream.text, /Le chemin de la lune vers l'horizon/);
  assert.match(dream.text, /2 traces de rêveurs précédents/);
  assert.match(dream.text, /une porte bleue/);
  assert.match(dream.text, /odeur|air|souffle|lumière|sol|pas/);
  FORBIDDEN_TERMS.forEach((term) => assert.equal(dream.text.toLowerCase().includes(term), false));
});

test("one symbol produces a deterministic, grounded dream", () => {
  const first = generateDream({ chosenEmoji: networkEmojis[0], constellation: networkEmojis.slice(0, 2), seed: "metadata-free" });
  const second = generateDream({ chosenEmoji: networkEmojis[0], constellation: networkEmojis.slice(0, 2), seed: "metadata-free" });
  assert.deepEqual(first, second);
  assert.match(first.text, /🌙/);
  assert.ok(first.text.length < 700);
});
