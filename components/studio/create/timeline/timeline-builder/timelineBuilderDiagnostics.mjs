import assert from "node:assert/strict";
import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const shell = read("components/studio/create/timeline/TimelineBuilderShell.jsx");
const view = read("components/studio/create/timeline/timeline-builder/TimelineBuilder.view.jsx");
const viewModel = read("components/studio/create/timeline/timeline-builder/useTimelineBuilderViewModel.js");
const client = read("lib/client/studio/timelines/timelineClient.js");
const ownerProjection = read("lib/shared/timelines/timelineOwnerProjection.js");
const v2CreatePage = read("app/studio/v2/editor/new/page.jsx");
const legacyCreatePage = read("app/studio/create/timeline/page.jsx");
const legacyEditPage = read("app/studio/create/timeline/[id]/page.jsx");
const previewPage = read("app/dev/ui-preview/timeline-builder/page.jsx");
const creationPickerBuckets = read("components/studio/creation-picker/creation-picker/creationPickerBuckets.js");

assert.match(shell, /useTimelineBuilderViewModel/);
assert.match(shell, /initialCreation/);
assert.match(shell, /useCreationPickerViewModel/);
assert.match(shell, /<CreationPickerView/);
assert.match(shell, /lorePickerSlot/);
assert.doesNotMatch(shell, /\bfetch\s*\(/);

assert.match(view, /Timeline Editor|Timeline Builder/);
assert.match(view, /Public Timeline/);
assert.match(view, /Viewer grouping/);
assert.match(view, /Timeline Chapters/);
assert.match(view, /Chapter title/);
assert.match(view, /Chapter/);
assert.match(view, /Order override/);
assert.match(view, /Add Lore/);
assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|supabase|PostGraphile|router\./);

assert.match(viewModel, /fetchOwnedCreation/);
assert.match(viewModel, /fetchOwnedCreations/);
assert.match(viewModel, /initialCreation/);
assert.match(viewModel, /buildOwnedTimelineProjection/);
assert.doesNotMatch(viewModel, /fetchOwnedTimelineProjection/);
assert.match(viewModel, /createTimelineDraft/);
assert.match(viewModel, /updateTimelineDraft/);
assert.match(viewModel, /sortTimelineEntries/);
assert.match(viewModel, /orderOverride/);
assert.match(viewModel, /groupingMode/);
assert.match(viewModel, /onAddChapter|createChapter/);
assert.match(viewModel, /updateEntryChapter/);
assert.match(viewModel, /publicEnabled/);
assert.match(viewModel, /\/studio\/v2\/lore\/timelines\/\$\{encodeURIComponent\(creation\.id\)\}/);
assert.doesNotMatch(viewModel, /\/studio\/create\//);
assert.doesNotMatch(viewModel, /<\w+/);

assert.match(ownerProjection, /buildOwnedTimelineProjection/);
assert.match(ownerProjection, /projectOwnedLoreForTimeline/);
assert.match(ownerProjection, /sortTimelineEntries/);

assert.match(client, /createTimelineDraft/);
assert.match(client, /updateTimelineDraft/);
assert.match(v2CreatePage, /type === "TIMELINE"/);
assert.match(v2CreatePage, /<TimelineBuilderShell/);
assert.doesNotMatch(v2CreatePage, /["'`]\/studio\/create\/timeline/);
assert.match(legacyCreatePage, /redirect\("\/studio\/v2\/editor\/new\?type=TIMELINE&origin=lore"\)/);
assert.match(legacyEditPage, /\/studio\/v2\/editor\/\$\{encodeURIComponent\(timelineId\)\}\?origin=timeline/);
assert.match(previewPage, /process\.env\.NODE_ENV === "production"/);
assert.match(previewPage, /notFound\(\)/);
assert.match(creationPickerBuckets, /TIMELINE:\s*"more"/);

console.log(JSON.stringify({
  diagnostic: "timeline_builder_chapters_tl4_v0",
  status: "PASSED",
  v2CreateRouteOwnsTimelineCreation: true,
  savedTimelineUsesGenericOwnerCreationAuthority: true,
  timelineEditorUsesServerHydratedInitialCreation: true,
  legacyTimelineRoutesAreCompatibilityRedirectsOnly: true,
  noTimelineBuilderNavigationToV1: true,
  chapterAuthoringAvailable: true,
  loreChapterAssignmentAvailable: true,
  loomBoundaryPreserved: true,
}, null, 2));
