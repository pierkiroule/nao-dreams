import test from "node:test";
import assert from "node:assert/strict";
import { dreamPassers, getNextPasser } from "../src/data/dreamPassers.js";

test("the twelve dream passers form a closed cycle", () => {
  assert.equal(dreamPassers.length, 12);
  assert.equal(getNextPasser(1).name, "Basile");
  assert.equal(getNextPasser(12).name, "Aube");
});
