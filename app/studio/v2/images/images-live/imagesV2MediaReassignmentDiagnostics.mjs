import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("image reassignment client owns GET context and POST mutation through FE API", () => {
  const client = read("lib/client/studio/media/imageOutputClient.js");

  assert.match(client, /fetchImageReassignmentContext/);
  assert.match(client, /reassignImageOutput/);
  assert.match(client, /\/api\/media\/images\/\$\{encodeURIComponent\(imageOutputId\)\}\/reassign/);
  assert.match(client, /sourceCreationId/);
  assert.match(client, /destinationCreationId/);
});

test("media-specific FE proxy preserves authenticated Chassis to services-api boundary", () => {
  const route = read("app/api/media/images/[imageOutputId]/reassign/route.js");

  assert.match(route, /getAuthenticatedUser/);
  assert.match(route, /crestfallApiRequest/);
  assert.match(route, /x-crestfall-user-id/);
  assert.match(route, /export async function GET/);
  assert.match(route, /export async function POST/);
  assert.match(route, /\/v1\/media\/images\/\$\{encodeURIComponent/);
  assert.doesNotMatch(route, /postgraphile|\.from\(/i);
});

test("generation history exposes authoritative assignment identity and applies reassignment locally", () => {
  const history = read(
    "components/studio/image-studio/hooks/useImageGenerationHistory.js"
  );

  assert.match(history, /primarySubjectCreationId/);
  assert.match(history, /canReassign: Boolean/);
  assert.match(history, /applyImageReassignment/);
  assert.match(history, /destinationCreationId/);
  assert.match(history, /primary_subject_creation_id: destinationCreationId/);
});

test("Image Studio workbench refreshes both assignment state and account coin balance", () => {
  const workbench = read(
    "components/studio/image-studio/image-studio-workbench/useImageStudioWorkbenchViewModel.js"
  );
  const historyGrid = read(
    "components/studio/image-studio/media-history-grid/useMediaHistoryGridViewModel.js"
  );

  assert.match(workbench, /applyImageReassignment/);
  assert.match(workbench, /onCoinBalanceChange: setCoinBalanceFromServer/);
  assert.match(workbench, /onImageReassigned: applyImageReassignment/);
  assert.match(historyGrid, /onReassignItem/);
  assert.match(historyGrid, /imageStudioHref = "\/studio\/image-studio"/);
  assert.match(historyGrid, /result\?\.coinBalance/);
  assert.match(historyGrid, /onImageReassigned\?\./);

  const v2View = read("app/studio/v2/images/ImagesV2Live.jsx");
  assert.match(v2View, /imageStudioHref="\/studio\/v2\/images"/);
});

test("V2 MediaLightbox owns reassignment presentation while ViewModel owns application calls", () => {
  const viewModel = read(
    "components/studio/media/media-lightbox/useMediaLightboxViewModel.js"
  );
  const view = read("components/studio/media/media-lightbox/MediaLightbox.view.jsx");
  const contract = read("components/studio/media/media-lightbox/MediaLightbox.contract.js");

  assert.match(contract, /2\.1\.0/);
  assert.match(viewModel, /fetchImageReassignmentContext/);
  assert.match(viewModel, /reassignImageOutput/);
  assert.match(viewModel, /showReassignAction/);
  assert.match(viewModel, /onSubmitReassign/);
  assert.match(view, /ReassignDialog/);
  assert.match(view, /Reassign for/);
  assert.match(view, /disabled=\{!showReassignAction\}/);
  assert.doesNotMatch(view, /imageOutputClient|fetch\(|crestfallApiRequest|supabase|postgraphile/i);
});

test("shared V2 image overlay enables reassignment only when an application callback exists", () => {
  const overlay = read("components/kit/image-overlay/KitImageOverlay.view.jsx");
  const contract = read("components/kit/image-overlay/KitImageOverlay.contract.js");

  assert.match(contract, /1\.2\.0/);
  assert.match(overlay, /onClick=\{onReassignAsset\}/);
  assert.match(overlay, /disabled=\{!onReassignAsset\}/);
  assert.doesNotMatch(overlay, /CR-055.*stub|not wired yet/);
});

test("V2 media delete confirmation reflects current permanent-delete behavior", () => {
  const mediaLightbox = read("components/studio/media/media-lightbox/MediaLightbox.view.jsx");
  const kitOverlay = read("components/kit/image-overlay/KitImageOverlay.view.jsx");

  for (const view of [mediaLightbox, kitOverlay]) {
    assert.doesNotMatch(view, /\[X\] days/);
    assert.match(view, /cannot be undone/);
  }
});
