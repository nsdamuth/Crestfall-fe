import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const page = read("app/studio/v2/home/page.jsx");
const shell = read("app/studio/v2/home/Home.jsx");
const vm = read("app/studio/v2/home/home/useHomeViewModel.js");
const view = read("app/studio/v2/home/home/Home.view.jsx");
const server = read("lib/server/studio/getHomePageData.js");

test("existing V2 Home route is converted from fixture-only to server-backed live data", () => {
  assert.match(page, /getHomePageData/);
  assert.match(page, /<Home \{\.\.\.data\} \/>/);
  assert.doesNotMatch(page, /PRE-PARITY|Fixture-driven page only/);
  assert.match(server, /getStoriesPageData/);
  assert.match(server, /getCommunityCreatorsPageData/);
});

test("Home composes existing authorities instead of inventing a Home backend", () => {
  assert.match(vm, /projectStoryRoomToContinueItem/);
  assert.match(vm, /projectCommunityCreations/);
  assert.match(vm, /projectCommunityCreators/);
  assert.match(vm, /useCreationEngagementState/);
  assert.match(vm, /setProfileFollowByUsername/);
  assert.doesNotMatch(vm, /homeContent\.mock/);
  assert.doesNotMatch(view, /fetch\(|supabase|PostGraphile|services-api/i);
});

test("Home routes every destination to the current product surface", () => {
  for (const href of [
    "/studio/v2/stories",
    "/studio/v2/adventures",
    "/studio",
    "/studio/v2/images",
    "/studio/v2/vault",
    "/studio/v2/community",
    "/studio/v2/creators",
    "/studio/v2/lore",
  ]) assert.match(vm, new RegExp(href.replaceAll("/", "\\/")));
  assert.match(vm, /\/studio\/story-rooms\/\$\{encodeURIComponent\(item\.roomId\)\}/);
});

test("Home preserves the responsive V2 guidepost composition", () => {
  assert.match(view, /grid-cols-2/);
  assert.match(view, /min-\[700px\]:grid-cols-3/);
  assert.match(view, /min-\[1100px\]:grid-cols-4/);
  assert.match(view, /KitRailView/);
  assert.match(view, /KitPromoBannerView/);
});

test("desktop and mobile primary navigation restore Home without replacing Studio", () => {
  const desktop = read("components/studio/studio-sidebar/useStudioSidebarViewModel.js");
  const mobile = read("components/studio/studio-mobile-nav/useStudioMobileNavViewModel.js");
  assert.match(desktop, /label: "Home", href: "\/studio\/v2\/home"/);
  assert.match(desktop, /label: "Studio", href: "\/studio"/);
  assert.match(desktop, /brandHref: v2Surface \? "\/studio\/v2\/home" : "\/studio"/);
  assert.match(mobile, /label: "Home", href: "\/studio\/v2\/home"/);
  assert.match(mobile, /label: "Studio", href: "\/studio"/);
  assert.match(mobile, /brandHref: v2Surface \? "\/studio\/v2\/home" : "\/studio"/);
});

test("mobile bottom navigation remains five high-frequency destinations", () => {
  const mobile = read("components/studio/studio-mobile-nav/useStudioMobileNavViewModel.js");
  const block = mobile.match(/STUDIO_MOBILE_NAV_V2_BOTTOM_LINKS = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || "";
  assert.equal((block.match(/Object\.freeze/g) || []).length, 5);
  for (const label of ["Home", "Stories", "Studio", "Images", "Vault"]) assert.match(block, new RegExp(`label: "${label}"`));
  assert.doesNotMatch(block, /label: "Adventures"/);
});

test("Home shell no longer exposes the product fixture harness", () => {
  assert.doesNotMatch(shell, /FixtureModeHarness|fixtureMode/);
  assert.match(shell, /useHomeViewModel/);
});
