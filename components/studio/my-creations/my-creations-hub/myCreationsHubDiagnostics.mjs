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

test("My Creations Hub shell stays thin and owns application component bindings", () => {
  const shell = read("components/studio/my-creations/MyCreationsHub.jsx");

  assert.match(shell, /import Link from "next\/link"/);
  assert.match(shell, /CreationCard/);
  assert.match(shell, /CreationTagFilterRow/);
  assert.match(shell, /ResponsiveFilterPanel/);
  assert.match(shell, /useMyCreationsHubViewModel/);
  assert.match(shell, /MyCreationsHubView/);
  assert.match(shell, /InternalLinkComponent=\{Link\}/);
  assert.doesNotMatch(shell, /useState|useEffect|buildFeaturedMedia|typeMeta/);
});

test("ViewModel owns creation and JSONB normalization", () => {
  const viewModel = read(
    "components/studio/my-creations/my-creations-hub/useMyCreationsHubViewModel.js"
  );

  assert.match(viewModel, /buildFeaturedMedia/);
  assert.match(viewModel, /getFirstCreationImageUrl/);
  assert.match(viewModel, /typeMeta/);
  assert.match(viewModel, /creation\.data/);
  assert.match(viewModel, /canon_status/);
  assert.match(viewModel, /content_rating/);
  assert.match(viewModel, /Recently updated/);
  assert.match(viewModel, /No description has been added yet\./);
  assert.doesNotMatch(viewModel, /<MyCreationsHubView|<CreationCard|<section/);
});

test("ViewModel preserves filters, tag ranking, pagination, and engagement", () => {
  const viewModel = read(
    "components/studio/my-creations/my-creations-hub/useMyCreationsHubViewModel.js"
  );

  assert.match(viewModel, /INITIAL_VISIBLE_CREATIONS = 12/);
  assert.match(viewModel, /VISIBLE_CREATION_INCREMENT = 12/);
  assert.match(viewModel, /EAGER_CREATION_IMAGE_COUNT = 4/);
  assert.match(viewModel, /getTopCreationTags/);
  assert.match(viewModel, /filterOwnedCreations/);
  assert.match(viewModel, /creation\.type === activeTab/);
  assert.match(viewModel, /creation\.status === activeTab/);
  assert.match(viewModel, /searchableText\.includes/);
  assert.match(viewModel, /useCreationEngagementState/);
  assert.match(viewModel, /setVisibleCount\(INITIAL_VISIBLE_CREATIONS\)/);
});

test("portable View receives display-ready state and injected adapters", () => {
  const view = read(
    "components/studio/my-creations/my-creations-hub/MyCreationsHub.view.jsx"
  );

  assert.match(view, /FilterPanelComponent/);
  assert.match(view, /TagFilterComponent/);
  assert.match(view, /CreationCardComponent/);
  assert.match(view, /InternalLinkComponent/);
  assert.match(view, /remainingCreationCount/);
  assert.match(view, /mobileGridToggleLabel/);
  assert.doesNotMatch(
    view,
    /next\/link|creationMedia|creationEditConstants|useCreationEngagementState/
  );
  assert.doesNotMatch(view, /creation\.data|canon_status|content_rating/);
});

test("contract and fixtures document portability and representative creation states", () => {
  const contract = read(
    "components/studio/my-creations/my-creations-hub/MyCreationsHub.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/my-creations-hub/MyCreationsHub.fixtures.js"
  );

  assert.match(contract, /MY_CREATIONS_HUB_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /MyCreationsHubViewProps/);
  assert.match(contract, /ownsRawCreationNormalization: "ViewModel"/);
  assert.match(contract, /ownsNextLinkBinding: "Binding Shell"/);
  assert.match(fixtures, /myCreationsHubFixture/);
  assert.match(fixtures, /myCreationsHubEmptyFixture/);
  assert.match(fixtures, /CHARACTER/);
  assert.match(fixtures, /LOCATION/);
  assert.match(fixtures, /SCENARIO/);
  assert.match(fixtures, /PLAYER_CHARACTER/);
});

test("My Creations Hub preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/my-creations-hub/page.jsx");
  const preview = read(
    "app/dev/ui-preview/my-creations-hub/MyCreationsHubPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /MyCreationsHubView/);
  assert.match(preview, /getMyCreationsHubViewProps/);
  assert.match(preview, /myCreationsHubFixture/);
  assert.match(preview, /myCreationsHubEmptyFixture/);
  assert.match(preview, /Toggle engagement error/);
});

test("documentation and diagnostic command keep deferred Mechanics work explicit", () => {
  const readme = read(
    "components/studio/my-creations/my-creations-hub/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /Twelve-card initial pagination/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/my-creations-hub/);
  assert.match(packageJson, /diagnostics:loom:my-creations-hub/);
});
