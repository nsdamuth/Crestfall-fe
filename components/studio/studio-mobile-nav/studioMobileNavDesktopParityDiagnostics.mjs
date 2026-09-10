import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("V2 mobile drawer mirrors desktop Play Create Explore taxonomy", () => {
  const view = read(
    "components/studio/studio-mobile-nav/StudioMobileNav.view.jsx"
  );

  assert.match(view, /V2_DRAWER_GROUP_DEFINITIONS/);
  assert.match(view, /label: "Play"[\s\S]*"Home", "Stories", "Adventures"/);
  // "Images" became "Media" in the FE/MEDIA-STUDIO rename (9e90a572,
  // 9 Sep 2026); this expectation was left behind and failed on HEAD
  // until browser review round 4 (10 Sep 2026) caught it.
  assert.match(view, /label: "Create"[\s\S]*"Studio", "Media", "Vault"/);
  assert.match(view, /label: "Explore"[\s\S]*"Community", "Creators", "Lore"/);
  // Support heading removed 6 Sep 2026 (sidebar batch 1): Feedback
  // renders beneath the coins block, Terms as footer text under Log out.
  assert.doesNotMatch(view, /label="Support"/);
  assert.match(view, /termsLink=\{termsLink\}/);
  const economyIndex = view.indexOf("{drawerEconomySlot}");
  const supportRowsIndex = view.indexOf("v2SupportRows.map");
  assert.ok(economyIndex >= 0 && supportRowsIndex > economyIndex);
});

test("V2 mobile drawer removes redundant Account and Community Links rows", () => {
  const view = read(
    "components/studio/studio-mobile-nav/StudioMobileNav.view.jsx"
  );

  assert.match(view, /utilityLinks\.filter\(\(link\) => link !== accountLink\)/);
  assert.match(view, /isV2Drawer \? \(/);
  assert.match(view, /\) : \([\s\S]*communityLinksLabel/);
  assert.match(view, /discordLink=\{discordLink\}/);
  assert.match(view, /accountLink=\{accountLink\}/);
});

test("mobile drawer rows adopt desktop compact density and active treatment", () => {
  const view = read(
    "components/studio/studio-mobile-nav/StudioMobileNav.view.jsx"
  );

  // Row height tokenized to --control-md 6 Sep 2026 (sidebar batch 2).
  assert.match(view, /min-h-\[var\(--control-md\)\]/);
  assert.doesNotMatch(view, /min-h-\[2\.35rem\]/);
  assert.match(view, /border-l-2 border-l-\[var\(--gold-action\)\]/);
  assert.match(view, /tracking-\[var\(--track-label\)\] text-\[var\(--gold-action\)\]/);
});

test("coins and signed-in identity follow the desktop drawer order", () => {
  const view = read(
    "components/studio/studio-mobile-nav/StudioMobileNav.view.jsx"
  );

  const economyIndex = view.indexOf("{drawerEconomySlot}");
  const accountIndex = view.indexOf("<MobileAccountSummary");
  assert.ok(economyIndex >= 0);
  assert.ok(accountIndex > economyIndex);
  assert.match(view, /MobileAccountSummary[\s\S]*LogOut/);
});

test("legacy drawer and Story-chat dock suppression remain available", () => {
  const view = read(
    "components/studio/studio-mobile-nav/StudioMobileNav.view.jsx"
  );

  assert.match(view, /showBottomDock = true/);
  assert.match(view, /\{showBottomDock \? \(/);
  assert.match(view, /MobileDrawerExternalLink/);
  assert.match(view, /socialOpen/);
});
