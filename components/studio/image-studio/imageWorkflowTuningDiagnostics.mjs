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
  getWorkflowTuningPresentationValue,
  normalizeImageWorkflowTuning,
  normalizeRenderStyleRailSelection,
  RENDER_STYLE_RAIL_STOPS,
} from "./imageWorkflowTuning.js";
import {
  IMAGE_SETTINGS_PRESET_CONTRACT,
  getImageSettingsPresetPresentation,
  parseImageSettingsPresetText,
  serializeImageSettingsPreset,
} from "./imageSettingsPreset.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("render style rail still has six fixed workflow families", () => {
  assert.deepEqual(
    RENDER_STYLE_RAIL_STOPS.map((entry) => entry.value),
    [
      "crestfall_fantasy",
      "crestfall_anime_anime",
      "crestfall_fantasy_realistic",
      "crestfall_fantasy_realism",
      "crestfall_realistic_fantasy",
      "crestfall_realistic",
    ]
  );
  assert.equal(normalizeRenderStyleRailSelection("auto"), "crestfall_fantasy");
  assert.equal(
    getRenderStyleRailStop("crestfall_realistic_fantasy").shortLabel,
    "Cinematic"
  );
});

test("detail presets are lane-aware and use user-facing controls", () => {
  const fantasy = getImageWorkflowTuningDefinition("crestfall_fantasy");
  const realistic = getImageWorkflowTuningDefinition("crestfall_realistic");

  assert.deepEqual(
    fantasy.controls.find((entry) => entry.id === "detailScale").options.map((entry) => entry.value),
    [1, 1.25, 1.5, 1.75, 2]
  );
  assert.deepEqual(
    realistic.controls.find((entry) => entry.id === "detailScale").options.map((entry) => entry.value),
    [1, 1.25]
  );
  assert.deepEqual(
    fantasy.controls.map((entry) => entry.label),
    ["Detail", "Foundation", "Refinement", "Variation"]
  );
});

test("x2 fantasy raw tuning projects to semantic percentages without losing raw values", () => {
  const raw = {
    detailScale: 2,
    foundationSteps: 55,
    polishSteps: 75,
    polishDenoise: 0.6,
  };
  const definition = getImageWorkflowTuningDefinition("crestfall_fantasy", raw);
  const foundation = definition.controls.find((entry) => entry.id === "foundationSteps");
  const refinement = definition.controls.find((entry) => entry.id === "polishSteps");
  const variation = definition.controls.find((entry) => entry.id === "polishDenoise");

  assert.equal(foundation.toDisplayValue(raw.foundationSteps), 100);
  assert.equal(refinement.toDisplayValue(raw.polishSteps), 100);
  assert.equal(variation.toDisplayValue(raw.polishDenoise), 0);
  assert.equal(foundation.fromDisplayValue(100), 55);
  assert.equal(refinement.fromDisplayValue(100), 75);
  assert.equal(variation.fromDisplayValue(0), 0.6);
  assert.equal(
    getWorkflowTuningPresentationValue(
      "crestfall_fantasy",
      "foundationSteps",
      raw.foundationSteps,
      raw
    ),
    100
  );
});

test("anime exposes reference influence while fantasy remains the only no-reference lane", () => {
  const fantasy = getImageWorkflowTuningDefinition("crestfall_fantasy");
  const anime = getImageWorkflowTuningDefinition("crestfall_anime_anime");

  assert.equal(fantasy.controls.some((entry) => entry.id === "referenceInfluence"), false);
  assert.equal(anime.controls.some((entry) => entry.id === "referenceInfluence"), true);
});

test("fantasy and anime x1.75 clamp foundation to the raised raw floor and 10% UI floor", () => {
  for (const profileKey of ["crestfall_fantasy", "crestfall_anime_anime"]) {
    const normalized = normalizeImageWorkflowTuning(profileKey, {
      detailScale: 1.75,
      foundationSteps: 44,
    });
    assert.equal(normalized.foundationSteps, 45);

    const definition = getImageWorkflowTuningDefinition(profileKey, normalized);
    const foundation = definition.controls.find(
      (entry) => entry.id === "foundationSteps"
    );
    assert.equal(foundation.min, 10);
    assert.equal(foundation.toDisplayValue(45), 10);
    assert.equal(foundation.fromDisplayValue(10), 45);
  }
});

test("copy/import keeps exact raw reproduction settings while details use abstractions", () => {
  const preset = {
    contract: IMAGE_SETTINGS_PRESET_CONTRACT,
    renderStyle: "crestfall_fantasy",
    cameraFraming: "AUTO",
    aspectRatio: "4:5",
    wardrobeTheme: "AUTO",
    workflowTuning: {
      detailScale: 2,
      foundationSteps: 55,
      polishSteps: 75,
      polishDenoise: 0.6,
    },
    sceneryOnlyHelperEnabled: true,
    negativePrompt: "",
  };

  const serialized = serializeImageSettingsPreset(preset);
  const parsed = parseImageSettingsPresetText(serialized);
  assert.deepEqual(parsed.workflowTuning, preset.workflowTuning);

  const presentation = getImageSettingsPresetPresentation(preset);
  assert.equal(
    presentation.tuningSummary,
    "Detail Maximum · Foundation 100% · Refinement 100% · Variation 0%"
  );
});

test("workflow payload still stores raw provider-facing values", () => {
  const raw = {
    detailScale: 2,
    foundationSteps: 55,
    polishSteps: 75,
    polishDenoise: 0.6,
  };
  assert.deepEqual(
    getWorkflowTuningPayload({
      profileKey: "crestfall_fantasy",
      tuning: raw,
      touched: true,
    }),
    raw
  );
  assert.deepEqual(
    getWorkflowTuningPayload({
      profileKey: "crestfall_fantasy",
      tuning: getDefaultImageWorkflowTuning("crestfall_fantasy"),
      touched: false,
    }),
    {
      detailScale: 1,
      foundationSteps: 25,
      polishSteps: 25,
      polishDenoise: 0.15,
    }
  );
});

test("composer initializes tuning before definition and maps semantic UI values back to raw", () => {
  const viewModel = read(
    "components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel.js"
  );
  const normalizationIndex = viewModel.indexOf(
    "const normalizedWorkflowTuning = normalizeImageWorkflowTuning"
  );
  const definitionIndex = viewModel.indexOf(
    "const workflowTuningDefinition = getImageWorkflowTuningDefinition"
  );

  assert.ok(normalizationIndex >= 0);
  assert.ok(definitionIndex >= 0);
  assert.ok(normalizationIndex < definitionIndex);
  assert.match(viewModel, /entry\.toDisplayValue/);
  assert.match(viewModel, /entry\.fromDisplayValue/);
});
