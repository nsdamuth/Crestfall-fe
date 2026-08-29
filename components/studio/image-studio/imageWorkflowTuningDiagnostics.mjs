import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  getDefaultImageWorkflowTuning,
  getImageWorkflowTuningDefinition,
  getRenderStyleRailStop,
  getWorkflowTuningPayload,
  normalizeImageWorkflowTuning,
  normalizeRenderStyleRailSelection,
  RENDER_STYLE_RAIL_STOPS,
} from "./imageWorkflowTuning.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("render style rail has five fixed stops from Fantasy to Realistic", () => {
  assert.deepEqual(
    RENDER_STYLE_RAIL_STOPS.map((entry) => entry.value),
    [
      "crestfall_fantasy",
      "crestfall_anime_anime",
      "crestfall_fantasy_realistic",
      "crestfall_realistic_fantasy",
      "crestfall_realistic",
    ]
  );
  assert.equal(RENDER_STYLE_RAIL_STOPS[0].mappedLabel, "Crestfall Fantasy");
  assert.equal(
    RENDER_STYLE_RAIL_STOPS[RENDER_STYLE_RAIL_STOPS.length - 1].mappedLabel,
    "Crestfall Realistic"
  );
  assert.equal(normalizeRenderStyleRailSelection("auto"), "crestfall_fantasy");
  assert.equal(
    getRenderStyleRailStop("crestfall_realistic_fantasy").shortLabel,
    "Real → Fantasy"
  );
});

test("all five rail workflows expose bounded semantic tuning definitions", () => {
  for (const entry of RENDER_STYLE_RAIL_STOPS) {
    const definition = getImageWorkflowTuningDefinition(entry.value);
    assert.ok(definition, `${entry.value} should have tuning`);
    assert.ok(definition.controls.length >= 1);
    assert.equal(
      definition.controls.some((control) =>
        ["cfg", "sampler", "scheduler", "model"].includes(control.id)
      ),
      false
    );
  }

  assert.deepEqual(
    getImageWorkflowTuningDefinition("crestfall_fantasy").controls.map(
      (entry) => entry.id
    ),
    ["detailLevel"]
  );
  assert.deepEqual(
    getImageWorkflowTuningDefinition("crestfall_anime_anime").controls.map(
      (entry) => entry.id
    ),
    ["foundationDetail", "polishDetail"]
  );
});

test("hybrid workflows preserve curated semantic tuning controls", () => {
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

test("composer projects the rail and bounded Advanced controls without owning workflow internals", () => {
  const viewModel = read(
    "components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel.js"
  );
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );

  assert.match(viewModel, /renderStyleRailProps/);
  assert.match(viewModel, /RENDER_STYLE_RAIL_STOPS/);
  assert.match(viewModel, /safetyNote/);
  assert.match(workbench, /workflowTuningTouched/);
  assert.match(workbench, /getWorkflowTuningPayload/);
});
