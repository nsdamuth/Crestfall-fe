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

test("Media Tile Quick Actions shell stays thin and preserves the public import", () => {
  const shell = read("components/studio/media/MediaTileQuickActions.jsx");

  assert.match(shell, /useMediaTileQuickActionsViewModel/);
  assert.match(shell, /MediaTileQuickActionsView/);
  assert.doesNotMatch(shell, /lucide-react|preventDefault|stopPropagation/);
  assert.doesNotMatch(shell, /Heart|Bookmark|Maximize2/);
});

test("ViewModel owns boolean normalization and display labels", () => {
  const viewModel = read(
    "components/studio/media/media-tile-quick-actions/useMediaTileQuickActionsViewModel.js"
  );

  assert.match(viewModel, /Boolean\(liked\)/);
  assert.match(viewModel, /Boolean\(bookmarked\)/);
  assert.match(viewModel, /isLiked \? "Unlike" : "Like"/);
  assert.match(
    viewModel,
    /isBookmarked \? "Remove bookmark" : "Bookmark"/
  );
  assert.match(viewModel, /onLike: onToggleLike/);
  assert.match(viewModel, /onBookmark: onToggleBookmark/);
});

test("portable View owns presentation and prevents parent-card activation", () => {
  const view = read(
    "components/studio/media/media-tile-quick-actions/MediaTileQuickActions.view.jsx"
  );

  assert.match(view, /event\.preventDefault\(\)/);
  assert.match(view, /event\.stopPropagation\(\)/);
  assert.match(view, /group-hover:opacity-100/);
  assert.match(view, /group-focus-within:opacity-100/);
  assert.match(view, /Heart/);
  assert.match(view, /Bookmark/);
  assert.match(view, /Maximize2/);
  assert.doesNotMatch(view, /mediaReactionClient|fetch\(|router|imageOutputId/);
});

test("existing application-facing callback contract remains unchanged", () => {
  const viewModel = read(
    "components/studio/media/media-tile-quick-actions/useMediaTileQuickActionsViewModel.js"
  );

  assert.match(viewModel, /onToggleLike/);
  assert.match(viewModel, /onToggleBookmark/);
  assert.match(viewModel, /onExpand/);
  assert.doesNotMatch(viewModel, /setMediaLike|setMediaBookmark/);
});

test("contract and fixtures cover inactive, active, and read-only states", () => {
  const contract = read(
    "components/studio/media/media-tile-quick-actions/MediaTileQuickActions.contract.js"
  );
  const fixtures = read(
    "components/studio/media/media-tile-quick-actions/MediaTileQuickActions.fixtures.js"
  );

  assert.match(contract, /MEDIA_TILE_QUICK_ACTIONS_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /MediaTileQuickActionsViewProps/);
  assert.match(fixtures, /mediaTileQuickActionsDefaultFixture/);
  assert.match(fixtures, /mediaTileQuickActionsActiveFixture/);
  assert.match(fixtures, /mediaTileQuickActionsReadOnlyFixture/);
});

test("preview is development-only and exercises the binding shell", () => {
  const page = read("app/dev/ui-preview/media-tile-quick-actions/page.jsx");
  const preview = read(
    "app/dev/ui-preview/media-tile-quick-actions/MediaTileQuickActionsPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /MediaTileQuickActions/);
  assert.match(preview, /mediaTileQuickActionsActiveFixture/);
  assert.match(preview, /Last action/);
});

test("shared consumers, documentation, and diagnostic command remain explicit", () => {
  const creationProfile = read(
    "components/studio/creations/CreationProfilePage.jsx"
  );
  const mediaHistory = read(
    "components/studio/image-studio/MediaHistoryGrid.jsx"
  );
  const imageLibrary = read(
    "components/studio/my-creations/image-library/CreationImageLibraryPage.jsx"
  );
  const readme = read(
    "components/studio/media/media-tile-quick-actions/README.md"
  );
  const packageJson = read("package.json");

  assert.match(creationProfile, /MediaTileQuickActions/);
  assert.match(mediaHistory, /MediaTileQuickActions/);
  assert.match(imageLibrary, /MediaTileQuickActions/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/media-tile-quick-actions/);
  assert.match(packageJson, /diagnostics:loom:media-tile-quick-actions/);
});
