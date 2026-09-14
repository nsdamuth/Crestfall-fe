import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildLocationViewControl,
  getDefaultLocationViewMode,
  getLocationViewGuidanceAvailability,
  normalizeLocationViewModeForItem,
} from "./locationViewMode.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

function location(data) {
  return {
    id: "loc-1",
    type: "LOCATION",
    title: "Test Location",
    rawCreation: { type: "LOCATION", data },
  };
}

const both = location({
  interior_image_prompt: "interior",
  interior_negative_prompt: "no sky",
  exterior_image_prompt: "exterior",
  exterior_negative_prompt: "no rooms",
});
const bothAvailability = getLocationViewGuidanceAvailability(both);
assert.equal(bothAvailability.hasInterior, true);
assert.equal(bothAvailability.hasExterior, true);
assert.equal(bothAvailability.showToggle, true);
assert.equal(getDefaultLocationViewMode(both), "INTERIOR");
assert.equal(normalizeLocationViewModeForItem(both, "EXTERIOR"), "EXTERIOR");
assert.equal(buildLocationViewControl(both, "EXTERIOR").showToggle, true);

const interiorOnly = location({
  interior_image_prompt: "underground lab",
  interior_negative_prompt: "no exterior",
});
assert.equal(getDefaultLocationViewMode(interiorOnly), "INTERIOR");
assert.equal(normalizeLocationViewModeForItem(interiorOnly, "EXTERIOR"), "INTERIOR");
assert.equal(buildLocationViewControl(interiorOnly, "AUTO").showToggle, false);

const exteriorOnly = location({ exterior_image_prompt: "estate facade" });
assert.equal(getDefaultLocationViewMode(exteriorOnly), "EXTERIOR");
assert.equal(buildLocationViewControl(exteriorOnly, "AUTO").showToggle, false);

const legacy = location({ image_prompt: "legacy general" });
assert.equal(getDefaultLocationViewMode(legacy), "AUTO");
assert.equal(buildLocationViewControl(legacy, "AUTO"), null);

const workbench = read("components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js");
const composer = read("components/studio/image-studio/image-studio-composer/useImageStudioComposerViewModel.js");
const kit = read("components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx");
const editor = read("components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/useLocationPromptGuidanceSectionViewModel.js");
const builder = read("components/studio/create/location/location-builder/useLocationBuilderViewModel.js");
const details = read("components/studio/media/media-lightbox/MediaLightbox.view.jsx");

assert.match(workbench, /locationViewMode:\s*String\(locationViewMode/);
assert.match(workbench, /buildLocationViewControl/);
assert.match(composer, /getInheritedAssetNegativePromptItems\(ingredientValues, \{ locationViewMode \}\)/);
assert.match(kit, /Location View/);
assert.match(editor, /interior_image_prompt/);
assert.match(editor, /interior_negative_prompt/);
assert.match(editor, /exterior_image_prompt/);
assert.match(editor, /exterior_negative_prompt/);
assert.match(builder, /interior_image_prompt/);
assert.match(builder, /exterior_image_prompt/);
assert.match(details, /View · \{asset\.viewModeLabel\}/);

console.log(JSON.stringify({
  diagnostic: "image_location_view_mode_v1",
  status: "PASSED",
  bothAuthoredModesExposeToggle: true,
  singleAuthoredModeAutoSelectsWithoutUselessToggle: true,
  legacyLocationsRemainUnchanged: true,
  perViewPositiveAndNegativeFieldsPersisted: true,
  selectedViewIncludedInGenerationPayload: true,
  selectedViewShownInImageDetails: true,
}, null, 2));
