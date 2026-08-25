import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  projectLiveCreatorConnections,
  projectLiveCreatorProfile,
} from "../../lib/shared/presentation/creatorProfilePresentation.js";

function read(path) {
  return fs.readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
}

test("public creator profile projection preserves authoritative profile stats and mixed works", () => {
  const projected = projectLiveCreatorProfile({
    profile: {
      id: "profile-1",
      username: "Vermillion",
      display_name: "Vermillion",
      description: "World builder",
      avatar_url: "/avatar.png",
    },
    creations: [
      { id: "c1", type: "CHARACTER", title: "A", stats: { likes: 7, messages: 13 } },
      { id: "c2", type: "LOCATION_REGISTRY", title: "B" },
    ],
    badges: [{ id: "b1", label: "Canon Builder", description: "Awarded" }],
    stats: [["11", "Likes"], ["2", "Characters"]],
    followCounts: { followers: 9, following: 4 },
    followState: { isFollowing: true, canFollow: true, isOwnProfile: false },
  });

  assert.equal(projected.profile.handle, "Vermillion");
  assert.equal(projected.stats.followers, 9);
  assert.equal(projected.stats.following, 4);
  assert.equal(projected.stats.likes, 11);
  assert.equal(projected.stats.works, 2);
  assert.equal(projected.works[0].assetKind, "character");
  assert.equal(projected.works[1].assetKind, "world");
  assert.equal(projected.badges[0].label, "Canon Builder");
});

test("public creator connections projection preserves canonical per-viewer follow state", () => {
  const projected = projectLiveCreatorConnections({
    profile: { username: "crestfall", displayName: "Crestfall" },
    followCounts: { followers: 2, following: 1 },
    followers: [
      {
        id: "p2",
        username: "reader",
        displayName: "Reader",
        followState: { isFollowing: true, canFollow: true, isOwnProfile: false },
      },
    ],
    following: [
      {
        id: "p1",
        username: "crestfall",
        displayName: "Crestfall",
        followState: { isFollowing: false, canFollow: false, isOwnProfile: true },
      },
    ],
  });

  assert.equal(projected.followCounts.followers, 2);
  assert.equal(projected.followers[0].isFollowing, true);
  assert.equal(projected.followers[0].canFollow, true);
  assert.equal(projected.following[0].isOwnProfile, true);
  assert.equal(projected.following[0].canFollow, false);
});

test("V2 creator profile route is server-backed and includes public donation activity", () => {
  const source = read("app/studio/v2/creators/[handle]/page.jsx");
  assert.match(source, /getPublicProfilePageData/);
  assert.match(source, /getPublicProfileDonationEvents/);
  assert.match(source, /CreatorProfileLive/);
  assert.doesNotMatch(source, /resolveCreatorProfile|fixtureMode/);
});

test("V2 creator profile live binding uses canonical follow, reaction, donation, and creation engagement clients", () => {
  const source = read("app/studio/v2/creators/CreatorProfileLive.jsx");
  assert.match(source, /setProfileFollowByUsername/);
  assert.match(source, /setProfileLike/);
  assert.match(source, /setProfileBookmark/);
  assert.match(source, /donateProfileCoins/);
  assert.match(source, /useCreationEngagementState/);
  assert.match(source, /startStoryFromCreation/);
  assert.match(source, /showMute: false/);
});

test("V2 creator connections route is server-backed and persists canonical follow state", () => {
  const page = read("app/studio/v2/creators/[handle]/connections/page.jsx");
  const live = read("app/studio/v2/creators/CreatorConnectionsLive.jsx");
  assert.match(page, /getPublicProfileConnectionsPageData/);
  assert.match(page, /CreatorConnectionsLive/);
  assert.match(live, /setProfileFollowByUsername/);
  assert.match(live, /router\.replace/);
  assert.match(live, /canFollow/);
});

test("public profile read proxies forward optional viewer identity without making public reads auth-required", () => {
  for (const path of [
    "app/api/profiles/[username]/public/route.js",
    "app/api/profiles/[username]/connections/route.js",
  ]) {
    const source = read(path);
    assert.match(source, /getOptionalActorUserId/);
    assert.match(source, /x-crestfall-user-id/);
    assert.match(source, /return error \|\| !user \? null : user\.id/);
  }
});

test("live creator views represent own-profile controls honestly and do not touch Images ownership", () => {
  const profileView = read("app/studio/v2/creators/creator-profile/CreatorProfile.view.jsx");
  const connectionsView = read("app/studio/v2/creators/creator-connections/CreatorConnections.view.jsx");
  assert.match(profileView, /isOwnProfile \? "You"/);
  assert.match(profileView, /canDonate === false/);
  assert.match(profileView, /stats\?\.likes !== undefined \? "Likes" : "Plays"/);
  assert.match(connectionsView, /isOwnProfile \? "You"/);

  const w2dOwnedFiles = [
    "app/api/profiles/[username]/connections/route.js",
    "app/api/profiles/[username]/public/route.js",
    "app/studio/v2/creators/[handle]/connections/page.jsx",
    "app/studio/v2/creators/[handle]/page.jsx",
    "app/studio/v2/creators/CreatorConnectionsLive.jsx",
    "app/studio/v2/creators/CreatorProfileLive.jsx",
    "app/studio/v2/creators/creator-connections/CreatorConnections.view.jsx",
    "app/studio/v2/creators/creator-profile/CreatorProfile.view.jsx",
    "lib/shared/presentation/creatorProfilePresentation.js",
    "integration/crestfall-v2-convergence-w2/v2CreatorProfileConnectionsLiveDiagnostics.mjs",
  ];

  assert.equal(w2dOwnedFiles.some((path) => path.includes("/images/")), false);
  assert.equal(w2dOwnedFiles.some((path) => path.includes("image-studio")), false);
});
