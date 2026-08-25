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

  assert.match(viewModel, /bulkDeleteConfirmOpen/);
  assert.match(viewModel, /handleConfirmBulkDelete/);
  assert.doesNotMatch(viewModel, /window\.(?:confirm|alert)/);
  assert.match(view, /KitModalFrame/);
  assert.match(view, /Delete permanently/);
  assert.match(view, /This action cannot\s+be undone/);
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

  assert.match(view, /Choose your ingredients and generate an image/);
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
