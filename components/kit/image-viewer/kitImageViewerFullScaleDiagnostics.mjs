import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const viewPath = path.join(currentDir, "KitImageViewer.view.jsx");
const legacyViewPath = path.join(
  currentDir,
  "../../studio/media/media-lightbox/MediaLightbox.view.jsx"
);
const framePath = path.join(currentDir, "../image-overlay/ImageFrame.jsx");
const view = fs.readFileSync(viewPath, "utf8");
const legacyView = fs.readFileSync(legacyViewPath, "utf8");
const frame = fs.readFileSync(framePath, "utf8");

testFullScaleViewer();

// Sizing law, RULED 12 Sep 2026 (Brian's browser review): the image
// never takes an explicit width. It keeps its own ratio and fits the
// space the column leaves after the header and the bar, so a window
// of any shape shows it at the correct fixed ratio; the column keeps
// --space-4 above and below so nothing sits flush with the window.
function testFullScaleViewer() {
  assert.match(
    legacyView,
    /className="h-full max-h-full w-full max-w-full object-contain"/,
    "legacy MediaLightbox authority must still prove the prior viewer actively filled its available image area"
  );
  assert.match(
    view,
    /function getViewerExpandedImageStyle\(pixelSize\)/,
    "Kit viewer must publish the stored image ratio as a column-level custom property"
  );
  assert.match(
    view,
    /"--viewer-aspect": `\$\{width\} \/ \$\{height\}`/,
    "the stored size must become an aspect-ratio value, never an explicit width"
  );
  assert.match(
    view,
    /style=\{viewerExpandedImageStyle\}/,
    "the ratio style must reach the live viewer column"
  );
  assert.match(
    view,
    /aspect-\[var\(--viewer-aspect\)\]/,
    "the image must carry the published ratio"
  );
  assert.match(
    view,
    /max-h-full max-w-full select-none/,
    "the image must be capped by real available space in both axes"
  );
  assert.doesNotMatch(
    view,
    /w-\[var\(--viewer-expanded-width\)\]|heightBoundWidthDvh|min-\[700px\]:max-h-\[78dvh\]|max-h-\[calc\(100dvh-20rem\)\]/,
    "no explicit width and no viewport-formula height cap may return; those squashed the image in short windows"
  );
  assert.match(
    view,
    /min-\[700px\]:max-w-\[min\(88vw,76rem\)\]/,
    "the standing desktop width ceiling stays"
  );
  assert.match(
    view,
    /flex min-h-0 max-w-full flex-1 items-center justify-center/,
    "the frame wrapper must take the height the header and bar leave, so max-h-full resolves against real space"
  );
  assert.match(
    view,
    /py-\[var\(--space-4\)\]/,
    "the viewer column must keep --space-4 above and below at every width"
  );
  assert.doesNotMatch(
    view,
    /min-\[700px\]:h-auto/,
    "the column must stay the full viewer height at desktop widths so the flex chain stays definite"
  );
  assert.match(
    frame,
    /className="relative flex max-h-full max-w-full"/,
    "the shared frame wrapper must pass the height cap through to the image"
  );
}

console.log(
  JSON.stringify(
    {
      diagnostic: "kit_image_viewer_full_scale_v3",
      status: "PASSED",
      legacyFillBehaviorVerified: true,
      imageKeepsFixedRatioAtEveryWindowShape: true,
      explicitWidthRemoved: true,
      desktopWidthEnvelope: "min(88vw, 76rem)",
      columnVerticalInset: "--space-4",
    },
    null,
    2
  )
);
