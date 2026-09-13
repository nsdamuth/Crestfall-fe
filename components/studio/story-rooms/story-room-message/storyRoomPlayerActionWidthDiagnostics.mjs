import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, name), "utf8");
const view = read("StoryRoomMessage.view.jsx");
const contract = read("StoryRoomMessage.contract.js");

test("story_room_player_action_width_v1: speaker bubbles use almost the full transcript width", () => {
  assert.match(view, /max-w-\[94%\] min-\[700px\]:max-w-\[96%\] bg-\[var\(--chat-bubble-fill\)\]/);
  assert.match(view, /max-w-\[94%\] min-\[700px\]:max-w-\[96%\] bg-\[var\(--surface-1\)\]/);
  assert.doesNotMatch(view, /max-w-\[86%\] min-\[700px\]:max-w-\[85%\]/);
});

test("story_room_player_action_width_v1: Player action ink is a darker chat-color-derived band", () => {
  assert.match(view, /const PLAYER_ACTION_COLOR =/);
  assert.match(view, /oklch\(from var\(--chat-speaker, var\(--gold-ornament\)\)/);
  assert.match(view, /clamp\(0\.56, l, 0\.64\)/);
  assert.match(view, /min\(c, 0\.16\)/);
  assert.doesNotMatch(view, /var\(--ink\) 38%/);
  assert.match(view, /playerActionColor &&\s*segment\.type === STORY_ROOM_MESSAGE_SEGMENT_TYPES\.NARRATION/s);
  assert.match(view, /narrationColor \|\| \(playerActionColor \? PLAYER_ACTION_COLOR : null\)/);
  assert.match(view, /playerActionColor=\{isPlayerMessage\}/);
});

test("story_room_player_action_width_v1: portable contract records the presentation-only revision", () => {
  assert.match(contract, /STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION = "2\.7\.1"/);
  assert.match(contract, /94%/);
  assert.match(contract, /96%/);
});
