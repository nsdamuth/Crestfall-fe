import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Player Character Creator Shell remains a focused LOOM binding", () => {
  const shell = read(
    "components/studio/create/player-character/PlayerCharacterCreator.jsx"
  );

  assert.match(shell, /usePlayerCharacterCreatorViewModel/);
  assert.match(shell, /<PlayerCharacterCreatorView/);
  assert.match(shell, /characterColorPaletteContent/);
  assert.match(shell, /defaultClothingContent/);
  assert.match(shell, /bodyTypeContent/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Player Character Creator View is API and application-Shell free", () => {
  const view = read(
    "components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createCreationDraft|createPlayerCharacterDraft|router\./
  );
  assert.doesNotMatch(
    view,
    /import .*SkinToneModal|import .*HairEyesModal|import .*TraitModal|import .*DefaultClothingSelector|import .*CharacterColorPaletteModal/
  );
  assert.match(view, /characterColorPaletteContent/);
  assert.match(view, /defaultClothingContent/);
});

test("Player Character Creator ViewModel owns payload, state, save, and navigation", () => {
  const viewModel = read(
    "components/studio/create/player-character/player-character-creator/usePlayerCharacterCreatorViewModel.js"
  );

  assert.match(viewModel, /buildPlayerCharacterCreationPayload/);
  assert.match(viewModel, /type: "PLAYER_CHARACTER"/);
  assert.match(viewModel, /builder: "PLAYER_CHARACTER_CREATOR"/);
  assert.match(viewModel, /createPlayerCharacterDraft/);
  assert.match(viewModel, /normalizeAdultAge/);
  assert.match(viewModel, /router\.push/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Player Character client delegates creation through the shared creation client", () => {
  const client = read(
    "lib/client/studio/player-characters/playerCharacterClient.js"
  );

  assert.match(client, /createCreationDraft/);
  assert.match(client, /Player character draft could not be saved\./);
  assert.doesNotMatch(client, /\bfetch\s*\(/);
});

test("Player Character Creator contract and fixtures cover builder states", () => {
  const contract = read(
    "components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.contract.js"
  );
  const fixtures = read(
    "components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.fixtures.js"
  );

  assert.match(contract, /PLAYER_CHARACTER_CREATOR_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /PLAYER_CHARACTER_STEPS/);
  assert.match(fixtures, /playerCharacterIdentityFixture/);
  assert.match(fixtures, /playerCharacterAppearanceFixture/);
  assert.match(fixtures, /playerCharacterBodyFixture/);
  assert.match(fixtures, /playerCharacterProfileFixture/);
  assert.match(fixtures, /playerCharacterReviewFixture/);
  assert.match(fixtures, /playerCharacterSavingFixture/);
  assert.match(fixtures, /playerCharacterSavedFixture/);
  assert.match(fixtures, /playerCharacterErrorFixture/);
});

test("Player Character Creator preview is development-only", () => {
  const page = read("app/dev/ui-preview/player-character-creator/page.jsx");

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create Player Character page retains the public Shell", () => {
  const page = read("app/studio/create/player-character/page.js");

  assert.match(
    page,
    /import PlayerCharacterCreator from "@\/components\/studio\/create\/player-character\/PlayerCharacterCreator"/
  );
  assert.match(page, /<PlayerCharacterCreator \/>/);
});
