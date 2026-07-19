import test from "node:test";
import assert from "node:assert/strict";
import { constellations } from "../src/data/resources.js";
import { generateDreamScenes } from "../src/services/dreamService.js";

test("every constellation holds exactly twelve surreal emoji records", () => {
  assert.ok(constellations.length >= 3);
  constellations.forEach((constellation) => {
    assert.equal(constellation.emojis.length, 12);
    constellation.emojis.forEach((item) => {
      assert.ok(item.keywords.length > 0);
      assert.ok(item.linked.length > 0);
      assert.ok(item.associations.length > 0);
    });
  });
});

test("a trio becomes three short, non-interpretive exquisite-corpse scenes", () => {
  const scenes = generateDreamScenes({ choices: constellations[0].emojis.slice(0, 3) });
  assert.equal(scenes.length, 3);
  assert.equal(new Set(scenes).size, 3);
  scenes.forEach((scene) => {
    assert.match(scene, /🍄.*🦊.*🦉/);
    assert.ok(scene.split(/\s+/).length < 35);
    assert.doesNotMatch(scene.toLowerCase(), /tu es|cela signifie|tu devrais|représente/);
  });
});
