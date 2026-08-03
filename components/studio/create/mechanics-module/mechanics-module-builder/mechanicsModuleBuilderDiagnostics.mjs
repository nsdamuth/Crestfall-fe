import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Mechanics Module Builder Shell remains a focused LOOM binding", () => {
  const shell = read(
    "components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx"
  );

  assert.match(shell, /useMechanicsModuleBuilderViewModel/);
  assert.match(shell, /<MechanicsModuleBuilderView/);
  assert.match(shell, /<MechanicsModuleFieldsSection \{\.\.\.mechanicsFieldsProps\} \/>/);
  assert.doesNotMatch(shell, /\bfetch\s*\(|useState|useRouter/);
});

test("Mechanics Module Builder View is API and persistence free", () => {
  const view = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/MechanicsModuleBuilder.view.jsx"
  );

  assert.doesNotMatch(
    view,
    /\bfetch\s*\(|\/api\/|supabase|PostGraphile|createCreationDraft|createMechanicsModuleDraft|router\./
  );
  assert.doesNotMatch(view, /import MechanicsModuleFieldsSection/);
  assert.match(view, /runtimeFieldsContent/);
});

test("Mechanics Module Builder ViewModel owns save and atomic data replacement", () => {
  const viewModel = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/useMechanicsModuleBuilderViewModel.js"
  );
  const payloadBuilder = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/mechanicsModuleCreationPayload.js"
  );

  assert.match(viewModel, /buildMechanicsModuleCreationPayload/);
  assert.match(viewModel, /createMechanicsModuleDraft/);
  assert.match(viewModel, /normalizeMechanicsDocument/);
  assert.match(viewModel, /replaceData: replaceMechanicsData/);
  assert.match(viewModel, /router\.push/);
  assert.doesNotMatch(viewModel, /\bfetch\s*\(|<\w+/);

  assert.match(payloadBuilder, /type: "MECHANICS_MODULE"/);
  assert.match(payloadBuilder, /data:\s*normalizeMechanicsDocument/);
  assert.doesNotMatch(payloadBuilder, /\bfetch\s*\(|router\./);
});

test("Mechanics Module client delegates creation through the shared creation client", () => {
  const client = read(
    "lib/client/studio/mechanics-modules/mechanicsModuleClient.js"
  );

  assert.match(client, /createCreationDraft/);
  assert.match(client, /Mechanics module draft could not be saved\./);
  assert.doesNotMatch(client, /\bfetch\s*\(/);
});

test("Mechanics Module Builder contract and fixtures cover key states", () => {
  const contract = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/MechanicsModuleBuilder.contract.js"
  );
  const fixtures = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/MechanicsModuleBuilder.fixtures.js"
  );

  assert.match(contract, /MECHANICS_MODULE_BUILDER_VIEW_CONTRACT_VERSION/);
  assert.match(fixtures, /mechanicsModuleBuilderDefaultFixture/);
  assert.match(fixtures, /mechanicsModuleBuilderEmptyFixture/);
  assert.match(fixtures, /mechanicsModuleBuilderSavingFixture/);
  assert.match(fixtures, /mechanicsModuleBuilderSavedFixture/);
  assert.match(fixtures, /mechanicsModuleBuilderErrorFixture/);
  assert.match(fixtures, /mechanicsModuleBuilderCustomContractFixture/);
});

test("Mechanics Module Builder preview is development-only", () => {
  const page = read("app/dev/ui-preview/mechanics-module-builder/page.jsx");

  assert.match(page, /process\.env\.NODE_ENV === "production"/);
  assert.match(page, /notFound\(\)/);
});

test("Create Mechanics Module page retains the public Builder Shell", () => {
  const page = read("app/studio/create/mechanics-module/page.js");

  assert.match(
    page,
    /import MechanicsModuleBuilderShell from "@\/components\/studio\/create\/mechanics-module\/MechanicsModuleBuilderShell"/
  );
  assert.match(page, /<MechanicsModuleBuilderShell \/>/);
});
