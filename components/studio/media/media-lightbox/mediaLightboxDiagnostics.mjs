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

test("Media Lightbox shell stays thin and preserves the public import", () => {
  const shell = read("components/studio/media/MediaLightbox.jsx");

  assert.match(shell, /useMediaLightboxViewModel/);
  assert.match(shell, /MediaLightboxView/);
  assert.match(shell, /LinkComponent=\{Link\}/);
  assert.doesNotMatch(shell, /fetchImageOutputDetails|createMediaReport/);
  assert.doesNotMatch(shell, /useState|useEffect|navigator|window\.confirm/);
});

test("ViewModel owns media aliases and active-item resolution", () => {
  const viewModel = read(
    "components/studio/media/media-lightbox/useMediaLightboxViewModel.js"
  );

  assert.match(viewModel, /image_output_id/);
  assert.match(viewModel, /image_generation_output_id/);
  assert.match(viewModel, /thumbnail_url/);
  assert.match(viewModel, /normalizeMediaLightboxItem/);
  assert.match(viewModel, /findIndex\(\(item\) => item\.id === activeItemId\)/);
});

test("ViewModel owns details, reporting, sharing, and deletion orchestration", () => {
  const viewModel = read(
    "components/studio/media/media-lightbox/useMediaLightboxViewModel.js"
  );

  assert.match(viewModel, /fetchImageOutputDetails/);
  assert.match(viewModel, /createMediaReport/);
  assert.match(viewModel, /navigator\?\.share/);
  assert.match(viewModel, /navigator\.clipboard\.writeText/);
  assert.match(viewModel, /confirmed: true/);
  // B5 danger-confirm recipe (ED1F propagation plan group G3):
  // window.confirm is retired in favor of the View's own confirm
  // panel, gated by deleteConfirmOpen state.
  assert.doesNotMatch(viewModel, /window\.confirm/);
  assert.match(viewModel, /deleteConfirmOpen/);
});

test("portable View owns presentation without importing Crestfall clients", () => {
  const view = read(
    "components/studio/media/media-lightbox/MediaLightbox.view.jsx"
  );

  assert.match(view, /ThumbnailButton|DetailsDialog|ReportDialog/i);
  assert.match(view, /Generate Variant/);
  assert.match(view, /Delete this image\?/);
  assert.match(view, /LinkComponent/);
  assert.doesNotMatch(view, /imageDetailsClient|mediaReportClient/);
  assert.doesNotMatch(view, /fetch\(|navigator|window\.confirm|next\/link/);
});

test("shared consumer contract remains connected", () => {
  const creationProfile = read("components/studio/creations/CreationProfilePage.jsx");
  const mediaHistory = read("components/studio/image-studio/MediaHistoryGrid.jsx");
  const mediaHistoryViewModel = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );
  const imageLibrary = read(
    "components/studio/my-creations/image-library/CreationImageLibraryPage.jsx"
  );

  assert.match(creationProfile, /MediaLightbox/);
  assert.match(mediaHistory, /MediaLightbox/);
  assert.match(imageLibrary, /MediaLightbox/);
  assert.match(mediaHistoryViewModel, /onDeleteItem: handleDeleteMedia/);
});

test("contract, fixtures, and development preview are explicit", () => {
  const contract = read(
    "components/studio/media/media-lightbox/MediaLightbox.contract.js"
  );
  const fixtures = read(
    "components/studio/media/media-lightbox/MediaLightbox.fixtures.js"
  );
  const page = read("app/dev/ui-preview/media-lightbox/page.jsx");
  const preview = read(
    "app/dev/ui-preview/media-lightbox/MediaLightboxPreviewClient.jsx"
  );

  assert.match(contract, /MEDIA_LIGHTBOX_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /MediaLightboxViewProps/);
  assert.match(fixtures, /mediaLightboxFixtureItems/);
  assert.match(fixtures, /image_output_id/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /<MediaLightbox/);
  assert.match(preview, /Last action/);
});

test("documentation and diagnostic command remain discoverable", () => {
  const readme = read("components/studio/media/media-lightbox/README.md");
  const packageJson = read("package.json");

  assert.match(readme, /Portable Skin/);
  assert.match(readme, /Creation Profile Page/);
  assert.match(readme, /Image Studio Media History/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/media-lightbox/);
  assert.match(packageJson, /diagnostics:loom:media-lightbox/);
});
