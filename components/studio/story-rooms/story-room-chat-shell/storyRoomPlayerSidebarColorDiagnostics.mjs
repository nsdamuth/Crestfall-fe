import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("player state sidebar exposes only Location, Time, and Weather", () => {
  const vm = read("components/studio/story-rooms/story-room-state-panel/useStoryRoomStatePanelViewModel.js");
  assert.match(vm, /createRow\("location", "Location"/);
  assert.match(vm, /createRow\("time", "Time"/);
  assert.match(vm, /createRow\("weather", "Weather"/);
  assert.doesNotMatch(vm, /id: "scenario-phase"/);
  assert.doesNotMatch(vm, /id: "knowledge-boundaries"/);
  assert.doesNotMatch(vm, /id: "memory"/);
  assert.doesNotMatch(vm, /"Time Source"|"Weather Source"/);
});

test("runtime Mechanics prompt is omitted once a room binding exists", () => {
  const vm = read("components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js");
  const railBinding = read("components/studio/story-rooms/StoryRoomDetailsRail.jsx");
  assert.match(vm, /getMechanicsModuleBindings\(room\)\.length > 0/);
  assert.match(vm, /hasRoomMechanicsModule\s*\?\s*null/);
  // fe/chat-studio item 6: the Mechanics drill-in renders the panel only
  // while the gate hands it props, otherwise one quiet line.
  assert.match(railBinding, /mechanics: runtimeMechanicsPanelProps \? \(/);
  assert.match(railBinding, /A mechanics module is attached to this story\./);
});

test("Character opening greetings use the persisted Character palette", () => {
  const vm = read("components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js");
  assert.match(vm, /isCharacterOpeningMessage/);
  assert.match(vm, /resolvedSpeakerType/);
  assert.match(vm, /openingCharacterPaletteId/);
  assert.match(vm, /getCharacterColorPalette\(openingCharacterPaletteId\)/);
  assert.match(vm, /paletteColors: palette\?\.colors/);
  assert.match(vm, /speakerColor:/);
  assert.match(vm, /palette\?\.colors\?\.speaker/);
  assert.match(vm, /return STORY_ROOM_MESSAGE_SURFACE_TONES\.CHARACTER/);
});

test("Narrator opening scenes remain on the opening presentation path", () => {
  const vm = read("components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js");
  assert.match(vm, /if \(message\?\.kind === "OPENING_SCENE"\)[\s\S]*STORY_ROOM_MESSAGE_SURFACE_TONES\.OPENING/);
});

test("Character semantic palette roles render while player chat color stays independent", () => {
  const view = read("components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx");
  const vm = read("components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js");

  assert.match(vm, /paletteColors: palette\?\.colors/);
  assert.match(vm, /bubbleColor/);
  assert.match(view, /baseRole = "dialogue"/);
  assert.match(view, /getPaletteColor\(paletteColors, baseRole\)/);
  assert.match(view, /getPaletteColor\(paletteColors, "narration"\)/);
  assert.match(view, /role = "emphasis"/);
  assert.match(view, /role = "strong"/);
  assert.match(view, /role = "whisper"/);
  assert.match(view, /getPaletteColor\(paletteColors, "speaker"\)/);
  assert.match(view, /bg-\[var\(--chat-bubble-fill\)\]/);
  assert.match(view, /bg-\[var\(--chat-avatar-fill\)\]/);
  assert.match(view, /rounded-\[var\(--radius-bubble\)\]/);
});

test("chat color change remains presentation-only", () => {
  const sources = [
    read("components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"),
    read("components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"),
  ].join("\n");
  assert.doesNotMatch(sources, /fetch\(|createClient|PostGraphile|supabase/i);
});
