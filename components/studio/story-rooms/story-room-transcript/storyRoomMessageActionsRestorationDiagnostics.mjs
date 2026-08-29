import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("working Story Room shell binds live message actions into the transcript", () => {
  const shell = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );

  for (const token of [
    "regenerateMessage",
    "continueMessage",
    "reportMessage",
    "messageActionState",
    "onRegenerateMessage: regenerateMessage",
    "onContinueMessage: continueMessage",
    "onReportMessage: reportMessage",
  ]) {
    assert.match(shell, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Story Room transcript owns local Copy feedback and remote-action eligibility only", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-transcript/useStoryRoomTranscriptViewModel.js"
  );

  assert.match(vm, /STORY_ROOM_MESSAGE_COPY_STATES/);
  assert.match(vm, /navigator\.clipboard/);
  assert.match(vm, /UUID_PATTERN/);
  assert.match(vm, /isAssistantActionTarget/);
  assert.match(vm, /isReportableMessage/);
  assert.match(vm, /latestAssistantActionMessageId/);
  assert.match(vm, /kind\)\.toUpperCase\(\) === "CHAT"/);
  assert.match(vm, /onRegenerateMessage\(id\)/);
  assert.match(vm, /onContinueMessage\(id\)/);
  assert.match(vm, /onReportMessage/);
  assert.doesNotMatch(vm, /fetch\s*\(/);
  assert.doesNotMatch(vm, /runStoryRoomMessageAction/);
});

test("message View restores Copy Regenerate Continue and Report icon controls", () => {
  const view = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );

  for (const token of [
    "Copy message",
    "Regenerate response",
    "Continue response",
    "Report message",
    "MessageActionButton",
    "RotateCcw",
    "StepForward",
    "Flag",
  ]) {
    assert.match(view, new RegExp(token));
  }

  assert.match(view, /isPlayerMessage \? "justify-end" : "justify-start"/);
});

test("Regenerate and Continue stay on the latest persisted Character or Narrator CHAT response", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-transcript/useStoryRoomTranscriptViewModel.js"
  );

  assert.match(vm, /\["character", "narrator"\]/);
  assert.match(vm, /isPersistedMessage\(message\)/);
  assert.match(vm, /metadata\?\.optimistic/);
  assert.match(vm, /latestAssistantActionMessageId/);
  assert.match(vm, /isLatestAssistant && typeof onRegenerateMessage === "function"/);
  assert.match(vm, /isLatestAssistant && typeof onContinueMessage === "function"/);
});

test("Report uses a reason and optional comment dialog without Story mutation ownership", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-transcript/useStoryRoomTranscriptViewModel.js"
  );
  const view = read(
    "components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx"
  );

  assert.match(vm, /REPORT_REASON_OPTIONS/);
  assert.match(vm, /OUT_OF_CHARACTER/);
  assert.match(vm, /CONTINUITY_ERROR/);
  assert.match(vm, /INAPPROPRIATE_CONTENT/);
  assert.match(vm, /LOW_QUALITY/);
  assert.match(vm, /onReportMessage\(reportDraft\.messageId/);
  assert.match(view, /Message report/);
  assert.match(view, /Submit report/);
  assert.match(view, /maxLength=\{2000\}/);
  assert.match(view, /It does not[\s\S]*alter the Story or its runtime state/);
});

test("auto-event media and optimistic messages do not acquire remote action controls", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-transcript/useStoryRoomTranscriptViewModel.js"
  );

  assert.match(
    vm,
    /contentType === STORY_ROOM_MESSAGE_CONTENT_TYPES\.AUTO_EVENT_MEDIA[\s\S]*return \{[\s\S]*message: viewProps/
  );
  assert.match(vm, /!message\?\.metadata\?\.optimistic/);
  assert.match(vm, /UUID_PATTERN\.test\(id\)/);
});
