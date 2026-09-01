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

test("Story Rooms Hub shell stays thin and owns application bindings", () => {
  const shell = read("components/studio/story-rooms/StoryRoomsHub.jsx");

  assert.match(shell, /import Link from "next\/link"/);
  assert.match(shell, /ViewModeToggle/);
  assert.match(shell, /useStoryRoomsHubViewModel/);
  assert.match(shell, /StoryRoomsHubView/);
  assert.match(shell, /InternalLinkComponent=\{Link\}/);
  assert.match(shell, /ViewModeToggleComponent=\{ViewModeToggle\}/);
  assert.doesNotMatch(
    shell,
    /fetchStoryRooms|deleteStoryRoom|useState|useEffect|window\.confirm/
  );
});

test("ViewModel owns Story Room clients, loading, deletion, and confirmation", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-rooms-hub/useStoryRoomsHubViewModel.js"
  );

  assert.match(viewModel, /fetchStoryRooms/);
  assert.match(viewModel, /deleteStoryRoom/);
  assert.match(viewModel, /usePersistentViewMode/);
  assert.match(viewModel, /window\.confirm/);
  assert.match(viewModel, /for \(const roomId of selectedIds\)/);
  assert.match(viewModel, /setRooms\(\(current\) =>/);
  assert.match(viewModel, /Stories could not be loaded\./);
  assert.match(viewModel, /Storys could not be deleted\./);
  assert.doesNotMatch(viewModel, /<StoryRoomsHubView|<section|<Link/);
});

test("room normalization preserves fallbacks, routes, counts, and timestamps", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-rooms-hub/useStoryRoomsHubViewModel.js"
  );

  assert.match(viewModel, /href: buildStoryChatHref\(id\)/);
  assert.match(viewModel, /Private Story/);
  assert.match(viewModel, /Active Room/);
  assert.match(viewModel, /Character Chat/);
  assert.match(viewModel, /Crestfall Engine/);
  assert.match(viewModel, /Unspecified Location/);
  assert.match(viewModel, /Open the story to continue\./);
  assert.match(viewModel, /Number\.isFinite\(Number\(room\.messages\)\)/);
  assert.match(viewModel, /Just now/);
  assert.match(viewModel, /Yesterday/);
});

test("ViewModel preserves Active, Templates, Private, Archived, and search filtering", () => {
  const viewModel = read(
    "components/studio/story-rooms/story-rooms-hub/useStoryRoomsHubViewModel.js"
  );

  assert.match(viewModel, /id: "ACTIVE"/);
  assert.match(viewModel, /id: "TEMPLATE"/);
  assert.match(viewModel, /id: "PRIVATE"/);
  assert.match(viewModel, /id: "ARCHIVED"/);
  assert.match(viewModel, /room\.visibility === "PRIVATE"/);
  assert.match(viewModel, /room\.status === "ARCHIVED"/);
  assert.match(viewModel, /room\.scenario/);
  assert.match(viewModel, /room\.narrator/);
  assert.match(viewModel, /room\.location/);
  assert.match(viewModel, /\.\.\.room\.cast/);
  assert.match(viewModel, /searchableText\.includes\(normalizedQuery\)/);
});

test("portable View receives display-ready state and injected adapters", () => {
  const view = read(
    "components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.view.jsx"
  );

  assert.match(view, /InternalLinkComponent/);
  assert.match(view, /ViewModeToggleComponent/);
  assert.match(view, /visibleRooms/);
  assert.match(view, /latestRoomHref/);
  assert.match(view, /room\.href/);
  assert.match(view, /room\.selected/);
  assert.match(view, /onDeleteSelectedRooms/);
  assert.doesNotMatch(
    view,
    /next\/link|storyRoomClient|fetchStoryRooms|deleteStoryRoom|usePersistentViewMode/
  );
  assert.doesNotMatch(view, /\/studio\/story-rooms\/\$\{/);
});

test("contract, fixtures, and preview cover representative hub states", () => {
  const contract = read(
    "components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.contract.js"
  );
  const fixtures = read(
    "components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.fixtures.js"
  );
  const page = read("app/dev/ui-preview/story-rooms-hub/page.jsx");
  const preview = read(
    "app/dev/ui-preview/story-rooms-hub/StoryRoomsHubPreviewClient.jsx"
  );

  assert.match(contract, /STORY_ROOMS_HUB_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /StoryRoomsHubRoomViewItem/);
  assert.match(contract, /ownsDeleteConfirmationAndMutation: "ViewModel"/);
  assert.match(fixtures, /storyRoomsHubPopulatedFixture/);
  assert.match(fixtures, /storyRoomsHubLoadingFixture/);
  assert.match(fixtures, /storyRoomsHubEmptyFixture/);
  assert.match(fixtures, /storyRoomsHubLoadErrorFixture/);
  assert.match(fixtures, /storyRoomsHubDeleteErrorFixture/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /getStoryRoomsHubViewProps/);
  assert.match(preview, /PreviewViewModeToggle/);
  assert.match(preview, /toggleRoomSelection/);
});

test("documentation and diagnostic command preserve scope and deferred Mechanics work", () => {
  const readme = read(
    "components/studio/story-rooms/story-rooms-hub/README.md"
  );
  const packageJson = read("package.json");

  assert.match(readme, /Binding Shell/);
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /crestfall\.storyRooms\.viewMode/);
  assert.match(readme, /Active, Templates, Private, and Archived/);
  assert.match(readme, /sequential deletion/);
  assert.match(readme, /does not abstract the Mechanics\s+Module/);
  assert.match(readme, /\/dev\/ui-preview\/story-rooms-hub/);
  assert.match(packageJson, /diagnostics:loom:story-rooms-hub/);
});
