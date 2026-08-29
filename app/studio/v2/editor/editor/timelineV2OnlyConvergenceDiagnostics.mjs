import assert from "node:assert/strict";
import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const v2New = read("app/studio/v2/editor/new/page.jsx");
const v2Edit = read("app/studio/v2/editor/[id]/page.jsx");
const v2Reader = read("app/studio/v2/lore/timelines/[id]/page.jsx");
const loreVm = read("app/studio/v2/lore/lore/useLoreViewModel.js");
const builderVm = read("components/studio/create/timeline/timeline-builder/useTimelineBuilderViewModel.js");
const readerVm = read("components/studio/timelines/timeline-reader/useTimelineReaderViewModel.js");
const legacyCreate = read("app/studio/create/timeline/page.jsx");
const legacyEdit = read("app/studio/create/timeline/[id]/page.jsx");

assert.match(v2New, /type === "TIMELINE"/);
assert.match(v2New, /TimelineBuilderShell/);
assert.match(v2Edit, /=== "TIMELINE"/);
assert.match(v2Edit, /initialCreation=\{creation\}/);
assert.match(v2Reader, /getOwnedCreationPageData/);
assert.match(v2Reader, /initialCreation=\{creation\}/);
assert.match(loreVm, /\/studio\/v2\/editor\/new\?type=TIMELINE&origin=lore/);
assert.match(loreVm, /\/studio\/v2\/lore\/timelines\//);
assert.match(builderVm, /\/studio\/v2\/lore\/timelines\//);
assert.match(readerVm, /\/studio\/v2\/editor\//);

for (const [name, source] of [
  ["V2 new editor", v2New],
  ["V2 saved editor", v2Edit],
  ["V2 Timeline reader", v2Reader],
  ["V2 Lore ViewModel", loreVm],
  ["Timeline editor ViewModel", builderVm],
  ["Timeline reader ViewModel", readerVm],
]) {
  assert.doesNotMatch(source, /["'`]\/studio\/create\/timeline/, `${name} must not navigate to the legacy Timeline route.`);
}

assert.match(legacyCreate, /redirect\("\/studio\/v2\/editor\/new\?type=TIMELINE&origin=lore"\)/);
assert.match(legacyEdit, /redirect\(`\/studio\/v2\/editor\/\$\{encodeURIComponent\(timelineId\)\}\?origin=timeline`\)/);

console.log(JSON.stringify({
  diagnostic: "timeline_v2_only_convergence_v0",
  status: "PASSED",
  createOwnedByV2Editor: true,
  editOwnedByV2Editor: true,
  browseOwnedByV2LoreReader: true,
  legacyRoutesCompatibilityOnly: true,
  timelineWorkflowHasNoV1Navigation: true,
}, null, 2));
