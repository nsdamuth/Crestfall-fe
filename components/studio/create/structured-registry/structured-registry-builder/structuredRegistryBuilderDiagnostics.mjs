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

test("Structured Registry Builder Shell remains a thin LOOM binding", () => {
  const shell = readRepo(
    "components/studio/create/structured-registry/StructuredRegistryBuilder.jsx"
  );

  assert.match(shell, /useStructuredRegistryBuilderViewModel/);
  assert.match(shell, /<StructuredRegistryBuilderView \{\.\.\.viewProps\}/);
  assert.match(shell, /<RegistryLinkedCreationPickerModal/);
  assert.doesNotMatch(shell, /createCreationDraft|useRouter|normalizeListText/);
});

test("Structured Registry Builder View is API and persistence free", () => {
  const view = readFeature("StructuredRegistryBuilder.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(/);
  assert.doesNotMatch(view, /supabase|PostGraphile|createCreationDraft|useRouter/);
  assert.doesNotMatch(view, /RegistryLinkedCreationPickerModal/);
  assert.doesNotMatch(view, /useStructuredRegistryBuilder/);
});

test("Structured Registry Builder ViewModel owns registry adaptation and linked creation orchestration", () => {
  const viewModel = readFeature("useStructuredRegistryBuilderViewModel.js");

  assert.match(viewModel, /useStructuredRegistryBuilder/);
  assert.match(viewModel, /createLinkedCreationLink/);
  assert.match(viewModel, /normalizeListText/);
  assert.match(viewModel, /selectedCreationIds/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Structured Registry Builder contract and fixtures cover the shared registry states", () => {
  const contract = readFeature("StructuredRegistryBuilder.contract.js");
  const fixtures = readFeature("StructuredRegistryBuilder.fixtures.js");

  assert.match(contract, /structured-registry-builder\.view\.v1/);
  assert.match(contract, /relationships/);
  assert.match(contract, /prompt/);
  assert.match(fixtures, /structuredRegistryBuilderRelationshipsFixture/);
  assert.match(fixtures, /structuredRegistryBuilderEditFixture/);
  assert.match(fixtures, /EVENT_REGISTRY/);
});

test("Structured Registry Builder preview is development-only", () => {
  const page = readRepo(
    "app/dev/ui-preview/structured-registry-builder/page.jsx"
  );
  const preview = readRepo(
    "app/dev/ui-preview/structured-registry-builder/StructuredRegistryBuilderPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StructuredRegistryBuilderView/);
  assert.doesNotMatch(preview, /createCreationDraft|fetch\s*\(/);
});

test("All four create routes retain the public Structured Registry Builder Shell", () => {
  for (const route of [
    "organization-registry",
    "faction-registry",
    "event-registry",
    "quest-registry",
  ]) {
    const page = readRepo(`app/studio/create/${route}/page.jsx`);
    assert.match(page, /StructuredRegistryBuilder/);
  }
});

test("Creation Edit retains controlled Structured Registry Builder mode", () => {
  const editSection = readRepo(
    "components/studio/my-creations/edit/sections/structured-registries/StructuredRegistryFieldsSection.js"
  );

  assert.match(editSection, /mode="edit"/);
  assert.match(editSection, /activeTab=/);
  assert.match(editSection, /hideTabs/);
  assert.match(editSection, /onChange=/);
});
