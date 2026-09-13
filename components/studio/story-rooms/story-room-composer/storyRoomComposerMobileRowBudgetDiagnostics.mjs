import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

// fe/chat-studio brief 2 item 11 (13 Sep 2026) measured the composer's
// rows at 390 to place the mobile story list and settings buttons; brief
// 3 item 10 returned both buttons to the page's top bar and brief 3 item
// 2 added the player circle, so the same measurement now reports the two
// rows the composer ships below md: row one is the scene image seat,
// the player circle, the cast circles, and the input mode chip; row two
// is the field with the Auto and send circles pinned right. Every length
// below is read from app/theme.css or from the rendered class strings;
// the only estimate is the chip label's glyph advance, and the check is
// taken on its ceiling (one em per glyph), which no Latin text face
// exceeds. Brief 4 item 5 added the add character plus circle inside
// the cast strip (the flex-1, min-w-0, overflow-x-auto span between the
// player circle and the chip), so it scrolls with the cast and the row
// budget below is unchanged.

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
const shellView = fs.readFileSync(
  path.join(
    repoRoot,
    "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx"
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
assert.match(composerView, /flex items-end gap-\[var\(--space-2\)\]/);
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

const available = VIEWPORT_PX - space3 * 2;

// Row one: scene image seat, player circle, two cast circles, the chip.
const rowOneCircles = 4;
const rowOneGaps = 4;
const rowOneCeiling =
  rowOneCircles * controlMd + rowOneGaps * space2 + chipWidth(labelCeilingPx);
const rowOneTypical =
  rowOneCircles * controlMd + rowOneGaps * space2 + chipWidth(labelTypicalPx);
const rowOneFits = rowOneCeiling <= available;

// Row two: the field, then Auto and send pinned right.
const rowTwoCircles = 2;
const rowTwoGaps = 2;
const rowTwoFieldWidth = available - rowTwoCircles * controlMd - rowTwoGaps * space2;

test("row one at 390 with two cast circles plus the chip fits the gutters", () => {
  assert.equal(controlMd, 44);
  assert.equal(space2, 8);
  assert.equal(space3, 12);
  assert.equal(available, 366);
  assert.ok(
    rowOneFits,
    `row one ceiling ${rowOneCeiling}px exceeds the ${available}px budget`
  );
});

test("the rows the composer ships are the ones measured", () => {
  // Row one: scene image seat, player circle, cast circles, chip; no
  // story list button (brief 3 item 10 returned it to the top bar).
  const sceneIndex = composerView.indexOf('disabled={sceneImageState !== "ready"}');
  const playerIndex = composerView.indexOf("<PlayerCircle circle={playerCircle} />");
  const castIndex = composerView.indexOf("castOptions.map((option) => (");
  const chipIndex = composerView.indexOf("<KitDropdownView");
  assert.ok(sceneIndex > 0 && sceneIndex < playerIndex && playerIndex < castIndex && castIndex < chipIndex);
  assert.doesNotMatch(composerView, /onOpenStoryList|onOpenSettings|md:hidden/);
  // Row two: field, Auto, send, and nothing after send.
  const autoIndex = composerView.indexOf("onClick={() => onAuto?.()}");
  const sendIndex = composerView.indexOf("onClick={() => onSend?.()}");
  assert.ok(autoIndex > 0 && autoIndex < sendIndex);
  // The two buttons sit on the mobile bar after the title.
  const titleIndex = shellView.indexOf("{title}\n      </h1>");
  const barStoryListIndex = shellView.indexOf("onClick={() => onOpenStoryList?.()}");
  const barSettingsIndex = shellView.indexOf("onClick={() => onOpenDetails?.()}");
  assert.ok(titleIndex > 0 && titleIndex < barStoryListIndex && barStoryListIndex < barSettingsIndex);
});

console.log(
  [
    "Story chat composer row widths at 390 (brief 3 item 10):",
    `  available inside the gutters: ${available}px`,
    `  row one, label at the 1em-per-glyph ceiling: ${rowOneCeiling}px`,
    `  row one, label at a typical 0.55em advance: ${rowOneTypical}px`,
    `  row one ${rowOneFits ? "FITS" : "OVERFLOWS"}`,
    `  row two: field ${rowTwoFieldWidth}px, Auto ${controlMd}px, send ${controlMd}px, two ${space2}px gaps`,
  ].join("\n")
);
