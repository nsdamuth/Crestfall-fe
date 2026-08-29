import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("historical Player Character route is a thin shared-creator compatibility entry", () => {
  const page = read("app/studio/create/player-character/page.js");

  assert.match(page, /import CharacterCreator/);
  assert.match(page, /CHARACTER_CREATOR_TYPES\.PLAYER_CHARACTER/);
  assert.match(
    page,
    /<CharacterCreator creationType=\{CHARACTER_CREATOR_TYPES\.PLAYER_CHARACTER\} \/>/
  );
  assert.doesNotMatch(page, /PlayerCharacterCreator/);
});

test("obsolete standalone Player Character creator and preview are removed", () => {
  assert.equal(
    existsSync("components/studio/create/player-character/player-character-creator"),
    false
  );
  assert.equal(
    existsSync("components/studio/create/player-character/PlayerCharacterCreator.jsx"),
    false
  );
  assert.equal(existsSync("app/dev/ui-preview/player-character-creator"), false);
  assert.equal(
    existsSync("lib/client/studio/player-characters/playerCharacterClient.js"),
    false
  );
});

test("package diagnostics no longer target the deleted standalone creator", () => {
  const packageJson = read("package.json");

  assert.doesNotMatch(packageJson, /diagnostics:loom:player-character-creator/);
  assert.doesNotMatch(packageJson, /player-character-creator\/playerCharacterCreatorDiagnostics/);
});

test("shared PC creation diagnostic remains the live Player Character creation gate", () => {
  const diagnostic = read(
    "components/studio/create/player-character/playerCharacterSharedCreationDiagnostics.mjs"
  );

  assert.match(diagnostic, /PLAYER_CHARACTER/);
  assert.match(diagnostic, /shared/);
});

test("Story launch continues to forward a selected saved Player Character id", () => {
  const controller = read(
    "components/studio/story-rooms/hooks/useStoryLaunchController.js"
  );
  const client = read("lib/client/studio/story-rooms/storyRoomClient.js");

  assert.match(controller, /playerCharacterId: selectedPlayerCharacterId \|\| null/);
  assert.match(controller, /playerCharacterSelection: playerSelection \|\| null/);
  assert.match(client, /normalizedPlayerCharacterSelection === "SELECTED"/);
  assert.match(client, /playerCharacterId: normalizedPlayerCharacterId/);
});
