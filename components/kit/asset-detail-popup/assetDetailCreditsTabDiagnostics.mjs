import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { getCreationCredits } from "../../../lib/shared/creations/creationAttribution.js";
import { projectCommunityCreation } from "../../../lib/shared/presentation/communityPresentation.js";
import { projectCreationToVaultItem } from "../../../lib/shared/presentation/vaultPresentation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("generic V2 asset popup exposes Credits only for resolved attribution", () => {
  const view = read("components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx");
  assert.match(view, /function CreditsDisclosure/);
  assert.match(view, /if \(!credits\.length\) return null/);
  assert.match(view, /aria-expanded=\{open\}/);
  assert.match(view, /<KitCreditsView credits=\{credits\}[\s\S]*showHeading=\{false\}/);
});

test("asset popup no longer treats Credits as media or opens a stacked credits modal", () => {
  const view = read("components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx");
  const shell = read("components/kit/KitAssetDetailPopup.jsx");
  assert.doesNotMatch(view, /MEDIA_TABS|getDetailTabs|Search media|MediaLibrary/);
  assert.doesNotMatch(view, /CollapsedCreditsBlock|View all credits/);
  assert.doesNotMatch(view, /KitCreditsModal/);
  assert.doesNotMatch(shell, /isCreditsModalOpen|useState|closeOnEscape|closeOnBackdrop/);
});

test("public creation catalogue keeps its own conditional Credits tab", () => {
  const vm = read("components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js");
  const view = read("components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx");
  const shell = read("components/studio/creations/CreationProfilePage.jsx");
  assert.match(vm, /CREATION_PROFILE_CREDITS_TAB/);
  assert.match(vm, /credits\.length[\s\S]*CREATION_PROFILE_CREDITS_TAB/);
  assert.match(view, /activeTabId === "CREDITS"/);
  assert.match(view, /showingCredits \? \([\s\S]*creditsSlot/);
  assert.match(shell, /<KitCredits credits=\{creation\.credits\} showHeading=\{false\} \/>/);
});

test("zero-credit creations do not receive an empty Credits affordance", () => {
  const vm = read("components/studio/creations/creation-profile-page/useCreationProfilePageViewModel.js");
  assert.match(vm, /credits\.length\s*\?\s*\[\.\.\.CREATION_PROFILE_MEDIA_TABS, CREATION_PROFILE_CREDITS_TAB\]\s*:\s*CREATION_PROFILE_MEDIA_TABS/);
  const kitView = read("components/kit/credits/KitCredits.view.jsx");
  assert.match(kitView, /if \(!credits\.length\) return null/);
});

test("credits rows remain display-only and keep existing attribution links", () => {
  const creditsView = read("components/kit/credits/KitCredits.view.jsx");
  assert.match(creditsView, /credit\.kindLabel/);
  assert.match(creditsView, /credit\.creatorHandle/);
  assert.match(creditsView, /credit\.creatorHref/);
  assert.match(creditsView, /credit\.assetTitle/);
  assert.doesNotMatch(creditsView, /fetch\(|supabase|postgraphile|\/api\//i);
});

test("live V2 card projections derive credits from the canonical attribution resolver", () => {
  const vault = read("lib/shared/presentation/vaultPresentation.js");
  const community = read("lib/shared/presentation/communityPresentation.js");
  const attribution = read("lib/shared/creations/creationAttribution.js");

  assert.match(vault, /getCreationCredits/);
  assert.match(vault, /credits: getCreationCredits\(creation\)/);
  assert.match(community, /getCreationCredits/);
  assert.match(community, /credits: getCreationCredits\(creation\)/);
  assert.match(attribution, /\.filter\(Array\.isArray\)[\s\S]*\.flat\(\)/);
});

test("empty explicit credits do not mask connected-asset provenance", () => {
  const creation = {
    id: "story-template-1",
    type: "ROOM_TEMPLATE",
    title: "Kessa's Test Story Template",
    credits: [],
    connectedAssets: [
      {
        id: "character-kessa",
        kind: "CHARACTER",
        title: "Kessa Cindervell",
        creatorUsername: "crestfall",
      },
    ],
  };

  const resolved = getCreationCredits(creation);
  assert.equal(resolved.length, 1);
  assert.equal(resolved[0].kindLabel, "Character");
  assert.equal(resolved[0].creatorHandle, "@Crestfall");
  assert.equal(resolved[0].assetTitle, "Kessa Cindervell");

  const vaultItem = projectCreationToVaultItem(creation);
  const communityItem = projectCommunityCreation(creation);
  assert.equal(vaultItem.credits.length, 1);
  assert.equal(communityItem.credits.length, 1);
});
