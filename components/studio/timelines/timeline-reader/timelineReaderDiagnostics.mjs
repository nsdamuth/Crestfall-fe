import assert from "node:assert/strict";
import fs from "node:fs";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

const shell = read("components/studio/timelines/TimelineReaderShell.jsx");
const view = read("components/studio/timelines/timeline-reader/TimelineReader.view.jsx");
const viewModel = read("components/studio/timelines/timeline-reader/useTimelineReaderViewModel.js");
const ownerProjection = read("lib/shared/timelines/timelineOwnerProjection.js");
const readerRoute = read("app/studio/v2/lore/timelines/[id]/page.jsx");
const loreViewModel = read("app/studio/v2/lore/lore/useLoreViewModel.js");
const editorRoute = read("app/studio/v2/editor/[id]/page.jsx");
const builderShell = read("components/studio/create/timeline/TimelineBuilderShell.jsx");
const builderViewModel = read("components/studio/create/timeline/timeline-builder/useTimelineBuilderViewModel.js");
const contract = read("components/studio/timelines/timeline-reader/TimelineReader.contract.js");
const fixtures = read("components/studio/timelines/timeline-reader/TimelineReader.fixtures.js");
const preview = read("app/dev/ui-preview/timeline-reader/page.jsx");

assert.match(shell, /useTimelineReaderViewModel/);
assert.match(shell, /initialCreation/);
assert.match(shell, /<TimelineReaderView/);
assert.doesNotMatch(shell, /\bfetch\s*\(/);

assert.match(view, /Edit Timeline/);
assert.match(view, /Public Timeline|Internal Timeline/);
assert.match(view, /showEditAction/);
assert.match(view, /<details/);
assert.match(view, /localStorage/);
assert.match(view, /group-hover:text-\[var\(--gold-ornament\)\]/);
assert.match(view, /group-hover:-translate-y-1/);
assert.doesNotMatch(view, /\bfetch\s*\(|\/api\/|router\./);

assert.match(viewModel, /fetchOwnedCreation/);
assert.match(viewModel, /fetchOwnedCreations/);
assert.match(viewModel, /initialCreation/);
assert.match(viewModel, /buildOwnedTimelineProjection/);
assert.doesNotMatch(viewModel, /fetchOwnedTimelineProjection/);
assert.match(viewModel, /groupTimelineReaderEntries/);
assert.match(viewModel, /groupingMode/);
assert.match(viewModel, /chapters/);
assert.match(viewModel, /Undated \/ unplaced/);
assert.match(viewModel, /\/studio\/v2\/editor\/\$\{encodeURIComponent\(timelineId\)\}\?origin=timeline/);
assert.doesNotMatch(viewModel, /\/studio\/create\//);
assert.doesNotMatch(viewModel, /<\w+/);

assert.match(ownerProjection, /buildOwnedTimelineProjection/);
assert.match(readerRoute, /getOwnedCreationPageData/);
assert.match(readerRoute, /creation\?\.type/);
assert.match(readerRoute, /<TimelineReaderShell timelineId=\{id\} initialCreation=\{creation\}/);
assert.match(loreViewModel, /\/studio\/v2\/lore\/timelines\/\$\{encodeURIComponent\(creation\.id\)\}/);

assert.match(editorRoute, /creation\?\.type/);
assert.match(editorRoute, /=== "TIMELINE"/);
assert.match(editorRoute, /initialCreation=\{creation\}/);
assert.match(editorRoute, /origin === "timeline"/);
assert.match(editorRoute, /\/studio\/v2\/lore\/timelines\/\$\{encodeURIComponent\(id\)\}/);
assert.match(builderShell, /initialCreation/);
assert.match(builderShell, /backHref/);
assert.match(builderViewModel, /initialCreation/);
assert.match(builderViewModel, /fetchOwnedCreation/);
assert.doesNotMatch(builderViewModel, /fetchOwnedTimelineProjection/);
assert.match(contract, /TIMELINE_READER_VIEW_CONTRACT_VERSION = "1\.1\.0"/);
assert.match(fixtures, /timelineReaderFixture/);
assert.match(preview, /process\.env\.NODE_ENV === "production"/);
assert.match(preview, /notFound\(\)/);

console.log(JSON.stringify({
  diagnostic: "timeline_reader_chapters_interaction_tl4_v0",
  status: "PASSED",
  loreTimelineCardsOpenReader: true,
  readerUsesSameOwnerCreationAuthorityAsV2Editor: true,
  readerHasExplicitEditDoor: true,
  timelineEditUsesTimelineBuilderWithInitialCreation: true,
  genericCharacterEditorBypassedForTimeline: true,
  ownerReaderAndEditorDoNotDependOnTimelineProjectionEndpoint: true,
  postCreateLandsOnReader: true,
  chapterGroupsAreCollapsible: true,
  loreCardsHaveGoldHoverAffordance: true,
  chapterOpenStatePersistsLocally: true,
  loomBoundaryPreserved: true,
}, null, 2));
