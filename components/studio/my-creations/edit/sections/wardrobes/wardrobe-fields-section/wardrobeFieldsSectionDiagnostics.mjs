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

test("Wardrobe Fields Shell remains a LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/wardrobes/WardrobeFieldsSection.jsx"
  );
  assert.match(shell, /useWardrobeFieldsSectionViewModel/);
  assert.match(shell, /<WardrobeFieldsSectionView/);
  assert.match(shell, /<OutfitPickerModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Wardrobe Fields View is API, persistence, and Outfit-picker free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /updateDataField|form\.data|selectionRules|promptGuidance/);
  assert.doesNotMatch(view, /OutfitPickerModal|normalizeWardrobeData/);
});

test("Wardrobe Fields ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/useWardrobeFieldsSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeWardrobeData/);
  assert.match(viewModel, /normalizeWardrobeEntry/);
  assert.match(viewModel, /createEmptyWardrobeEntry/);
  assert.match(viewModel, /normalizeListText/);
  assert.match(viewModel, /updateDataField\?\.\("entries"/);
  assert.match(viewModel, /updateDataField\?\.\("selectionRules"/);
  assert.match(viewModel, /updateDataField\?\.\("promptGuidance"/);
  assert.match(viewModel, /limitWardrobePromptValue/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Wardrobe Fields contract and fixtures cover all three sections", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.fixtures.js"
  );
  assert.match(contract, /WARDROBE_FIELDS_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /OutfitPickerModal/);
  assert.match(fixtures, /wardrobeFieldsOverviewFixture/);
  assert.match(fixtures, /wardrobeFieldsEntriesFixture/);
  assert.match(fixtures, /wardrobeFieldsRulesFixture/);
  assert.match(fixtures, /wardrobeFieldsEmptyFixture/);
});

test("Wardrobe Fields preview is development-only", () => {
  const page = read("app/dev/ui-preview/wardrobe-fields-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/wardrobe-fields-section/WardrobeFieldsSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /WardrobeFieldsSectionView/);
});

test("Creation Edit retains the public Wardrobe Fields Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import WardrobeFieldsSection from/);
  assert.match(editShell, /<WardrobeFieldsSection/);
  assert.match(editShell, /section="entries"/);
  assert.match(editShell, /section="rules"/);
});

test("Wardrobe Fields package documents storage and preview boundaries", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /creation\.data\.entries/);
  assert.match(readme, /\/dev\/ui-preview\/wardrobe-fields-section/);
});
