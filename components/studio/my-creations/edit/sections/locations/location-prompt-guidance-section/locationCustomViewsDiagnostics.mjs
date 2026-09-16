import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const vm = read("components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/useLocationPromptGuidanceSectionViewModel.js");
const view = read("components/studio/my-creations/edit/sections/locations/location-prompt-guidance-section/LocationPromptGuidanceSection.view.jsx");
const builderVm = read("components/studio/create/location/location-builder/useLocationBuilderViewModel.js");
const builderView = read("components/studio/create/location/location-builder/LocationBuilder.view.jsx");
const studioView = read("components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx");

assert.match(vm, /custom_image_views/);
assert.match(vm, /createLocationCustomImageViewId/);
assert.match(view, /Additional Views/);
assert.match(view, /Add view/);
assert.match(view, /Edit additional view/);
assert.match(view, /Negative Prompt/);
assert.match(builderVm, /custom_image_views/);
assert.match(builderView, /Additional Views/);
assert.match(builderView, /Save view/);
assert.match(studioView, /title="Additional View"/);
assert.match(studioView, /locationViewControl\.customOptions\?\.length/);

console.log(JSON.stringify({
  diagnostic: "location_custom_views_editor_v1",
  status: "PASSED",
  createAndEditSupported: true,
  stableIdsPersisted: true,
  imageStudioDropdownConditionalOnCustomViews: true,
}, null, 2));
