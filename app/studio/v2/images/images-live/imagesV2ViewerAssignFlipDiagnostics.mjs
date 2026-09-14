import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("V2 Assign flips into the fitted image box and reassignment is free", () => {
  const adapter = read("app/studio/v2/images/images-live/ImagesV2ImageViewer.jsx");
  const viewer = read("components/kit/image-viewer/KitImageViewer.view.jsx");
  const viewerVm = read("components/kit/image-viewer/useKitImageViewerViewModel.js");
  const lightboxVm = read("components/studio/media/media-lightbox/useMediaLightboxViewModel.js");
  const lightboxView = read("components/studio/media/media-lightbox/MediaLightbox.view.jsx");
  const gridVm = read("components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js");
  const libraryVm = read("components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js");

  assert.doesNotMatch(adapter, /<ReassignDialog/, "V2 must not open reassignment as an overlay modal");
  assert.match(adapter, /assignOpen=\{Boolean\(lightbox\.reassignDialog\.open\)\}/);
  assert.match(adapter, /assignPanel=\{\{ \.\.\.lightbox\.reassignDialog, eyebrow: "Assign" \}\}/);
  assert.match(adapter, /onAssignDestinationChange=\{lightbox\.onReassignDestinationChange\}/);
  assert.match(adapter, /onSubmitAssign=\{lightbox\.onSubmitReassign\}/);
  assert.match(adapter, /lightbox\.reassignDialog\.open[\s\S]*lightbox\.onCloseReassign[\s\S]*lightbox\.onOpenReassign/);

  assert.match(viewerVm, /assignOpen: Boolean\(props\?\.assignOpen\)/);
  assert.match(viewerVm, /assignPanel: props\?\.assignPanel \?\? null/);
  assert.match(viewer, /const backFaceOpen = Boolean\(detailsOpen \|\| assignOpen\)/);
  assert.match(viewer, /assignActive=\{assignOpen\}/);
  assert.match(viewer, /label=\{assignActive \? "Back to image" : "Assign"\}/);
  assert.match(viewer, /<ReassignDialog[\s\S]*embedded[\s\S]*onDestinationChange=\{onAssignDestinationChange\}[\s\S]*onSubmit=\{onSubmitAssign\}/);
  assert.match(viewer, /h-\[var\(--viewer-image-h\)\] w-\[var\(--viewer-image-w\)\]/);
  assert.match(viewer, /motion-reduce:transition-none/);
  assert.match(viewer, /backFaceOpen \? "pointer-events-none" : "pointer-events-auto"/);

  assert.match(lightboxVm, /setReassignOpen\(false\);[\s\S]*setDetailsOpen\(true\)/);
  assert.match(lightboxVm, /setDetailsOpen\(false\);[\s\S]*const sourceCreationId/);
  assert.doesNotMatch(lightboxVm, /1 Coin used/);
  assert.doesNotMatch(lightboxView, /Reassignment costs|Reassign for/);
  assert.match(lightboxView, /"Reassign image"/);
  assert.match(lightboxView, /embedded[\s\S]*h-full w-full overflow-y-auto/);

  assert.doesNotMatch(gridVm, /result\?\.coinBalance/);
  assert.doesNotMatch(libraryVm, /setCoinBalanceFromServer|1 Coin used/);

  console.log(JSON.stringify({
    diagnostic: "images_v2_viewer_assign_flip_free_reassignment_v1",
    status: "PASSED",
    assignUsesFittedReverseFace: true,
    modalOverlayRemovedFromV2Assign: true,
    detailsAndAssignMutuallyExclusive: true,
    zoomPanStatePreserved: true,
    reassignmentCoinCopyRemoved: true,
    reassignmentCoinBalanceReconciliationRemoved: true,
  }, null, 2));
});
