import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("V2 Images reclaims mobile-only vertical whitespace without changing desktop spacing", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  const page = read("components/kit/studio-page/KitStudioPage.view.jsx");
  const header = read("components/studio/studio-page-header/StudioPageHeader.view.jsx");

  assert.match(live, /-mt-\[var\(--space-12\)\] sm:mt-0/);
  assert.match(live, /<KitStudioPageView\s+compactMobile/);
  assert.match(live, /<StudioPageHeaderView\s+compactMobile/);
  assert.match(page, /compactMobile = false/);
  assert.match(page, /py-\[var\(--space-2\)\].*sm:py-\[var\(--space-6\)\]/s);
  assert.match(header, /compactMobile = false/);
  assert.match(header, /gap-3 pb-4 sm:gap-6 sm:pb-8/);
});

test("mobile Images exposes the editor in the library toolbar instead of behind the bottom nav", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  const wrapper = read(
    "components/studio/image-studio/MediaHistoryGrid.jsx"
  );
  const history = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );

  assert.match(live, /mobilePrimaryActionLabel="Image Editor"/);
  assert.match(live, /onMobilePrimaryAction=\{\(\) => setMobileCreatorOpen\(true\)\}/);
  assert.doesNotMatch(live, /fixed bottom-\[calc\(var\(--space-4\)/);
  assert.match(wrapper, /mobilePrimaryActionLabel=\{props\.mobilePrimaryActionLabel\}/);
  assert.match(wrapper, /onMobilePrimaryAction=\{props\.onMobilePrimaryAction\}/);
  assert.match(history, /mobilePrimaryActionLabel && onMobilePrimaryAction/);
  assert.match(history, /cf-btn cf-btn--primary cf-btn--sm min-\[1100px\]:hidden/);
});

test("mobile Image Editor retains the real live creator panel and denser modal spacing", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.match(live, /ariaLabel="Image Editor"/);
  assert.match(live, /<KitImageCreatorPanel \{\.\.\.live\.panelProps\} \/>/);
  assert.match(live, /p-\[var\(--space-4\)\] pt-\[var\(--space-5\)\].*sm:p-\[var\(--space-6\)\]/s);
  assert.match(live, /Back to Image Editor/);
});

test("shared compact presentation options are additive and opt-in", () => {
  const page = read("components/kit/studio-page/KitStudioPage.view.jsx");
  const header = read("components/studio/studio-page-header/StudioPageHeader.view.jsx");

  assert.match(page, /compactMobile = false/);
  assert.match(page, /: "gap-\[var\(--space-6\)\] py-\[var\(--space-6\)\]"/);
  assert.match(header, /compactMobile = false/);
  assert.match(header, /: "gap-6 pb-8"/);
});

test("Images mobile usability changes stay inside presentation seams", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  const history = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );

  for (const source of [live, history]) {
    assert.doesNotMatch(source, /fetch\s*\(|crestfallApiRequest|postgraphile|supabase/i);
  }
});
