import test from "node:test";
import assert from "node:assert/strict";
import {
  canContinue,
  isFinalPathComplete,
  parentPath,
} from "../src/components/dreamConstellationModel.js";

const branch = [
  { level: "theme", id: "metamorphose" },
  { level: "landscape", id: "metamorphose-ocean" },
  { level: "presence", id: "metamorphose-ocean-baleine" },
  { level: "object", id: "metamorphose-ocean-baleine-cle" },
];

test("le parcours ouvre le sous-graphe suivant en conservant son chemin", () => {
  assert.equal(isFinalPathComplete(branch), false);
  assert.deepEqual(branch.map((entry) => entry.level), ["theme", "landscape", "presence", "object"]);
});

test("le retour parent retire le dernier réseau sélectionné", () => {
  assert.deepEqual(parentPath(branch), branch.slice(0, -1));
});

test("le retour depuis les symboles terminaux conserve la branche", () => {
  const terminalPath = [...branch, { level: "atmosphere", id: "metamorphose-ocean-baleine-cle-brume" }];
  assert.deepEqual(parentPath(terminalPath), branch);
});

test("la continuation reste bloquée tant que le trio final et la sensation sont incomplets", () => {
  const twoSymbols = [...branch, { level: "atmosphere", id: "a" }, { level: "atmosphere", id: "b" }];
  const complete = [...twoSymbols, { level: "atmosphere", id: "c" }];
  assert.equal(canContinue(twoSymbols), false);
  assert.equal(canContinue(complete), false);
  assert.equal(canContinue([...complete, { level: "sensation", id: "apaisement" }]), true);
});
