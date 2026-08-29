import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Story Room runtime hook restores live message-action transport ownership", () => {
  const hook = read("components/studio/story-rooms/hooks/useStoryRoomChat.js");
  const client = read("lib/client/studio/story-rooms/storyRoomClient.js");

  assert.match(hook, /runStoryRoomMessageAction/);
  assert.match(hook, /messageActionState/);
  assert.match(hook, /activeMessageActionRequestsRef/);
  assert.match(hook, /REGENERATE_RESPONSE/);
  assert.match(hook, /CONTINUE_RESPONSE/);
  assert.match(hook, /REPORT_MESSAGE/);
  assert.match(hook, /replaceMessageFromAction/);
  assert.match(hook, /regenerateMessage/);
  assert.match(hook, /continueMessage/);
  assert.match(hook, /reportMessage/);
  assert.match(client, /messages\/\$\{encodeURIComponent\(messageId\)\}\/actions/);
});

test("V2 Story Chat binds the live action methods without direct transport", () => {
  const pageVm = read("app/studio/v2/stories/[id]/useChatV2StoryPageViewModel.js");

  assert.match(pageVm, /useStoryRoomV2MessageActions/);
  assert.match(pageVm, /regenerateMessage: chat\.regenerateMessage/);
  assert.match(pageVm, /continueMessage: chat\.continueMessage/);
  assert.match(pageVm, /reportMessage: chat\.reportMessage/);
  assert.match(pageVm, /messageActionState: chat\.messageActionState/);
  assert.match(pageVm, /activeDialog: messageActions\.reportDialog/);
  assert.doesNotMatch(pageVm, /runStoryRoomMessageAction/);
  assert.doesNotMatch(pageVm, /fetch\s*\(/);
});

test("V2 message actions reproduce the ruled Copy Regenerate Continue Report row", () => {
  const actions = read("app/studio/v2/stories/[id]/useStoryRoomV2MessageActions.js");
  const messageView = read("components/studio/chat/chat-message/ChatMessage.view.jsx");

  assert.match(actions, /canCopy/);
  assert.match(actions, /canRegenerate/);
  assert.match(actions, /canContinue/);
  assert.match(actions, /canReport/);
  assert.match(actions, /copyState/);
  assert.match(actions, /reportSubmitted/);
  assert.match(messageView, /Copy message/);
  assert.match(messageView, /Regenerate response/);
  assert.match(messageView, /Continue response/);
  assert.match(messageView, /Report message/);
});

test("Regenerate and Continue stay limited to the latest persisted Character or Narrator CHAT response", () => {
  const actions = read("app/studio/v2/stories/[id]/useStoryRoomV2MessageActions.js");

  assert.match(actions, /\["character", "narrator"\]\.includes/);
  assert.match(actions, /normalizeText\(message\?\.kind\)\.toUpperCase\(\) === "CHAT"/);
  assert.match(actions, /latestAssistantActionMessageId/);
  assert.match(actions, /id === latestAssistantActionMessageId/);
  assert.match(actions, /UUID_PATTERN/);
});

test("Report uses the existing V2 reason/comment dialog and persisted-message boundary", () => {
  const actions = read("app/studio/v2/stories/[id]/useStoryRoomV2MessageActions.js");
  const dialogs = read("components/studio/chat/chat-session-dialogs/ChatSessionDialogs.contract.js");

  assert.match(actions, /CHAT_REPORT_REASON_OPTIONS/);
  assert.match(actions, /kind: "REPORT"/);
  assert.match(actions, /reasonCode: reportReasonCode/);
  assert.match(actions, /comment: reportComment/);
  assert.match(actions, /onSubmit: submitReport/);
  assert.match(actions, /onClose: closeReport/);
  assert.match(actions, /\["player", "character", "narrator"\]\.includes/);
  assert.match(actions, /\["CHAT", "OPENING_SCENE"\]\.includes/);
  assert.match(dialogs, /OUT_OF_CHARACTER/);
  assert.match(dialogs, /CONTINUITY_ERROR/);
  assert.match(dialogs, /INAPPROPRIATE_CONTENT/);
  assert.match(dialogs, /LOW_QUALITY/);
});

test("optimistic and media-only rows never acquire remote message actions", () => {
  const actions = read("app/studio/v2/stories/[id]/useStoryRoomV2MessageActions.js");

  assert.match(actions, /!message\?\.metadata\?\.optimistic/);
  assert.match(actions, /CHAT_MESSAGE_CONTENT_TYPES\.AUTO_EVENT_MEDIA/);
  assert.match(actions, /return item/);
});
