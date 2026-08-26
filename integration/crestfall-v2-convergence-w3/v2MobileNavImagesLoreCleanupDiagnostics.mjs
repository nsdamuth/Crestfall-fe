import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("mobile V2 drawer restores Home at the top of Play", () => {
  const view = read("components/studio/studio-mobile-nav/StudioMobileNav.view.jsx");
  assert.match(view, /label: "Play"[\s\S]*"Home", "Stories", "Adventures"/);
});

test("canonical shared Story, creation, builder and feedback routes retain V2 chrome", () => {
  const mobile = read("components/studio/studio-mobile-nav/useStudioMobileNavViewModel.js");
  const desktop = read("components/studio/studio-sidebar/useStudioSidebarViewModel.js");
  for (const source of [mobile, desktop]) {
    assert.match(source, /pathname\.startsWith\("\/studio\/story-rooms"\)/);
    assert.match(source, /pathname\.startsWith\("\/studio\/creations"\)/);
    assert.match(source, /pathname\.startsWith\("\/studio\/create"\)/);
    assert.match(source, /pathname\.startsWith\("\/studio\/feedback"\)/);
  }
  assert.match(mobile, /brandHref: v2Surface \? "\/studio\/v2\/home" : "\/studio"/);
});

test("list creation cards keep empty-art ornament clear of mobile titles", () => {
  const card = read("components/kit/creation-card/KitCreationCard.view.jsx");
  assert.match(card, /absolute inset-y-0 right-0 w-\[5\.5rem\][\s\S]*<KitArtPlaceholderView size="sm"/);
});

test("mobile Images exposes a persistent live Generate action", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  assert.match(live, /live\.panelProps\?\.onGenerate/);
  assert.match(live, /live\.panelProps\?\.canGenerate/);
  assert.match(live, /aria-label="Generate image"/);
  assert.match(live, /bottom-\[calc\(4\.6rem\+env\(safe-area-inset-bottom\)\)\]/);
  assert.match(live, /min-\[1100px\]:hidden/);
});

test("Image Library Filters is one functional responsive disclosure", () => {
  const history = read("components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx");
  const vm = read("components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js");
  assert.match(history, /<SlidersHorizontal size=\{14\}/);
  assert.match(history, /Filter library/);
  assert.match(history, /absolute right-0 top-full[\s\S]*hidden w-\[20rem\][\s\S]*md:block/);
  assert.match(history, /fixed inset-0 z-\[70\][\s\S]*md:hidden/);
  assert.match(history, /onSetFilter\?\.\(value\)/);
  assert.match(history, /onClose\?\.\(\)/);
  assert.match(vm, /onToggleFilters: \(\) => setFiltersOpen/);
  assert.match(vm, /onSetFilter: setActiveFilter/);
});

test("Image filters only expose supported media and activity facets", () => {
  const history = read("components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx");
  assert.match(history, /new Set\(\["ALL", "IMAGES", "VIDEOS"\]\)/);
  assert.match(history, />Activity</);
  assert.doesNotMatch(history, /Recent Characters|Enhanced|Edit\s*<\/FilterPill>/);
});

test("public Lore publication returns to V2 Lore instead of legacy Community", () => {
  const lore = read("components/studio/creations/lore/LorePublicCreationPage.jsx");
  assert.match(lore, /href="\/studio\/v2\/lore"/);
  assert.doesNotMatch(lore, /href="\/studio\/community"/);
  assert.match(lore, /<ArrowLeft size=\{14\} \/>[\s\S]*Lore/);
});
