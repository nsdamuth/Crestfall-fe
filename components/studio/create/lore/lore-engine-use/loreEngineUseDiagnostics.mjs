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
  assert.match(viewModel, /fetchLoreEngineUseState/);
  assert.match(viewModel, /submitLoreForEngineUse/);
  assert.match(viewModel, /cancelLoreEngineUseSubmission/);
  assert.match(viewModel, /characterAccess/);
  assert.match(viewModel, /excludedChapterIds/);
  assert.match(viewModel, /excludedSectionIds/);
  assert.match(viewModel, /excludedBlockIds/);
  assert.match(view, /Submit for Engine Use/);
  assert.match(view, /Character knowledge/);
  assert.match(view, /Knowledge scope/);
  assert.match(view, /Explicit exclusions/);
  assert.match(view, /Location relevance/);
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
  assert.match(repository, /createLoreEngineUseSubmissionV2JsonAsActor/);
});

console.log("Lore engine-use LOOM diagnostics passed.");
