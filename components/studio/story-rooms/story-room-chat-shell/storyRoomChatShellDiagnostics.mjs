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

test("Story Room Chat Shell stays thin and owns app bindings", () => {
  const shell = read("components/studio/story-rooms/StoryRoomChatShell.jsx");

  assert.match(shell, /useRouter/);
  assert.match(shell, /useStoryRoomChat\(roomId\)/);
  assert.match(shell, /useStoryRoomChatShellViewModel/);
  assert.match(shell, /StoryRoomChatShellView/);
  assert.match(shell, /CastPanelComponent=\{StoryRoomCastPanel\}/);
  assert.match(shell, /RuntimeMechanicsPanelComponent=\{StoryRoomRuntimeMechanicsPanel\}/);
  assert.doesNotMatch(shell, /window\.confirm/);
  assert.match(shell, /router\.push\("\/studio\/v2\/stories"\)/);
  assert.doesNotMatch(shell, /useState|deleteStoryRoom|resolveLocalStoryRoomCommand/);
});

test("Chat Shell ViewModel owns local state, deletion, and command routing", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );

  assert.match(viewModel, /deleteStoryRoom/);
  assert.match(viewModel, /resolveLocalStoryRoomCommand/);
  assert.match(viewModel, /STORY_ROOM_COMMANDS/);
  assert.match(viewModel, /const \[inputMode, setInputMode\] = useState\("DIALOGUE"\)/);
  assert.match(viewModel, /const \[nextSpeaker, setNextSpeaker\] = useState\("AUTO"\)/);
  assert.match(viewModel, /const \[mobilePanel, setMobilePanel\] = useState\(null\)/);
  assert.match(viewModel, /PLAYER_YIELD_TO_CHARACTER/);
  assert.match(viewModel, /setDraft\(body\)/);
  assert.match(viewModel, /setParticipantMentions\(mentionsForSend\)/);
  assert.match(viewModel, /setLocationMentions\(locationMentionsForSend\)/);
  assert.doesNotMatch(viewModel, /useRouter|window\.confirm|<section/);
});

test("transport hook remains separate and preserves runtime ownership", () => {
  const transport = read(
    "components/studio/story-rooms/hooks/useStoryRoomChat.js"
  );

  assert.match(transport, /fetchStoryRoom/);
  assert.match(transport, /fetchStoryRoomRegistryNpcs/);
  assert.match(transport, /sendStoryRoomMessage/);
  assert.match(transport, /createOptimisticUserMessage/);
  assert.match(transport, /getReturnedResponseMessages/);
  assert.match(transport, /loadStoryRoomRegistryNpc/);
  assert.match(transport, /unloadStoryRoomRegistryNpc/);
  assert.match(transport, /setStoryRoomPlayerCharacter/);
  assert.match(transport, /buildRoomViewModel/);
  assert.match(transport, /buildCastViewModel/);
  assert.doesNotMatch(
    transport,
    /StoryRoomChatShell\.view|useStoryRoomChatShellViewModel|deleteStoryRoom/
  );
});

test("portable View owns responsive layout and uses injected children only", () => {
  const view = read(
    "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx"
  );
  const statePanelView = read(
    "components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.view.jsx"
  );
  const castPanelView = read(
    "components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx"
  );

  assert.match(view, /CastPanelComponent/);
  assert.match(view, /ComposerComponent/);
  assert.match(view, /MobileDrawerComponent/);
  assert.match(view, /RuntimeMechanicsPanelComponent/);
  assert.match(view, /StatePanelComponent/);
  assert.match(view, /TranscriptComponent/);
  assert.match(view, /xl:h-\[calc\(100vh-7rem\)\]/);
  assert.match(view, /hidden min-h-0 overflow-y-auto pr-1 xl:block/);
  assert.match(view, /min-w-0 pb-4/);
  assert.doesNotMatch(statePanelView, /2xl:sticky|2xl:top-24/);
  assert.match(castPanelView, /xl:sticky xl:top-0/);
  assert.doesNotMatch(castPanelView, /xl:top-24/);
  assert.match(view, /Room & Cast/);
  assert.match(view, /Chronicle State/);
  assert.match(view, /Available Commands/);
  assert.match(view, /Quick Help/);
  assert.doesNotMatch(
    view,
    /useStoryRoomChat\(|storyRoomClient|useRouter|next\/navigation|StoryRoomCastPanel from/
  );
});

test("ViewModel preserves responder, mention, and mobile panel projection", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );

  assert.match(viewModel, /\{ id: "AUTO", label: "Auto" \}/);
  assert.match(viewModel, /\{ id: "RANDOM", label: "Random" \}/);
  assert.match(viewModel, /participantType === "CHARACTER"/);
  assert.match(viewModel, /locationMentionOptions/);
  assert.match(viewModel, /onOpenCast: \(\) => setMobilePanel\("cast"\)/);
  assert.match(viewModel, /onOpenState: \(\) => setMobilePanel\("state"\)/);
  assert.match(viewModel, /onUpdated: reloadStoryRoom/);
  assert.match(viewModel, /disabled: loading \|\| Boolean\(error\)/);
});

test("delete wording and navigation behavior remain explicit", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const shell = read("components/studio/story-rooms/StoryRoomChatShell.jsx");

  assert.match(viewModel, /Delete this Story\?/);
  assert.match(viewModel, /permanently deletes this chat session and all messages/);
  assert.match(viewModel, /Interaction totals will remain/);
  assert.match(viewModel, /This cannot be undone/);
  assert.match(viewModel, /isConfirmingDeleteRoom/);
  assert.match(viewModel, /await deleteStoryRoom\(roomId\)/);
  assert.match(viewModel, /onRoomDeleted\?\.\(\)/);
  assert.match(shell, /\/studio\/v2\/stories/);
});

test("contract, fixtures, and protected preview cover shell states", () => {
  const contract = read(
    "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.contract.js"
  );
  const fixtures = read(
    "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.fixtures.js"
  );
  const page = read("app/dev/ui-preview/story-room-chat-shell/page.jsx");
  const preview = read(
    "app/dev/ui-preview/story-room-chat-shell/StoryRoomChatShellPreviewClient.jsx"
  );

  assert.match(contract, /STORY_ROOM_CHAT_SHELL_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /ownsStoryRoomTransportHook: "Transport \/ Runtime Hook"/);
  assert.match(contract, /ownsComposerAndPanelState: "ViewModel"/);
  assert.match(contract, /ownsResponsiveChatLayout: "Portable View"/);
  assert.match(fixtures, /storyRoomChatShellReadyFixture/);
  assert.match(fixtures, /storyRoomChatShellLoadingFixture/);
  assert.match(fixtures, /storyRoomChatShellErrorFixture/);
  assert.match(fixtures, /storyRoomChatShellDeleteErrorFixture/);
  assert.match(fixtures, /storyRoomChatShellCollapsedFixture/);
  assert.match(fixtures, /storyRoomChatShellCommandsFixture/);
  assert.match(fixtures, /storyRoomChatShellMobileStateFixture/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /StoryRoomChatShellView/);
  assert.match(preview, /PreviewTranscript/);
  assert.match(preview, /PreviewRuntimeMechanicsPanel/);
});

test("documentation and package script preserve scope and Mechanics deferral", () => {
  const readme = read(
    "components/studio/story-rooms/story-room-chat-shell/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /portable Skin/);
  assert.match(readme, /optimistic player messages/);
  assert.match(readme, /PLAYER_YIELD_TO_CHARACTER/);
  assert.match(readme, /does not abstract the deferred Mechanics Module editor/);
  assert.match(readme, /\/dev\/ui-preview\/story-room-chat-shell/);
  assert.match(packageJson, /diagnostics:loom:story-room-chat-shell/);
});
