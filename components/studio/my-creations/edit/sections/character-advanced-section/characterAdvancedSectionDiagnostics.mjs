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

test("Character Advanced Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/AdvancedSection.jsx"
  );
  assert.match(shell, /useCharacterAdvancedSectionViewModel/);
  assert.match(shell, /<CharacterAdvancedSectionView/);
  assert.match(shell, /<AdvancedPromptingEditor/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Character Advanced View is API, persistence, and application-feature free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-advanced-section/CharacterAdvancedSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /updateDataField|form\.data|relationship_to_player|appearance_notes|personality_notes|extra_runtime_notes|creator_directives/
  );
  assert.doesNotMatch(view, /AdvancedPromptingEditor/);
});

test("Character Advanced ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-advanced-section/useCharacterAdvancedSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeText/);
  assert.match(viewModel, /relationship_to_player/);
  assert.match(viewModel, /appearance_notes/);
  assert.match(viewModel, /personality_notes/);
  assert.match(viewModel, /extra_runtime_notes/);
  assert.match(viewModel, /creator_directives/);
  assert.match(viewModel, /showRelationshipToPlayer/);
  assert.match(viewModel, /PLAYER_CHARACTER/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Character Advanced contract and fixtures cover portable states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/character-advanced-section/CharacterAdvancedSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/character-advanced-section/CharacterAdvancedSection.fixtures.js"
  );
  assert.match(contract, /CHARACTER_ADVANCED_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /advancedPromptingControl/);
  assert.match(contract, /showRelationshipToPlayer/);
  assert.match(contract, /onChangeRuntimeNotes/);
  assert.match(fixtures, /characterAdvancedSectionPopulatedFixture/);
  assert.match(fixtures, /characterAdvancedSectionEmptyFixture/);
  assert.match(fixtures, /characterAdvancedSectionLongContentFixture/);
  assert.match(fixtures, /characterAdvancedSectionMissingCallbacksFixture/);
  assert.match(fixtures, /playerCharacterAdvancedSectionFixture/);
});

test("Character Advanced preview is development-only", () => {
  const page = read("app/dev/ui-preview/character-advanced-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/character-advanced-section/CharacterAdvancedSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CharacterAdvancedSectionView/);
});

test("Creation Edit retains the public Character Advanced Shell through the registry dispatcher", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  const componentMap = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
  assert.match(editShell, /SECTION_COMPONENT_REGISTRY/);
  assert.match(componentMap, /import AdvancedSection from/);
  assert.match(componentMap, /advanced: \{ Component: AdvancedSection/);
});

test("Character Advanced package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/character-advanced-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /creator_directives/);
  assert.match(readme, /\/dev\/ui-preview\/character-advanced-section/);
});
