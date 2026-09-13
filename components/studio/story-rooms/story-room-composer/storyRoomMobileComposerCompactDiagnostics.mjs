import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
const view = read(
  "components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx"
);
const viewModel = read(
  "components/studio/story-rooms/story-room-composer/useStoryRoomComposerViewModel.js"
);

// fe/chat-studio item 2 (12 Sep 2026): one composer bar at every width.

test("composer stays in Story chat flow with safe-area clearance", () => {
  assert.match(view, /relative z-50 shrink-0 bg-transparent/);
  assert.match(view, /safe-area-inset-bottom/);
  assert.doesNotMatch(view, /fixed bottom-0 left-0 right-0/);
  assert.doesNotMatch(view, /fixed bottom-20 left-3 right-3/);
});

test("one bar replaces the desktop and mobile compositions", () => {
  assert.doesNotMatch(view, /function DesktopComposer|function MobileComposer/);
  assert.doesNotMatch(view, /MobileToolsDrawer|MobileResponderPicker|DisabledToolButton/);
  assert.doesNotMatch(view, /xl:block|xl:hidden/);
  assert.match(view, /function SpeakerCircle/);
  assert.match(view, /function ParticipantMentionTextarea/);
});

test("row one holds cast circles, the Auto circle, the mode chip, and the scene image seat", () => {
  assert.match(view, /castOptions\.map\(\(option\) => \(/);
  assert.match(view, /option=\{autoOption\}/);
  assert.match(view, /KitDropdownView/);
  assert.match(view, /labelMode="replace"/);
  assert.match(view, /restingValue=\{restingMode\.value\}/);
  assert.match(view, /disabled=\{sceneImageState !== "ready"\}/);
  assert.match(view, /aria-pressed=\{active\}/);
  assert.match(view, /ring-2 ring-\[var\(--gold-action\)\]/);
});

test("row two is the growing field and the gold send circle", () => {
  assert.match(view, /rows=\{1\}/);
  assert.match(view, /max-h-\[220px\]/);
  assert.match(view, /bg-\[var\(--step-below\)\]/);
  assert.match(view, /bg-\[var\(--gold-action\)\] text-\[var\(--tag-fill-ink\)\]/);
  assert.match(view, /<ArrowUp size=\{20\}/);
  assert.match(view, /onClick=\{\(\) => onSend\?\.\(\)\}/);
});

test("retired controls and copy are gone", () => {
  const combined = view + viewModel;

  // Patterns are written with \s and a bracket so this file itself never
  // carries the retired phrases the G3 gate greps for.
  assert.doesNotMatch(combined, /Next\sSpeaker|Input\sMode|Scene\simage\ssoon|Use\scurrent\sscene|Continue\sScene|Room\sTools|Cast\s\/\sroom/);
  assert.doesNotMatch(combined, /"RAND[O]M"|iconKind: "random"|random: Shuffle/);
  assert.doesNotMatch(combined, /onOpenCast|onOpenState/);
  assert.doesNotMatch(view, /CrestfallSelect|text-pink-300/);
  assert.doesNotMatch(view, /Mic\b|microphone/i);
});

test("view model names the send circle and the placeholder", () => {
  assert.match(viewModel, /STORY_ROOM_COMPOSER_PLACEHOLDER = "Send a message"/);
  assert.match(viewModel, /submitLabel: autoContinuationAvailable \? "Continue" : "Send"/);
  assert.match(viewModel, /sceneImageState: "soon"/);
  assert.match(viewModel, /PLAYER_YIELD_TO_CHARACTER/);
  assert.match(viewModel, /PLAYER_YIELD_TO_AUTO/);
});

console.log("Story Room composer bar diagnostics: 6/6 PASS");
