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

test("Character Identity Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/IdentitySection.jsx"
  );
  assert.match(shell, /useCharacterIdentitySectionViewModel/);
  assert.match(shell, /<CharacterIdentitySectionView/);
  assert.match(shell, /<CharacterColorPaletteModal/);
  assert.match(shell, /<CrestfallOptionModal/);
  assert.doesNotMatch(shell, /updateDataField\?\.\(|form\.data/);
});

test("Character Identity View is API, persistence, and application-picker free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(view, /updateDataField|form\.data|custom_species|short_concept/);
  assert.doesNotMatch(view, /CharacterColorPaletteModal|CrestfallOptionModal/);
});

test("Character Identity ViewModel owns defaults, storage mapping, and adult age clamping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-identity-section/useCharacterIdentitySectionViewModel.js"
  );
  assert.match(viewModel, /clampAdultCharacterAge/);
  assert.match(viewModel, /CUSTOM_APPEARANCE_VALUE_MAX_LENGTH/);
  assert.match(viewModel, /character_color_palette_id/);
  assert.match(viewModel, /short_concept/);
  assert.match(viewModel, /rendering_style/);
  assert.match(viewModel, /PLAYER_CHARACTER: "Player Character"/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Character Identity contract and fixtures cover key portable states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.fixtures.js"
  );
  assert.match(contract, /CHARACTER_IDENTITY_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /colorPaletteControl/);
  assert.match(contract, /roleArchetypeControl/);
  assert.match(fixtures, /characterIdentitySectionCustomIdentityFixture/);
  assert.match(fixtures, /characterIdentitySectionMinimumAgeFixture/);
  assert.match(fixtures, /characterIdentitySectionMissingCallbacksFixture/);
});

test("Character Identity preview is development-only", () => {
  const page = read(
    "app/dev/ui-preview/character-identity-section/page.jsx"
  );
  const preview = read(
    "app/dev/ui-preview/character-identity-section/CharacterIdentitySectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CharacterIdentitySectionView/);
});

test("Creation Edit retains the public Character Identity Shell through the registry dispatcher", () => {
  const editShell = read(
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx"
  );
  const componentMap = read(
    "components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js"
  );
  assert.match(editShell, /SECTION_COMPONENT_REGISTRY/);
  assert.match(componentMap, /import IdentitySection from/);
  assert.match(componentMap, /identity: \{ Component: IdentitySection/);
});

test("Character Identity package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/character-identity-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /adult minimum of 18/);
  assert.match(readme, /\/dev\/ui-preview\/character-identity-section/);
});
