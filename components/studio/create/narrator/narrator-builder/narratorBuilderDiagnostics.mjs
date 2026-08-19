import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Narrator Builder Shell remains a thin LOOM binding", () => {
  const shell = read("components/studio/create/narrator/NarratorBuilderShell.jsx");

  assert.match(shell, /useNarratorBuilderViewModel/);
  assert.match(shell, /<NarratorBuilderView \{\.\.\.viewProps\} \/>/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Narrator Builder View is API and persistence free", () => {
  const view = read(
    "components/studio/create/narrator/narrator-builder/NarratorBuilder.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createCreationDraft|createNarratorDraft|router\./
  );
  assert.match(view, /NarratorModuleSelectorView/);
  assert.doesNotMatch(view, /import NarratorModuleSelector from/);
});

test("Narrator Builder ViewModel owns state, payload mapping, and creation orchestration", () => {
  const viewModel = read(
    "components/studio/create/narrator/narrator-builder/useNarratorBuilderViewModel.js"
  );

  assert.match(viewModel, /buildNarratorCreationPayload/);
  assert.match(viewModel, /type: "NARRATOR"/);
  assert.match(viewModel, /selected_modules/);
  assert.match(viewModel, /response_direction/);
  assert.doesNotMatch(
    viewModel,
    /pacing:\s*selectedModules\.pacing/
  );
  assert.doesNotMatch(
    viewModel,
    /detail_level:\s*selectedModules\.detail_level/
  );
  assert.match(viewModel, /createNarratorDraft/);
  assert.match(viewModel, /router\.push/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);
});

test("Narrator client delegates creation through the shared creation client", () => {
  const client = read("lib/client/studio/narrators/narratorClient.js");

  assert.match(client, /createCreationDraft/);
  assert.match(client, /Narrator draft could not be saved\./);
  assert.doesNotMatch(client, /\bfetch\s*\(/);
});

test("Narrator Builder contract and fixtures cover key states", () => {
  const contract = read(
    "components/studio/create/narrator/narrator-builder/NarratorBuilder.contract.js"
  );
  const fixtures = read(
    "components/studio/create/narrator/narrator-builder/NarratorBuilder.fixtures.js"
  );

  assert.match(contract, /NARRATOR_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(
    contract,
    /prose_style:\s*"cinematic"[\s\S]*detail_level:\s*"balanced"[\s\S]*pacing:\s*"balanced"[\s\S]*atmosphere:\s*"adventurous"/
  );
  assert.doesNotMatch(contract, /dialogue_style/);
  assert.doesNotMatch(contract, /knowledge_behavior/);
  assert.match(fixtures, /narratorBuilderDefaultFixture/);
  assert.match(fixtures, /narratorBuilderEmptyFixture/);
  assert.match(fixtures, /narratorBuilderSavingFixture/);
  assert.match(fixtures, /narratorBuilderSavedFixture/);
  assert.match(fixtures, /narratorBuilderErrorFixture/);
  assert.match(fixtures, /narratorBuilderEnsembleFixture/);
});

test("Narrator Builder preview is development-only", () => {
  const page = read("app/dev/ui-preview/narrator-builder/page.jsx");

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create Narrator page retains the public NarratorBuilderShell", () => {
  const page = read("app/studio/create/narrator/page.js");

  assert.match(
    page,
    /import NarratorBuilderShell from "@\/components\/studio\/create\/narrator\/NarratorBuilderShell"/
  );
  assert.match(page, /<NarratorBuilderShell \/>/);
});
