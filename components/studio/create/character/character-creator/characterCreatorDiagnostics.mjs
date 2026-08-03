import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Character Creator Shell remains a focused LOOM binding", () => {
  const shell = read("components/studio/create/character/CharacterCreator.jsx");
  assert.match(shell, /useCharacterCreatorViewModel/);
  assert.match(shell, /<CharacterCreatorView/);
  assert.match(shell, /<CharacterPreview/);
  assert.match(shell, /<CharacterTemplateModal/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Character Creator View is API, persistence, and application-Shell free", () => {
  const view = read(
    "components/studio/create/character/character-creator/CharacterCreator.view.jsx"
  );
  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createCharacterDraft|buildCharacterCreationPayload|router\./
  );
  assert.doesNotMatch(
    view,
    /import .*CharacterPreview|import .*IdentityStep|import .*CharacterTemplateModal/
  );
  assert.match(view, /headerContent/);
  assert.match(view, /previewContent/);
  assert.match(view, /editorContent/);
});

test("Character Creator ViewModel owns wizard state, templates, payload, save, and navigation", () => {
  const viewModel = read(
    "components/studio/create/character/character-creator/useCharacterCreatorViewModel.js"
  );
  assert.match(viewModel, /applyCharacterTemplateToForm/);
  assert.match(viewModel, /buildCharacterCreationPayload/);
  assert.match(viewModel, /createCharacterDraft/);
  assert.match(viewModel, /router\.push/);
  assert.match(viewModel, /calculateCharacterCreatorProgress/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Legacy Character Creator hook delegates to the LOOM ViewModel", () => {
  const legacyHook = read(
    "components/studio/characters/hooks/useCharacterCreator.js"
  );
  assert.match(legacyHook, /useCharacterCreatorViewModel/);
  assert.match(legacyHook, /finishDraft: viewProps\.onSave/);
  assert.doesNotMatch(
    legacyHook,
    /createCharacterDraft|buildCharacterCreationPayload|useRouter/
  );
});

test("Character Creator contract and fixtures cover key states", () => {
  const contract = read(
    "components/studio/create/character/character-creator/CharacterCreator.contract.js"
  );
  const fixtures = read(
    "components/studio/create/character/character-creator/CharacterCreator.fixtures.js"
  );
  assert.match(contract, /CHARACTER_CREATOR_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CHARACTER_CREATOR_STEPS/);
  assert.match(fixtures, /characterCreatorIdentityFixture/);
  assert.match(fixtures, /characterCreatorReviewFixture/);
  assert.match(fixtures, /characterCreatorSavingFixture/);
  assert.match(fixtures, /characterCreatorErrorFixture/);
});

test("Character Creator preview is development-only", () => {
  const page = read("app/dev/ui-preview/character-creator/page.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create Character page retains the public CharacterCreator Shell", () => {
  const page = read("app/studio/create/character/page.js");
  assert.match(
    page,
    /import CharacterCreator from "@\/components\/studio\/create\/character\/CharacterCreator"/
  );
  assert.match(page, /<CharacterCreator \/>/);
});
