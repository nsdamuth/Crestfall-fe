import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const results = [];
function check(name, fn) {
  test(name, () => {
    fn();
    results.push(name);
  });
}

check("cast roster drops responder instructional copy", () => {
  const vm = read("components/studio/story-rooms/story-room-cast-panel/useStoryRoomCastPanelViewModel.js");
  const fixtures = read("components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.fixtures.js");
  assert.doesNotMatch(vm, /Select an active Character or Narrator/);
  assert.doesNotMatch(fixtures, /Select an active Character or Narrator/);
});

check("cast cards no longer render responder or player-controlled badges", () => {
  const view = read("components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx");
  assert.doesNotMatch(view, /selectionLabel/);
  assert.doesNotMatch(view, /Player-controlled|Select responder|Next responder|Not selectable/i);
});

check("cast cards use image-dominant visual roster treatment", () => {
  const view = read("components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx");
  assert.match(view, /aspect-\[5\/2\]/);
  assert.match(view, /object-cover object-center/);
  assert.match(view, /bg-gradient-to-b from-black\/65/);
});

check("selection remains available through the whole card with visual confirmation", () => {
  const view = read("components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx");
  assert.match(view, /onSelect\?\.\(safeMember\.id\)/);
  assert.match(view, /aria-pressed/);
  assert.match(view, /<Check/);
});

check("player-facing labels collapse to Player Character Narrator categories", () => {
  const vm = read("components/studio/story-rooms/story-room-cast-panel/useStoryRoomCastPanelViewModel.js");
  assert.match(vm, /participantType === "PLAYER_CHARACTER" \|\| participantType === "USER"/);
  assert.match(vm, /\? "Player"/);
  assert.match(vm, /\? "Narrator"/);
  assert.match(vm, /: "Character"/);
});

check("normal presence state stays quiet while exceptional states remain available", () => {
  const vm = read("components/studio/story-rooms/story-room-cast-panel/useStoryRoomCastPanelViewModel.js");
  const view = read("components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx");
  assert.match(vm, /\^\(present\|active\)\$/i);
  assert.match(view, /safeMember\.displayState/);
});

process.on("exit", () => {
  console.log(`Story Room visual cast roster diagnostics: ${results.length}/6 PASS`);
});
