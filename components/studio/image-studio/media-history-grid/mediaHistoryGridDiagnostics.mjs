import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Media History Grid shell stays thin and preserves application slots", () => {
  const shell = read("components/studio/image-studio/MediaHistoryGrid.jsx");

  assert.match(shell, /useMediaHistoryGridViewModel/);
  assert.match(shell, /MediaHistoryGridView/);
  assert.match(shell, /FilterPillComponent=\{FilterPill\}/);
  assert.match(shell, /MediaTileQuickActions/);
  assert.match(shell, /MediaLightbox/);
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
  assert.match(view, /Select all visible/i);
  assert.match(view, /Delete selected/i);
  assert.match(view, /renderQuickActions/);
  assert.match(view, /renderLightbox/);
  assert.match(view, /KitModalFrame/);
  assert.match(view, /Delete permanently/);
  assert.match(view, /This action cannot\s+be undone/);
  assert.doesNotMatch(view, /mediaReactionClient|imageOutputClient/);
  assert.doesNotMatch(view, /fetchMediaReactions|deleteImageOutput/);
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

  assert.match(contract, /MEDIA_HISTORY_GRID_VIEW_CONTRACT_VERSION = "1\.3\.0"/);
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
