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

test("Creation Image Library shell stays thin and owns application slots", () => {
  const shell = read(
    "components/studio/my-creations/image-library/CreationImageLibraryPage.jsx"
  );

  assert.match(shell, /useCreationImageLibraryPageViewModel/);
  assert.match(shell, /CreationImageLibraryPageView/);
  assert.match(shell, /BackLinkComponent=\{Link\}/);
  assert.match(shell, /MediaTileQuickActions/);
  assert.match(shell, /MediaLightbox/);
  assert.doesNotMatch(shell, /fetchMediaReactions|deleteImageOutput/);
  assert.doesNotMatch(shell, /useState|useEffect|window\.confirm/);
});

test("ViewModel composes the existing image-library Chassis", () => {
  const viewModel = read(
    "components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js"
  );

  assert.match(viewModel, /useCreationImageLibraryViewModel/);
  assert.match(viewModel, /assignFeaturedSlot/);
  assert.match(viewModel, /hideImage/);
  assert.match(viewModel, /showImage/);
  assert.match(viewModel, /filteredVisibleImages/);
  assert.match(viewModel, /pagedVisibleImages/);
});

test("ViewModel owns aliases, reactions, and destructive orchestration", () => {
  const viewModel = read(
    "components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js"
  );

  assert.match(viewModel, /image_output_id/);
  assert.match(viewModel, /image_width/);
  assert.match(viewModel, /providerMetadata/);
  assert.match(viewModel, /fetchMediaReactions/);
  assert.match(viewModel, /setMediaLike/);
  assert.match(viewModel, /setMediaBookmark/);
  assert.match(viewModel, /deleteImageOutput/);
  assert.match(viewModel, /owner_deleted_from_character_library/);
  assert.match(viewModel, /window\.confirm/);
});

test("portable View renders library states without Crestfall clients", () => {
  const view = read(
    "components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view.jsx"
  );

  assert.match(view, /Featured Images/);
  assert.match(view, /Visible Library/);
  assert.match(view, /Hidden From Character Library/);
  assert.match(view, /No matching images/);
  assert.match(view, /renderQuickActions/);
  assert.match(view, /renderLightbox/);
  assert.doesNotMatch(view, /mediaReactionClient|imageOutputClient/);
  assert.doesNotMatch(view, /fetchMediaReactions|deleteImageOutput/);
});

test("existing route consumer remains connected", () => {
  const routes = [
    "app/studio/my-creations/[id]/image-library/page.jsx",
    "app/studio/my-creations/[id]/image-library/page.js",
  ];
  const existing = routes.find((candidate) =>
    fs.existsSync(path.join(repoRoot, candidate))
  );
  assert.ok(existing, "image-library route should remain present");
  assert.match(read(existing), /CreationImageLibraryPage/);
});

test("contract, fixtures, and protected preview are explicit", () => {
  const contract = read(
    "components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.fixtures.js"
  );
  const page = read("app/dev/ui-preview/creation-image-library-page/page.jsx");
  const preview = read(
    "app/dev/ui-preview/creation-image-library-page/CreationImageLibraryPagePreviewClient.jsx"
  );

  assert.match(contract, /CREATION_IMAGE_LIBRARY_PAGE_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CreationImageLibraryPageViewProps/);
  assert.match(fixtures, /creationImageLibraryFixtureImages/);
  assert.match(fixtures, /library-entry-blocked/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CreationImageLibraryPageView/);
  assert.match(preview, /No matching images/);
});

test("documentation and diagnostics command remain discoverable", () => {
  const readme = read(
    "components/studio/my-creations/image-library/creation-image-library-page/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Portable Skin/);
  assert.match(readme, /MediaTileQuickActions/);
  assert.match(readme, /MediaLightbox/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/creation-image-library-page/);
  assert.match(packageJson, /diagnostics:loom:creation-image-library-page/);
});
