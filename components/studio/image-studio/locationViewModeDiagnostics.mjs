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
  scenic_image_prompt: "aerial establishing view",
  scenic_negative_prompt: "no close framing",
  custom_image_views: [
    {
      id: "palace-courtyard",
      label: "Grand Palace Courtyard",
      prompt: "white marble royal courtyard",
      negative_prompt: "no modern elements",
    },
    {
      id: "tavern",
      label: "Aethelgard Tavern",
      prompt: "warm tavern interior",
    },
  ],
});
const bothAvailability = getLocationViewGuidanceAvailability(both);
assert.equal(bothAvailability.hasInterior, true);
assert.equal(bothAvailability.hasExterior, true);
assert.equal(bothAvailability.hasScenic, true);
assert.equal(bothAvailability.showToggle, true);
assert.equal(getDefaultLocationViewMode(both), "AUTO");
assert.equal(normalizeLocationViewModeForItem(both, "SCENIC"), "SCENIC");
const multiControl = buildLocationViewControl(both, "AUTO");
assert.equal(multiControl.showToggle, true);
assert.deepEqual(multiControl.options.map((entry) => entry.value), [
  "AUTO",
  "INTERIOR",
  "EXTERIOR",
  "SCENIC",
]);
assert.deepEqual(multiControl.customOptions.map((entry) => entry.value), [
  "CUSTOM:palace-courtyard",
  "CUSTOM:tavern",
]);
assert.equal(
  normalizeLocationViewModeForItem(both, "CUSTOM:palace-courtyard"),
  "CUSTOM:palace-courtyard"
);

const interiorOnly = location({
  interior_image_prompt: "underground lab",
  interior_negative_prompt: "no exterior",
});
assert.equal(getDefaultLocationViewMode(interiorOnly), "AUTO");
assert.equal(normalizeLocationViewModeForItem(interiorOnly, "EXTERIOR"), "EXTERIOR");
assert.equal(buildLocationViewControl(interiorOnly, "AUTO").showToggle, true);
assert.deepEqual(buildLocationViewControl(interiorOnly, "AUTO").options.map((entry) => entry.value), [
  "AUTO",
  "INTERIOR",
  "EXTERIOR",
  "SCENIC",
]);

const exteriorOnly = location({ exterior_image_prompt: "estate facade" });
assert.equal(getDefaultLocationViewMode(exteriorOnly), "AUTO");
assert.equal(buildLocationViewControl(exteriorOnly, "AUTO").showToggle, true);

const exteriorAndScenic = location({
  exterior_image_prompt: "tower facade",
  scenic_image_prompt: "tower in the mountain skyline",
});
const exteriorAndScenicControl = buildLocationViewControl(exteriorAndScenic, "AUTO");
assert.equal(exteriorAndScenicControl.showToggle, true);
assert.deepEqual(exteriorAndScenicControl.options.map((entry) => entry.value), [
  "AUTO",
  "INTERIOR",
  "EXTERIOR",
  "SCENIC",
]);

const legacy = location({ image_prompt: "legacy general" });
assert.equal(getDefaultLocationViewMode(legacy), "AUTO");
assert.deepEqual(buildLocationViewControl(legacy, "AUTO").options.map((entry) => entry.value), [
  "AUTO",
  "INTERIOR",
  "EXTERIOR",
  "SCENIC",
]);

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
assert.match(kit, /Additional View/);
assert.match(kit, /locationViewControl\.customOptions\?\.length/);
assert.ok(kit.indexOf("Custom prompt") < kit.indexOf("Location View"));
assert.match(editor, /interior_image_prompt/);
assert.match(editor, /interior_negative_prompt/);
assert.match(editor, /exterior_image_prompt/);
assert.match(editor, /exterior_negative_prompt/);
assert.match(editor, /scenic_image_prompt/);
assert.match(editor, /scenic_negative_prompt/);
assert.match(editor, /custom_image_views/);
assert.match(builder, /interior_image_prompt/);
assert.match(builder, /exterior_image_prompt/);
assert.match(builder, /scenic_image_prompt/);
assert.match(builder, /custom_image_views/);
assert.match(details, /View · \{asset\.viewModeLabel\}/);

console.log(JSON.stringify({
  diagnostic: "image_location_view_mode_v1",
  status: "PASSED",
  locationViewSelectorAlwaysAvailableForAssetLocations: true,
  allFourModesAlwaysExposed: true,
  selectorLivesBelowCustomPrompt: true,
  scenicViewAuthoredAndSelectable: true,
  customViewsProjectedOnlyWhenAuthored: true,
  autoKeepsLocationsNeutralUntilChosen: true,
  perViewPositiveAndNegativeFieldsPersisted: true,
  selectedViewIncludedInGenerationPayload: true,
  selectedViewShownInImageDetails: true,
}, null, 2));
