import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(CURRENT_DIR, "../../../../..");

function read(relativePath) {
  return readFileSync(path.join(CURRENT_DIR, relativePath), "utf8");
}

function readRepo(relativePath) {
  return readFileSync(path.join(REPO_ROOT, relativePath), "utf8");
}

test("Room Template Builder Shell remains a LOOM binding", () => {
  const shell = read("../RoomTemplateBuilderShell.jsx");

  assert.match(shell, /useRoomTemplateBuilderViewModel/);
  assert.match(shell, /<RoomTemplateBuilderView/);
  assert.match(shell, /runtimeAttachmentsContent/);
  assert.doesNotMatch(shell, /buildRoomTemplateCreationPayload/);
});

test("Room Template Builder View is API and persistence free", () => {
  const view = read("RoomTemplateBuilder.view.jsx");

  assert.doesNotMatch(view, /\bfetch\s*\(|\/api\//);
  assert.doesNotMatch(view, /supabase|PostGraphile|createRoomTemplateDraft/);
  assert.doesNotMatch(view, /RoomTemplatePickerModal|RoomRegistryAttachmentsSection|StoryRulesCodexAttachmentsSection/);
});

test("Room Template Builder View composes portable child Views", () => {
  const view = read("RoomTemplateBuilder.view.jsx");

  assert.match(view, /RoomTemplateSummaryView/);
  assert.match(view, /SelectedCharactersPanelView/);
  assert.match(view, /ScenarioRecommendationsPanelView/);
  assert.match(view, /InvitedPlayersPanelView/);
  assert.match(view, /OpeningMessageCardView/);
  assert.match(view, /StoryOpeningLocationAuthoringPanelView/);
  assert.match(view, /openingLocationAuthoringProps/);
  assert.match(view, /PLAYER_SELECT/);
  assert.doesNotMatch(view, /from "@\/components\/studio\/room-templates\/(RoomTemplateSummary|SelectedCharactersPanel|ScenarioRecommendationsPanel|InvitedPlayersPanel|OpeningMessageCard)"/);
});

test("Room Template Builder ViewModel owns state, payload, and creation", () => {
  const viewModel = read("useRoomTemplateBuilderViewModel.js");

  assert.match(viewModel, /buildRoomTemplateCreationPayload/);
  assert.match(viewModel, /createRoomTemplateDraft/);
  assert.match(viewModel, /router\.push\(`\/studio\/my-creations\/\$\{creation\.id\}\/edit`\)/);
  assert.match(viewModel, /mergeScenarioNpcRegistryRecommendations/);
  assert.match(viewModel, /normalizeStoryOpeningLocationAuthoring/);
  assert.match(viewModel, /buildPlayerSelectableOpeningLocationConfig/);
  assert.match(viewModel, /patchStoryCharacterLifecycleSelection/);
  assert.match(viewModel, /Player-selectable Stories require at least one allowed starting Location/);
  assert.match(viewModel, /onChangeCharacterLifecycle/);
  assert.doesNotMatch(viewModel, /<\w+/);
});

test("Legacy Room Template Builder hook delegates to the LOOM ViewModel", () => {
  const hook = readRepo(
    "components/studio/room-templates/hooks/useRoomTemplateBuilder.js"
  );

  assert.match(hook, /useRoomTemplateBuilderViewModel/);
  assert.doesNotMatch(hook, /createRoomTemplateDraft|buildRoomTemplateCreationPayload/);
});

test("Room Template Builder contract and fixtures cover key states", () => {
  const contract = read("RoomTemplateBuilder.contract.js");
  const fixtures = read("RoomTemplateBuilder.fixtures.js");

  assert.match(contract, /ROOM_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(contract, /validateRoomTemplateBuilderViewProps/);
  assert.match(fixtures, /roomTemplateBuilderReferenceFixture/);
  assert.match(fixtures, /roomTemplateBuilderRecommendationsFixture/);
  assert.match(fixtures, /roomTemplateBuilderMultiplayerFixture/);
  assert.match(fixtures, /roomTemplateBuilderSavingFixture/);
  assert.match(fixtures, /roomTemplateBuilderErrorFixture/);
});

test("Room Template Builder preview is development-only and create page retains the Shell", () => {
  const page = readRepo("app/dev/ui-preview/room-template-builder/page.jsx");
  const createPage = readRepo("app/studio/create/room-template/page.js");
  const packageJson = readRepo("package.json");

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
  assert.match(createPage, /RoomTemplateBuilderShell/);
  assert.match(packageJson, /diagnostics:loom:room-template-builder/);
});
