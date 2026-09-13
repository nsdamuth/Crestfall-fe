import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("story_room_presentation_restoration_v1: informational system surfaces are blue and danger remains red", () => {
  const messageView = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );
  const notice = read(
    "components/studio/story-rooms/story-room-transcript/StoryRoomNoticeCard.jsx"
  );

  assert.match(messageView, /border-sky-400\/20 bg-sky-400\/10/);
  assert.match(messageView, /text-sky-100\/80/);
  assert.match(notice, /border-sky-400\/20 bg-sky-400\/10/);
  assert.match(notice, /text-sky-100\/80/);
  assert.match(notice, /--status-danger-border/);
  assert.match(notice, /--status-danger-text/);
});

test("story_room_presentation_restoration_v1: Character semantic palette is complete and player color stays separate", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"
  );
  const view = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );

  assert.match(vm, /openingCharacterPaletteId/);
  assert.match(vm, /getCharacterColorPalette\(openingCharacterPaletteId\)/);
  assert.match(vm, /paletteColors: palette\?\.colors/);
  assert.match(vm, /bubbleColor/);
  for (const role of ["dialogue", "narration", "emphasis", "strong", "whisper"]) {
    assert.match(view, new RegExp(`["']${role}["']`));
  }
  assert.match(view, /getPaletteColor\(paletteColors, "speaker"\)/);
  assert.match(view, /"--chat-speaker": speakerAnchor\.trim\(\)/);
  assert.match(view, /bg-\[var\(--chat-bubble-fill\)\]/);
});

test("story_room_presentation_restoration_v1: opening hero is projected and shown only at true transcript start", () => {
  const transport = read("components/studio/story-rooms/hooks/useStoryRoomChat.js");
  const shellVm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const transcriptVm = read(
    "components/studio/story-rooms/story-room-transcript/useStoryRoomTranscriptViewModel.js"
  );
  const transcript = read(
    "components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx"
  );

  assert.match(transport, /resolveStoryRoomOpeningHeroImage/);
  assert.match(transport, /openingHeroImage/);
  assert.match(transport, /opening_hero_image/);
  assert.match(transport, /heroImage/);
  assert.match(transport, /hero_image/);
  assert.match(shellVm, /openingHeroImage: room\?\.openingHeroImage \|\| null/);
  assert.match(transcriptVm, /openingHeroImage/);
  assert.match(transcript, /hiddenCount === 0 && openingHeroImage\?\.displayUrl/);
  assert.match(transcript, /src=\{openingHeroImage\.displayUrl\}/);
});

test("story_room_presentation_restoration_v1: authoritative first-appearance event media still has a dedicated renderer", () => {
  const contract = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.contract.js"
  );
  const vm = read(
    "components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"
  );
  const view = read(
    "components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"
  );

  assert.match(contract, /CHARACTER_EVENT_IMAGE/);
  assert.match(contract, /LOCATION_EVENT_IMAGE/);
  assert.match(vm, /metadata\?\.autoEventMedia/);
  assert.match(vm, /media\.displayUrl/);
  assert.match(view, /return <AutoEventMediaMessage media=\{media\} \/>/);
  assert.match(view, /src=\{media\.displayUrl\}/);
});

test("story_room_presentation_restoration_v1: existing right-rail gallery follows the latest responder", () => {
  const transport = read("components/studio/story-rooms/hooks/useStoryRoomChat.js");
  const railVm = read(
    "components/studio/story-rooms/story-room-details-rail/useStoryRoomDetailsRailViewModel.js"
  );
  const railView = read(
    "components/studio/story-rooms/story-room-details-rail/StoryRoomDetailsRail.view.jsx"
  );

  assert.match(transport, /featuredSpeakerImageUrl/);
  assert.match(transport, /featuredSpeakerName/);
  assert.match(transport, /featuredSpeakerParticipantId/);
  assert.match(transport, /featuredSpeakerMediaImageUrls/);
  assert.match(railVm, /buildLatestResponderMediaItems/);
  assert.match(railVm, /responderMediaItems\.length/);
  assert.match(railVm, /setActiveIndex\(0\)/);
  assert.match(railView, /<Gallery gallery=\{gallery\} viewerSlot=\{viewerSlot\} \/>/);
  assert.doesNotMatch(railView, /FeaturedSpeakerMedia/);
  assert.doesNotMatch(railView, />Latest responder</);
});

test("story_room_presentation_restoration_v1: Delete story lives at the Details bottom and confirmation authority remains in shell", () => {
  const shell = read(
    "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx"
  );
  const shellVm = read(
    "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
  );
  const binding = read("components/studio/story-rooms/StoryRoomDetailsRail.jsx");
  const railView = read(
    "components/studio/story-rooms/story-room-details-rail/StoryRoomDetailsRail.view.jsx"
  );

  assert.doesNotMatch(shell, /DeleteStoryButton/);
  assert.doesNotMatch(shell, /trailing=\{/);
  assert.match(shellVm, /detailsRailProps = \{[\s\S]*onRequestDeleteRoom: requestDeleteRoom/);
  assert.match(binding, /dangerAction=/);
  assert.match(binding, /label: "Delete story"/);
  assert.match(railView, /border-t border-\[var\(--line-whisper\)\] pt-\[var\(--space-4\)\]/);
  assert.match(railView, /<Trash2/);
  assert.match(shell, /StoryChatDialog/);
  assert.match(shell, /onPress: onConfirmDeleteRoom/);
});
