import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { applyMediaHistoryFilters, normalizeMediaFilterModel } from "./mediaHistoryVisibility.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Media History Grid shell stays thin and preserves application slots", () => {
  const shell = read("components/studio/image-studio/MediaHistoryGrid.jsx");
  // The three injected controls moved to MediaHistoryGridSkin.jsx on
  // 6 Sep 2026 (FE/FILTERS) so a page can call the ViewModel itself.
  const skin = read("components/studio/image-studio/MediaHistoryGridSkin.jsx");

  assert.match(shell, /useMediaHistoryGridViewModel/);
  assert.match(shell, /MediaHistoryGridSkin/);
  assert.match(skin, /MediaHistoryGridView/);
  assert.match(skin, /FilterPillComponent=\{FilterPill\}/);
  assert.match(skin, /MediaTileQuickActions/);
  assert.match(skin, /MediaLightbox/);
  assert.doesNotMatch(shell, /fetchMediaReactions|deleteImageOutput/);
  assert.doesNotMatch(shell, /useState|useEffect|window\.confirm/);
});

test("ViewModel owns legacy output aliases and stored dimensions", () => {
  const viewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );

  assert.match(viewModel, /image_output_id/);
  assert.match(viewModel, /image_generation_output_id/);
  assert.match(viewModel, /provider_metadata/);
  assert.match(viewModel, /settings_snapshot/);
  assert.match(viewModel, /normalizeMediaHistoryItem/);
  assert.match(viewModel, /storedWidth/);
});

test("ViewModel owns reactions and destructive output orchestration", () => {
  const viewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );

  assert.match(viewModel, /fetchMediaReactions/);
  assert.match(viewModel, /setMediaLike/);
  assert.match(viewModel, /setMediaBookmark/);
  assert.match(viewModel, /deleteImageOutput/);
  assert.match(viewModel, /owner_deleted_from_image_studio/);
  assert.match(viewModel, /owner_bulk_deleted_from_image_studio/);
  assert.match(viewModel, /deleteMediaHistoryOutputsWithConcurrency/);
  assert.match(viewModel, /bulkDeleteConfirmOpen/);
  assert.match(viewModel, /handleConfirmBulkDelete/);
  assert.doesNotMatch(viewModel, /window\.(?:confirm|alert)/);
});

test("portable View owns masonry and presentation without Crestfall clients", () => {
  const view = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );

  assert.match(view, /ResizeObserver/);
  assert.match(view, /gridRowEnd/);
  assert.match(view, /renderQuickActions/);
  assert.match(view, /renderLightbox/);
  assert.doesNotMatch(view, /mediaReactionClient|imageOutputClient/);
  assert.doesNotMatch(view, /fetchMediaReactions|deleteImageOutput/);
});

// AF5 (ASSET-FOLDERS, 14 Sep 2026): the View's bulk section and its
// confirm modal are gone; the page composes the one Kit selection bar
// against the same ViewModel handlers by name (contract law), so the
// ViewModel still returns every bulk handler it did.
test("the bulk section left the View and the ViewModel keeps its handlers by name", () => {
  const view = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );
  const viewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );
  const page = read("app/studio/v2/images/ImagesV2Live.jsx");

  assert.doesNotMatch(view, /Select all visible|Delete selected|Delete permanently|KitModalFrame/);
  assert.doesNotMatch(view, /KitSelectionBar/);
  assert.match(view, /\{selectionMode \? "Done" : "Select"\}/);
  for (const handler of [
    "onToggleSelectionMode",
    "onToggleMediaSelection",
    "onToggleSelectAllVisible",
    "onClearSelection",
    "onBulkDeleteSelected",
    "onCancelBulkDelete",
    "onConfirmBulkDelete",
  ]) {
    assert.match(viewModel, new RegExp(`${handler}:`), `ViewModel still returns ${handler}`);
  }
  assert.equal((page.match(/<KitSelectionBar/g) || []).length, 1);
  assert.match(page, /onDelete=\{handleDeleteSelected\}/);
  assert.match(page, /grid\.onConfirmBulkDelete\?\.\(\)/);
  assert.match(page, /onDone=\{grid\.onToggleSelectionMode\}/);
  assert.match(page, /\{grid\.selectionMode \? null : \(/);
  // Follow-up 1 item 2: Select sits in the shared bar's controlsSlot
  // on this page, before Folders and Filter; the View's own toggle is
  // off here through showSelectionToggle and stays on the legacy page.
  assert.match(page, /showSelectionToggle=\{false\}/);
  assert.match(view, /hasSelectableMedia && showSelectionToggle/);
  // Follow-up 2 items 3 and 5: the density toggle rides the same row,
  // last, so the four controls share one row's gaps.
  const slot = page.slice(page.indexOf("controlsSlot={"), page.indexOf("bannerSlot={"));
  const order = ["onToggleSelectionMode", "onToggleFolders", "KitDropdownView", "ViewModeToggleView"].map((needle) => slot.indexOf(needle));
  assert.ok(order.every((index) => index >= 0) && order[0] < order[1] && order[1] < order[2] && order[2] < order[3], "Select, Folders, Filter, density in that order");
  assert.doesNotMatch(slot, /viewModeSlot=/);
  assert.match(slot, /justify-between/);
});

// AF5 item 2: folder membership filters after the Library filter and
// the two compose. A folder holding an image and a video with the
// Videos filter on yields only the video.
test("folder membership composes with the Library filter", () => {
  const image = { id: "img-1", imageOutputId: "img-1", type: "IMAGE" };
  const video = { id: "vid-1", imageOutputId: "vid-1", type: "VIDEO" };
  const outside = { id: "img-2", imageOutputId: "img-2", type: "IMAGE" };
  const items = [image, video, outside];
  const folderItemIds = ["img-1", "vid-1"];

  assert.deepEqual(
    applyMediaHistoryFilters(items, { media: "VIDEOS", activity: [] }, folderItemIds),
    [video]
  );
  assert.deepEqual(applyMediaHistoryFilters(items, { media: "ALL", activity: [] }, folderItemIds), [image, video]);
  assert.deepEqual(applyMediaHistoryFilters(items, { media: "VIDEOS", activity: [] }, null), [video]);
  assert.deepEqual(applyMediaHistoryFilters(items, "ALL", null), items);
  assert.deepEqual(normalizeMediaFilterModel("BOOKMARKED"), { media: "ALL", activity: ["BOOKMARKED"] });

  const viewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );
  assert.match(viewModel, /folderItemIds = null,/);
  assert.match(viewModel, /applyMediaHistoryFilters\(items, activeFilter, folderItemIds\)/);
});

test("existing Image Studio consumer remains connected through the Workbench boundary", () => {
  const workbenchShell = read(
    "components/studio/image-studio/ImageStudioWorkbench.jsx"
  );
  const workbenchView = read(
    "components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.view.jsx"
  );
  const workbenchViewModel = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );
  const mediaShell = read("components/studio/image-studio/MediaHistoryGrid.jsx");

  assert.match(workbenchShell, /import MediaHistoryGrid/);
  assert.match(workbenchShell, /MediaHistoryGridComponent=\{MediaHistoryGrid\}/);
  assert.match(workbenchView, /MediaHistoryGridComponent/);
  assert.match(workbenchView, /<MediaHistoryGridComponent \{\.\.\.mediaHistoryProps\} \/>/);
  assert.match(workbenchViewModel, /mediaHistoryProps:/);
  assert.match(workbenchViewModel, /generatedMedia: mediaItems/);
  assert.match(workbenchViewModel, /onLoadMoreHistory: loadMoreImageGenerationHistory/);
  assert.match(mediaShell, /export default function MediaHistoryGrid/);
});

test("contract, fixtures, and protected preview are explicit", () => {
  const contract = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.contract.js"
  );
  const fixtures = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.fixtures.js"
  );
  const page = read("app/dev/ui-preview/media-history-grid/page.jsx");
  const preview = read(
    "app/dev/ui-preview/media-history-grid/MediaHistoryGridPreviewClient.jsx"
  );

  assert.match(contract, /MEDIA_HISTORY_GRID_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /MediaHistoryGridViewProps/);
  assert.match(fixtures, /mediaHistoryGridFixtureItems/);
  assert.match(fixtures, /pending-media-preview/);
  assert.match(fixtures, /failed-media-preview/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /<MediaHistoryGrid/);
  assert.match(preview, /populated/);
  assert.match(preview, /Load More completed/);
});


test("V2 Image Library owns asset search, opaque filters, and working Grid/Large density", () => {
  const viewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );
  const view = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx"
  );
  const contract = read(
    "components/studio/image-studio/media-history-grid/MediaHistoryGrid.contract.js"
  );

  assert.match(viewModel, /fetchOwnedCreations/);
  assert.match(viewModel, /creationSearchLabelsById/);
  assert.match(viewModel, /searchQuery/);
  assert.match(viewModel, /sourceAssetsSnapshot|source_assets_snapshot/);
  assert.match(viewModel, /grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3/);
  assert.match(viewModel, /grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4/);

  assert.match(view, /Search assets/);
  assert.match(view, /Character, outfit, preset, or prompt/);
  assert.match(view, /bg-\[var\(--surface-2\)\]/);
  assert.doesNotMatch(view, /bg-\[var\(--panel-glass\)\]/);
  assert.match(view, /min-\[1100px\]:!hidden/);
  assert.match(view, /\{compactMobileGrid \? "Large" : "Grid"\}/);
  assert.match(view, /className=\{`grid \$\{mobileGridClass\}`\}/);

  assert.match(contract, /MEDIA_HISTORY_GRID_VIEW_CONTRACT_VERSION = "1\.6\.0"/);
  assert.match(contract, /onChangeSearchQuery/);
  assert.match(contract, /onClearFilters/);
});

test("documentation and diagnostics command remain discoverable", () => {
  const readme = read(
    "components/studio/image-studio/media-history-grid/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Portable Skin/);
  assert.match(readme, /bulk deletion/);
  assert.match(readme, /MediaTileQuickActions/);
  assert.match(readme, /MediaLightbox/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/media-history-grid/);
  assert.match(packageJson, /diagnostics:loom:media-history-grid/);
});
