import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  projectCommunityCreator,
  projectCommunityCreators,
} from "../../lib/shared/presentation/creatorPresentation.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const W2C_OWNED_PATHS = [
  "app/studio/v2/creators/CreatorsV2Live.jsx",
  "app/studio/v2/creators/CreatorsV2Mockup.jsx",
  "app/studio/v2/creators/page.jsx",
  "components/kit/creator-card/KitCreatorCard.contract.js",
  "components/kit/creator-card/KitCreatorCard.view.jsx",
  "integration/crestfall-v2-convergence-w2/v2CreatorsLiveDiagnostics.mjs",
  "lib/server/studio/getCommunityCreatorsPageData.js",
  "lib/shared/presentation/creatorPresentation.js",
];

test("Community creator summaries project into the V2 creator-card contract", () => {
  const item = projectCommunityCreator(
    {
      id: "profile-1",
      username: "Crestfall",
      avatarUrl: "/media/avatar.webp",
      stats: {
        followers: 42,
        likes: 13,
        characters: 7,
      },
    },
    {
      viewerUsername: "viewer",
      followingUsernames: ["crestfall"],
      creations: [
        {
          id: "creation-1",
          ownerId: "profile-1",
          title: "Recent Work",
          updatedAt: "2026-08-24T20:00:00Z",
          featuredMedia: [{ imageUrl: "/media/work.webp" }],
        },
      ],
    }
  );

  assert.equal(item.handle, "@crestfall");
  assert.equal(item.followers, 42);
  assert.equal(item.likes, 13);
  assert.equal(item.works, 7);
  assert.equal(item.isFollowing, true);
  assert.equal(item.canFollow, true);
  assert.equal(item.thumbnails[0].creationId, "creation-1");
  assert.equal(item.thumbnails[0].imageSrc, "/media/work.webp");
});

test("Creator projection marks the viewer's own profile as non-followable", () => {
  const [item] = projectCommunityCreators(
    [{ id: "self", username: "Owner", stats: {} }],
    { viewerUsername: "owner" }
  );

  assert.equal(item.isOwnProfile, true);
  assert.equal(item.canFollow, false);
});

test("V2 Creators route is live and server-backed", () => {
  const page = read("app/studio/v2/creators/page.jsx");
  const live = read("app/studio/v2/creators/CreatorsV2Live.jsx");
  const helper = read("lib/server/studio/getCommunityCreatorsPageData.js");

  assert.match(page, /getCommunityCreatorsPageData/);
  assert.match(page, /CreatorsV2Live/);
  assert.match(live, /projectCommunityCreators/);
  assert.match(live, /<CreatorsV2Mockup/);
  assert.match(helper, /getCommunityPageData/);
  assert.match(helper, /\/api\/profile\/me/);
  assert.match(helper, /\/connections/);
});

test("V2 Creators uses canonical profile-follow behavior", () => {
  const view = read("app/studio/v2/creators/CreatorsV2Mockup.jsx");
  const followClient = read("lib/client/studio/profile/profileFollowClient.js");

  assert.match(view, /setProfileFollowByUsername/);
  assert.match(view, /active: nextFollowing/);
  assert.match(followClient, /\/follow/);
  assert.doesNotMatch(view, /setProfileFollow\(/);
});

test("live creator cards use authoritative profile likes and recent public work", () => {
  const kit = read("components/kit/creator-card/KitCreatorCard.view.jsx");
  const presentation = read("lib/shared/presentation/creatorPresentation.js");

  assert.match(kit, /Heart/);
  assert.match(kit, /"likes"/);
  assert.match(kit, /canFollow/);
  assert.match(presentation, /stats\.likes/);
  assert.match(presentation, /buildRecentWorkThumbnails/);
});

test("creator recent-work thumbnails open the real public creation route", () => {
  const view = read("app/studio/v2/creators/CreatorsV2Mockup.jsx");

  assert.match(view, /thumbnail\.creationId/);
  assert.match(view, /\/studio\/creations\//);
});

test("Images/media parallel ownership remains untouched by W2C", () => {
  const ownedPaths = W2C_OWNED_PATHS.join("\n");

  assert.doesNotMatch(ownedPaths, /app\/studio\/v2\/images\//);
  assert.doesNotMatch(ownedPaths, /image-creator-panel|libraryPassClient|reassign/i);
});
