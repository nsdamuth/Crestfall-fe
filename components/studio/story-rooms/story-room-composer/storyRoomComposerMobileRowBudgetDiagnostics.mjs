import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

// fe/chat-studio brief 2 item 11 (13 Sep 2026): the placement of the
// mobile story list and settings buttons is decided by measurement in
// code, not by taste. The starred placement (story list at the far left
// of the cast row, settings at the far right of the send row) ships
// only if the cast row at 390 with two cast circles plus the input mode
// chip fits inside 390 minus the composer gutters. Every length below
// is read from app/theme.css or from the rendered class strings; the
// only estimate is the chip label's glyph advance, and the decision is
// taken on its ceiling (one em per glyph), which no Latin text face
// exceeds.

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const theme = fs.readFileSync(path.join(repoRoot, "app/theme.css"), "utf8");
const composerView = fs.readFileSync(
  path.join(
    repoRoot,
    "components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx"
  ),
  "utf8"
);
const dropdownView = fs.readFileSync(
  path.join(repoRoot, "components/kit/dropdown/KitDropdown.view.jsx"),
  "utf8"
);

const ROOT_FONT_PX = 16;
const VIEWPORT_PX = 390;

function readRem(token) {
  const match = new RegExp(`^\\s*${token}:\\s*([0-9.]+)rem;`, "m").exec(theme);
  assert.ok(match, `${token} is declared in app/theme.css`);
  return Number.parseFloat(match[1]) * ROOT_FONT_PX;
}

const controlMd = readRem("--control-md");
const space1 = readRem("--space-1");
const space2 = readRem("--space-2");
const space3 = readRem("--space-3");
const textUi = readRem("--text-ui");

// The composer's horizontal gutter and the row gap, as written.
assert.match(composerView, /px-\[var\(--space-3\)\]/);
assert.match(composerView, /flex items-center gap-\[var\(--space-2\)\]/);
// The chip: 1px hairline, --space-3 side padding, --space-1 gap, a
// 14px chevron, the label at --text-ui.
assert.match(dropdownView, /border border-\[var\(--line-whisper\)\] bg-\[var\(--step-above\)\] px-\[var\(--space-3\)\]/);
assert.match(dropdownView, /gap-\[var\(--space-1\)\]/);
assert.match(dropdownView, /<ChevronDown\n\s+size=\{14\}/);
const chevronPx = 14;
const chipBorderPx = 2;

const longestRestingLabel = "Dialogue";
const labelCeilingPx = longestRestingLabel.length * textUi;
const labelTypicalPx = Math.ceil(longestRestingLabel.length * textUi * 0.55);

function chipWidth(labelPx) {
  return chipBorderPx + space3 * 2 + labelPx + space1 + chevronPx;
}

const circles = 4; // story list, scene image, two cast circles
const gaps = 4;
const available = VIEWPORT_PX - space3 * 2;
const rowCeiling = circles * controlMd + gaps * space2 + chipWidth(labelCeilingPx);
const rowTypical = circles * controlMd + gaps * space2 + chipWidth(labelTypicalPx);
const starredPlacementFits = rowCeiling <= available;

test("cast row at 390 with two cast circles plus the chip fits the gutters", () => {
  assert.equal(controlMd, 44);
  assert.equal(space2, 8);
  assert.equal(space3, 12);
  assert.equal(available, 366);
  assert.ok(
    starredPlacementFits,
    `row ceiling ${rowCeiling}px exceeds the ${available}px budget`
  );
});

test("the starred placement is the one the composer ships", () => {
  // Story list at the far left of the cast row, before the scene image
  // seat; settings at the far right of the send row, after send.
  const storyListIndex = composerView.indexOf("onOpenStoryList?.()");
  const sceneIndex = composerView.indexOf('disabled={sceneImageState !== "ready"}');
  const sendIndex = composerView.indexOf("onClick={() => onSend?.()}");
  const settingsIndex = composerView.indexOf("onOpenSettings?.()");
  assert.ok(storyListIndex > 0 && storyListIndex < sceneIndex);
  assert.ok(sendIndex > 0 && sendIndex < settingsIndex);
});

console.log(
  [
    "Story chat mobile row budget at 390:",
    `  available inside the gutters: ${available}px`,
    `  cast row, label at the 1em-per-glyph ceiling: ${rowCeiling}px`,
    `  cast row, label at a typical 0.55em advance: ${rowTypical}px`,
    `  starred placement ${starredPlacementFits ? "SHIPS" : "FALLS BACK to the top bar"}`,
  ].join("\n")
);
