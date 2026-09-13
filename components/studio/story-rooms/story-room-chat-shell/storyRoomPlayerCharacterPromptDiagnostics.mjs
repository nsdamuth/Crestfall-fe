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

test("transcript receives a transient Player Character prompt on the notice card recipe", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const transcript = read(
    "components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx"
  );
  const noticeCard = read(
    "components/studio/story-rooms/story-room-transcript/StoryRoomNoticeCard.jsx"
  );

  assert.match(vm, /playerCharacterPrompt:/);
  assert.match(vm, /visible: Boolean\(canSetPlayerCharacter\) && !firstMessageSubmitted/);
  assert.match(transcript, /PlayerCharacterPromptCard/);
  // Story Chat presentation restoration: informational notices are blue
  // again while the existing danger tokens remain reserved for errors.
  assert.match(transcript, /StoryRoomNoticeCard/);
  assert.match(noticeCard, /border-sky-400\/20 bg-sky-400\/10/);
  assert.match(noticeCard, /text-sky-100\/80/);
  assert.match(noticeCard, /cf-btn cf-btn--secondary/);
  assert.match(noticeCard, /--status-danger-border/);
  assert.match(noticeCard, /--status-danger-text/);
  assert.match(transcript, /Select player character/);
  assert.match(transcript, /Change player character/);
  assert.match(transcript, /eyebrow="Story error"/);
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
