import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const live = fs.readFileSync("app/studio/v2/creators/CreatorProfileLive.jsx", "utf8");
const view = fs.readFileSync("app/studio/v2/creators/creator-profile/CreatorProfile.view.jsx", "utf8");
const contract = fs.readFileSync("app/studio/v2/creators/creator-profile/CreatorProfile.contract.js", "utf8");
const activityView = fs.readFileSync("components/studio/profile/public-profile-activity-feed/PublicProfileActivityFeed.view.jsx", "utf8");
const activityVm = fs.readFileSync("components/studio/profile/public-profile-activity-feed/usePublicProfileActivityFeedViewModel.js", "utf8");
const badgesView = fs.readFileSync("components/studio/profile/public-profile-badges/PublicProfileBadges.view.jsx", "utf8");
const badgesVm = fs.readFileSync("components/studio/profile/public-profile-badges/usePublicProfileBadgesViewModel.js", "utf8");

test("live creator profile reuses Crestfall rich Activity presentation", () => {
  assert.match(live, /PublicProfileActivityFeedView/);
  assert.match(live, /buildPublicProfileActivityFeedViewProps/);
  assert.match(live, /profile: pageData\.profile/);
  assert.match(live, /creations: pageData\.creations/);
  assert.match(live, /donationEvents: pageData\.donationEvents/);
  assert.match(live, /activityContentSlot=/);
});

test("Activity feed renders creation media and donation detail", () => {
  assert.match(activityView, /event\.imageUrl/);
  assert.match(activityView, /event\.description/);
  assert.match(activityView, /event\.amountNet/);
  assert.match(activityView, /event\.message/);
  assert.match(activityVm, /getCreationImageUrl/);
  assert.match(activityVm, /getCreationActionLabel/);
});

test("live creator profile reuses Crestfall rich badge presentation", () => {
  assert.match(live, /PublicProfileBadgesView/);
  assert.match(live, /buildPublicProfileBadgesViewProps/);
  assert.match(live, /badges: pageData\.badges/);
  assert.match(live, /badgesContentSlot=/);
});

test("Badges render authoritative art, category and descriptions", () => {
  assert.match(badgesView, /badge\?\.imageUrl/);
  assert.match(badgesView, /badge\?\.categoryLabel/);
  assert.match(badgesView, /badge\.description/);
  assert.match(badgesVm, /badge\?\.imageUrl \|\| badge\?\.image_url/);
  assert.match(badgesVm, /EARLY_ACCESS: "Early Access"/);
});

test("portable V2 profile retains fixture fallbacks behind additive slots", () => {
  assert.match(view, /activityContentSlot \|\|/);
  assert.match(view, /badgesContentSlot \|\|/);
  assert.match(view, /ActivityList items=\{activityItems\}/);
  assert.match(view, /BadgeGrid items=\{badgeItems\}/);
  assert.match(contract, /CREATOR_PROFILE_VIEW_CONTRACT_VERSION = "1\.4\.0"/);
});
