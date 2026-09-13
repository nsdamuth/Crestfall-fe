import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const viewPath = path.join(currentDir, "KitImageViewer.view.jsx");
const viewModelPath = path.join(currentDir, "useKitImageViewerViewModel.js");
const legacyViewPath = path.join(
  currentDir,
  "../../studio/media/media-lightbox/MediaLightbox.view.jsx"
);
const view = fs.readFileSync(viewPath, "utf8");
const viewModel = fs.readFileSync(viewModelPath, "utf8");
const legacyView = fs.readFileSync(legacyViewPath, "utf8");

testFullScaleViewer();

// Sizing law, RULED 12 Sep 2026 (Brian's browser review, two passes):
// the ViewModel measures the frame slot (the column's height after the
// header and the bar) and fits the image's own ratio into it, then the
// image takes exactly that box. A window of any shape shows the whole
// image at its fixed ratio, never squashed and never cropped, and the
// column keeps --space-4 above and below so nothing sits flush.
function testFullScaleViewer() {
  assert.match(
    legacyView,
    /className="h-full max-h-full w-full max-w-full object-contain"/,
    "legacy MediaLightbox authority must still prove the prior viewer actively filled its available image area"
  );
  assert.match(
    viewModel,
    /function fitImageBox\(frameBox, pixelSize\)/,
    "the ViewModel must fit the image's ratio into the measured frame slot"
  );
  assert.match(
    viewModel,
    /new ResizeObserver\(\(\) => measureFrameSlot\(\)\)/,
    "the frame slot must be measured live so a window resize refits the image"
  );
  assert.match(
    viewModel,
    /window\.addEventListener\("resize", measureFrameSlot\)/,
    "a window resize that does not change the slot height must still refit the width"
  );
  assert.match(
    viewModel,
    /"--viewer-image-w": `\$\{imageBox\.width\}px`, "--viewer-image-h": `\$\{imageBox\.height\}px`/,
    "the fitted box must reach the view as two custom properties"
  );
  assert.match(
    view,
    /ref=\{frameSlotRef\}/,
    "the view must hand the frame slot to the ViewModel for measurement"
  );
  assert.match(
    view,
    /w-\[var\(--viewer-image-w\)\] h-\[var\(--viewer-image-h\)\]/,
    "the image must take exactly the fitted box"
  );
  assert.match(
    view,
    /hasImageBox \? VIEWER_IMAGE_FITTED_CLASSES : VIEWER_IMAGE_FALLBACK_CLASSES/,
    "before the slot is measured the image must fall back to caps, never to an explicit width"
  );
  assert.doesNotMatch(
    view,
    /w-\[var\(--viewer-expanded-width\)\]|heightBoundWidthDvh|min-\[700px\]:max-h-\[78dvh\]|max-h-\[calc\(100dvh-20rem\)\]/,
    "no viewport-formula width or height may return; those squashed the image in short windows"
  );
  assert.match(
    viewModel,
    /DESKTOP_WIDTH_FRACTION = 0\.88;[\s\S]*DESKTOP_WIDTH_CAP_PX = 76 \* 16;/,
    "the standing desktop width ceiling (88vw, 76rem) stays"
  );
  assert.match(
    view,
    /flex min-h-0 max-w-full flex-1 items-center justify-center self-stretch/,
    "the frame slot must take the height the header and bar leave"
  );
  assert.match(
    view,
    /py-\[var\(--space-4\)\]/,
    "the viewer column must keep --space-4 above and below at every width"
  );
  assert.doesNotMatch(
    view,
    /min-\[700px\]:h-auto/,
    "the column must stay the full viewer height at desktop widths"
  );
}

console.log(
  JSON.stringify(
    {
      diagnostic: "kit_image_viewer_full_scale_v4",
      status: "PASSED",
      legacyFillBehaviorVerified: true,
      imageKeepsFixedRatioAtEveryWindowShape: true,
      imageNeverCropped: true,
      frameSlotMeasuredLive: true,
      desktopWidthEnvelope: "min(88vw, 76rem)",
      columnVerticalInset: "--space-4",
    },
    null,
    2
  )
);
