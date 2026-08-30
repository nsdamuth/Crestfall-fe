import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  getCreationMediaCardUrl,
  getCreationMediaDisplayUrl,
  getCreationMediaLockedPreviewUrl,
  getCreationMediaThumbnailUrl,
  getFirstAssignedCreationMediaUrl,
  getFirstCreationMediaUrl,
  normalizeCreationMediaItem,
} from "../../../../../lib/shared/creations/creationMedia.js";
import { projectCommunityCreation } from "../../../../../lib/shared/presentation/communityPresentation.js";
import { projectCommunityCreator } from "../../../../../lib/shared/presentation/creatorPresentation.js";
import { projectCreationToVaultItem } from "../../../../../lib/shared/presentation/vaultPresentation.js";
import {
  getImageOutputCardUrl,
  getImageOutputDisplayUrl,
  getImageOutputLockedPreviewUrl,
  getImageOutputThumbnailUrl,
} from "../../../../../lib/server/image-generation/imageOutputUrls.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const derivativeMedia = {
  id: "media-1",
  displayUrl: "/image?variant=display",
  cardUrl: "/image?variant=card",
  thumbnailUrl: "/image?variant=thumbnail",
  lockedPreviewUrl: "/image?variant=lockedPreview",
  originalUrl: "/image",
};

const creation = {
  id: "creation-1",
  ownerId: "creator-1",
  type: "CHARACTER",
  title: "Derivative Test",
  imageUrl: derivativeMedia.displayUrl,
  featuredMedia: [derivativeMedia],
};

test("shared media helpers preserve variant intent and never clear-fallback locked previews", () => {
  assert.equal(getCreationMediaDisplayUrl(derivativeMedia), derivativeMedia.displayUrl);
  assert.equal(getCreationMediaCardUrl(derivativeMedia), derivativeMedia.cardUrl);
  assert.equal(getCreationMediaThumbnailUrl(derivativeMedia), derivativeMedia.thumbnailUrl);
  assert.equal(getCreationMediaLockedPreviewUrl(derivativeMedia), derivativeMedia.lockedPreviewUrl);
  assert.equal(getCreationMediaLockedPreviewUrl({ displayUrl: derivativeMedia.displayUrl }), null);
  assert.equal(getFirstCreationMediaUrl([derivativeMedia], { variant: "card" }), derivativeMedia.cardUrl);
  assert.equal(getFirstAssignedCreationMediaUrl([{ ...derivativeMedia, isPlaceholder: true }], { variant: "card" }), null);
});

test("normalized featured media carries every derivative without collapsing display authority", () => {
  const normalized = normalizeCreationMediaItem(derivativeMedia, 0);
  assert.equal(normalized.imageUrl, derivativeMedia.displayUrl);
  assert.equal(normalized.displayUrl, derivativeMedia.displayUrl);
  assert.equal(normalized.cardUrl, derivativeMedia.cardUrl);
  assert.equal(normalized.thumbnailUrl, derivativeMedia.thumbnailUrl);
  assert.equal(normalized.lockedPreviewUrl, derivativeMedia.lockedPreviewUrl);
  assert.equal(normalized.originalUrl, derivativeMedia.originalUrl);
});

test("server output URL helpers target controlled derivative routes and only expose stored locked previews", () => {
  const output = {
    id: "output-1",
    provider_metadata: { storage: { lockedPreview: { path: "locked.webp" } } },
  };
  assert.equal(getImageOutputDisplayUrl(output), "/api/media/images/output-1/file?variant=display");
  assert.equal(getImageOutputCardUrl(output), "/api/media/images/output-1/file?variant=card");
  assert.equal(getImageOutputThumbnailUrl(output), "/api/media/images/output-1/file?variant=thumbnail");
  assert.equal(getImageOutputLockedPreviewUrl(output), "/api/media/images/output-1/file?variant=lockedPreview");
  assert.equal(getImageOutputLockedPreviewUrl({ id: "legacy-output" }), null);
});

test("Vault and Community use card faces while preserving display, thumbnail, and locked media", () => {
  const vault = projectCreationToVaultItem(creation);
  const community = projectCommunityCreation(creation);
  for (const projected of [vault, community]) {
    assert.equal(projected.imageSrc, derivativeMedia.cardUrl);
    assert.equal(projected.detailMedia[0].displaySrc, derivativeMedia.displayUrl);
    assert.equal(projected.detailMedia[0].cardSrc, derivativeMedia.cardUrl);
    assert.equal(projected.detailMedia[0].thumbnailSrc, derivativeMedia.thumbnailUrl);
    assert.equal(projected.detailMedia[0].lockedPreviewSrc, derivativeMedia.lockedPreviewUrl);
  }
});

test("creator recent-work strips prefer thumbnails", () => {
  const creator = projectCommunityCreator({ id: "creator-1", username: "tester" }, { creations: [creation] });
  assert.equal(creator.thumbnails[0].imageSrc, derivativeMedia.thumbnailUrl);
});

test("Image Studio picker and selected ingredient request thumbnails", () => {
  const utils = read("components/studio/image-studio/imageStudioUtils.js");
  const picker = read("components/studio/image-studio/ingredient-picker/useIngredientPickerViewModel.js");
  const adapter = read("app/studio/v2/images/images-live/useImagesV2LiveViewModel.js");
  for (const source of [utils, picker, adapter]) assert.match(source, /variant:\s*["']thumbnail["']/);
});

test("creation/profile cards consume card media while large preview authority remains display", () => {
  const cardVm = read("components/studio/creations/creation-card/useCreationCardViewModel.js");
  const profileVm = read("components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js");
  const profileView = read("components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx");
  assert.match(cardVm, /variant:\s*["']card["']/);
  assert.match(profileVm, /getCreationMediaDisplayUrl/);
  assert.match(profileVm, /getCreationMediaCardUrl/);
  assert.match(profileView, /item\.cardUrl \|\| item\.thumbnailUrl \|\| item\.imageUrl/);
});
