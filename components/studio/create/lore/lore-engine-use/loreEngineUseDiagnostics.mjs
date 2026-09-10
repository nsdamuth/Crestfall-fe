import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("Lore Engine Use shell follows LOOM boundaries", () => {
  const shell = read("components/studio/create/lore/LoreEngineUse.jsx");
  const viewModel = read(
    "components/studio/create/lore/lore-engine-use/useLoreEngineUseViewModel.js"
  );
  const view = read(
    "components/studio/create/lore/lore-engine-use/LoreEngineUse.view.jsx"
  );

  assert.match(shell, /useLoreEngineUseViewModel/);
  assert.match(shell, /LoreEngineUseView/);
  assert.match(shell, /LoreEngineUseJsonEditorModal/);
  assert.match(shell, /jsonEditorSlot/);
  assert.match(viewModel, /fetchLoreEngineUseState/);
  assert.match(viewModel, /submitLoreForEngineUse/);
  assert.match(viewModel, /cancelLoreEngineUseSubmission/);
  assert.match(viewModel, /characterAccess/);
  assert.match(viewModel, /excludedChapterIds/);
  assert.match(viewModel, /excludedSectionIds/);
  assert.match(viewModel, /excludedBlockIds/);
  assert.match(viewModel, /knowledgeAvailableFrom/);
  assert.match(viewModel, /knowledgeAvailableUntil/);
  assert.match(viewModel, /allowedScenarioIds/);
  assert.match(viewModel, /allowedRoomTemplateIds/);
  assert.match(viewModel, /fetchOwnedCreations/);
  assert.match(viewModel, /buildLoreEngineUseAuthoringConfiguration/);
  assert.match(viewModel, /projectLoreEngineUseConfigurationToAuthoringState/);
  assert.match(viewModel, /jsonEditorOpen/);
  assert.match(viewModel, /applyImportedEngineUseConfiguration/);
  assert.match(viewModel, /buildLoreEngineUseDraftSource/);
  assert.match(viewModel, /staged Engine Use configuration was preserved/);
  assert.match(view, /Submit for Engine Use/);
  assert.match(view, /Engine Use JSON/);
  assert.match(view, /Engine Use can be authored against the current Lore draft now/);
  assert.match(view, /publish a validated revision later before submitting/);
  assert.match(view, /Character knowledge/);
  assert.match(view, /Knowledge scope/);
  assert.match(view, /Explicit exclusions/);
  assert.match(view, /Knowledge availability/);
  assert.match(view, /Story context/);
  assert.match(view, /Allowed Scenarios/);
  assert.match(view, /Allowed Room Templates/);
  assert.match(view, /Location relevance/);
  assert.match(view, /Active engine configuration/);
  assert.match(view, /Connected to active Engine Use/);
  assert.match(view, /hasAuthoritativeConfiguration/);
  assert.match(view, /!isActive && !hasAuthoritativeConfiguration/);
  assert.doesNotMatch(view, /@\/lib\/client|next\/link|Supabase|PostGraphile/);
});

test("engine-use routes preserve the Crestfall service boundary", () => {
  const client = read("lib/client/studio/creations/loreEngineUseClient.js");
  const api = read("app/api/creations/[id]/lore-engine-use/route.js");
  const service = read("lib/server/services/creations/loreEngineUseService.js");
  const route = read("services/api/src/routes/loreEngineUseRoute.js");
  const repository = read(
    "services/api/src/services/creations/lore/loreEngineUseRepository.js"
  );

  assert.match(client, /\/api\/creations\/.*lore-engine-use/);
  assert.match(api, /submitOwnedLoreForEngineUse/);
  assert.match(service, /crestfallApiRequest/);
  assert.match(route, /submitLoreForEngineUse/);
  assert.match(repository, /postgraphileRequest/);
  assert.match(repository, /createLoreEngineUseSubmissionV3JsonAsActor/);
});


test("Engine Use JSON editor is form-only, contract checked, and revision aware", () => {
  const validation = read(
    "components/studio/create/lore/lore-engine-use/loreEngineUseJsonEditor.validation.js"
  );
  const modalViewModel = read(
    "components/studio/create/lore/lore-engine-use/useLoreEngineUseJsonEditorViewModel.js"
  );
  const modalView = read(
    "components/studio/create/lore/lore-engine-use/LoreEngineUseJsonEditorModal.view.jsx"
  );
  const contract = read(
    "components/studio/create/lore/lore-engine-use/LoreEngineUse.contract.js"
  );

  assert.match(contract, /lore_engine_use_authoring_v1/);
  assert.match(validation, /buildLoreEngineUseDraftSource/);
  assert.match(validation, /Character is not tagged in the current Lore authoring source/);
  assert.match(validation, /Location is not tagged in the current Lore authoring source/);
  assert.match(validation, /Excluded block is outside this Character knowledge scope/);
  assert.match(validation, /knowledgeAvailableFrom must not be later/);
  assert.match(validation, /Legacy abbreviated configuration accepted/);
  assert.match(modalViewModel, /validateLoreEngineUseJsonText/);
  assert.match(modalViewModel, /Engine Use JSON downloaded/);
  assert.match(modalView, /Validate & apply/);
  assert.match(modalView, /publicReleaseId is intentionally omitted/);
  assert.match(modalView, /does not publish, submit, index, verify, activate, cancel, or withdraw/);
  assert.doesNotMatch(modalView, /@\/lib\/client|Supabase|PostGraphile/);
});

console.log("Lore engine-use LOOM diagnostics passed.");
