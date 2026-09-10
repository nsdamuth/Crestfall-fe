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

function testFullScaleViewer() {
  assert.match(
    legacyView,
    /className="h-full max-h-full w-full max-w-full object-contain"/,
    "legacy MediaLightbox authority must still prove the prior viewer actively filled its available image area"
  );
  assert.match(
    view,
    /function getViewerExpandedImageStyle\(pixelSize\)/,
    "Kit viewer must derive an explicit desktop display size from the measured image aspect ratio"
  );
  assert.match(
    view,
    /heightBoundWidthDvh = 78 \* aspectRatio/,
    "desktop display width must be bounded by the established 78dvh height envelope"
  );
  assert.match(
    view,
    /--viewer-expanded-width.*min\(88vw, 76rem,/,
    "desktop image expansion must also remain bounded by the established viewport width envelope"
  );
  assert.match(
    view,
    /min-\[700px\]:w-\[var\(--viewer-expanded-width\)\]/,
    "desktop Kit viewer must actively request the expanded display width instead of leaving width intrinsic"
  );
  assert.match(
    view,
    /style=\{viewerExpandedImageStyle\}/,
    "the measured expansion style must reach the live viewer column"
  );
  assert.doesNotMatch(
    view,
    /min-\[700px\]:max-h-\[60dvh\]/,
    "the regressed 60dvh desktop image cap must not return"
  );
  assert.match(
    view,
    /max-h-\[calc\(100dvh-20rem\)\]/,
    "mobile chrome-aware image reservation must remain unchanged"
  );
  assert.match(
    frame,
    /min-\[700px\]:max-h-\[78dvh\]/,
    "shared overlay sizing remains aligned to the same desktop height envelope"
  );
}

console.log(
  JSON.stringify(
    {
      diagnostic: "kit_image_viewer_full_scale_v2",
      status: "PASSED",
      legacyFillBehaviorVerified: true,
      desktopActivelyExpandsBeyondIntrinsicSize: true,
      desktopHeightEnvelope: "78dvh",
      desktopWidthEnvelope: "min(88vw, 76rem)",
      portraitAndLandscapeAspectAware: true,
      mobileChromeReservationPreserved: true,
    },
    null,
    2
  )
);
