import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const featureDir = path.dirname(currentFile);
const repoRoot = path.resolve(featureDir, "../../../../..");

function readFeature(name) {
  return fs.readFileSync(path.join(featureDir, name), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Location Registry Builder Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/create/location-registry/LocationRegistryBuilder.jsx"
  );

  assert.match(shell, /useLocationRegistryBuilderViewModel/);
  assert.match(shell, /<LocationRegistryBuilderView \{\.\.\.viewProps\}/);
  assert.doesNotMatch(shell, /createCreationDraft|fetchOwnedCreations|useRouter/);
});

test("Location Registry Builder View is API and persistence free", () => {
  const view = readFeature("LocationRegistryBuilder.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(/);
  assert.doesNotMatch(
    view,
    /supabase|PostGraphile|createCreationDraft|updateCreationDraft|useRouter/
  );
  assert.doesNotMatch(view, /useLocationRegistryBuilder/);
  assert.doesNotMatch(view, /locationRegistryUtils/);
  assert.doesNotMatch(view, /getDistanceModeDisplay/);
  assert.match(view, /connection\.distanceModeDisplay/);
});

test("Location Registry Builder ViewModel owns application adaptation", () => {
  const viewModel = readFeature("useLocationRegistryBuilderViewModel.js");

  assert.match(viewModel, /useLocationRegistryBuilder/);
  assert.match(viewModel, /normalizeListText/);
  assert.match(viewModel, /withEntryPresentation/);
  assert.match(viewModel, /withConnectionPresentation/);
  assert.match(viewModel, /withConnectionListPresentation/);
  assert.match(viewModel, /distanceModeDisplay/);
  assert.match(viewModel, /withPresencePresentation/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Location Registry Builder contract and fixtures cover core states", () => {
  const contract = readFeature("LocationRegistryBuilder.contract.js");
  const fixtures = readFeature("LocationRegistryBuilder.fixtures.js");

  assert.match(contract, /location-registry-builder\.view\.v1/);
  assert.match(contract, /connections/);
  assert.match(contract, /presence/);
  assert.match(contract, /weather/);
  assert.match(fixtures, /locationRegistryBuilderEntriesFixture/);
  assert.match(fixtures, /locationRegistryBuilderConnectionsFixture/);
  assert.match(fixtures, /locationRegistryBuilderPresenceFixture/);
  assert.match(fixtures, /locationRegistryBuilderEditFixture/);
});

test("Location Registry Builder preview is development-only", () => {
  const page = readRepo(
    "app/dev/ui-preview/location-registry-builder/page.jsx"
  );
  const preview = readRepo(
    "app/dev/ui-preview/location-registry-builder/LocationRegistryBuilderPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /LocationRegistryBuilderView/);
  assert.doesNotMatch(preview, /createCreationDraft|fetch\s*\(/);
});

test("Location Registry create route retains the public Shell", () => {
  const page = readRepo("app/studio/create/location-registry/page.jsx");
  assert.match(page, /LocationRegistryBuilder/);
});

test("Creation Edit retains controlled Location Registry mode", () => {
  const editSection = readRepo(
    "components/studio/my-creations/edit/sections/location-registries/LocationRegistryFieldsSection.jsx"
  );

  assert.match(editSection, /mode="edit"/);
  assert.match(editSection, /activeTab=/);
  assert.match(editSection, /hideTabs/);
  assert.match(editSection, /onChange=/);
});
