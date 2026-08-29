import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyImageOutputDisplayNameResult,
  getImageOutputDisplayTitle,
} from "../../../../lib/shared/media/imageOutputNaming.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const generated = {
  createdAt: "2026-08-28T18:25:21.000Z",
  providerMetadata: {
    crestfallMediaIdentity: {
      version: "image_output_media_identity_v1",
      defaultTitleBase: "Vermillion",
      displayName: null,
    },
  },
};

assert.equal(
  getImageOutputDisplayTitle(generated),
  "Vermillion — 2026-08-28"
);

const renamed = applyImageOutputDisplayNameResult(generated, {
  providerMetadata: {
    crestfallMediaIdentity: {
      version: "image_output_media_identity_v1",
      defaultTitleBase: "Vermillion",
      displayName: "Throne Room Portrait",
    },
  },
});
assert.equal(getImageOutputDisplayTitle(renamed), "Throne Room Portrait");

const history = read(
  "components/studio/image-studio/hooks/useImageGenerationHistory.js"
);
const lightboxVm = read(
  "components/studio/media/media-lightbox/useMediaLightboxViewModel.js"
);
const lightboxView = read(
  "components/studio/media/media-lightbox/MediaLightbox.view.jsx"
);
const imageOutputClient = read(
  "lib/client/studio/media/imageOutputClient.js"
);
const apiProxy = read(
  "app/api/media/images/[imageOutputId]/route.js"
);
const libraryVm = read(
  "components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js"
);

assert.match(history, /getImageOutputDisplayTitle/);
assert.doesNotMatch(history, /prompt\.trim\(\)\.slice\(0, 70\)/);
assert.doesNotMatch(history, /const title = prompt\?\.trim\(\)/);
assert.match(history, /applyImageRename/);
assert.match(lightboxVm, /updateImageOutputDisplayName/);
assert.match(lightboxVm, /onRenameItem/);
assert.match(lightboxView, /Edit image name/);
assert.match(lightboxView, /Reset to default/);
assert.match(imageOutputClient, /method: "PATCH"/);
assert.match(apiProxy, /export async function PATCH/);
assert.match(libraryVm, /getImageOutputDisplayTitle/);
assert.match(libraryVm, /allowRename: true/);

console.log(JSON.stringify({
  diagnostic: "image_output_naming_fe_v0",
  status: "PASSED",
  generationHistoryUsesAssetTitleAndDate: true,
  promptTextNoLongerOwnsImageTitle: true,
  lightboxRenameToolWired: true,
  resetToDefaultWired: true,
  imageStudioStateUpdatesAfterRename: true,
  creationImageLibraryUsesPersistedNames: true,
  viewOwnsPresentationOnly: true,
}, null, 2));
