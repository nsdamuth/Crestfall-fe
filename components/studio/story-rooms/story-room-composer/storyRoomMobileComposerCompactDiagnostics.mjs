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

// Brief 2 item 1 (13 Sep 2026): the Auto circle left the cast row for
// the send row, between the field and the gold send circle.
test("row one holds the scene image seat, the cast circles, then the mode chip", () => {
  assert.match(view, /castOptions\.map\(\(option\) => \(/);
  assert.doesNotMatch(view, /option=\{autoOption\}/);
  assert.match(view, /KitDropdownView/);
  // Brief 2 item 2: scene image first, cast circles, chip pinned right.
  const sceneIndex = view.indexOf("disabled={sceneImageState !== \"ready\"}");
  const castIndex = view.indexOf("castOptions.map((option) => (");
  const chipIndex = view.indexOf("<KitDropdownView");
  assert.ok(sceneIndex > 0 && sceneIndex < castIndex && castIndex < chipIndex);
  assert.match(view, /labelMode="replace"/);
  assert.match(view, /restingValue=\{restingMode\.value\}/);
  assert.match(view, /disabled=\{sceneImageState !== "ready"\}/);
  assert.match(view, /aria-pressed=\{active\}/);
  assert.match(view, /ring-2 ring-\[var\(--gold-action\)\]/);
});

test("row two is the growing field, the Auto circle, and the gold send circle", () => {
  assert.match(view, /rows=\{1\}/);
  assert.match(view, /bg-\[var\(--step-below\)\]/);
  // Brief 2 item 3: no scrollbar below the cap; the cap is 40dvh under
  // md and 320px at md and up, read from the computed style.
  assert.match(view, /max-h-\[40dvh\] .* overflow-hidden .* md:max-h-\[320px\]/);
  assert.doesNotMatch(view, /max-h-\[220px\]|overflow-y-auto rounded/);
  assert.match(view, /getComputedStyle\(textarea\)\.maxHeight/);
  assert.match(view, /textarea\.style\.overflowY = atCap \? "auto" : "hidden"/);
  assert.match(view, /onClick=\{\(\) => onAuto\?\.\(\)\}/);
  assert.match(view, /<Sparkles size=\{18\}/);
  assert.match(view, /bg-\[var\(--gold-action\)\] text-\[var\(--tag-fill-ink\)\]/);
  assert.match(view, /<ArrowUp size=\{20\}/);
  assert.match(view, /onClick=\{\(\) => onSend\?\.\(\)\}/);
  assert.doesNotMatch(view, /submitIsContinuation/);
  // Auto and send stay in this order: field, Auto, send.
  assert.ok(view.indexOf("onAuto?.()") < view.indexOf("onSend?.()}\n            disabled={sendDisabled}"));
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

test("view model names the send and Auto circles and the placeholder", () => {
  assert.match(viewModel, /STORY_ROOM_COMPOSER_PLACEHOLDER = "Send a message"/);
  assert.match(viewModel, /submitLabel: "Send"/);
  assert.match(viewModel, /sendDisabled: composerDisabled \|\| sending \|\| !draftText\.trim\(\)/);
  assert.match(viewModel, /onAuto: continueAuto/);
  assert.match(viewModel, /sceneImageState: "soon"/);
  assert.match(viewModel, /PLAYER_YIELD_TO_CHARACTER/);
  // The Auto circle is the existing continuation call with the AUTO
  // speaker and never reads the draft.
  assert.match(
    viewModel,
    /function continueAuto\(\) \{\n    if \(composerDisabled \|\| sending\) return;\n\n    setNextSpeaker\?\.\("AUTO"\);\n    onSend\?\.\(\{\n      requestedSpeakerId: "AUTO",\n      actionType: "PLAYER_YIELD_TO_AUTO",\n    \}\);/
  );
  assert.doesNotMatch(viewModel, /autoContinuationAvailable/);
});

console.log("Story Room composer bar diagnostics: 6/6 PASS");
