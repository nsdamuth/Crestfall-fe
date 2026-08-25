import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

function read(path) {
  return fs.readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

test("Creators restores Grid/List selection with persistent V2 preference", () => {
  const source = read("app/studio/v2/creators/CreatorsV2Mockup.jsx");
  assert.match(source, /ViewModeToggleView/);
  assert.match(source, /cf\.creators\.viewMode/);
  assert.match(source, /layout === "list"/);
  assert.match(source, /CreatorListRow/);
});

test("Creator list row keeps live follow and profile navigation actions", () => {
  const source = read("app/studio/v2/creators/CreatorsV2Mockup.jsx");
  assert.match(source, /onFollow=\{handlers\.onFollow\}/);
  assert.match(source, /onViewProfile=\{handlers\.onViewProfile\}/);
  assert.match(source, /Following/);
  assert.match(source, /View profile/);
});

test("Creator projection exposes identity copy needed by list view", () => {
  const source = read("lib/shared/presentation/creatorPresentation.js");
  assert.match(source, /displayName:/);
  assert.match(source, /summary:/);
  assert.match(source, /canonContributor:/);
});

test("Creator profile restores Creations Activity and Badges tabs", () => {
  const source = read("app/studio/v2/creators/creator-profile/CreatorProfile.view.jsx");
  assert.match(source, /PROFILE_TABS/);
  assert.match(source, /Creations/);
  assert.match(source, /Activity/);
  assert.match(source, /Badges/);
  assert.match(source, /activeTab === "activity"/);
  assert.match(source, /activeTab === "badges"/);
});

test("Live creator profile owns tab state without changing backend contracts", () => {
  const source = read("app/studio/v2/creators/CreatorProfileLive.jsx");
  assert.match(source, /activeProfileTab/);
  assert.match(source, /onSelectTab=\{setActiveProfileTab\}/);
  assert.doesNotMatch(source, /\/api\//);
});

test("Fixture creator profile exercises the same tab contract", () => {
  const source = read("app/studio/v2/creators/creator-profile/useCreatorProfileViewModel.js");
  assert.match(source, /activeTab/);
  assert.match(source, /onSelectTab: setActiveTab/);
});
