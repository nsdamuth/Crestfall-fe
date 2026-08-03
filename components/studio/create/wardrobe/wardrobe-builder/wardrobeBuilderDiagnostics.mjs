import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const featureRoot = path.join(repoRoot, "components/studio/create/wardrobe");

function read(relativePath) {
  return fs.readFileSync(path.join(featureRoot, relativePath), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Wardrobe Builder Shell remains a LOOM binding", () => {
  const shell = read("WardrobeBuilder.jsx");
  assert.match(shell, /useWardrobeBuilderViewModel/);
  assert.match(shell, /<WardrobeBuilderView/);
  assert.match(shell, /OutfitPickerModal/);
  assert.doesNotMatch(shell, /createCreationDraft|buildWardrobeCreationPayload/);
});

test("Wardrobe Builder View is API and persistence free", () => {
  const view = read("wardrobe-builder/WardrobeBuilder.view.jsx");
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|createCreationDraft/);
  assert.doesNotMatch(view, /buildWardrobeCreationPayload|router\./);
  assert.doesNotMatch(view, /OutfitPickerModal|wardrobeUtils/);
});

test("Wardrobe Builder ViewModel owns normalization and creation", () => {
  const viewModel = read(
    "wardrobe-builder/useWardrobeBuilderViewModel.js"
  );
  assert.match(viewModel, /normalizeWardrobeData/);
  assert.match(viewModel, /normalizeWardrobeEntry/);
  assert.match(viewModel, /buildWardrobeCreationPayload/);
  assert.match(viewModel, /createDraft\(/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Legacy wardrobe hook delegates to the LOOM ViewModel", () => {
  const hook = read("hooks/useWardrobeBuilder.js");
  assert.match(hook, /useWardrobeBuilderViewModel/);
  assert.doesNotMatch(hook, /createCreationDraft|buildWardrobeCreationPayload/);
});

test("Wardrobe Builder contract and fixtures cover core states", () => {
  const contract = read("wardrobe-builder/WardrobeBuilder.contract.js");
  const fixtures = read("wardrobe-builder/WardrobeBuilder.fixtures.js");
  assert.match(contract, /WARDROBE_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /selection rules/i);
  assert.match(fixtures, /wardrobeBuilderOverviewFixture/);
  assert.match(fixtures, /wardrobeBuilderEntriesFixture/);
  assert.match(fixtures, /wardrobeBuilderRulesFixture/);
  assert.match(fixtures, /wardrobeBuilderErrorFixture/);
});

test("Wardrobe Builder preview is development-only", () => {
  const page = readRepo("app/dev/ui-preview/wardrobe-builder/page.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Wardrobe create page retains the public Binding Shell", () => {
  const page = readRepo("app/studio/create/wardrobe/page.js");
  const packageJson = readRepo("package.json");
  assert.match(page, /WardrobeBuilder/);
  assert.match(packageJson, /diagnostics:loom:wardrobe-builder/);
});
