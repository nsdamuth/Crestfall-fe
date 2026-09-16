import assert from "node:assert/strict";
import test from "node:test";

import { getImageWorkflowTuningDefinition } from "./imageWorkflowTuning.js";

function controlsById(profileKey) {
  const definition = getImageWorkflowTuningDefinition(profileKey, {
    detailScale: 2,
  });
  return Object.fromEntries(definition.controls.map((entry) => [entry.id, entry]));
}

test("Illustrative restores Fantasy-to-Realism semantic control labels without changing raw ids", () => {
  const controls = controlsById("crestfall_fantasy_realistic");
  assert.equal(controls.foundationSteps.label, "Fantasy Foundation Detail");
  assert.equal(controls.polishSteps.label, "Realism Polish Detail");
  assert.equal(controls.polishDenoise.label, "Realism Balance");
  assert.equal(controls.polishDenoise.leftLabel, "More Fantasy");
  assert.equal(controls.polishDenoise.rightLabel, "Max Realism");
});

test("Heroic restores realism-first / fantasy-polish semantic labels", () => {
  const controls = controlsById("crestfall_fantasy_realism");
  assert.equal(controls.foundationSteps.label, "Realistic Foundation Detail");
  assert.equal(controls.polishSteps.label, "Fantasy Polish Detail");
  assert.equal(controls.polishDenoise.label, "Fantasy Influence");
  assert.equal(controls.polishDenoise.leftLabel, "Mostly Realistic");
  assert.equal(controls.polishDenoise.rightLabel, "Stronger Fantasy");
});

test("Cinematic restores realism-first / fantasy-polish semantic labels", () => {
  const controls = controlsById("crestfall_realistic_fantasy");
  assert.equal(controls.foundationSteps.label, "Realistic Foundation Detail");
  assert.equal(controls.polishSteps.label, "Fantasy Polish Detail");
  assert.equal(controls.polishDenoise.label, "Fantasy Influence");
});

test("Fantasy keeps generic tuning presentation", () => {
  const controls = controlsById("crestfall_fantasy");
  assert.equal(controls.foundationSteps.label, "Foundation");
  assert.equal(controls.polishSteps.label, "Refinement");
  assert.equal(controls.polishDenoise.label, "Variation");
});
