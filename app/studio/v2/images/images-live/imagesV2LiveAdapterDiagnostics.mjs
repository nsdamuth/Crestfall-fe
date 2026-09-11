import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("V2 Images runtime route binds the live composition instead of fixtures", () => {
  const page = read("app/studio/v2/images/page.jsx");
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.match(page, /ImagesV2Live/);
  assert.doesNotMatch(page, /ImagesV2Mockup/);
  assert.match(live, /KitImageCreatorPanel/);
  assert.match(live, /MediaHistoryGrid/);
  assert.match(live, /KitIngredientPicker/);
  assert.match(live, /KitSaveIngredientPreset/);
});

test("V2 Images adapter reuses application-owned workbench state", () => {
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );

  assert.match(adapter, /useStudioAccount/);
  assert.match(adapter, /useImageStudioWorkbenchViewModel/);
  assert.match(adapter, /getImageStudioComposerViewProps/);
  assert.match(adapter, /mediaHistoryProps: workbench\.mediaHistoryProps/);
  assert.match(adapter, /onGenerate: composer\.onGenerateImage/);
  assert.match(adapter, /renderStyleRailProps: composer\.renderStyleRailProps/);
  assert.match(adapter, /advancedTuningProps: composer\.advancedTuningProps/);
  // Session 2 (notes 3 and 4): both modal prop sets still derive from
  // the workbench, with only presentation keys (display label, save
  // availability, the Custom handlers) added in the adapter.
  assert.match(adapter, /\.\.\.workbench\.pickerModalProps/);
  assert.match(adapter, /\.\.\.workbench\.savePresetModalProps/);
  assert.match(adapter, /onUseCustom: workbench\.composerProps\.onStartCustomEntry/);
  assert.match(adapter, /onUseOnce: workbench\.composerProps\.onUseCustomOnce/);
});

test("V2 Images Views do not own transport or database access", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );

  for (const source of [live, adapter]) {
    assert.doesNotMatch(source, /fetch\s*\(/);
    assert.doesNotMatch(source, /crestfallApiRequest/);
    assert.doesNotMatch(source, /postgraphile/i);
    assert.doesNotMatch(source, /supabase/i);
    assert.doesNotMatch(source, /\.from\s*\(/);
  }
});

test("V2 Images retains the wide desktop workspace and mobile creator path", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.match(live, /min-w-0 flex-1/);
  assert.match(live, /w-\[24rem\]/);
  assert.match(live, /min-\[1100px\]:block/);
  assert.match(live, /mobilePrimaryActionLabel="Image Editor"/);
  assert.match(live, /onMobilePrimaryAction/);
  assert.doesNotMatch(live, /fixed bottom-\[calc\(var\(--space-4\)/);
  assert.doesNotMatch(live, /max-w-\[(?:7xl|6xl|5xl|4xl|3xl)\]/);
});

test("V2 Image Creator panel renders the snapping workflow rail and bounded tuning projection", () => {
  const panel = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
  );
  const vm = read(
    "components/kit/image-creator-panel/useKitImageCreatorPanelViewModel.js"
  );
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );

  assert.match(panel, /RenderStyleRail/);
  assert.match(panel, /Slide from fantasy-first workflows to realistic-first workflows/);
  assert.match(panel, /aria-valuetext=\{rail\.activeLabel\}/);
  assert.match(panel, /AdvancedTuning/);
  assert.match(panel, /Curated workflow controls/);
  assert.match(panel, /type="range"/);
  assert.match(panel, /Reset defaults/);
  assert.match(vm, /renderStyleRailProps/);
  assert.match(vm, /advancedTuningProps/);
  assert.match(adapter, /field\.id !== "render-style"/);
  assert.match(adapter, /setRenderStyle\?\.\("crestfall_fantasy"\)/);
});

test("unsupported video generation remains explicitly non-live", () => {
  const panel = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
  );

  assert.match(panel, /Generate video soon/);
});

// Keys declared in a destructuring signature or an object literal
// body, one per line, e.g. `remix = null,` or `remix: remix ...,` or
// the shorthand `remix,`. Continuation lines of a multi-line value
// never start with an identifier followed by `=`, `:` or `,`.
function declaredKeys(block) {
  const keys = [];
  for (const line of block.split("\n")) {
    const match = line.match(/^\s*([A-Za-z_$][\w$]*)\s*[=:,]/);
    if (match) keys.push(match[1]);
  }
  return keys;
}

function blockBetween(source, startPattern, endPattern) {
  const start = source.search(startPattern);
  assert.notEqual(start, -1, `missing block start ${startPattern}`);
  const afterStart = start + source.match(startPattern)[0].length;
  const end = source.slice(afterStart).search(endPattern);
  assert.notEqual(end, -1, `missing block end ${endPattern}`);
  return source.slice(afterStart, afterStart + end);
}

// Regression guard, 10 Sep 2026: the live page rendered the session 1
// Remix stub because the kit panel's pass-through ViewModel dropped
// `remix` on its way to the View, on the rail and on the sheet alike.
test("V2 Images live adapter passes the Remix stage to the panel on the rail and the sheet", () => {
  const live = read("app/studio/v2/images/ImagesV2Live.jsx");
  const sheet = read("app/studio/v2/images/images-live/ImagesV2ComposerSheet.jsx");
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );
  const panelViewModel = read(
    "components/kit/image-creator-panel/useKitImageCreatorPanelViewModel.js"
  );
  const panelView = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
  );

  // The adapter projects Remix into panelProps unconditionally: the
  // composer depends on creations, never on the history feed, so a
  // failed history fetch cannot null it.
  assert.match(adapter, /panelProps: \{[\s\S]*?\n\s+remix,\n/);
  assert.doesNotMatch(adapter, /historyError|historyStatus/);

  // Rail path: the desktop aside hands the panel the projected remix.
  assert.match(
    live,
    /<KitImageCreatorPanel \{\.\.\.live\.panelProps\} remix=\{live\.panelProps\.remix\} \/>/
  );
  // Sheet path: the page hands the sheet the same remix, and the sheet
  // hands it to the panel.
  assert.match(
    live,
    /<ImagesV2ComposerSheet\s+panelProps=\{live\.panelProps\}\s+remix=\{live\.panelProps\.remix\}/
  );
  assert.match(sheet, /<KitImageCreatorPanel \{\.\.\.panelProps\} remix=\{remix/);

  // The kit pass-through ViewModel accepts and returns every prop the
  // View reads, so no prop the contract adds can be dropped silently.
  const viewKeys = declaredKeys(
    blockBetween(panelView, /export default function KitImageCreatorPanelView\(\{/, /\n\}\) \{/)
  );
  const acceptedKeys = declaredKeys(
    blockBetween(panelViewModel, /export function useKitImageCreatorPanelViewModel\(\{/, /\n\} = \{\}\) \{/)
  );
  const returnedKeys = declaredKeys(
    blockBetween(panelViewModel, /\n  return \{/, /\n  \};/)
  );
  assert.ok(viewKeys.includes("remix"));
  assert.deepEqual(
    viewKeys.filter((key) => !acceptedKeys.includes(key)),
    [],
    "View props the kit ViewModel does not accept"
  );
  assert.deepEqual(
    viewKeys.filter((key) => !returnedKeys.includes(key)),
    [],
    "View props the kit ViewModel does not return"
  );
});
