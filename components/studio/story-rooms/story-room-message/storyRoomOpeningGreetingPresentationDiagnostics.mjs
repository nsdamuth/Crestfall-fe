import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { buildCharacterOpeningGreetingPresentation } from "./storyRoomOpeningGreetingPresentation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const ALYERA_STYLE_GREETING = [
  "The road into the village is blocked by overturned carts.",
  "",
  "A line of refugees waits on the near side.",
  "",
  "“Move the wounded first.”",
  "",
  "Her voice cuts through the panic cleanly.",
  "",
  '"Then the children."',
].join("\n");

test("legacy Character opening greeting restores narration/dialogue presentation without changing text", () => {
  const segments = buildCharacterOpeningGreetingPresentation(ALYERA_STYLE_GREETING);

  assert.deepEqual(
    segments.map((segment) => segment.type),
    ["NARRATION", "DIALOGUE", "NARRATION", "DIALOGUE"]
  );
  assert.equal(
    segments.map((segment) => segment.text).join(""),
    ALYERA_STYLE_GREETING
  );
  assert.match(segments[0].text, /road into the village/);
  assert.equal(segments[1].text, "“Move the wounded first.”");
  assert.equal(segments[3].text, '"Then the children."');
});

test("narration-only Character greeting is still renderable as narration", () => {
  const body = "Rain gathers on the chapel steps.";
  assert.deepEqual(buildCharacterOpeningGreetingPresentation(body), [
    { type: "NARRATION", emphasis: "", text: body },
  ]);
});

test("legacy markdown and blockquote greetings remain on the legacy renderer", () => {
  assert.deepEqual(
    buildCharacterOpeningGreetingPresentation('*She waits.* "Come in."'),
    []
  );
  assert.deepEqual(
    buildCharacterOpeningGreetingPresentation("> The bells ring."),
    []
  );
});

test("Story Room ViewModel uses fallback only for Character opening messages without backend presentation", () => {
  const vm = read(
    "components/studio/story-rooms/story-room-message/useStoryRoomMessageViewModel.js"
  );

  assert.match(vm, /messageType === "character"/);
  assert.match(vm, /openingCharacterPaletteId/);
  assert.match(vm, /buildCharacterOpeningGreetingPresentation\(legacyBody\)/);
  assert.match(vm, /shouldRepairCharacterOpeningPresentation/);
  assert.match(vm, /!presentationHasDialogue \|\| !presentationHasNarration/);
  assert.match(vm, /const semanticSegments = useOpeningGreetingRepair/);
  assert.match(vm, /bodyMode: semanticSegments\.length/);
  assert.match(vm, /semanticSegments,/);
});
