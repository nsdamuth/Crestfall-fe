import assert from "node:assert/strict";

import {
  getImageSettingsPresetPresentation,
  parseImageSettingsPresetText,
  serializeImageSettingsPreset,
} from "../../../../../components/studio/image-studio/imageSettingsPreset.js";

const source = {
  contract: "crestfall.imageSettings.v1",
  renderStyle: "crestfall_fantasy",
  cameraFraming: "AUTO",
  aspectRatio: "4:5",
  wardrobeTheme: "AUTO",
  workflowTuning: {
    detailScale: 1.5,
    foundationSteps: 40,
    polishSteps: 46,
    polishDenoise: 0.31,
  },
  sceneryOnlyHelperEnabled: true,
  locationViewMode: "AUTO",
  negativePrompt: "",
};

const serialized = serializeImageSettingsPreset(source);
const parsed = parseImageSettingsPresetText(serialized);

assert.deepEqual(parsed.workflowTuning, source.workflowTuning);
assert.equal(parsed.locationViewMode, "AUTO");

const presentation = getImageSettingsPresetPresentation(parsed);
assert.match(presentation.tuningSummary, /Detail High/);
assert.match(presentation.tuningSummary, /Foundation \d+%/);
assert.match(presentation.tuningSummary, /Refinement \d+%/);
assert.match(presentation.tuningSummary, /Variation \d+%/);
assert.doesNotMatch(presentation.tuningSummary, /Detail 1%/);

console.log(
  JSON.stringify(
    {
      diagnostic: "images_v2_settings_round_trip_v2",
      status: "PASSED",
      workflowTuning: parsed.workflowTuning,
      locationViewMode: parsed.locationViewMode,
      tuningSummary: presentation.tuningSummary,
    },
    null,
    2
  )
);
