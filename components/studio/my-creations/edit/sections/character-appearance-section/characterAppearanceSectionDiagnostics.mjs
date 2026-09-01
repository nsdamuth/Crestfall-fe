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
  assert.match(shell, /creationType="IMAGE_PRESET"/);
  assert.match(shell, /normalizeDefaultImagePresetSelection/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Character Appearance View is API, persistence, and application-picker free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /updateDataField|form\.data|clothing_source|default_outfit_id|default_wardrobe_id|default_image_preset_id/
  );
  assert.doesNotMatch(
    view,
    /SkinToneModal|EyeColorModal|HairModal|TraitModal|OutfitPickerModal/
  );
  assert.match(view, /Default Clothing/);
  assert.doesNotMatch(view, />Clothing Style</);
  assert.match(view, /Image Generation Guidance/);
  assert.match(view, /negativePromptMaxLength/);
  assert.equal(
    [...view.matchAll(/imageGenerationGuidanceLabel/g)].length,
    2,
    "image guidance must be owned only by the top-level Appearance view prop and field"
  );
  assert.equal(
    [...view.matchAll(/onChangeNegativePrompt/g)].length,
    2,
    "negative-prompt callback must not leak into nested cards without props"
  );
});

test("Character Appearance ViewModel owns clothing and default image-preset normalization/storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/useCharacterAppearanceSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeDefaultOutfitSelection/);
  assert.match(viewModel, /normalizeDefaultWardrobeSelection/);
  assert.match(viewModel, /getClearedDefaultClothingFields/);
  assert.match(viewModel, /clothing_source/);
  assert.match(viewModel, /default_outfit_id/);
  assert.match(viewModel, /default_wardrobe_id/);
  assert.match(viewModel, /normalizeDefaultImagePresetSelection/);
  assert.match(viewModel, /getClearedDefaultImagePresetFields/);
  assert.match(viewModel, /default_image_preset_id/);
  assert.match(viewModel, /fetchOwnedCreations/);
  assert.match(viewModel, /type: "IMAGE_PRESET"/);
  assert.match(viewModel, /negative_prompt/);
  assert.match(viewModel, /ASSET_NEGATIVE_PROMPT_GUIDANCE_MAX_LENGTH/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Character Appearance contract and fixtures cover clothing and default image-preset states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.fixtures.js"
  );
  assert.match(contract, /CHARACTER_APPEARANCE_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /skinToneControl/);
  assert.match(contract, /onClearDefaultClothing/);
  assert.match(contract, /selectedImagePreset/);
  assert.match(contract, /onPickImagePreset/);
  assert.match(contract, /onClearDefaultImagePreset/);
  assert.match(contract, /negativePromptValue/);
  assert.match(contract, /onChangeNegativePrompt/);
  assert.match(fixtures, /characterAppearanceSectionOutfitFixture/);
  assert.match(fixtures, /characterAppearanceSectionWardrobeFixture/);
  assert.match(fixtures, /characterAppearanceSectionEmptyFixture/);
  assert.match(fixtures, /characterAppearanceSectionMissingCallbacksFixture/);
  assert.match(fixtures, /Default Image Preset/);
  assert.match(fixtures, /Change Preset/);
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

test("Creation Edit registry retains the public Character Appearance Shell", () => {
  const componentMap = read(
    "components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js"
  );
  assert.match(componentMap, /import AppearanceSection from/);
  assert.match(componentMap, /appearance:\s*\{\s*Component:\s*AppearanceSection/);
});

test("Character Appearance package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/character-appearance-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /clothing_source/);
  assert.match(readme, /\/dev\/ui-preview\/character-appearance-section/);
});
