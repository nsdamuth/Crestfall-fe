import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  getDefaultImageWorkflowTuning,
  getImageWorkflowTuningDefinition,
  getWorkflowTuningPayload,
  normalizeImageWorkflowTuning,
} from "./imageWorkflowTuning.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("hybrid workflows expose only curated semantic tuning controls", () => {
  const fantasyRealistic = getImageWorkflowTuningDefinition(
    "crestfall_fantasy_realistic"
  );
  const realisticFantasy = getImageWorkflowTuningDefinition(
    "crestfall_realistic_fantasy"
  );

  assert.deepEqual(
    fantasyRealistic.controls.map((entry) => entry.id),
    ["referenceInfluence", "styleBalance", "foundationDetail", "polishDetail"]
  );
  assert.deepEqual(
    realisticFantasy.controls.map((entry) => entry.id),
    ["referenceInfluence", "styleBalance", "foundationDetail", "polishDetail"]
  );

  assert.equal(
    fantasyRealistic.controls.some((entry) =>
      ["cfg", "sampler", "scheduler", "model"].includes(entry.id)
    ),
    false
  );
});

test("semantic tuning is hard-clamped to zero through one hundred", () => {
  assert.deepEqual(
    normalizeImageWorkflowTuning("crestfall_fantasy_realistic", {
      referenceInfluence: -40,
      styleBalance: 150,
      foundationDetail: 63,
      polishDetail: "75",
    }),
    {
      referenceInfluence: 0,
      styleBalance: 100,
      foundationDetail: 63,
      polishDetail: 75,
    }
  );
});

test("untouched workflow controls do not alter the generation payload", () => {
  const defaults = getDefaultImageWorkflowTuning("crestfall_fantasy_realistic");

  assert.equal(
    getWorkflowTuningPayload({
      profileKey: "crestfall_fantasy_realistic",
      tuning: defaults,
      touched: false,
    }),
    null
  );

  assert.deepEqual(
    getWorkflowTuningPayload({
      profileKey: "crestfall_fantasy_realistic",
      tuning: { ...defaults, styleBalance: 65 },
      touched: true,
    }),
    { ...defaults, styleBalance: 65 }
  );
});

test("workflow ceilings hand off to the inverse hybrid workflow", () => {
  const fantasyRealistic = getImageWorkflowTuningDefinition(
    "crestfall_fantasy_realistic"
  );
  const realisticFantasy = getImageWorkflowTuningDefinition(
    "crestfall_realistic_fantasy"
  );

  assert.equal(
    fantasyRealistic.handoff.targetProfileKey,
    "crestfall_realistic_fantasy"
  );
  assert.equal(
    realisticFantasy.handoff.targetProfileKey,
    "crestfall_fantasy_realistic"
  );
  assert.equal(fantasyRealistic.handoff.boundaryValue, 100);
  assert.equal(realisticFantasy.handoff.boundaryValue, 100);
});

test("composer owns a bounded Advanced accordion with reset and handoff affordances", () => {
  const view = read(
    "components/studio/image-studio/image-studio-composer/ImageStudioComposer.view.jsx"
  );
  const viewModel = read(
    "components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel.js"
  );
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(view, /Advanced/);
  assert.match(view, /type="range"/);
  assert.match(view, /Reset defaults/);
  assert.match(view, /Switch to \{advancedTuningProps\.handoff\.targetProfileLabel\}/);
  assert.match(viewModel, /safetyNote/);
  assert.match(workbench, /workflowTuningTouched/);
  assert.match(workbench, /getWorkflowTuningPayload/);
});
