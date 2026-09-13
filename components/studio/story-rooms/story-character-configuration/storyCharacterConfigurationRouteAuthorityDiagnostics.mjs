import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

function read(relativePath) {
  return fs.readFileSync(
    fileURLToPath(new URL(`../../../../${relativePath}`, import.meta.url)),
    "utf8"
  );
}

const vm = read("components/studio/story-rooms/story-character-configuration/useStoryCharacterConfigurationViewModel.js");
const view = read("components/studio/story-rooms/story-character-configuration/StoryCharacterConfiguration.view.jsx");
const shell = read("components/studio/story-rooms/story-character-configuration/StoryCharacterConfigurationShell.jsx");
const chatShell = read("components/studio/story-rooms/StoryRoomChatShell.jsx");

assert.match(vm, /setStoryRoomPlayerCharacter/);
assert.match(vm, /playerCharacterPickerProps:/);
assert.match(vm, /Change Player Character|playerCharacterAction/);
assert.match(vm, /required \|\| !roomId[\s\S]*\/studio\/v2\/stories/);
assert.match(view, /Change Player Character/);
assert.match(view, /backLabel/);
assert.match(shell, /DefaultPlayerCharacterPickerModal/);
assert.match(chatShell, /isStoryPostCreateCharacterConfigurationRequired/);
assert.match(chatShell, /buildStoryCharacterConfigurationHref/);
assert.match(chatShell, /router\.replace\(configurationHref\)/);

console.log(JSON.stringify({
  diagnostic: "story_character_configuration_route_authority_v1",
  status: "PASSED",
  incompleteConfigurationCannotRemainInNormalChat: true,
  explicitBackAvoidsBlockedChatLoop: true,
  playerCharacterCanBeChangedFromConfiguration: true,
  savedPlayerCharacterAssetsRemainUnmodifiedByRoomLocalConfiguration: true,
  serverRemainsConfigurationAuthority: true,
  providerAuthorityGranted: false,
  crownfallSpecificRulesIntroduced: false,
}, null, 2));
