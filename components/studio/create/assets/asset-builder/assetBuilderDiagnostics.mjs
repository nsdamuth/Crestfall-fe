import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Asset Builder Shell remains a focused LOOM binding", () => {
  const shell = read("components/studio/create/assets/AssetBuilderShell.jsx");

  assert.match(shell, /useAssetBuilderViewModel/);
  assert.match(shell, /<AssetBuilderView/);
  assert.match(shell, /locationRuntimeContent/);
  assert.match(shell, /locationRegistryContent/);
  assert.match(shell, /parentPickerContent/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Asset Builder View is API and persistence free", () => {
  const view = read(
    "components/studio/create/assets/asset-builder/AssetBuilder.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createCreationDraft|createVisualAssetDraft|router\./
  );
  assert.doesNotMatch(
    view,
    /import .*LocationParentPickerModal|import .*LocationRuntimeModulesSection|import .*LocationRegistryAttachmentsSection/
  );
  assert.match(view, /locationRuntimeContent/);
  assert.match(view, /locationRegistryContent/);
});

test("Asset Builder ViewModel owns payload, save, and location compatibility", () => {
  const viewModel = read(
    "components/studio/create/assets/asset-builder/useAssetBuilderViewModel.js"
  );

  assert.match(viewModel, /buildAssetCreationPayload/);
  assert.match(viewModel, /getCreationTypeFromAssetConfig/);
  assert.match(viewModel, /builder: "VISUAL_ASSET_BUILDER"/);
  assert.match(viewModel, /createVisualAssetDraft/);
  assert.match(viewModel, /selectParentLocation/);
  assert.match(viewModel, /router\.push/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Visual asset client delegates creation through the shared creation client", () => {
  const client = read("lib/client/studio/assets/assetClient.js");

  assert.match(client, /createCreationDraft/);
  assert.match(client, /Visual asset draft could not be saved\./);
  assert.doesNotMatch(client, /\bfetch\s*\(/);
});

test("Asset Builder contract and fixtures cover supported asset states", () => {
  const contract = read(
    "components/studio/create/assets/asset-builder/AssetBuilder.contract.js"
  );
  const fixtures = read(
    "components/studio/create/assets/asset-builder/AssetBuilder.fixtures.js"
  );

  assert.match(contract, /ASSET_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(fixtures, /assetBuilderOutfitFixture/);
  assert.match(fixtures, /assetBuilderPoseFixture/);
  assert.match(fixtures, /assetBuilderImagePresetFixture/);
  assert.match(fixtures, /assetBuilderLocationFixture/);
  assert.match(fixtures, /assetBuilderEmptyFixture/);
  assert.match(fixtures, /assetBuilderSavingFixture/);
  assert.match(fixtures, /assetBuilderSavedFixture/);
  assert.match(fixtures, /assetBuilderErrorFixture/);
});

test("Asset Builder preview is development-only", () => {
  const page = read("app/dev/ui-preview/asset-builder/page.jsx");

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create asset pages retain the public AssetBuilderShell", () => {
  for (const pagePath of [
    "app/studio/create/outfit/page.js",
    "app/studio/create/pose/page.js",
    "app/studio/create/image-preset/page.js",
  ]) {
    const page = read(pagePath);

    assert.match(
      page,
      /import AssetBuilderShell from "@\/components\/studio\/create\/assets\/AssetBuilderShell"/
    );
    assert.match(page, /<AssetBuilderShell config=\{config\} \/>/);
  }
});
