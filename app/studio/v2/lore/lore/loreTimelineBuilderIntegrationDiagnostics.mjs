import assert from "node:assert/strict";
import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const pageData = read("lib/server/studio/getLoreV2PageData.js");
const page = read("app/studio/v2/lore/page.jsx");
const shell = read("app/studio/v2/lore/Lore.jsx");
const viewModel = read("app/studio/v2/lore/lore/useLoreViewModel.js");
const view = read("app/studio/v2/lore/lore/Lore.view.jsx");
const v2CreatePage = read("app/studio/v2/editor/new/page.jsx");

assert.match(pageData, /type=TIMELINE/);
assert.match(pageData, /ownedTimelines/);
assert.match(page, /ownedTimelines=/);
assert.match(shell, /ownedTimelines/);
assert.match(viewModel, /Your Timelines|timelineItems/);
assert.match(
  viewModel,
  /onBuildTimeline:[\s\S]*\/studio\/v2\/editor\/new\?type=TIMELINE&origin=lore/
);
assert.match(
  viewModel,
  /\/studio\/v2\/lore\/timelines\/\$\{encodeURIComponent\(creation\.id\)\}/
);
assert.doesNotMatch(viewModel, /\/studio\/create\/timeline/);
assert.match(v2CreatePage, /type === "TIMELINE"/);
assert.match(view, /Your Timelines/);
assert.match(view, /Build Timeline/);
assert.match(view, /TimelineGrid/);
assert.doesNotMatch(view, /\bfetch\s*\(|\/api\//);

console.log(JSON.stringify({
  diagnostic: "lore_timeline_v2_only_integration_tl3b_v0",
  status: "PASSED",
  v2LoreLoadsOwnedTimelines: true,
  buildTimelineUsesV2EditorCreateRoute: true,
  timelineCardsOpenV2Reader: true,
  noTimelineNavigationToV1: true,
  portableLoreViewRemainsDataAccessFree: true,
}, null, 2));
