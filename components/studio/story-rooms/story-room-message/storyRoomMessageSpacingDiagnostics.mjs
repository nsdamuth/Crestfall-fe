import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildLegacyMessageParagraphs,
  buildSemanticMessageParagraphs,
  hasAuthoredMessageLineBreak,
} from "./storyRoomMessageSpacing.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function read(fileName) {
  return fs.readFileSync(path.join(currentDir, fileName), "utf8");
}

function flattenSemantic(paragraphs) {
  return paragraphs
    .flat()
    .map((segment) => segment.text)
    .join("");
}

test("semantic action-dialogue-action responses gain one display paragraph break", () => {
  const segments = [
    { type: "NARRATION", text: "She watched the door. " },
    { type: "DIALOGUE", text: '"Do not move." ' },
    { type: "NARRATION", text: "Her hand found the hilt." },
  ];
  const paragraphs = buildSemanticMessageParagraphs(segments);

  assert.equal(paragraphs.length, 2);
  assert.equal(paragraphs[0].length, 2);
  assert.equal(paragraphs[1].length, 1);
  assert.equal(flattenSemantic(paragraphs), flattenSemantic([segments]));
});

test("semantic dialogue-action-dialogue responses gain one display paragraph break", () => {
  const segments = [
    { type: "DIALOGUE", text: '"I know." ' },
    { type: "NARRATION", text: "He lowered his voice. " },
    { type: "DIALOGUE", text: '"That is why I am leaving."' },
  ];
  const paragraphs = buildSemanticMessageParagraphs(segments);

  assert.equal(paragraphs.length, 2);
  assert.equal(flattenSemantic(paragraphs), flattenSemantic([segments]));
});

test("existing semantic line breaks are preserved without fallback grouping", () => {
  const segments = [
    { type: "NARRATION", text: "She crossed the room.\n\n" },
    { type: "DIALOGUE", text: '"Wait here."' },
    { type: "NARRATION", text: "The door closed." },
  ];
  const paragraphs = buildSemanticMessageParagraphs(segments);

  assert.equal(hasAuthoredMessageLineBreak(flattenSemantic([segments])), true);
  assert.equal(paragraphs.length, 1);
  assert.equal(flattenSemantic(paragraphs), flattenSemantic([segments]));
});

test("same-type and standalone semantic content remains on one paragraph", () => {
  assert.equal(
    buildSemanticMessageParagraphs([
      { type: "DIALOGUE", text: '"First." ' },
      { type: "DIALOGUE", text: '"Second."' },
    ]).length,
    1
  );
  assert.equal(
    buildSemanticMessageParagraphs([
      { type: "NARRATION", text: "She waited." },
    ]).length,
    1
  );
});

test("legacy action-dialogue-action text is grouped without changing characters", () => {
  const body =
    '*She folded the note once.* "This changes nothing." *She slipped it into her coat.*';
  const paragraphs = buildLegacyMessageParagraphs(body);

  assert.equal(paragraphs.length, 2);
  assert.equal(paragraphs.join(""), body);
});

test("legacy authored line breaks and ordinary prose remain untouched", () => {
  const multiline = '*She waited.*\n\n"Not yet."';
  const ordinary =
    "The archive remained silent while the last lamp burned down to a blue ember.";

  assert.deepEqual(buildLegacyMessageParagraphs(multiline), [
    "*She waited.*",
    '"Not yet."',
  ]);
  assert.deepEqual(buildLegacyMessageParagraphs(ordinary), [ordinary]);
});

test("standalone legacy action and dialogue remain single paragraphs", () => {
  assert.equal(buildLegacyMessageParagraphs("*She waited.*").length, 1);
  assert.equal(buildLegacyMessageParagraphs('"Not yet."').length, 1);
});

test("View integration stays display-only and limits fallback to responses", () => {
  const view = read("StoryRoomMessage.view.jsx");
  const contract = read("StoryRoomMessage.contract.js");
  const fixtures = read("StoryRoomMessage.fixtures.js");

  assert.match(view, /buildLegacyMessageParagraphs/);
  assert.match(view, /buildSemanticMessageParagraphs/);
  assert.match(view, /STORY_ROOM_MESSAGE_SURFACE_TONES\.CHARACTER/);
  assert.match(view, /STORY_ROOM_MESSAGE_SURFACE_TONES\.NARRATOR/);
  assert.doesNotMatch(view, /fetch\(|storyRoomClient|update|persist|save/);
  assert.match(contract, /VIEW_CONTRACT_VERSION = "1\.2\.0"/);
  assert.match(contract, /persisted message text remain unchanged/);
  assert.match(fixtures, /storyRoomMessageZeroNewlineActionDialogueActionFixture/);
  assert.match(fixtures, /storyRoomMessageExistingMultilineFixture/);
  assert.match(fixtures, /storyRoomMessageOrdinaryZeroNewlineProseFixture/);
});
