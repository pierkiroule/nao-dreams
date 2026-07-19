import test from "node:test";
import assert from "node:assert/strict";
import { MAX_REFLECTION_LENGTH, nextNarrativePhase, SELECTION_PROMPTS } from "../src/components/journeyNarrative.js";
import { resolveDreamPhrase } from "../src/services/dreamPhrases.js";

test("the narrative progresses through exactly three selections before revealing the trio", () => {
  assert.equal(nextNarrativePhase(0), "selecting_first");
  assert.equal(nextNarrativePhase(1), "selecting_second");
  assert.equal(nextNarrativePhase(2), "selecting_third");
  assert.equal(nextNarrativePhase(3), "revealing_trio");
  assert.equal(SELECTION_PROMPTS.length, 3);
});

test("the fallback dream phrase is stable, sensory, and does not instruct", () => {
  const phrase = resolveDreamPhrase(["ocean", "moon", "lantern"]);
  assert.equal(phrase, resolveDreamPhrase(["ocean", "moon", "lantern"]));
  assert.ok(phrase.split(/\s+/).length >= 8);
  assert.doesNotMatch(phrase.toLowerCase(), /respire|écris|ose|tu devrais/);
});

test("the private reflection limit is bounded", () => {
  assert.equal(MAX_REFLECTION_LENGTH, 1000);
});
