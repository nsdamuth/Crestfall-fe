import assert from "node:assert/strict";
import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const shell = read("components/studio/create/timeline/TimelineBuilderShell.jsx");
const view = read("components/studio/create/timeline/timeline-builder/TimelineBuilder.view.jsx");
const viewModel = read("components/studio/create/timeline/timeline-builder/useTimelineBuilderViewModel.js");
const client = read("lib/client/studio/timelines/timelineClient.js");
const createPage = read("app/studio/create/timeline/page.jsx");
const editPage = read("app/studio/create/timeline/[id]/page.jsx");
const previewPage = read("app/dev/ui-preview/timeline-builder/page.jsx");
const creationPickerBuckets = read("components/studio/creation-picker/creation-picker/creationPickerBuckets.js");

assert.match(shell, /useTimelineBuilderViewModel/);
assert.match(shell, /useCreationPickerViewModel/);
assert.match(shell, /<CreationPickerView/);
assert.match(shell, /lorePickerSlot/);
assert.doesNotMatch(shell, /\bfetch\s*\(/);

assert.match(view, /Public Timeline/);
assert.match(view, /Group by Era/);
assert.match(view, /Order override/);
assert.match(view, /Add Lore/);
assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile|router\./);

assert.match(viewModel, /fetchOwnedCreations/);
assert.match(viewModel, /fetchOwnedTimelineProjection/);
assert.match(viewModel, /createTimelineDraft/);
assert.match(viewModel, /updateTimelineDraft/);
assert.match(viewModel, /sortTimelineEntries/);
assert.match(viewModel, /orderOverride/);
assert.match(viewModel, /publicEnabled/);
assert.doesNotMatch(viewModel, /<\w+/);

assert.match(client, /createTimelineDraft/);
assert.match(client, /updateTimelineDraft/);
assert.match(createPage, /<TimelineBuilderShell/);
assert.match(editPage, /timelineId=/);
assert.match(previewPage, /process\.env\.NODE_ENV === "production"/);
assert.match(previewPage, /notFound\(\)/);
assert.match(creationPickerBuckets, /TIMELINE:\s*"more"/);

console.log(JSON.stringify({
  diagnostic: "timeline_builder_tl2a_v0",
  status: "PASSED",
  loomBoundaryPreserved: true,
  createAndEditRoutesPresent: true,
  lorePickerUsesOwnedLore: true,
  automaticChronologyPresent: true,
  manualOverridePresent: true,
  publicTogglePresent: true,
  productionPreviewBlocked: true,
  globalCreationPickerRecognizesTimeline: true,
}, null, 2));
