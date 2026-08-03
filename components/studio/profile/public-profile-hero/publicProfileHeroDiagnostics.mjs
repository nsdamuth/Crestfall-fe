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

test("Public Profile Hero Shell stays thin and owns application slots", () => {
  const shell = read("components/studio/profile/PublicProfileHero.jsx");
  assert.match(shell, /usePublicProfileHeroViewModel/);
  assert.match(shell, /PublicProfileHeroView/);
  assert.match(shell, /<Link/);
  assert.match(shell, /<ProfileAvatar/);
  assert.match(shell, /<PublicProfileEngagementActions/);
  assert.match(shell, /<PublicProfileDonateButton/);
  assert.match(shell, /<ProfileShareButton/);
  assert.doesNotMatch(shell, /profile\?\.avatar_url/);
  assert.doesNotMatch(shell, /followCounts\.followers/);
});

test("Public Profile Hero View is portable and display-only", () => {
  const view = read(
    "components/studio/profile/public-profile-hero/PublicProfileHero.view.jsx"
  );
  assert.match(view, /avatarSlot/);
  assert.match(view, /followersLinkSlot/);
  assert.match(view, /engagementActionsSlot/);
  assert.match(view, /stats\.map/);
  assert.doesNotMatch(view, /next\/link|next\/navigation/);
  assert.doesNotMatch(view, /ProfileAvatar|PublicProfileEngagementActions/);
  assert.doesNotMatch(view, /profile\?\.|followCounts/);
});

test("Public Profile Hero ViewModel owns aliases, routes, and fallbacks", () => {
  const viewModel = read(
    "components/studio/profile/public-profile-hero/usePublicProfileHeroViewModel.js"
  );
  assert.match(viewModel, /DEFAULT_PROFILE_BANNER/);
  assert.match(viewModel, /avatar_url \|\| source\.avatarUrl \|\| source\.avatar_asset_url/);
  assert.match(viewModel, /banner_url/);
  assert.match(viewModel, /normalizePublicProfileStats/);
  assert.match(viewModel, /encodeURIComponent\(username\)/);
  assert.match(viewModel, /connections\?tab=followers/);
  assert.match(viewModel, /No public bio yet\./);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Public Profile Hero normalization preserves tuples and count fallbacks", async () => {
  const modulePath = path.join(
    repoRoot,
    "components/studio/profile/public-profile-hero/usePublicProfileHeroViewModel.js"
  );
  const source = read(
    "components/studio/profile/public-profile-hero/usePublicProfileHeroViewModel.js"
  ).replace(/^"use client";\s*/, "");
  const dataUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
  const module = await import(dataUrl);

  const result = module.normalizePublicProfileHero({
    profile: { username: "test creator", avatarUrl: "/avatar.png" },
    stats: [[12, "Characters"], ["4", "Rooms"]],
    followCounts: { followers: "8", following: -4 },
  });

  assert.equal(result.displayName, "Test creator");
  assert.equal(result.avatarUrl, "/avatar.png");
  assert.deepEqual(result.stats, [
    { value: 12, label: "Characters" },
    { value: "4", label: "Rooms" },
  ]);
  assert.equal(result.followersCount, "8");
  assert.equal(result.followingCount, -4);
  assert.match(result.followersHref, /test%20creator/);
  assert.ok(modulePath.endsWith("usePublicProfileHeroViewModel.js"));
});

test("Public Profile Hero contract and fixtures cover full and fallback states", () => {
  const contract = read(
    "components/studio/profile/public-profile-hero/PublicProfileHero.contract.js"
  );
  const fixtures = read(
    "components/studio/profile/public-profile-hero/PublicProfileHero.fixtures.js"
  );
  assert.match(contract, /PUBLIC_PROFILE_HERO_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /engagementActionsSlot/);
  assert.match(contract, /connection route construction/);
  assert.match(fixtures, /publicProfileHeroCompleteFixture/);
  assert.match(fixtures, /publicProfileHeroAliasFixture/);
  assert.match(fixtures, /publicProfileHeroFallbackFixture/);
});

test("Public Profile Hero preview is development-only", () => {
  const page = read("app/dev/ui-preview/public-profile-hero/page.jsx");
  const preview = read(
    "app/dev/ui-preview/public-profile-hero/PublicProfileHeroPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /PublicProfileHeroView/);
  assert.match(preview, /Fallback Profile/);
});

test("Public Profile Hero remains wired to the public profile page and diagnostics", () => {
  const publicPage = read("app/studio/profile/[username]/page.js");
  const readme = read(
    "components/studio/profile/public-profile-hero/README.md"
  );
  const packageJson = read("package.json");
  assert.match(publicPage, /import PublicProfileHero from/);
  assert.match(publicPage, /<PublicProfileHero/);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /\/dev\/ui-preview\/public-profile-hero/);
  assert.match(packageJson, /diagnostics:loom:public-profile-hero/);
});
