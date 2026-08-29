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

function between(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start + startToken.length);
  assert.notEqual(start, -1, `missing start token: ${startToken}`);
  assert.notEqual(end, -1, `missing end token: ${endToken}`);
  return source.slice(start, end);
}

test("mobile composer stays in Story chat flow while the chat menu keeps its opaque panel", () => {
  const mobile = between(view, "function MobileComposer({", "function MobileResponderPicker(");
  const desktop = between(view, "function DesktopComposer({", "function MobileComposer({");

  assert.match(mobile, /relative z-50 shrink-0[^\n]+bg-transparent/);
  assert.doesNotMatch(mobile, /fixed bottom-0 left-0 right-0/);
  assert.match(mobile, /rounded-\[var\(--radius-md\)\][^\n]+bg-\[#080706\]\/95 p-3 shadow-2xl/);
  assert.match(desktop, /hidden border-t border-white\/10 bg-black\/35 p-4 xl:block/);
});

test("mobile top row owns responder controls plus image settings and send actions", () => {
  const mobile = between(view, "function MobileComposer({", "function MobileResponderPicker(");

  assert.match(mobile, /ml-auto flex shrink-0 items-center gap-2/);
  assert.match(mobile, /Generate scene image soon/);
  assert.match(mobile, /Open tools/);
  assert.match(mobile, /onClick=\{\(\) => onSend\?\.\(\)\}/);
  assert.match(mobile, /ParticipantMentionTextarea/);
});

test("Random is suppressed only from the mobile speaker projection", () => {
  const mobile = between(view, "function MobileComposer({", "function MobileResponderPicker(");
  const desktop = between(view, "function DesktopComposer({", "function MobileComposer({");

  assert.match(mobile, /filter\(\(option\) => option\?\.id !== "RANDOM"\)/);
  assert.doesNotMatch(mobile, /options=\{nextSpeakerOptions\}[\s\S]*selectedId=\{nextSpeaker\}/);
  assert.match(desktop, /options=\{nextSpeakerOptions\}/);
});

test("more than two responders collapse to one 3+ mobile overflow control", () => {
  const mobile = between(view, "function MobileComposer({", "function MobileResponderPicker(");

  assert.match(mobile, /const responderOverflow = responderOptions\.length > 2/);
  assert.match(mobile, /const visibleResponderOptions = responderOverflow \? \[\] : responderOptions/);
  assert.match(mobile, />\s*3\+\s*<\/button>/);
  assert.match(mobile, /setResponderPickerOpen\(true\)/);
});

test("overflow responder picker uses display-ready speaker options and the existing responder callback", () => {
  const mobile = between(view, "function MobileComposer({", "function ParticipantMentionTextarea({");

  assert.match(mobile, /function MobileResponderPicker/);
  assert.match(mobile, /<KitModalFrame[\s\S]*variant="sheet"/);
  assert.match(mobile, /options=\{responderOptions\}/);
  assert.match(mobile, /onChangeNextSpeaker\?\.\(speakerId\)/);
  assert.match(mobile, /option\.avatarUrl/);
  assert.match(mobile, /option\.label/);
  assert.doesNotMatch(mobile, /storyRoomClient|fetch\(|createClient|supabase/i);
});

test("mobile tools no longer duplicate speaker routing or Random", () => {
  const tools = between(view, "function MobileToolsDrawer({", "function DisabledToolButton(");

  assert.doesNotMatch(tools, /Next Speaker/);
  assert.doesNotMatch(tools, /nextSpeakerOptions|onChangeNextSpeaker|RANDOM/);
  assert.match(tools, /Input Mode/);
  assert.match(tools, /Cast \/ room/);
  assert.match(tools, /State/);
});

console.log("Story Room mobile compact composer diagnostics: 6/6 PASS");
