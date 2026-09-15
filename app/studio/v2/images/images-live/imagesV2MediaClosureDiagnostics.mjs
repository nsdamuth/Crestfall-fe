import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("V2 media history uses portable danger confirmation instead of browser dialogs", () => {
  const viewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );
  const view = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );

  // The confirmation moved to the Kit selection bar (ASSET-FOLDERS
  // AF4 and AF5, 14 Sep 2026): the grid View no longer carries it.
  const bar = read("components/kit/selection-bar/KitSelectionBar.view.jsx");
  const page = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.match(viewModel, /bulkDeleteConfirmOpen/);
  assert.match(viewModel, /handleConfirmBulkDelete/);
  assert.doesNotMatch(viewModel, /window\.(?:confirm|alert)/);
  assert.doesNotMatch(view, /KitModalFrame|Delete permanently/);
  assert.match(bar, /KitModalFrame/);
  assert.match(page, /<KitSelectionBar/);
  assert.match(page, /This cannot be undone\./);
});

test("creation image library returns variant generation to V2 Images", () => {
  const viewModel = read(
    "components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js"
  );

  assert.match(viewModel, /const imageStudioHref = "\/studio\/v2\/images"/);
  assert.doesNotMatch(viewModel, /\/studio\/image-studio/);
});

test("V2 Images empty state reflects multi-ingredient generation", () => {
  const view = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );

  // "assets" replaced "ingredients" in this copy at the FE/MEDIA-STUDIO
  // review (the View reads "Choose your assets and generate an image or
  // video"); the assertion follows the ruled copy.
  assert.match(view, /Choose your assets and generate an image/);
  assert.doesNotMatch(view, /Select a character and generate an image/);
});

test("media closure remains inside Images-owned presentation and ViewModel seams", () => {
  const view = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );
  const viewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );

  assert.doesNotMatch(view, /fetch\(|supabase|postgraphile|imageOutputClient|mediaReactionClient/i);
  assert.match(viewModel, /deleteImageOutput/);
  assert.match(viewModel, /fetchMediaReactions/);
});
