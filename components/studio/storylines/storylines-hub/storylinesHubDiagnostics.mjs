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

test("Storylines Hub shell stays thin and owns the Next.js link binding", () => {
  const shell = read("components/studio/storylines/StorylinesHub.jsx");
  assert.match(shell, /import Link from "next\/link"/);
  assert.match(shell, /useStorylinesHubViewModel/);
  assert.match(shell, /StorylinesHubView/);
  assert.match(shell, /InternalLinkComponent=\{Link\}/);
  assert.doesNotMatch(shell, /fetchOwnedStorylines|useState|useEffect|data\?\./);
});

test("Storylines Hub ViewModel owns loading, errors, and client orchestration", () => {
  const viewModel = read(
    "components/studio/storylines/storylines-hub/useStorylinesHubViewModel.js"
  );
  assert.match(viewModel, /fetchOwnedStorylines/);
  assert.match(viewModel, /useState/);
  assert.match(viewModel, /useEffect/);
  assert.match(viewModel, /setStatus\("loading"\)/);
  assert.match(viewModel, /setStatus\("loaded"\)/);
  assert.match(viewModel, /setStatus\("error"\)/);
  assert.match(viewModel, /Storylines could not be loaded\./);
  assert.doesNotMatch(viewModel, /<StorylinesHubView|<div|<Link/);
});

test("Storyline normalization preserves routes, fallbacks, and node compatibility", () => {
  const viewModel = read(
    "components/studio/storylines/storylines-hub/useStorylinesHubViewModel.js"
  );
  assert.match(viewModel, /data\.nodes/);
  assert.match(viewModel, /data\.ordered_nodes/);
  assert.match(viewModel, /\/studio\/my-creations\/\$\{id\}\/edit/);
  assert.match(viewModel, /Untitled Storyline/);
  assert.match(viewModel, /No description provided\./);
  assert.match(viewModel, /node\$\{nodeCount === 1 \? "" : "s"\}/);
});

test("portable Storylines Hub View receives only display-ready state", () => {
  const view = read(
    "components/studio/storylines/storylines-hub/StorylinesHub.view.jsx"
  );
  assert.match(view, /showLoading/);
  assert.match(view, /showEmpty/);
  assert.match(view, /errorMessage/);
  assert.match(view, /card\.nodeCountLabel/);
  assert.match(view, /InternalLinkComponent/);
  assert.doesNotMatch(view, /next\/link|fetchOwnedStorylines|storylineClient/);
  assert.doesNotMatch(view, /card\.data|ordered_nodes|\.nodes/);
});

test("contract and fixtures document loaded, empty, loading, and error states", () => {
  const contract = read(
    "components/studio/storylines/storylines-hub/StorylinesHub.contract.js"
  );
  const fixtures = read(
    "components/studio/storylines/storylines-hub/StorylinesHub.fixtures.js"
  );
  assert.match(contract, /STORYLINES_HUB_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /StorylinesHubCardViewItem/);
  assert.match(contract, /InternalLinkComponent/);
  assert.match(fixtures, /storylinesHubLoadedFixture/);
  assert.match(fixtures, /storylinesHubEmptyFixture/);
  assert.match(fixtures, /storylinesHubLoadingFixture/);
  assert.match(fixtures, /storylinesHubErrorFixture/);
  assert.match(fixtures, /ordered_nodes/);
});

test("Storylines Hub preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/storylines-hub/page.jsx");
  const preview = read(
    "app/dev/ui-preview/storylines-hub/StorylinesHubPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StorylinesHubView/);
  assert.match(preview, /getStorylinesHubViewProps/);
  assert.match(preview, /storylinesHubLoadedFixture/);
  assert.match(preview, /storylinesHubEmptyFixture/);
  assert.match(preview, /storylinesHubLoadingFixture/);
  assert.match(preview, /storylinesHubErrorFixture/);
});

test("compatibility export, documentation, and diagnostic command remain explicit", () => {
  const compatibility = read(
    "components/studio/storylines/hooks/useStorylinesHubViewModel.js"
  );
  const readme = read(
    "components/studio/storylines/storylines-hub/README.md"
  );
  const packageJson = read("package.json");
  assert.match(compatibility, /storylines-hub\/useStorylinesHubViewModel/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /fetchOwnedStorylines/);
  assert.match(readme, /data\.ordered_nodes/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/storylines-hub/);
  assert.match(packageJson, /diagnostics:loom:storylines-hub/);
});
