import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Item Registry Fields Shell remains a LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/item-registries/ItemRegistryFieldsSection.jsx"
  );
  assert.match(shell, /useItemRegistryFieldsSectionViewModel/);
  assert.match(shell, /<ItemRegistryFieldsSectionView/);
  assert.match(shell, /<ItemStartingAssignmentEditor/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Item Registry Fields View is API, persistence, and application-editor free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /updateDataField|form\.data|prompt_guidance/);
  assert.doesNotMatch(view, /ItemStartingAssignmentEditor|normalizeItemRegistryData/);
});

test("Item Registry Fields ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/useItemRegistryFieldsSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeItemRegistryData/);
  assert.match(viewModel, /normalizeItemEntry/);
  assert.match(viewModel, /createEmptyItemEntry/);
  assert.match(viewModel, /normalizeListText/);
  assert.match(viewModel, /updateDataField\?\.\("entries"/);
  assert.match(viewModel, /updateDataField\?\.\("prompt_guidance"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Item Registry Fields contract and fixtures cover all six sections", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.fixtures.js"
  );
  assert.match(contract, /ITEM_REGISTRY_FIELDS_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /ItemStartingAssignmentEditor/);
  assert.match(fixtures, /itemRegistryFieldsOverviewFixture/);
  assert.match(fixtures, /itemRegistryFieldsEntriesFixture/);
  assert.match(fixtures, /itemRegistryFieldsAssociationsFixture/);
  assert.match(fixtures, /itemRegistryFieldsTrackingFixture/);
  assert.match(fixtures, /itemRegistryFieldsPromptFixture/);
  assert.match(fixtures, /itemRegistryFieldsReviewFixture/);
});

test("Item Registry Fields preview is development-only", () => {
  const page = read("app/dev/ui-preview/item-registry-fields-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/item-registry-fields-section/ItemRegistryFieldsSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /ItemRegistryFieldsSectionView/);
});

test("Creation Edit retains the public Item Registry Fields Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import ItemRegistryFieldsSection from/);
  assert.match(editShell, /<ItemRegistryFieldsSection/);
  assert.match(editShell, /section="overview"/);
  assert.match(editShell, /section="entries"/);
  assert.match(editShell, /section="associations"/);
  assert.match(editShell, /section="tracking"/);
  assert.match(editShell, /section="prompt"/);
  assert.match(editShell, /section="review"/);
});

test("Item Registry Fields package documents storage and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /creation\.data\.entries/);
  assert.match(readme, /\/dev\/ui-preview\/item-registry-fields-section/);
});
