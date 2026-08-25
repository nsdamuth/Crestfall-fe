import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

test("character quick-create remains full-bleed on phone widths", () => {
  const view = read(
    "components/studio/create/character/creator-stops/CreatorStops.view.jsx",
  );

  assert.match(view, /h-\[100dvh\] w-full/);
  assert.match(view, /min-\[700px\]:w-\[min\(46rem,/);
});

test("character quick-create reclaims desktop width", () => {
  const view = read(
    "components/studio/create/character/creator-stops/CreatorStops.view.jsx",
  );

  assert.match(view, /min-\[1024px\]:w-\[min\(64rem,/);
});

test("dev Review mode and Notes are opt-in during V2 convergence", () => {
  const layout = read("app/layout.js");

  assert.match(layout, /CRESTFALL_ENABLE_REVIEW_MODE/);
  assert.match(layout, /reviewModeEnabled \? <DevOnlyReviewMode \/> : null/);
  assert.doesNotMatch(
    layout,
    /process\.env\.NODE_ENV !== "production" \? <DevOnlyReviewMode \/> : null/,
  );
});

test("Review mode tooling remains available for explicit design review", () => {
  const layout = read("app/layout.js");
  const gate = read("app/dev/review-mode/DevOnlyReviewMode.jsx");

  assert.match(layout, /import DevOnlyReviewMode/);
  assert.match(gate, /dynamic\(\(\) => import\("\.\/ReviewModeOverlay"\)/);
});
