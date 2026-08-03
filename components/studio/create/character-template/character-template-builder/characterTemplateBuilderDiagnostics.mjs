import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Character Template Builder Shell remains a focused LOOM binding", () => {
  const shell = read(
    "components/studio/create/character-template/CharacterTemplateBuilder.jsx"
  );
  assert.match(shell, /useCharacterTemplateBuilderViewModel/);
  assert.match(shell, /<CharacterTemplateBuilderView/);
  assert.match(shell, /<CharacterTemplateBuilderEditor/);
  assert.match(shell, /href="\/studio\/templates\/characters"/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Character Template Builder View is API, persistence, and application-Shell free", () => {
  const view = read(
    "components/studio/create/character-template/character-template-builder/CharacterTemplateBuilder.view.jsx"
  );
  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createCharacterTemplateDraft|buildCharacterTemplateCreationPayload|router\./
  );
  assert.doesNotMatch(
    view,
    /import .*SkinToneModal|import .*HairEyesModal|import .*KibbePresetModal|import .*CharacterTemplateBuilderEditor/
  );
  assert.match(view, /browseTemplatesContent/);
  assert.match(view, /editorContent/);
});

test("Character Template Builder ViewModel owns state, payload, save, and navigation", () => {
  const viewModel = read(
    "components/studio/create/character-template/character-template-builder/useCharacterTemplateBuilderViewModel.js"
  );
  assert.match(viewModel, /buildCharacterTemplateCreationPayload/);
  assert.match(viewModel, /createCharacterTemplateDraft/);
  assert.match(viewModel, /getCharacterTemplateCompletion/);
  assert.match(viewModel, /getCharacterTemplateSectionStatus/);
  assert.match(viewModel, /router\.push\("\/studio\/my-creations"\)/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Legacy Character Template Builder hook delegates to the LOOM ViewModel", () => {
  const legacyHook = read(
    "components/studio/character-templates/hooks/useCharacterTemplateBuilder.js"
  );
  assert.match(legacyHook, /useCharacterTemplateBuilderViewModel/);
  assert.match(legacyHook, /return compatibilityProps/);
  assert.doesNotMatch(
    legacyHook,
    /createCharacterTemplateDraft|buildCharacterTemplateCreationPayload|useRouter/
  );
});

test("Character Template Builder contract and fixtures cover key states", () => {
  const contract = read(
    "components/studio/create/character-template/character-template-builder/CharacterTemplateBuilder.contract.js"
  );
  const fixtures = read(
    "components/studio/create/character-template/character-template-builder/CharacterTemplateBuilder.fixtures.js"
  );
  assert.match(contract, /CHARACTER_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CHARACTER_TEMPLATE_BUILDER_STEPS/);
  assert.match(fixtures, /characterTemplateBuilderTemplateFixture/);
  assert.match(fixtures, /characterTemplateBuilderReviewFixture/);
  assert.match(fixtures, /characterTemplateBuilderSavingFixture/);
  assert.match(fixtures, /characterTemplateBuilderErrorFixture/);
});

test("Character Template Builder preview is development-only", () => {
  const page = read("app/dev/ui-preview/character-template-builder/page.jsx");
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create Character Template page retains the public Builder Shell", () => {
  const page = read("app/studio/create/character-template/page.js");
  assert.match(
    page,
    /import CharacterTemplateBuilder from "@\/components\/studio\/create\/character-template\/CharacterTemplateBuilder"/
  );
  assert.match(page, /<CharacterTemplateBuilder \/>/);
});
