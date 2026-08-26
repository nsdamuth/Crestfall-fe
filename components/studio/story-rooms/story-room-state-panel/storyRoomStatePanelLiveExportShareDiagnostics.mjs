import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("the actual live Story Room route still owns the approved chat presentation", () => {
  const shell = read("components/studio/story-rooms/StoryRoomChatShell.jsx");
  assert.match(shell, /StoryRoomChatShellView/);
  assert.match(shell, /StatePanelComponent=\{StoryRoomStatePanel\}/);
  assert.doesNotMatch(shell, /StoryRoomChatC1C6Binding/);
});

test("existing transcript and share clients are restored through the live Story Room hook", () => {
  const hook = read("components/studio/story-rooms/hooks/useStoryRoomChat.js");
  for (const token of [
    "exportStoryRoomTranscript",
    "createTemporaryStoryRoomShare",
    "revokeTemporaryStoryRoomShare",
    "createPersistentStoryRoomShare",
    "revokePersistentStoryRoomShare",
    "exportTranscript",
    "createTemporaryShare",
    "revokeTemporaryShare",
    "createPersistentShare",
    "revokePersistentShare",
  ]) {
    assert.match(hook, new RegExp(token));
  }
});

test("desktop and mobile Chronicle State receive the same live callbacks", () => {
  const vm = read("components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js");
  assert.equal((vm.match(/onExportTranscript: exportTranscript/g) || []).length, 2);
  assert.equal((vm.match(/onCreateTemporaryShare: createTemporaryShare/g) || []).length, 2);
  assert.equal((vm.match(/onCreatePersistentShare: createPersistentShare/g) || []).length, 2);
  assert.equal((vm.match(/onRevokeTemporaryShare: revokeTemporaryShare/g) || []).length, 2);
  assert.equal((vm.match(/onRevokePersistentShare: revokePersistentShare/g) || []).length, 2);
  assert.equal((vm.match(/\bmessages,/g) || []).length >= 2, true);
});

test("Chronicle State actions are live and use the shared ChatSessionDialogs UI", () => {
  const wrapper = read("components/studio/story-rooms/StoryRoomStatePanel.jsx");
  const view = read("components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.view.jsx");
  const vm = read("components/studio/story-rooms/story-room-state-panel/useStoryRoomStatePanelViewModel.js");

  assert.match(wrapper, /ChatSessionDialogs/);
  assert.match(view, /action\.onPress\?\.\(\)/);
  assert.match(vm, /label: actionProjection\.export\.label/);
  assert.match(vm, /label: actionProjection\.share\.label/);
  assert.doesNotMatch(vm, /Export Chat Soon|Share Snapshot Soon/);
  const fixtures = read("components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.fixtures.js");
  assert.doesNotMatch(fixtures, /Export Chat Soon|Share Snapshot Soon/);
  assert.match(vm, /projectStorySessionExportDialog/);
  assert.match(vm, /projectStorySessionShareDialog/);
});

test("player-facing Chronicle State remains limited to Location, Time, and Weather", () => {
  const vm = read("components/studio/story-rooms/story-room-state-panel/useStoryRoomStatePanelViewModel.js");
  assert.match(vm, /createRow\("location", "Location"/);
  assert.match(vm, /createRow\("time", "Time"/);
  assert.match(vm, /createRow\("weather", "Weather"/);
  assert.doesNotMatch(vm, /id: "scenario-phase"|id: "knowledge-boundaries"|id: "memory"/);
  assert.doesNotMatch(vm, /"Time Source"|"Weather Source"/);
});

test("State presentation owns no direct product-data transport", () => {
  for (const relativePath of [
    "components/studio/story-rooms/StoryRoomStatePanel.jsx",
    "components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.view.jsx",
    "components/studio/story-rooms/story-room-state-panel/useStoryRoomStatePanelViewModel.js",
    "components/studio/story-rooms/story-share-export-c4-binding/StoryShareExportC4Binding.contract.js",
  ]) {
    const source = read(relativePath);
    assert.doesNotMatch(source, /fetch\s*\(|supabase|PostGraphile|services\/api/i);
  }
});
