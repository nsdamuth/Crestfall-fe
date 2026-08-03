import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Character Appearance Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/AppearanceSection.jsx"
  );
  assert.match(shell, /useCharacterAppearanceSectionViewModel/);
  assert.match(shell, /<CharacterAppearanceSectionView/);
  assert.match(shell, /<SkinToneModal/);
  assert.match(shell, /<OutfitPickerModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Character Appearance View is API, persistence, and application-picker free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /updateDataField|form\.data|clothing_source|default_outfit_id|default_wardrobe_id/
  );
  assert.doesNotMatch(
    view,
    /SkinToneModal|EyeColorModal|HairModal|TraitModal|OutfitPickerModal/
  );
});

test("Character Appearance ViewModel owns clothing normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/useCharacterAppearanceSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeDefaultOutfitSelection/);
  assert.match(viewModel, /normalizeDefaultWardrobeSelection/);
  assert.match(viewModel, /getClearedDefaultClothingFields/);
  assert.match(viewModel, /clothing_source/);
  assert.match(viewModel, /default_outfit_id/);
  assert.match(viewModel, /default_wardrobe_id/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Character Appearance contract and fixtures cover portable clothing states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.fixtures.js"
  );
  assert.match(contract, /CHARACTER_APPEARANCE_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /skinToneControl/);
  assert.match(contract, /onClearDefaultClothing/);
  assert.match(fixtures, /characterAppearanceSectionOutfitFixture/);
  assert.match(fixtures, /characterAppearanceSectionWardrobeFixture/);
  assert.match(fixtures, /characterAppearanceSectionEmptyFixture/);
  assert.match(fixtures, /characterAppearanceSectionMissingCallbacksFixture/);
});

test("Character Appearance preview is development-only", () => {
  const page = read(
    "app/dev/ui-preview/character-appearance-section/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/character-appearance-section/CharacterAppearanceSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CharacterAppearanceSectionView/);
});

test("Creation Edit retains the public Character Appearance Shell", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  assert.match(editShell, /import AppearanceSection from/);
  assert.match(editShell, /<AppearanceSection/);
});

test("Character Appearance package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /clothing_source/);
  assert.match(readme, /\/dev\/ui-preview\/character-appearance-section/);
});
