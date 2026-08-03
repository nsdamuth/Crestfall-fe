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

test("Public Profile Creation Grid Shell stays thin and owns Creation Cards", () => {
  const shell = read("components/studio/profile/PublicProfileCreationGrid.jsx");
  assert.match(shell, /usePublicProfileCreationGridViewModel/);
  assert.match(shell, /PublicProfileCreationGridView/);
  assert.match(shell, /<CreationCard/);
  assert.match(shell, /context="public"/);
  assert.match(shell, /creationSlots=/);
  assert.doesNotMatch(shell, /useCreationEngagementState|useState|useEffect/);
});

test("Public Profile Creation Grid View is portable and display-only", () => {
  const view = read(
    "components/studio/profile/public-profile-creation-grid/PublicProfileCreationGrid.view.jsx"
  );
  assert.match(view, /engagementMessage/);
  assert.match(view, /creationSlots/);
  assert.match(view, /No public creations yet/);
  assert.match(view, /sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4/);
  assert.doesNotMatch(view, /CreationCard|useCreationEngagementState/);
  assert.doesNotMatch(view, /next\/|@\/|useState|useEffect/);
});

test("Public Profile Creation Grid ViewModel owns engagement and card projection", () => {
  const viewModel = read(
    "components/studio/profile/public-profile-creation-grid/usePublicProfileCreationGridViewModel.js"
  );
  assert.match(viewModel, /useCreationEngagementState/);
  assert.match(viewModel, /normalizePublicProfileCreations/);
  assert.match(viewModel, /buildPublicProfileCreationCardModels/);
  assert.match(viewModel, /getPublicProfileCreationGridViewProps/);
  assert.match(viewModel, /toggleCreationLike/);
  assert.match(viewModel, /toggleCreationBookmark/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Public Profile Creation Grid helpers preserve original Creation objects", async () => {
  const source = read(
    "components/studio/profile/public-profile-creation-grid/usePublicProfileCreationGridViewModel.js"
  )
    .replace(/^"use client";\s*/, "")
    .replace(/import \{ useMemo \} from "react";\s*/, "")
    .replace(
      /import \{ useCreationEngagementState \} from "@\/components\/studio\/engagement\/hooks\/useCreationEngagementState";\s*/,
      ""
    );
  const dataUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
  const module = await import(dataUrl);
  const creation = { id: "creation-1", title: "Kessa Cindervell" };
  const models = module.buildPublicProfileCreationCardModels({
    creations: [creation, null],
    isCreationLiked: () => true,
    isCreationBookmarked: () => false,
  });
  const viewProps = module.getPublicProfileCreationGridViewProps({
    creations: [creation],
    engagementMessage: " Like could not be saved. ",
    isCreationLiked: () => true,
  });

  assert.equal(models.length, 1);
  assert.equal(models[0].creation, creation);
  assert.equal(models[0].liked, true);
  assert.equal(models[0].bookmarked, false);
  assert.equal(viewProps.hasCreations, true);
  assert.equal(viewProps.engagementMessage, "Like could not be saved.");
  assert.equal(
    module.getPublicProfileCreationGridViewProps({ creations: [] }).hasCreations,
    false
  );
});

test("Public Profile Creation Grid contract and fixtures cover primary states", () => {
  const contract = read(
    "components/studio/profile/public-profile-creation-grid/PublicProfileCreationGrid.contract.js"
  );
  const fixtures = read(
    "components/studio/profile/public-profile-creation-grid/PublicProfileCreationGrid.fixtures.js"
  );
  assert.match(contract, /PUBLIC_PROFILE_CREATION_GRID_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /Creation Card slots/);
  assert.match(contract, /like and bookmark state/);
  assert.match(fixtures, /publicProfileCreationGridPopulatedFixture/);
  assert.match(fixtures, /publicProfileCreationGridEmptyFixture/);
  assert.match(fixtures, /publicProfileCreationGridErrorFixture/);
});

test("Public Profile Creation Grid preview is development-only", () => {
  const page = read("app/dev/ui-preview/public-profile-creation-grid/page.jsx");
  const preview = read(
    "app/dev/ui-preview/public-profile-creation-grid/PublicProfileCreationGridPreviewClient.jsx"
  );
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /Populated Grid/);
  assert.match(preview, /Empty Grid/);
  assert.match(preview, /Engagement Error/);
  assert.doesNotMatch(preview, /CreationCard/);
});

test("Public Profile Creation Grid remains wired to Tabs and diagnostics", () => {
  const tabsShell = read("components/studio/profile/PublicProfileTabs.jsx");
  const readme = read(
    "components/studio/profile/public-profile-creation-grid/README.md"
  );
  const packageJson = read("package.json");
  assert.match(tabsShell, /import PublicProfileCreationGrid from/);
  assert.match(tabsShell, /<PublicProfileCreationGrid creations=\{creations\}/);
  assert.match(readme, /Portable LOOM boundary/);
  assert.match(readme, /\/dev\/ui-preview\/public-profile-creation-grid/);
  assert.match(packageJson, /diagnostics:loom:public-profile-creation-grid/);
});
