import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const featureRoot = path.join(
  repoRoot,
  "components/studio/create/item-registry"
);

function read(relativePath) {
  return fs.readFileSync(path.join(featureRoot, relativePath), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Item Registry Builder Shell remains a LOOM binding", () => {
  const shell = read("ItemRegistryBuilder.jsx");
  assert.match(shell, /useItemRegistryBuilderViewModel/);
  assert.match(shell, /<ItemRegistryBuilderView/);
  assert.match(shell, /ItemStartingAssignmentEditor/);
  assert.doesNotMatch(shell, /createCreationDraft|buildItemRegistryCreationPayload/);
});

test("Item Registry Builder View is API and persistence free", () => {
  const view = read("item-registry-builder/ItemRegistryBuilder.view.jsx");
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|createCreationDraft/);
  assert.doesNotMatch(view, /buildItemRegistryCreationPayload|router\./);
  assert.doesNotMatch(view, /ItemStartingAssignmentEditor/);
});

test("Item Registry Builder ViewModel owns normalization and creation", () => {
  const viewModel = read(
    "item-registry-builder/useItemRegistryBuilderViewModel.js"
  );
  assert.match(viewModel, /normalizeItemRegistryData/);
  assert.match(viewModel, /normalizeItemEntry/);
  assert.match(viewModel, /buildItemRegistryCreationPayload/);
  assert.match(viewModel, /createDraft\(/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Legacy item registry hook delegates to the LOOM ViewModel", () => {
  const hook = readRepo(
    "components/studio/registries/hooks/useItemRegistryBuilder.js"
  );
  assert.match(hook, /useItemRegistryBuilderViewModel/);
  assert.doesNotMatch(hook, /createCreationDraft|buildItemRegistryCreationPayload/);
});

test("Item Registry Builder contract and fixtures cover core states", () => {
  const contract = read(
    "item-registry-builder/ItemRegistryBuilder.contract.js"
  );
  const fixtures = read(
    "item-registry-builder/ItemRegistryBuilder.fixtures.js"
  );
  assert.match(contract, /ITEM_REGISTRY_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /associations/);
  assert.match(contract, /tracking/);
  assert.match(fixtures, /itemRegistryBuilderOverviewFixture/);
  assert.match(fixtures, /itemRegistryBuilderTrackingFixture/);
  assert.match(fixtures, /itemRegistryBuilderErrorFixture/);
});

test("Item Registry Builder preview is development-only", () => {
  const page = readRepo("app/dev/ui-preview/item-registry-builder/page.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Item Registry create page retains the public Binding Shell", () => {
  const page = readRepo("app/studio/create/item-registry/page.jsx");
  const packageJson = readRepo("package.json");
  assert.match(page, /ItemRegistryBuilder/);
  assert.match(packageJson, /diagnostics:loom:item-registry-builder/);
});
