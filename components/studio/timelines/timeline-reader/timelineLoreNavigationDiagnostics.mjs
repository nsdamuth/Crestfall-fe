import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const shell = read("components/studio/timelines/TimelineReaderShell.jsx");
const vm = read("components/studio/timelines/timeline-reader/useTimelineReaderViewModel.js");
const view = read("components/studio/timelines/timeline-reader/TimelineReader.view.jsx");
const timelinePage = read("app/studio/v2/lore/timelines/[id]/page.jsx");
const lorePage = read("app/studio/v2/lore/timelines/[id]/lore/[loreId]/page.jsx");
const ownerRead = read("lib/server/studio/getOwnedCreationPageData.js");

assert.match(shell, /import Link from "next\/link"/);
assert.match(shell, /LinkComponent=\{Link\}/);
assert.match(vm, /\/studio\/v2\/lore\/timelines\/\$\{encodeURIComponent\(/);
assert.match(vm, /\/lore\/\$\{encodeURIComponent\(entry\.loreCreationId\)\}/);
assert.match(view, /LinkComponent/);
assert.match(view, /aria-label=\{`Open Lore: \$\{entry\.title\}`\}/);
assert.match(view, /!entry\.href \|\| entry\.isUnavailable/);

assert.match(timelinePage, /getOwnedCreationPageData/);
assert.doesNotMatch(timelinePage, /getEditCreationPageData/);

assert.match(lorePage, /getOwnedCreationPageData\(timelineId\)/);
assert.match(lorePage, /getOwnedCreationPageData\(loreId\)/);
assert.match(lorePage, /timelineDefinition\.entries\.some/);
assert.match(lorePage, /if \(!isAttached\)/);
assert.match(lorePage, /LoreDocumentRenderer/);
assert.match(lorePage, /Owner-only Lore/);
assert.doesNotMatch(lorePage, /\/studio\/creations\//);
assert.doesNotMatch(lorePage, /\/api\/community\//);

assert.match(ownerRead, /\/api\/creations\/\$\{encodeURIComponent\(creationId\)\}/);
assert.match(ownerRead, /UNAUTHORIZED/);
assert.match(ownerRead, /CREATION_NOT_FOUND/);
assert.doesNotMatch(ownerRead, /\/api\/community\//);
assert.doesNotMatch(ownerRead, /preview/);

console.log(
  JSON.stringify(
    {
      diagnostic: "timeline_owner_lore_navigation_v0",
      passed: true,
      ownerOnlyReadBoundary: true,
      attachmentRequired: true,
      privateDraftLoreNavigableForOwner: true,
      unavailableLoreNotNavigable: true,
      v2Only: true,
    },
    null,
    2
  )
);
