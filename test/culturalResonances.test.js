import test from "node:test";
import assert from "node:assert/strict";
import { culturalResonanceSymbols, getCulturalResonances } from "../src/data/culturalResonances.js";

test("the cultural base covers each local emoji-tag", () => {
  assert.deepEqual(culturalResonanceSymbols.sort(), ["🌊", "🌲", "🌙", "🔥", "🌷", "🕊️", "🫧", "🏠", "✨", "💗", "🪶", "🦁", "🌫️", "🐋", "🏮", "🗝️", "🦋"].sort());
});

test("a trio receives one short cultural reference per known symbol", () => {
  const references = getCulturalResonances([
    { id: "ocean", emoji: "🌊", text: "Océan" },
    { id: "lantern", emoji: "🏮", text: "Lanterne" },
    { id: "butterfly", emoji: "🦋", text: "Papillon" },
  ]);

  assert.equal(references.length, 3);
  assert.deepEqual(references.map(({ emoji }) => emoji), ["🌊", "🏮", "🦋"]);
  assert.ok(references.every(({ tradition, text }) => tradition && text.length > 45));
});
