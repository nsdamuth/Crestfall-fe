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

test("Creation Preview Modal shell stays thin and owns application adapters", () => {
  const shell = read("components/studio/creations/CreationPreviewModal.jsx");

  assert.match(shell, /useCreationPreviewModalViewModel/);
  assert.match(shell, /CreationPreviewModalView/);
  assert.match(shell, /ModalShell/);
  assert.match(shell, /LinkComponent=\{Link\}/);
  assert.match(shell, /StatusBadgesComponent=\{CreationStatusBadges\}/);
  assert.match(shell, /StatsRowComponent=\{CreationStatsRow\}/);
  assert.match(shell, /CreditsComponent=\{CreationCredits\}/);
  assert.match(shell, /ShareButtonComponent=\{CreationShareButton\}/);
  assert.doesNotMatch(shell, /useState|startStoryFromCreation|setDefaultPlayerCharacter|getCreationCredits/);
});

test("ViewModel owns creation aliases, routes, description, and media projection", () => {
  const vm = read(
    "components/studio/creations/creation-preview-modal/useCreationPreviewModalViewModel.js"
  );

  for (const token of [
    "featuredMedia",
    "featured_media",
    "featuredImages",
    "featured_images",
    "imageUrl",
    "image_url",
    "assetUrl",
    "asset_url",
    "catalogueHref",
    "imageLibraryHref",
    "CREATION_DESCRIPTION_PREVIEW_LIMIT = 520",
  ]) {
    assert.match(vm, new RegExp(token));
  }
  assert.match(vm, /slice\(0, 4\)/);
  assert.match(vm, /getCreationCreator/);
  assert.match(vm, /getCreationCredits/);
});

test("ViewModel owns story and default Player Character mutations", () => {
  const vm = read(
    "components/studio/creations/creation-preview-modal/useCreationPreviewModalViewModel.js"
  );

  assert.match(vm, /getStoryOpeningLocationStartConfig/);
  assert.match(vm, /projectStoryStartOpeningLocationPresentation/);
  assert.match(vm, /startStoryFromCreation\(creation,\s*\{/);
  assert.match(vm, /openingLocationPicker/);
  assert.match(vm, /setDefaultPlayerCharacter\(creation\.id\)/);
  assert.match(vm, /Story was created without a room id\./);
  assert.match(vm, /Story could not be started\./);
  assert.match(vm, /Default Player Character set\./);
  assert.match(vm, /Default Player Character could not be saved\./);
  assert.match(vm, /navigate\?\.\(`\/studio\/story-rooms\/\$\{roomId\}`\)/);
});

test("portable View receives display-ready state and semantic callbacks", () => {
  const view = read(
    "components/studio/creations/creation-preview-modal/CreationPreviewModal.view.jsx"
  );

  assert.match(view, /description\.visibleText/);
  assert.match(view, /mediaIndicators\.map/);
  assert.match(view, /onPreviousMedia/);
  assert.match(view, /onNextMedia/);
  assert.match(view, /onSetDefaultPc/);
  assert.match(view, /openingLocationPicker/);
  assert.match(view, /StoryStartOpeningLocationPickerView/);
  assert.match(view, /LinkComponent/);
  assert.match(view, /ShareButtonComponent/);
  assert.doesNotMatch(
    view,
    /next\/link|next\/navigation|storyRoomClient|defaultPlayerCharacterClient|creationAttribution|creationMedia|creationTypePolicy/
  );
  assert.doesNotMatch(view, /creation\?\.|creation\.data|featured_media/);
});

test("owner, public, picker, carousel, and empty-media behavior remain present", () => {
  const view = read(
    "components/studio/creations/creation-preview-modal/CreationPreviewModal.view.jsx"
  );
  const vm = read(
    "components/studio/creations/creation-preview-modal/useCreationPreviewModalViewModel.js"
  );

  assert.match(view, /context === "owner"/);
  assert.match(view, /context === "picker"/);
  assert.match(view, /Set default PC/);
  assert.match(view, /Image library/);
  assert.match(view, /Select soon/);
  assert.match(view, /Preview Pending/);
  assert.match(view, /Want to see more\?/);
  assert.match(vm, /isShareable/);
  assert.match(vm, /isChatCapableCreationType/);
  assert.match(vm, /mediaIndexByCreationId/);
});

test("contract, fixtures, and preview cover all modal contexts", () => {
  const contract = read(
    "components/studio/creations/creation-preview-modal/CreationPreviewModal.contract.js"
  );
  const fixtures = read(
    "components/studio/creations/creation-preview-modal/CreationPreviewModal.fixtures.js"
  );
  const page = read("app/dev/ui-preview/creation-preview-modal/page.jsx");
  const preview = read(
    "app/dev/ui-preview/creation-preview-modal/CreationPreviewModalPreviewClient.jsx"
  );

  assert.match(contract, /CREATION_PREVIEW_MODAL_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CreationPreviewModalViewProps/);
  assert.match(contract, /CreationPreviewOpeningLocationPicker/);
  assert.match(contract, /openingLocationPicker/);
  assert.match(contract, /ownsStoryAndDefaultPlayerCharacterMutations: "ViewModel"/);
  assert.match(fixtures, /creationPreviewOwnerFixture/);
  assert.match(fixtures, /creationPreviewPublicFixture/);
  assert.match(fixtures, /creationPreviewPickerFixture/);
  assert.match(fixtures, /creationPreviewMissingMediaFixture/);
  assert.match(fixtures, /creationPreviewPlayerSelectOpeningLocationFixture/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /getCreationPreviewViewProps/);
});

test("documentation and focused diagnostic command remain explicit", () => {
  const readme = read(
    "components/studio/creations/creation-preview-modal/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /four-image limit/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/creation-preview-modal/);
  assert.match(packageJson, /diagnostics:loom:creation-preview-modal/);
});
