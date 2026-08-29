import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Room & Cast no longer receives the Set Player Character quick action", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const castBlock = vm.match(/const castPanelProps = \{[\s\S]*?\n  \};/)?.[0] || "";

  assert.doesNotMatch(castBlock, /canSetPlayerCharacter/);
  assert.doesNotMatch(castBlock, /onSetPlayerCharacter/);
});

test("transcript receives a transient blue Player Character system prompt", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const transcript = read(
    "components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx"
  );

  assert.match(vm, /playerCharacterPrompt:/);
  assert.match(vm, /visible: Boolean\(canSetPlayerCharacter\) && !firstMessageSubmitted/);
  assert.match(transcript, /PlayerCharacterPromptCard/);
  assert.match(transcript, /border-sky-400\/25 bg-sky-400\/10/);
  assert.match(transcript, /Select Player Character/);
  assert.match(transcript, /Change Player Character/);
});

test("first real sent message removes the prompt, but failed sends restore it", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );

  assert.match(vm, /setFirstMessageSubmitted\(true\)/);
  assert.match(vm, /if \(!result && !isYieldTurn\) \{[\s\S]*setFirstMessageSubmitted\(false\)/);
  assert.match(vm, /if \(localCommand\) \{[\s\S]*return;/);
});

test("existing Player Character picker is rebound at the chat shell instead of duplicated", () => {
  const shell = read("components/studio/story-rooms/StoryRoomChatShell.jsx");
  const vm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );

  assert.match(shell, /DefaultPlayerCharacterPickerModal/);
  assert.match(shell, /viewProps\.playerCharacterPickerProps/);
  assert.match(vm, /playerCharacterPickerProps: playerCharacterPickerOpen/);
  assert.match(vm, /await setPlayerCharacter\(playerCharacter\.id\)/);
});
