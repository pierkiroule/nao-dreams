import test from "node:test";
import assert from "node:assert/strict";
import { getLinkVisualStrength, getNetworkPositions, getVisualScale } from "../src/components/graphMath.js";
import { TRANSITION_STATES, nextTransitionState } from "../src/components/graphTransition.js";

test("resonance scale is neutral when absent and bounded when supplied", () => {
  assert.equal(getVisualScale(), 1);
  assert.equal(getVisualScale(-4), 0.92);
  assert.equal(getVisualScale(4), 1.1);
});

test("cooccurrence strength uses a bounded logarithmic mapping", () => {
  assert.deepEqual(getLinkVisualStrength(), { opacity: 0.2, width: 1 });
  const visual = getLinkVisualStrength(10, 100);
  assert.ok(visual.opacity > 0.18 && visual.opacity < 0.53);
  assert.ok(visual.width > 1 && visual.width < 2.3);
});

test("network positions are deterministic and remain within the scene", () => {
  const first = getNetworkPositions("network", "parent", 2);
  assert.deepEqual(first, getNetworkPositions("network", "parent", 2));
  assert.notDeepEqual(first, getNetworkPositions("network", "other", 2));
  assert.equal(first.length, 6);
  first.forEach(({ left, top }) => { assert.ok(left >= 12 && left <= 88); assert.ok(top >= 12 && top <= 86); });
});

test("transition machine advances through the non-interactive phases", () => {
  assert.equal(nextTransitionState(TRANSITION_STATES.FOCUSING), TRANSITION_STATES.ENTERING);
  assert.equal(nextTransitionState(TRANSITION_STATES.ENTERING), TRANSITION_STATES.REVEALING);
  assert.equal(nextTransitionState(TRANSITION_STATES.REVEALING), TRANSITION_STATES.IDLE);
});
