import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  CHARACTER_CREATOR_TYPES,
  buildCharacterCreatorCreationPayload,
  normalizeCharacterCreatorType,
} from "../character/characterCreationMode.js";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Character and Player Character remain distinct Creation types", () => {
  assert.equal(
    normalizeCharacterCreatorType("character"),
    CHARACTER_CREATOR_TYPES.CHARACTER
  );
  assert.equal(
    normalizeCharacterCreatorType("player_character"),
    CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER
  );
});

test("shared quick creator emits canonical Player Character persistence", () => {
  const payload = buildCharacterCreatorCreationPayload(
    {
      name: "Ari Vale",
      title: "The Cartographer",
      species: "HUMAN",
      genderPresentation: "NONBINARY",
      shortConcept: "EXPLORER",
      outwardPersonality: "Curious and patient.",
      relationshipToPlayer: "This must not survive on a Player Character.",
      visibility: "PRIVATE",
      contentRating: "SFW",
    },
    CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER
  );

  assert.equal(payload.type, "PLAYER_CHARACTER");
  assert.equal(payload.title, "Ari Vale");
  assert.equal(payload.data.gender_presentation, "NONBINARY");
  assert.equal(payload.data.short_concept, "EXPLORER");
  assert.equal(payload.data.outward_personality, "Curious and patient.");
  assert.equal(payload.data.relationship_to_player, "");
  assert.equal(payload.data.persona_type, "PLAYER_CHARACTER");
  assert.equal(payload.data.ai_controlled, false);
  assert.equal(Object.hasOwn(payload.data, "playable"), false);
  assert.equal(Object.hasOwn(payload.data, "discoverable"), false);
  assert.equal(Object.hasOwn(payload.data, "searchable"), false);
});

test("shared quick creator preserves Character behavior by default", () => {
  const payload = buildCharacterCreatorCreationPayload({
    name: "Mara",
    relationshipToPlayer: "Old rival",
  });

  assert.equal(payload.type, "CHARACTER");
  assert.equal(payload.data.relationship_to_player, "Old rival");
  assert.equal(payload.data.persona_type, undefined);
});

test("Quick Start and Full Studio both open Player Character through the shared creator", () => {
  const content = read("app/studio/v2/studio/studio/studioContent.mock.js");
  const viewModel = read("app/studio/v2/studio/studio/useStudioViewModel.js");
  const shell = read("app/studio/v2/studio/Studio.jsx");
  const modes = read("app/studio/v2/studio/studio/StudioModePanels.view.jsx");

  assert.match(
    content,
    /id: "playerCharacter"[\s\S]{0,320}isLive: true/
  );
  assert.match(
    viewModel,
    /playerCharacter: "onOpenPlayerCharacterCreator"/
  );
  assert.match(shell, /CHARACTER_CREATOR_TYPES\.PLAYER_CHARACTER/);
  assert.match(shell, /fieldScope: "quick"/);
  assert.match(shell, /fieldScope: "full"/);
  assert.match(modes, /\/studio\/create\/player-character/);
  assert.match(modes, /onOpenPlayerCharacterCreator/);
});

test("historical Player Character route reuses the Character creator stack", () => {
  const page = read("app/studio/create/player-character/page.js");

  assert.match(page, /import CharacterCreator/);
  assert.match(page, /CHARACTER_CREATOR_TYPES\.PLAYER_CHARACTER/);
  assert.match(
    page,
    /<CharacterCreator creationType=\{CHARACTER_CREATOR_TYPES\.PLAYER_CHARACTER\} \/>/
  );
  assert.doesNotMatch(page, /PlayerCharacterCreator/);
});

test("shared page creator saves either type and exits into the V2 editor", () => {
  const viewModel = read(
    "components/studio/create/character/character-creator/useCharacterCreatorViewModel.js"
  );
  const utils = read("components/studio/characters/characterUtils.js");

  assert.match(viewModel, /creationType = CHARACTER_CREATOR_TYPES\.CHARACTER/);
  assert.match(viewModel, /buildCharacterCreationPayload\([\s\S]*creatorMode\.creationType/);
  assert.match(viewModel, /\/studio\/v2\/editor\/\$\{creation\.id\}\?origin=studio/);
  assert.match(utils, /type: normalizedType/);
  assert.match(utils, /PLAYER_CHARACTER_CREATOR/);
});


test("shared page creator removes Player-Character-only presentation mismatches", () => {
  const creator = read("components/studio/create/character/CharacterCreator.jsx");
  const previewVm = read(
    "components/studio/create/character/character-preview/useCharacterPreviewViewModel.js"
  );
  const reviewVm = read(
    "components/studio/create/character/review-step/useCharacterReviewStepViewModel.js"
  );

  assert.match(creator, /creationType=\{normalizedCreationType\}/);
  assert.match(previewVm, /Unnamed Player Character/);
  assert.match(reviewVm, /field\.key !== "relationship_to_player"/);
  assert.match(reviewVm, /Unnamed Player Character/);
});
