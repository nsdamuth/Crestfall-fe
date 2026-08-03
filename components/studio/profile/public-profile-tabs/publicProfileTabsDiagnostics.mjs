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

test("Public Profile Tabs Shell stays thin and owns profile feature slots", () => {
  const shell = read("components/studio/profile/PublicProfileTabs.jsx");
  assert.match(shell, /usePublicProfileTabsViewModel/);
  assert.match(shell, /PublicProfileTabsView/);
  assert.match(shell, /<PublicProfileCreationGrid/);
  assert.match(shell, /<PublicProfileActivityFeed/);
  assert.match(shell, /<PublicProfileBadges/);
  assert.match(shell, /contentSlot=/);
  assert.doesNotMatch(shell, /useState|const TABS/);
});

test("Public Profile Tabs View is portable and display-only", () => {
  const view = read(
    "components/studio/profile/public-profile-tabs/PublicProfileTabs.view.jsx"
  );
  assert.match(view, /tabs\.map/);
  assert.match(view, /onSelectTab\(tab\.id\)/);
  assert.match(view, /aria-pressed/);
  assert.match(view, /contentSlot/);
  assert.doesNotMatch(view, /PublicProfileCreationGrid|PublicProfileActivityFeed/);
  assert.doesNotMatch(view, /next\/|@\/|useState|useEffect/);
});

test("Public Profile Tabs ViewModel owns legal tabs and headings", () => {
  const viewModel = read(
    "components/studio/profile/public-profile-tabs/usePublicProfileTabsViewModel.js"
  );
  assert.match(viewModel, /PUBLIC_PROFILE_TAB_DEFINITIONS/);
  assert.match(viewModel, /Characters & Canon Work/);
  assert.match(viewModel, /normalizePublicProfileTabId/);
  assert.match(viewModel, /buildPublicProfileTabState/);
  assert.match(viewModel, /useState/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Public Profile Tabs normalization preserves the historical default", async () => {
  const source = read(
    "components/studio/profile/public-profile-tabs/usePublicProfileTabsViewModel.js"
  )
    .replace(/^"use client";\s*/, "")
    .replace(/import \{ useMemo, useState \} from "react";\s*/, "");
  const dataUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
  const module = await import(dataUrl);

  assert.equal(module.normalizePublicProfileTabId("unknown"), "creations");
  assert.equal(module.buildPublicProfileTabState("creations").title, "Characters & Canon Work");
  assert.equal(module.buildPublicProfileTabState("activity").title, "Activity");
  assert.equal(module.buildPublicProfileTabState("badges").title, "Badges");
  assert.equal(
    module.buildPublicProfileTabState("badges").tabs.filter((tab) => tab.isActive).length,
    1
  );
});

test("Public Profile Tabs contract and fixtures cover all three states", () => {
  const contract = read(
    "components/studio/profile/public-profile-tabs/PublicProfileTabs.contract.js"
  );
  const fixtures = read(
    "components/studio/profile/public-profile-tabs/PublicProfileTabs.fixtures.js"
  );
  assert.match(contract, /PUBLIC_PROFILE_TABS_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /contentSlot/);
  assert.match(contract, /active heading resolution/);
  assert.match(fixtures, /publicProfileTabsCreationsFixture/);
  assert.match(fixtures, /publicProfileTabsActivityFixture/);
  assert.match(fixtures, /publicProfileTabsBadgesFixture/);
});

test("Public Profile Tabs preview is development-only and interactive", () => {
  const page = read("app/dev/ui-preview/public-profile-tabs/page.jsx");
  const preview = read(
    "app/dev/ui-preview/public-profile-tabs/PublicProfileTabsPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /usePublicProfileTabsViewModel/);
  assert.match(preview, /Interactive Tabs/);
  assert.match(preview, /Activity Fixture/);
  assert.match(preview, /Badges Fixture/);
});

test("Public Profile Tabs remains wired to the profile page and diagnostics", () => {
  const publicPage = read("app/studio/profile/[username]/page.js");
  const readme = read(
    "components/studio/profile/public-profile-tabs/README.md"
  );
  const packageJson = read("package.json");
  assert.match(publicPage, /import PublicProfileTabs from/);
  assert.match(publicPage, /<PublicProfileTabs/);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /\/dev\/ui-preview\/public-profile-tabs/);
  assert.match(packageJson, /diagnostics:loom:public-profile-tabs/);
});
