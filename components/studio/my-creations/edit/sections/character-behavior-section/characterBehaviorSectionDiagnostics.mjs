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

test("Character Behavior Shell remains a thin LOOM binding", () => {
  const shell = read(
    "components/studio/my-creations/edit/sections/BehaviorSection.jsx"
  );
  assert.match(shell, /useCharacterBehaviorSectionViewModel/);
  assert.match(shell, /<CharacterBehaviorSectionView/);
  assert.match(shell, /<PersonalityModal/);
  assert.match(shell, /<VoiceModulePickerModal/);
  assert.match(shell, /<MultiTraitModal/);
  assert.doesNotMatch(shell, /form\.data|updateDataField\?\.\(/);
});

test("Character Behavior View is API, persistence, and application-modal free", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.view.jsx"
  );
  assert.doesNotMatch(view, /\bfetch\s*\(|supabase|PostGraphile|\/api\//);
  assert.doesNotMatch(
    view,
    /updateDataField|form\.data|voice_module_ids|verbosity_level|outward_personality/
  );
  assert.doesNotMatch(
    view,
    /PersonalityModal|TraitModal|VoiceModulePickerModal/
  );
});

test("Character Behavior ViewModel owns normalization and storage mapping", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-behavior-section/useCharacterBehaviorSectionViewModel.js"
  );
  assert.match(viewModel, /normalizeCharacterInterests/);
  assert.match(viewModel, /return single \? \[single\] : \[\]/);
  assert.match(viewModel, /normalizeVoiceModuleIds/);
  assert.match(viewModel, /voice_module_ids/);
  assert.match(viewModel, /verbosity_level/);
  assert.match(viewModel, /PLAYER_CHARACTER/);
  assert.match(viewModel, /without taking control away from the player/);
  assert.match(viewModel, /outward_personality/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Character Behavior contract and fixtures cover portable states", () => {
  const contract = read(
    "components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.contract.js"
  );
  const fixtures = read(
    "components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.fixtures.js"
  );
  assert.match(contract, /CHARACTER_BEHAVIOR_SECTION_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /outwardPersonalityControl/);
  assert.match(contract, /onChangePhilosophy/);
  assert.match(fixtures, /characterBehaviorSectionPopulatedFixture/);
  assert.match(fixtures, /characterBehaviorSectionEmptyFixture/);
  assert.match(fixtures, /characterBehaviorSectionLongContentFixture/);
  assert.match(fixtures, /characterBehaviorSectionMissingCallbacksFixture/);
});

test("Character Behavior preview is development-only", () => {
  const page = read("app/dev/ui-preview/character-behavior-section/page.jsx");
  const preview = read(
    "app/dev/ui-preview/character-behavior-section/CharacterBehaviorSectionPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CharacterBehaviorSectionView/);
});

test("Creation Edit retains the public Character Behavior Shell through the registry dispatcher", () => {
  const editShell = read("components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx");
  const componentMap = read("components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js");
  assert.match(editShell, /SECTION_COMPONENT_REGISTRY/);
  assert.match(componentMap, /import BehaviorSection from/);
  assert.match(componentMap, /behavior: \{ Component: BehaviorSection/);
});

test("Character Behavior package includes its documented handoff", () => {
  const readme = read(
    "components/studio/my-creations/edit/sections/character-behavior-section/README.md"
  );
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /voice_module_ids/);
  assert.match(readme, /\/dev\/ui-preview\/character-behavior-section/);
});
