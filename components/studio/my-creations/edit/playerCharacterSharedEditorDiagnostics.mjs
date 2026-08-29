import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Character and Player Character share the same V2 editor grammar without asset-type collapse", () => {
  const constants = read(
    "components/studio/my-creations/edit/creationEditConstants.js"
  );
  const map = read(
    "components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js"
  );

  assert.match(constants, /CHARACTER: CHARACTER_EDITOR_PAGE_GROUPS/);
  assert.match(constants, /PLAYER_CHARACTER: CHARACTER_EDITOR_PAGE_GROUPS/);
  assert.match(map, /CHARACTER: CHARACTER_LIKE_SECTIONS/);
  assert.match(map, /PLAYER_CHARACTER: CHARACTER_LIKE_SECTIONS/);
});

test("shared Character sections receive the concrete asset type for small editor specialization", () => {
  const map = read(
    "components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js"
  );

  assert.match(map, /characterDataFieldProps/);
  assert.match(map, /creationType: ctx\.creationType/);
  assert.match(map, /identity: \{ Component: IdentitySection, buildProps: characterDataFieldProps \}/);
  assert.match(map, /behavior: \{ Component: BehaviorSection, buildProps: characterDataFieldProps \}/);
  assert.match(map, /advanced: \{ Component: AdvancedSection, buildProps: characterDataFieldProps \}/);
});

test("Player Character identity uses friendly type terminology instead of the raw enum", () => {
  const identity = read(
    "components/studio/my-creations/edit/sections/character-identity-section/useCharacterIdentitySectionViewModel.js"
  );

  assert.match(identity, /PLAYER_CHARACTER: "Player Character"/);
  assert.match(identity, /Player Character Name/);
});

test("Player Character advanced editing hides Relationship to Player without deleting legacy data", () => {
  const viewModel = read(
    "components/studio/my-creations/edit/sections/character-advanced-section/useCharacterAdvancedSectionViewModel.js"
  );
  const view = read(
    "components/studio/my-creations/edit/sections/character-advanced-section/CharacterAdvancedSection.view.jsx"
  );

  assert.match(viewModel, /showRelationshipToPlayer: !isPlayerCharacter/);
  assert.match(viewModel, /relationship_to_player/);
  assert.match(view, /showRelationshipToPlayer \? \(/);
  assert.doesNotMatch(viewModel, /updateDataField\?\.\("relationship_to_player", ""\)/);
});

test("Player Character behavior copy preserves player authority", () => {
  const behavior = read(
    "components/studio/my-creations/edit/sections/character-behavior-section/useCharacterBehaviorSectionViewModel.js"
  );

  assert.match(behavior, /without taking control away from the player/);
  assert.match(behavior, /does not limit what you type or choose for your Player Character/);
});

test("Player Character mechanics attachment keeps PLAYER_CHARACTER compatibility authority", () => {
  const map = read(
    "components/studio/my-creations/creation-edit-shell/creationEditSectionComponentMap.js"
  );
  const mechanics = read(
    "components/studio/characters/actor-mechanics-profile-attachment/useActorMechanicsProfileAttachmentSectionViewModel.js"
  );

  assert.match(map, /actorType: ctx\.creationType/);
  assert.match(mechanics, /owner\.ownerType !== normalizedActorType/);
});

test("V2 editor exposes Set default PC only through the Player Character type flag", () => {
  const shell = read(
    "components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js"
  );
  const editor = read("app/studio/v2/editor/Editor.jsx");

  assert.match(shell, /isPlayerCharacter = creationType === "PLAYER_CHARACTER"/);
  assert.match(shell, /canSetDefaultPc: isPlayerCharacter && Boolean\(creationId\)/);
  assert.match(editor, /canSetDefaultPc \? \(/);
  assert.match(editor, /Set default PC/);
});

test("Character-like title editing keeps top-level title and data.name coherent for Player Characters", () => {
  const editViewModel = read(
    "components/studio/my-creations/edit/hooks/useCreationEditViewModel.js"
  );
  const payloads = read(
    "components/studio/my-creations/edit/creationEditPayloads.js"
  );

  assert.match(editViewModel, /\["CHARACTER", "PLAYER_CHARACTER"\]/);
  assert.match(payloads, /\["CHARACTER", "PLAYER_CHARACTER"\]/);
});
