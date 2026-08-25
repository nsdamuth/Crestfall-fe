import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  STORY_ROOM_MOBILE_SWIPE_MIN_DISTANCE,
  resolveStoryRoomMobileSwipe,
} from "./storyRoomMobileSwipe.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("closed mobile chat maps deliberate horizontal swipes to Cast and State", () => {
  assert.equal(STORY_ROOM_MOBILE_SWIPE_MIN_DISTANCE, 64);
  assert.equal(resolveStoryRoomMobileSwipe({ deltaX: 90, deltaY: 10 }), "OPEN_CAST");
  assert.equal(resolveStoryRoomMobileSwipe({ deltaX: -90, deltaY: 10 }), "OPEN_STATE");
});

test("short or vertically dominant gestures do not open panels", () => {
  assert.equal(resolveStoryRoomMobileSwipe({ deltaX: 50, deltaY: 2 }), null);
  assert.equal(resolveStoryRoomMobileSwipe({ deltaX: 90, deltaY: 80 }), null);
});

test("reverse swipe closes the corresponding directional sheet only", () => {
  assert.equal(resolveStoryRoomMobileSwipe({ panel: "cast", deltaX: -90, deltaY: 10 }), "CLOSE");
  assert.equal(resolveStoryRoomMobileSwipe({ panel: "cast", deltaX: 90, deltaY: 10 }), null);
  assert.equal(resolveStoryRoomMobileSwipe({ panel: "state", deltaX: 90, deltaY: 10 }), "CLOSE");
  assert.equal(resolveStoryRoomMobileSwipe({ panel: "state", deltaX: -90, deltaY: 10 }), null);
});

test("chat shell wires gestures to existing mobile panel state callbacks", () => {
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");
  const vm = read("components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js");

  assert.match(view, /onTouchStart=\{handleSwipeStart\}/);
  assert.match(view, /onTouchEnd=\{handleSwipeEnd\}/);
  assert.match(view, /onOpenMobileCast/);
  assert.match(view, /onOpenMobileState/);
  assert.match(view, /side="left"/);
  assert.match(view, /side="right"/);
  assert.match(vm, /onOpenMobileCast: \(\) => setMobilePanel\("cast"\)/);
  assert.match(vm, /onOpenMobileState: \(\) => setMobilePanel\("state"\)/);
});

test("mobile drawer is a directional side sheet with reverse-swipe and fallback close controls", () => {
  const drawer = read("components/studio/story-rooms/story-room-mobile-drawer/StoryRoomMobileDrawer.view.jsx");

  assert.match(drawer, /data-drawer-side=\{normalizedSide\}/);
  assert.match(drawer, /justify-end/);
  assert.match(drawer, /justify-start/);
  assert.match(drawer, /resolveStoryRoomMobileSwipe/);
  assert.match(drawer, /Close panel overlay/);
  assert.match(drawer, /aria-label="Close panel"/);
});

test("gesture layer remains presentation-only and mobile scoped", () => {
  const view = read("components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx");
  const gesture = read("components/studio/story-rooms/story-room-chat-shell/storyRoomMobileSwipe.js");

  assert.match(view, /matchMedia\("\(min-width: 1280px\)"\)/);
  assert.match(gesture, /button,a,input,textarea,select/);
  assert.doesNotMatch(gesture, /storyRoomClient|fetch\(|services\/api|supabase|PostGraphile/i);
});
