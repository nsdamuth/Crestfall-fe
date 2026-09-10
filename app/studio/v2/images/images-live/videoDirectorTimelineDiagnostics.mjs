import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  VIDEO_DIRECTOR_TIME_STEP_SECONDS,
  addVideoDirectorCue,
  clipVideoDirectorCuesToDuration,
  createInitialVideoDirectorCues,
  getNextVideoDirectorCueRange,
  projectVideoDirectorRows,
  removeVideoDirectorCue,
  updateVideoDirectorCue,
} from "./videoDirectorTimeline.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Director starts with a compact one-second cue inside a five-second video", () => {
  assert.equal(VIDEO_DIRECTOR_TIME_STEP_SECONDS, 0.1);
  assert.deepEqual(createInitialVideoDirectorCues(5), [
    { id: "cue-1", fromSecond: 0, toSecond: 1, prompt: "" },
  ]);
});

test("Director adds cues into open timeline space without changing duration", () => {
  let cues = createInitialVideoDirectorCues(5);
  cues = addVideoDirectorCue(cues, 5);
  cues = addVideoDirectorCue(cues, 5);

  assert.deepEqual(
    cues.map(({ fromSecond, toSecond }) => [fromSecond, toSecond]),
    [[0, 1], [1, 2], [2, 3]]
  );
  assert.deepEqual(getNextVideoDirectorCueRange(cues, 5), {
    fromSecond: 3,
    toSecond: 4,
  });
});

test("Director supports the common 0-1, 1-2, 3-5 pattern and allows its gap", () => {
  const cues = [
    { id: "cue-1", fromSecond: 0, toSecond: 1, prompt: "Beat one" },
    { id: "cue-2", fromSecond: 1, toSecond: 2, prompt: "Beat two" },
    { id: "cue-3", fromSecond: 3, toSecond: 5, prompt: "Beat three" },
  ];
  const rows = projectVideoDirectorRows(cues, 5);

  assert.equal(rows.every((row) => !row.isInvalid), true);
  assert.deepEqual(getNextVideoDirectorCueRange(cues, 5), {
    fromSecond: 2,
    toSecond: 3,
  });
});

test("Director preserves decimal timing and surfaces overlaps instead of silently rewriting them", () => {
  let cues = createInitialVideoDirectorCues(5);
  cues = updateVideoDirectorCue(
    cues,
    "cue-1",
    { fromSecond: 0.2, toSecond: 1.7, prompt: "Slow push" },
    { durationSeconds: 5 }
  );
  cues = [
    ...cues,
    { id: "cue-2", fromSecond: 1.5, toSecond: 2.5, prompt: "Turn" },
  ];

  assert.equal(cues[0].fromSecond, 0.2);
  assert.equal(cues[0].toSecond, 1.7);
  assert.equal(cues[0].prompt, "Slow push");
  const rows = projectVideoDirectorRows(cues, 5);
  assert.equal(rows[0].isInvalid, true);
  assert.equal(rows[1].isInvalid, true);
  assert.equal(rows[0].errorText, "Director cues cannot overlap.");
});

test("Shortening duration clips or removes only out-of-range cues", () => {
  const cues = [
    { id: "cue-1", fromSecond: 0, toSecond: 1, prompt: "One" },
    { id: "cue-2", fromSecond: 4, toSecond: 8, prompt: "Two" },
    { id: "cue-3", fromSecond: 8, toSecond: 9, prompt: "Three" },
  ];

  assert.deepEqual(clipVideoDirectorCuesToDuration(cues, 5), [
    { id: "cue-1", fromSecond: 0, toSecond: 1, prompt: "One" },
    { id: "cue-2", fromSecond: 4, toSecond: 5, prompt: "Two" },
  ]);
  assert.deepEqual(removeVideoDirectorCue(cues, "cue-2").map((cue) => cue.id), [
    "cue-1",
    "cue-3",
  ]);
});

test("Live adapter and portable View keep Director timing separate from billing", () => {
  const adapter = read(
    "app/studio/v2/images/images-live/useImagesV2LiveViewModel.js"
  );
  const panel = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.view.jsx"
  );
  const contract = read(
    "components/kit/image-creator-panel/KitImageCreatorPanel.contract.js"
  );

  assert.match(adapter, /projectVideoDirectorRows\(directorCues, durationSeconds\)/);
  assert.match(adapter, /addVideoDirectorCue\(current, durationSeconds\)/);
  assert.doesNotMatch(adapter, /onAddRow:[\s\S]{0,180}changeDuration\(/);
  assert.match(adapter, /Math\.ceil\(durationSeconds \/ segmentSeconds\)/);
  assert.match(adapter, /const directorError = rows\.find\(\(row\) => row\.isInvalid\)/);
  assert.match(adapter, /: directorError;/);

  assert.match(panel, /inputMode="decimal"/);
  assert.match(panel, /step=\{timeStepSeconds\}/);
  assert.match(panel, /onChangeRowTime/);
  assert.match(panel, /onRemoveRow/);
  assert.match(panel, /Set precise cue ranges\. Gaps are allowed\./);
  assert.doesNotMatch(panel, /\{row\.fromSecond\} to \{row\.toSecond\}s/);

  assert.match(contract, /VIEW_CONTRACT_VERSION = "2\.4\.0"/);
  assert.match(contract, /0\.1-second precision/);
  assert.match(contract, /adding\/removing cues never/);
});
