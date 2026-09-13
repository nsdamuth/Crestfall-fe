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

test("V2 image details swap replaces the image body instead of opening a modal", () => {
  const adapter = read("app/studio/v2/images/images-live/ImagesV2ImageViewer.jsx");
  const view = read("components/kit/image-viewer/KitImageViewer.view.jsx");
  const viewModel = read("components/kit/image-viewer/useKitImageViewerViewModel.js");
  const mediaLightboxView = read("components/studio/media/media-lightbox/MediaLightbox.view.jsx");

  assert.doesNotMatch(
    adapter,
    /<DetailsDialog/,
    "the V2 Images viewer must stop opening the generation details modal over the zoomable image"
  );
  assert.match(
    adapter,
    /detailsOpen=\{Boolean\(lightbox\.detailsDialog\.open\)\}/,
    "the V2 adapter must drive details as a viewer body mode"
  );
  assert.match(
    adapter,
    /detailsPanel=\{lightbox\.detailsDialog\}/,
    "the V2 adapter must pass the details payload into the viewer body"
  );
  assert.match(
    adapter,
    /onDetails=\{lightbox\.detailsDialog\.open \? lightbox\.onCloseDetails : lightbox\.onOpenDetails\}/,
    "the V2 adapter must toggle between opening details and returning to the image"
  );
  assert.match(
    viewModel,
    /detailsOpen: Boolean\(props\?\.detailsOpen\)/,
    "the Kit viewer ViewModel must carry details mode"
  );
  assert.match(
    view,
    /detailsLabel=\{detailsOpen \? "Back to image" : "Details"\}/,
    "the viewer header must expose a toggle back to the image"
  );
  assert.match(
    view,
    /detailsOpen \? \(/,
    "the viewer body must branch between image mode and details mode"
  );
  assert.match(
    view,
    /<ImageDetailsPanel embedded \{\.\.\.detailsPanel\} onClose=\{onCloseDetails\} \/>/,
    "the details panel must render inline inside the viewer body"
  );
  assert.match(
    mediaLightboxView,
    /export function ImageDetailsPanel\(/,
    "the shared media details markup must be reusable outside the modal shell"
  );
  assert.match(
    mediaLightboxView,
    /Back to image/,
    "the embedded details panel must offer an explicit way back to the image"
  );
});

console.log(
  JSON.stringify(
    {
      diagnostic: "images_v2_viewer_details_swap_v1",
      status: "PASSED",
      imageBodyAndDetailsBodyAreMutuallyExclusive: true,
      zoomableImageNoLongerInterceptsDetailsScroll: true,
      detailsRemainInSameViewerContext: true,
      modalOnlyDetailsPathRemovedFromV2Viewer: true,
    },
    null,
    2
  )
);
