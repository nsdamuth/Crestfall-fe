import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("Creation Profile Page shell stays thin and owns application adapters", () => {
  const shell = read("components/studio/creations/CreationProfilePage.jsx");

  for (const token of [
    "useCreationProfilePageViewModel",
    "CreationProfilePageView",
    "CreationStatusBadges",
    "CreationStatsRow",
    "CreationShareButton",
    "MediaTileQuickActions",
    "MediaLightbox",
    "KitCredits",
    "LorePublicCreationPage",
    "StandardCreationProfilePage",
  ]) {
    assert.match(shell, new RegExp(token));
  }
  assert.doesNotMatch(
    shell,
    /useState|useEffect|fetchMediaReactions|setMediaLike|setMediaBookmark|startStoryFromCreation/
  );
  assert.match(shell, /creationType === "LORE"/);
  assert.match(shell, /return <LorePublicCreationPage \{\.\.\.props\} \/>/);
  assert.match(shell, /return <StandardCreationProfilePage \{\.\.\.props\} \/>/);
});

test("ViewModel owns media aliases, filtering, source ordering, and pagination", () => {
  const vm = read(
    "components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js"
  );

  for (const token of [
    "image_output_id",
    "output_id",
    "displayImageUrl",
    "thumbnailUrl",
    "filterCreationProfileMedia",
    "CREATION_PROFILE_INITIAL_VISIBLE_MEDIA = 12",
    "CREATION_PROFILE_VISIBLE_MEDIA_INCREMENT = 12",
    "CREATION_PROFILE_EAGER_MEDIA_COUNT = 4",
    "IMAGES",
    "VIDEOS",
    "LIKED",
    "BOOKMARKED",
    "CREATION_PROFILE_CREDITS_TAB",
    "buildCreationProfileTabs",
  ]) {
    assert.match(vm, new RegExp(token));
  }
});

test("ViewModel owns reactions and Story Room orchestration", () => {
  const vm = read(
    "components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js"
  );

  assert.match(vm, /fetchMediaReactions\(imageOutputIds\)/);
  assert.match(vm, /setMediaLike\(imageOutputId, nextActive\)/);
  assert.match(vm, /setMediaBookmark\(imageOutputId, nextActive\)/);
  assert.match(vm, /startStoryFromCreation\(normalizedCreation\.raw\)/);
  assert.match(vm, /Story was created without a room id\./);
  assert.match(vm, /navigate\?\.\(`\/studio\/story-rooms\/\$\{roomId\}`\)/);
});

test("portable View consumes display-ready state and semantic slots", () => {
  const view = read(
    "components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx"
  );

  for (const token of [
    "statusBadgesSlot",
    "statsSlot",
    "creatorLinkSlot",
    "generateLinkSlot",
    "shareButtonSlot",
    "mediaActionSlots",
    "lightboxSlot",
    "description?.visibleText",
    "mediaTabs.map",
    "creditsSlot",
    "showingCredits",
    "visibleMedia.map",
  ]) {
    assert.match(view, new RegExp(token.replace(/[?.]/g, "\\$&")));
  }
  assert.doesNotMatch(
    view,
    /next\/link|next\/navigation|mediaReactionClient|storyRoomClient|creationTypePolicy|creation\.data/
  );
  assert.doesNotMatch(view, /sortControlSlot|Sort Newest|label="Sort"/);
});

test("legacy catalogue behavior and fallback states remain present", () => {
  const view = read(
    "components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx"
  );
  const vm = read(
    "components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js"
  );

  assert.match(view, /No public media yet/);
  assert.match(view, /Search this creation's media/);
  assert.match(view, /Load more/i);
  assert.match(view, /Starting\.\.\./);
  assert.match(vm, /CREATION_PROFILE_DESCRIPTION_PREVIEW_LIMIT = 420/);
  assert.match(vm, /No description has been added yet\./);
  assert.match(vm, /Like could not be saved\./);
  assert.match(vm, /Bookmark could not be saved\./);
});

test("contract, fixtures, and protected preview are included", () => {
  const contract = read(
    "components/studio/creations/creation-profile-page/CreationProfilePage.contract.js"
  );
  const fixtures = read(
    "components/studio/creations/creation-profile-page/CreationProfilePage.fixtures.js"
  );
  const page = read("app/dev/ui-preview/creation-profile-page/page.jsx");
  const preview = read(
    "app/dev/ui-preview/creation-profile-page/CreationProfilePagePreviewClient.jsx"
  );

  assert.match(contract, /CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CreationProfilePageViewProps/);
  assert.match(contract, /reactionsAndStoryStart: "ViewModel"/);
  assert.match(fixtures, /creationProfileFixture/);
  assert.match(fixtures, /creationProfileMediaFixture/);
  assert.match(fixtures, /creationProfileEmptyMediaFixture/);
  assert.match(fixtures, /creationProfileLoadErrorFixture/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /POPULATED/);
  assert.match(preview, /EMPTY/);
  assert.match(preview, /ERROR/);
});

test("documentation and focused diagnostic command remain explicit", () => {
  const readme = read(
    "components/studio/creations/creation-profile-page/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /12-item pagination/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/creation-profile-page/);
  assert.match(packageJson, /diagnostics:loom:creation-profile-page/);
});
