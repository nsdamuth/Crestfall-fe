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

test("Community Hub shell stays thin and injects application controls", () => {
  const shell = read("components/studio/community/CommunityHub.jsx");

  assert.match(shell, /CommunityHubView/);
  assert.match(shell, /useCommunityHubViewModel/);
  assert.match(shell, /ResponsiveFilterPanel/);
  assert.match(shell, /CrestfallSelect/);
  assert.match(shell, /CreationCard/);
  assert.match(shell, /CreatorCard/);
  assert.match(shell, /CreatorListRow/);
  assert.doesNotMatch(shell, /useState|useEffect|useMemo|getCommunityCreationSortValue/);
});

test("ViewModel owns community filtering, sorting, pagination, and engagement", () => {
  const viewModel = read(
    "components/studio/community/community-hub/useCommunityHubViewModel.js"
  );

  assert.match(viewModel, /filterCommunityCreations/);
  assert.match(viewModel, /filterCommunityCreators/);
  assert.match(viewModel, /getCommunityCreationSortValue/);
  assert.match(viewModel, /INITIAL_VISIBLE_COMMUNITY_CREATIONS = 12/);
  assert.match(viewModel, /VISIBLE_COMMUNITY_CREATION_INCREMENT = 12/);
  assert.match(viewModel, /INITIAL_VISIBLE_CREATORS = 12/);
  assert.match(viewModel, /VISIBLE_CREATOR_INCREMENT = 12/);
  assert.match(viewModel, /EAGER_CREATION_IMAGE_COUNT = 4/);
  assert.match(viewModel, /useCreationEngagementState/);
  assert.match(viewModel, /useProfileEngagementState/);
  assert.doesNotMatch(viewModel, /<CommunityHubView|<CreationCard|<section/);
});

test("ViewModel preserves original community filter semantics", () => {
  const viewModel = read(
    "components/studio/community/community-hub/useCommunityHubViewModel.js"
  );

  assert.match(viewModel, /\["OFFICIAL", "ACCEPTED"\]/);
  assert.match(viewModel, /creation\.recentlyUpdated/);
  assert.match(viewModel, /creation\.contentRating === rating/);
  assert.match(viewModel, /creation\.renderingStyle === rendering/);
  assert.match(viewModel, /creator\.canonContributor/);
  assert.match(viewModel, /creator\.recentlyActive/);
  assert.match(viewModel, /searchableText\.includes/);
});

test("portable View receives display-ready state and injected adapters", () => {
  const view = read(
    "components/studio/community/community-hub/CommunityHub.view.jsx"
  );

  assert.match(view, /FilterPanelComponent/);
  assert.match(view, /SelectComponent/);
  assert.match(view, /TagFilterComponent/);
  assert.match(view, /CreationCardComponent/);
  assert.match(view, /CreatorCardComponent/);
  assert.match(view, /CreatorListRowComponent/);
  assert.match(view, /No public creations yet/);
  assert.match(view, /No public creators yet/);
  assert.doesNotMatch(
    view,
    /next\/link|useCreationEngagementState|useProfileEngagementState/
  );
  assert.doesNotMatch(view, /creation\.canonStatus|creation\.contentRating/);
});

test("contract and fixtures document both community modes", () => {
  const contract = read(
    "components/studio/community/community-hub/CommunityHub.contract.js"
  );
  const fixtures = read(
    "components/studio/community/community-hub/CommunityHub.fixtures.js"
  );

  assert.match(contract, /COMMUNITY_HUB_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /CommunityHubViewProps/);
  assert.match(contract, /ownsCommunityFilteringAndSorting: "ViewModel"/);
  assert.match(contract, /ownsApplicationCardsAndControls: "Binding Shell"/);
  assert.match(fixtures, /communityHubFixture/);
  assert.match(fixtures, /communityHubEmptyFixture/);
  assert.match(fixtures, /CHARACTER/);
  assert.match(fixtures, /LOCATION/);
  assert.match(fixtures, /SCENARIO/);
  assert.match(fixtures, /canonContributor/);
});

test("Community Hub preview is development-only and fixture driven", () => {
  const page = read("app/dev/ui-preview/community-hub/page.jsx");
  const preview = read(
    "app/dev/ui-preview/community-hub/CommunityHubPreviewClient.jsx"
  );

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /CommunityHubView/);
  assert.match(preview, /getCommunityHubViewProps/);
  assert.match(preview, /communityHubFixture/);
  assert.match(preview, /communityHubEmptyFixture/);
  assert.match(preview, /Toggle engagement error/);
});

test("documentation and command keep deferred Mechanics work explicit", () => {
  const readme = read("components/studio/community/community-hub/README.md");
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /Twelve-item initial pagination/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/community-hub/);
  assert.match(packageJson, /diagnostics:loom:community-hub/);
});
