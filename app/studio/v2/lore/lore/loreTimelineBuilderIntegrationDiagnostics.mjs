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

assert.match(pageData, /type=TIMELINE/);
assert.match(pageData, /ownedTimelines/);
assert.match(page, /ownedTimelines=/);
assert.match(shell, /ownedTimelines/);
assert.match(viewModel, /Your Timelines|timelineItems/);
assert.match(viewModel, /\/studio\/create\/timeline/);
assert.match(view, /Your Timelines/);
assert.match(view, /Build Timeline/);
assert.match(view, /TimelineGrid/);
assert.doesNotMatch(view, /\bfetch\s*\(|\/api\//);

console.log(JSON.stringify({
  diagnostic: "lore_timeline_builder_integration_tl2a_v0",
  status: "PASSED",
  v2LoreLoadsOwnedTimelines: true,
  buildTimelineEntryPointPresent: true,
  timelineCardsOpenEditor: true,
  portableLoreViewRemainsDataAccessFree: true,
}, null, 2));
