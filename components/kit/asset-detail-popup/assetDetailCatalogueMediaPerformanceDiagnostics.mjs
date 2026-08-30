import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(currentDir, "../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

test("featured-media hydration preserves display, card, thumbnail, and locked-preview derivatives", () => {
  const attach = read("lib/server/services/creations/attachFeaturedImageSlotsToCreationRows.js");
  const media = read("lib/shared/creations/creationMedia.js");

  assert.match(attach, /thumbnailUrl/);
  assert.match(attach, /cardUrl/);
  assert.match(attach, /lockedPreviewUrl/);
  assert.match(attach, /displayUrl/);
  assert.match(media, /function getCreationMediaThumbnailUrl/);
  assert.match(media, /function getCreationMediaCardUrl/);
  assert.match(media, /function getCreationMediaLockedPreviewUrl/);
  assert.match(media, /thumbnailUrl,/);
  assert.match(media, /cardUrl,/);
  assert.match(media, /lockedPreviewUrl,/);
  assert.match(media, /displayImageUrl: imageUrl/);
});

test("asset detail popup uses display media for hero and thumbnails for compact tiles", () => {
  const contract = read("components/kit/asset-detail-popup/KitAssetDetailPopup.contract.js");
  const viewModel = read("components/kit/asset-detail-popup/useKitAssetDetailPopupViewModel.js");
  const view = read("components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx");

  assert.match(contract, /thumbnailSrc/);
  assert.match(viewModel, /displaySrc/);
  assert.match(viewModel, /thumbnailSrc/);
  assert.match(view, /getMediaDisplaySrc/);
  assert.match(view, /getMediaThumbnailSrc/);
  assert.match(view, /View full catalogue →/);
});

test("live Community and Vault pass derivative-aware detail media into the popup", () => {
  const communityPresentation = read("lib/shared/presentation/communityPresentation.js");
  const vaultPresentation = read("lib/shared/presentation/vaultPresentation.js");
  const community = read("app/studio/v2/community/CommunityV2Mockup.jsx");
  const vault = read("app/studio/v2/vault/VaultV2Mockup.jsx");

  assert.match(communityPresentation, /detailMedia: media/);
  assert.match(vaultPresentation, /detailMedia,/);
  assert.match(community, /creation\.detailMedia\?\.length/);
  assert.match(vault, /item\.detailMedia\?\.length/);
});

test("editor hero rail consumes the thumbnail derivative without shrinking the large hero", () => {
  const editor = read("app/studio/v2/editor/editor/useEditorViewModel.js");
  const contract = read("components/studio/my-creations/editor-header/EditorHeader.contract.js");
  const view = read("components/studio/my-creations/editor-header/EditorHeader.view.jsx");

  assert.match(editor, /thumbnailSrc:/);
  assert.match(contract, /thumbnailSrc/);
  assert.match(view, /slot\.thumbnailSrc \|\| slot\.imageSrc/);
  assert.match(view, /<PrimaryArt[\s\S]{0,180}imageSrc=\{primaryImageSrc\}/);
});

test("owner catalogue actions resolve to the authenticated creation image library", () => {
  const card = read("components/studio/creations/creation-card/useCreationCardViewModel.js");
  const preview = read("components/studio/creations/creation-preview-modal/useCreationPreviewModalViewModel.js");
  const vault = read("app/studio/v2/vault/VaultV2Mockup.jsx");

  const ownerLibraryPattern = /\/studio\/my-creations\/\$\{[^}]+\}\/image-library/;
  assert.match(card, ownerLibraryPattern);
  assert.match(preview, ownerLibraryPattern);
  assert.match(vault, ownerLibraryPattern);
  assert.ok(vault.indexOf("if (live && item.isOwn)") < vault.indexOf('if (live && ["PUBLIC", "CANON"].includes(item.visibility))'));
});
