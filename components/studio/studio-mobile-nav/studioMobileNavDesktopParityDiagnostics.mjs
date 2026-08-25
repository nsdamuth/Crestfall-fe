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
  assert.match(view, /label: "Play"[\s\S]*"Stories", "Adventures"/);
  assert.match(view, /label: "Create"[\s\S]*"Studio", "Images", "Vault"/);
  assert.match(view, /label: "Explore"[\s\S]*"Community", "Creators", "Lore"/);
  assert.match(view, /<MobileDrawerGroup[\s\S]*label="Support"/);
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

  assert.match(view, /min-h-\[2\.35rem\]/);
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
