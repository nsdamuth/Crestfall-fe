import assert from "node:assert/strict";
import fs from "node:fs";

const viewModel = fs.readFileSync(
  "components/studio/create/lore/lore-editor/useLoreEditorViewModel.js",
  "utf8"
);
const view = fs.readFileSync(
  "components/studio/create/lore/lore-editor/LoreEditor.view.jsx",
  "utf8"
);
const guide = fs.readFileSync(
  "components/studio/create/lore/lore-json-editor/loreJsonAiAuthoringGuide.js",
  "utf8"
);
const typeConstants = fs.readFileSync("lib/server/creations/constants.js", "utf8");
const typePolicy = fs.readFileSync(
  "lib/shared/creations/creationTypePolicy.js",
  "utf8"
);

assert.match(viewModel, /timelineOrder:\s*normalizeOptionalTimelineNumber/);
assert.match(view, /label="Timeline order"/);
assert.match(view, /Optional chronology key/);
assert.match(guide, /independent of the human-readable `displayDate`/);
assert.match(typeConstants, /"TIMELINE"/);
assert.match(typePolicy, /TIMELINE:[\s\S]*editMode: "TIMELINE"/);
assert.match(typePolicy, /TIMELINE:[\s\S]*communityDiscoverable: false/);

console.log("Lore Timeline-order foundation diagnostics passed.");
