import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  projectCommunityCreation,
  projectCommunityCreations,
} from "../../lib/shared/presentation/communityPresentation.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const W2B_OWNED_PATHS = [
  "app/api/engagement/creation-reactions/route.js",
  "app/studio/v2/community/CommunityV2Live.jsx",
  "app/studio/v2/community/CommunityV2Mockup.jsx",
  "app/studio/v2/community/page.jsx",
  "app/studio/v2/vault/VaultV2Live.jsx",
  "app/studio/v2/vault/VaultV2Mockup.jsx",
  "app/studio/v2/vault/page.jsx",
  "integration/crestfall-v2-convergence-w2/v2CommunitySavedVaultDiagnostics.mjs",
  "integration/crestfall-v2-convergence-w2/v2VaultLiveDiagnostics.mjs",
  "lib/client/studio/engagement/creationReactionClient.js",
  "lib/server/studio/getCommunityCreationsPageData.js",
  "lib/shared/presentation/communityPresentation.js",
];

test("Community projection maps current service summaries into the V2 card contract", () => {
  const item = projectCommunityCreation({
    id: "room-1",
    type: "ROOM_TEMPLATE",
    title: "The Hollow Road",
    contentRating: "MATURE",
    canonStatus: "OFFICIAL",
    renderingStyle: "ANIME",
    creatorHandle: "@creator",
    creatorProfileHref: "/studio/profile/creator",
    imageUrl: "/media/hollow.webp",
    featured: true,
    recentlyUpdated: true,
    stats: { likes: 14, messages: 27 },
    tags: ["Mystery"],
    updatedAt: "2026-08-24T20:00:00Z",
  });

  assert.equal(item.assetKind, "story");
  assert.equal(item.ratingTier, "TEEN");
  assert.equal(item.renderingStyle, "anime");
  assert.equal(item.isCanon, true);
  assert.equal(item.hearts, 14);
  assert.equal(item.plays, 27);
  assert.equal(item.creator.handle, "@creator");
});

test("Community projection preserves the full current mixed creation taxonomy", () => {
  const items = projectCommunityCreations([
    { id: "a", type: "CHARACTER", title: "Character" },
    { id: "b", type: "LOCATION", title: "Location" },
    { id: "c", type: "OUTFIT", title: "Outfit" },
    { id: "d", type: "ROOM_TEMPLATE", title: "Story" },
    { id: "e", type: "STORYLINE", title: "Adventure" },
  ]);

  assert.deepEqual(items.map((item) => item.assetKind), [
    "character",
    "world",
    "look",
    "story",
    "adventure",
  ]);
});

test("V2 Community route is live and server-backed", () => {
  const page = read("app/studio/v2/community/page.jsx");
  const live = read("app/studio/v2/community/CommunityV2Live.jsx");

  assert.match(page, /getCommunityCreationsPageData/);
  assert.match(page, /CommunityV2Live/);
  assert.match(live, /projectCommunityCreations/);
  assert.match(live, /<CommunityV2Mockup live/);
});

test("V2 Community persists creation engagement and launches chat-capable creations", () => {
  const view = read("app/studio/v2/community/CommunityV2Mockup.jsx");

  assert.match(view, /useCreationEngagementState/);
  assert.match(view, /toggleCreationBookmark/);
  assert.match(view, /toggleCreationLike/);
  assert.match(view, /startStoryFromCreation/);
  assert.match(view, /isChatCapableCreationType/);
  assert.match(view, /\/studio\/story-rooms\//);
});

test("creation reactions batch large public catalog reads safely", () => {
  const client = read("lib/client/studio/engagement/creationReactionClient.js");
  const hook = read("components/studio/engagement/hooks/useCreationEngagementState.js");
  const route = read("app/api/engagement/creation-reactions/route.js");

  assert.match(client, /MAX_CREATION_REACTION_IDS_PER_REQUEST = 100/);
  assert.match(client, /batches\.map/);
  assert.match(hook, /fetchCreationReactions\(creationIds\)/);
  assert.match(route, /function forwardServiceError/);
  assert.match(route, /CREATION_REACTIONS_LOAD_FAILED/);
});

test("Vault fuses owned creations with bookmarked public Community creations", () => {
  const page = read("app/studio/v2/vault/page.jsx");
  const live = read("app/studio/v2/vault/VaultV2Live.jsx");
  const view = read("app/studio/v2/vault/VaultV2Mockup.jsx");

  assert.match(page, /getMyCreationsPageData/);
  assert.match(page, /getCommunityCreationsPageData/);
  assert.match(live, /bookmarkCandidates/);
  assert.match(view, /useCreationEngagementState\(engagementCandidates\)/);
  assert.match(view, /engagementState\.isCreationBookmarked/);
  assert.match(view, /!ownedIds\.has\(item\.id\)/);
});

test("Images/media parallel ownership remains untouched by W2B", () => {
  const ownedPaths = W2B_OWNED_PATHS.join("\n");

  // This diagnostic is intentionally scoped to W2B's declared ownership.
  // The convergence workflow permits a parallel Images session to have
  // legitimate changes in the same working tree, so inspecting the entire
  // git diff would falsely attribute those changes to W2B.
  assert.doesNotMatch(ownedPaths, /app\/studio\/v2\/images\//);
  assert.doesNotMatch(ownedPaths, /libraryPassClient|reassign/i);
});
