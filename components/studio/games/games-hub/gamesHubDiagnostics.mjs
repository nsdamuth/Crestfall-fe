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

test("Games Hub shell stays thin and owns the application view toggle", () => {
  const shell = read("components/studio/games/GamesHub.jsx");
  assert.match(shell, /ViewModeToggle/);
  assert.match(shell, /useGamesHubViewModel/);
  assert.match(shell, /GamesHubView/);
  assert.doesNotMatch(shell, /fetchGames|playStoryTemplate|useState|useEffect|useRouter/);
});

test("Games Hub ViewModel owns loading, play orchestration, and navigation", () => {
  const vm = read("components/studio/games/games-hub/useGamesHubViewModel.js");
  assert.match(vm, /fetchGames/);
  assert.match(vm, /playStoryTemplate/);
  assert.match(vm, /usePersistentViewMode/);
  assert.match(vm, /useRouter/);
  assert.match(vm, /router\.push\(buildStoryChatHref\(roomId\)\)/);
  assert.match(vm, /Games could not be loaded\./);
  assert.match(vm, /Story Template could not be played\./);
  assert.doesNotMatch(vm, /<GamesHubView|<section|<article/);
});

test("game normalization preserves continue routes, fallbacks, cast, and metrics", () => {
  const vm = read("components/studio/games/games-hub/useGamesHubViewModel.js");
  assert.match(vm, /getRoomIdFromGameHref/);
  assert.match(vm, /Untitled Story/);
  assert.match(vm, /Playable Story Template/);
  assert.match(vm, /COMMUNITY_SANDBOX/);
  assert.match(vm, /Flexible Cast/);
  assert.match(vm, /formatGameTimestamp/);
  assert.match(vm, /activeRoomCount/);
  assert.match(vm, /messages/);
});

test("filtering owns all six filters and full game search projection", () => {
  const vm = read("components/studio/games/games-hub/useGamesHubViewModel.js");
  for (const token of [
    "ALL",
    "CONTINUE",
    "OFFICIAL_CANON",
    "CANON_COMPATIBLE",
    "COMMUNITY_SANDBOX",
    "FEATURED",
  ]) {
    assert.match(vm, new RegExp(token));
  }
  assert.match(vm, /game\.scenario/);
  assert.match(vm, /game\.narrator/);
  assert.match(vm, /game\.cast/);
});

test("portable Games Hub View receives display-ready state and semantic callbacks", () => {
  const view = read("components/studio/games/games-hub/GamesHub.view.jsx");
  assert.match(view, /filteredGames/);
  assert.match(view, /continueGames/);
  assert.match(view, /featuredGames/);
  assert.match(view, /onGameAction/);
  assert.match(view, /ViewModeToggleComponent/);
  assert.doesNotMatch(view, /next\/navigation|fetchGames|playStoryTemplate|gamesClient|storyRoomClient/);
  assert.doesNotMatch(view, /game\?\.data|creation\.data/);
});

test("contract, fixtures, and preview cover loaded, empty, loading, and error states", () => {
  const contract = read("components/studio/games/games-hub/GamesHub.contract.js");
  const fixtures = read("components/studio/games/games-hub/GamesHub.fixtures.js");
  const page = read("app/dev/ui-preview/games-hub/page.jsx");
  const preview = read("app/dev/ui-preview/games-hub/GamesHubPreviewClient.jsx");
  assert.match(contract, /GAMES_HUB_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /GamesHubGameViewItem/);
  assert.match(fixtures, /gamesHubRawGamesFixture/);
  assert.match(fixtures, /gamesHubEmptyFixture/);
  assert.match(fixtures, /gamesHubLoadingFixture/);
  assert.match(fixtures, /gamesHubErrorFixture/);
  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(preview, /getGamesHubViewProps/);
});

test("documentation and focused diagnostic command remain explicit", () => {
  const readme = read("components/studio/games/games-hub/README.md");
  const packageJson = read("package.json");
  assert.match(readme, /Portable Skin/);
  assert.match(readme, /Story Template play orchestration/);
  assert.match(readme, /Mechanics Module field decomposition remains deferred/);
  assert.match(readme, /\/dev\/ui-preview\/games-hub/);
  assert.match(packageJson, /diagnostics:loom:games-hub/);
});
