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
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");
  assert.match(vm, /getMechanicsModuleBindings\(room\)\.length > 0/);
  assert.match(vm, /hasRoomMechanicsModule\s*\?\s*null/);
  assert.equal((view.match(/RuntimeMechanicsPanelComponent && runtimeMechanicsPanelProps/g) || []).length, 2);
});

test("Character opening greetings use the persisted Character palette", () => {
  const vm = read("components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js");
  assert.match(vm, /isCharacterOpeningMessage/);
  assert.match(vm, /resolvedSpeakerType/);
  assert.match(vm, /openingCharacterPaletteId/);
  assert.match(vm, /getCharacterColorPalette\(openingCharacterPaletteId\)/);
  assert.match(vm, /speakerColor:/);
  assert.match(vm, /palette\?\.colors\?\.speaker/);
  assert.match(vm, /return STORY_ROOM_MESSAGE_SURFACE_TONES\.CHARACTER/);
});

test("Narrator opening scenes remain on the opening presentation path", () => {
  const vm = read("components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js");
  assert.match(vm, /if \(message\?\.kind === "OPENING_SCENE"\)[\s\S]*STORY_ROOM_MESSAGE_SURFACE_TONES\.OPENING/);
});

test("legacy greeting text consumes palette colors instead of generic gold", () => {
  const view = read("components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx");
  assert.match(view, /hasPalettePresentation/);
  assert.match(view, /paletteColors=\{hasPalettePresentation \? resolvedPaletteColors : null\}/);
  assert.match(view, /paletteColors\.dialogue/);
  assert.match(view, /paletteColors\.narration/);
  assert.match(view, /resolvedPaletteColors\.speaker/);
});

test("chat color change remains presentation-only", () => {
  const sources = [
    read("components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"),
    read("components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx"),
  ].join("\n");
  assert.doesNotMatch(sources, /fetch\(|createClient|PostGraphile|supabase/i);
});
