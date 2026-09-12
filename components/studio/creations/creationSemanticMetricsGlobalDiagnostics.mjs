import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { projectCommunityCreation } from "../../../lib/shared/presentation/communityPresentation.js";
import { projectCreationToVaultItem } from "../../../lib/shared/presentation/vaultPresentation.js";
import { projectPublicLoreCreation } from "../../../lib/shared/presentation/lorePresentation.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

const fixture = {
  id: "11111111-1111-4111-8111-111111111111",
  type: "LOCATION",
  title: "Semantic Metrics Fixture",
  visibility: "PUBLIC",
  status: "APPROVED",
  contentRating: "SFW",
  stats: {
    likes: 7,
    messages: 91,
    bookmarks: 999,
    saves: 999,
  },
  usageMetrics: {
    interactionCount: 91,
    likeCount: 7,
    imageUseCount: 42,
    storyUseCount: 3,
    externalCreationUseCount: 5,
  },
};

for (const projected of [
  projectCommunityCreation(fixture),
  projectCreationToVaultItem(fixture, 0, { isOwn: true }),
  projectPublicLoreCreation({ ...fixture, type: "LORE" }),
]) {
  assert.ok(Array.isArray(projected.metrics));
  assert.ok(projected.metrics.length <= 3);
  assert.equal(
    projected.metrics.some((metric) => /bookmark|save/i.test(metric.id || metric.label || "")),
    false
  );
  assert.equal(Object.prototype.hasOwnProperty.call(projected, "saves"), false);
}

const community = projectCommunityCreation(fixture);
assert.deepEqual(
  community.metrics.map((metric) => metric.id),
  ["imageUseCount", "likeCount", "externalCreationUseCount"]
);

const [
  kitCard,
  legacyStatsRow,
  communityView,
  vaultView,
  creatorProfileLive,
  adventuresLive,
  storiesLive,
  homeVm,
  popupView,
] = await Promise.all([
  read("components/kit/creation-card/KitCreationCard.view.jsx"),
  read("components/studio/creations/creation-stats-row/CreationStatsRow.view.jsx"),
  read("app/studio/v2/community/CommunityV2Mockup.jsx"),
  read("app/studio/v2/vault/VaultV2Mockup.jsx"),
  read("app/studio/v2/creators/CreatorProfileLive.jsx"),
  read("app/studio/v2/adventures/AdventuresLive.jsx"),
  read("app/studio/v2/stories/StoriesV2Live.jsx"),
  read("app/studio/v2/home/home/useHomeViewModel.js"),
  read("components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx"),
]);

assert.doesNotMatch(kitCard, /saves:\s*Bookmark|bookmarkCount|saveCount/);
assert.doesNotMatch(legacyStatsRow, /\bBookmark\b/);
assert.match(communityView, /metrics=\{creation\.metrics\}/);
assert.match(vaultView, /metrics=\{item\.metrics\}/);
assert.match(creatorProfileLive, /metrics:\s*item\.metrics/);
assert.match(adventuresLive, /metrics:\s*item\.metrics/);
assert.match(storiesLive, /metrics=\{item\.metrics\}/);
assert.match(homeVm, /metrics:\s*item\.metrics/);
assert.doesNotMatch(popupView, /saves:\s*Bookmark|bookmarkCount|saveCount/);

console.log("creationSemanticMetricsGlobalDiagnostics: PASS");
