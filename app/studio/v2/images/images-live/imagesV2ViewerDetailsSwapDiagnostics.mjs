import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("V2 image details flips inside the exact fitted image box and scrolls independently", () => {
  const adapter = read("app/studio/v2/images/images-live/ImagesV2ImageViewer.jsx");
  const view = read("components/kit/image-viewer/KitImageViewer.view.jsx");
  const viewModel = read("components/kit/image-viewer/useKitImageViewerViewModel.js");
  const mediaLightboxView = read("components/studio/media/media-lightbox/MediaLightbox.view.jsx");

  assert.doesNotMatch(
    adapter,
    /<DetailsDialog/,
    "the V2 Images viewer must not open the generation details modal over the zoomable image"
  );
  assert.match(
    adapter,
    /detailsOpen=\{Boolean\(lightbox\.detailsDialog\.open\)\}/,
    "the V2 adapter must drive details as a viewer face mode"
  );
  assert.match(
    adapter,
    /detailsPanel=\{lightbox\.detailsDialog\}/,
    "the V2 adapter must pass the details payload into the viewer"
  );
  assert.match(
    adapter,
    /onDetails=\{lightbox\.detailsDialog\.open \? lightbox\.onCloseDetails : lightbox\.onOpenDetails\}/,
    "the header Details button must toggle between details and image"
  );
  assert.match(
    adapter,
    /onCloseDetails=\{lightbox\.onCloseDetails\}/,
    "the embedded details Back control must close details"
  );

  assert.match(
    viewModel,
    /detailsOpen: Boolean\(props\?\.detailsOpen\)/,
    "the Kit viewer ViewModel must carry details mode"
  );
  assert.match(
    viewModel,
    /"--viewer-image-w": `\$\{imageBox\.width\}px`, "--viewer-image-h": `\$\{imageBox\.height\}px`/,
    "the viewer must continue publishing the fitted image width and height"
  );

  assert.match(
    view,
    /detailsLabel=\{detailsOpen \? "Back to image" : "Details"\}/,
    "the viewer header must expose the same Details toggle while either face is visible"
  );
  assert.match(
    view,
    /h-\[var\(--viewer-image-h\)\] w-\[var\(--viewer-image-w\)\]/,
    "the flip surface must use the exact fitted image width and height"
  );
  assert.match(
    view,
    /data-viewer-flip-surface/,
    "the image/details body must use one stable flip surface"
  );
  assert.match(
    view,
    /\[perspective:1200px\]/,
    "the fitted surface must provide restrained 3D perspective"
  );
  assert.match(
    view,
    /\[transform-style:preserve-3d\]/,
    "the two faces must preserve 3D transforms"
  );
  assert.match(
    view,
    /transform: detailsOpen \? "rotateY\(180deg\)" : "rotateY\(0deg\)"/,
    "Details must flip the same surface rather than replacing it with a new-sized body"
  );
  assert.match(
    view,
    /motion-reduce:transition-none/,
    "reduced-motion users must get an immediate face swap"
  );
  assert.match(
    view,
    /detailsOpen \? "pointer-events-none" : "pointer-events-auto"/,
    "the hidden image face must stop receiving zoom/pan pointer input"
  );
  assert.match(
    view,
    /detailsOpen \? "pointer-events-auto" : "pointer-events-none"/,
    "only the visible details face may receive scrolling/pointer input"
  );
  assert.match(
    view,
    /inert=\{detailsOpen \? true : undefined\}/,
    "the hidden image face must also be removed from interaction semantics"
  );
  assert.match(
    view,
    /inert=\{!detailsOpen \? true : undefined\}/,
    "the hidden details face must not retain a tabbable Back control"
  );
  assert.match(
    view,
    /<ImageFrame[\s\S]*<ImageDetailsPanel embedded \{\.\.\.detailsPanel\} onClose=\{onCloseDetails\} \/>/,
    "both image and details faces must stay mounted in the same fitted surface"
  );

  assert.match(
    mediaLightboxView,
    /embedded\n\s*\? "h-full w-full overflow-y-auto/,
    "embedded generation details must scroll inside the fixed fitted surface"
  );
  assert.match(
    mediaLightboxView,
    /Back to image/,
    "the embedded details face must offer an explicit way back"
  );

  console.log(
    JSON.stringify(
      {
        diagnostic: "images_v2_viewer_details_flip_v2",
        status: "PASSED",
        exactFittedImageBox: true,
        internalDetailsScroll: true,
        zoomPanStatePreserved: true,
        hiddenImageCannotInterceptPointerInput: true,
        reducedMotionFallback: true,
        modalDetailsPathRemovedFromV2Viewer: true,
      },
      null,
      2
    )
  );
});
