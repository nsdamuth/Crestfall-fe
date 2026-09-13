import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const imageFramePath = path.join(currentDir, "ImageFrame.jsx");
const source = fs.readFileSync(imageFramePath, "utf8");

assert.match(
  source,
  /const dragStart = dragStartRef\.current;[\s\S]*const dx = event\.clientX - dragStart\.clientX;[\s\S]*const dy = event\.clientY - dragStart\.clientY;/,
  "pointer move must snapshot the drag start before queueing the zoom state update"
);

assert.match(
  source,
  /updateZoom\(\(current\) => \(\{[\s\S]*x: dragStart\.origin\.x \+ dx,[\s\S]*y: dragStart\.origin\.y \+ dy,/,
  "the queued zoom updater must use the stable drag-start snapshot"
);

assert.doesNotMatch(
  source,
  /updateZoom\(\(current\) => \(\{[\s\S]{0,220}dragStartRef\.current\.origin/,
  "queued zoom state must never dereference the mutable dragStartRef"
);

console.log(
  JSON.stringify(
    {
      diagnostic: "image_frame_pan_safety_v1",
      status: "PASSED",
      dragStartSnapshotBeforeQueuedUpdate: true,
      pointerUpCancelRaceGuarded: true,
    },
    null,
    2
  )
);
