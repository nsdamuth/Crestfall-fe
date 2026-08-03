import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_GUARD_COMPOSER_VISIBILITIES,
  MECHANICS_GUARD_CONDITION_TYPES,
  MECHANICS_GUARD_ENFORCEMENTS,
  MECHANICS_GUARD_MODES,
  MECHANICS_GUARD_OPERATORS,
  MECHANICS_GUARD_PUBLIC_VISIBILITIES,
  MECHANICS_GUARDS_LOOM_CONTRACT,
} from "./MechanicsGuards.contract.js";
import { MECHANICS_GUARD_FIXTURES } from "./mechanicsGuards.fixtures.js";
import {
  normalizeMechanicsGuard,
  normalizeMechanicsGuardCondition,
  normalizeMechanicsGuards,
  summarizeMechanicsGuard,
} from "./mechanicsGuardsNormalization.js";
import {
  addMechanicsGuard,
  addMechanicsGuardCondition,
  patchMechanicsGuard,
  patchMechanicsGuardCondition,
  removeMechanicsGuard,
  removeMechanicsGuardCondition,
} from "./mechanicsGuardsOperations.js";
import { normalizeMechanicsDocument } from "../mechanics-core/mechanicsDocumentNormalization.js";
import { canonicalizeMechanicsModuleData } from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
const fixture = (id) => MECHANICS_GUARD_FIXTURES.find((item) => item.id === id);

test("M7C contract freezes Guard ownership", () => {
  assert.equal(MECHANICS_GUARDS_LOOM_CONTRACT.id, "crestfall.loom.mechanics-guards.v1");
  assert.equal(MECHANICS_GUARDS_LOOM_CONTRACT.storagePath, "instanceData.guards");
  assert.deepEqual([...MECHANICS_GUARD_ENFORCEMENTS], [
    "HARD_LOCK",
    "SOFT_LOCK",
    "GUIDANCE",
  ]);
  assert.deepEqual([...MECHANICS_GUARD_MODES], ["ALL", "ANY"]);
  assert.deepEqual([...MECHANICS_GUARD_CONDITION_TYPES], [
    "COUNTER",
    "METER",
    "FLAG",
    "STAGE",
  ]);
  assert.deepEqual([...MECHANICS_GUARD_OPERATORS], [
    "lt",
    "lte",
    "gt",
    "gte",
    "eq",
    "neq",
  ]);
  assert.deepEqual([...MECHANICS_GUARD_COMPOSER_VISIBILITIES], [
    "SUMMARY_ONLY",
    "FULL",
    "HIDDEN",
  ]);
  assert.deepEqual([...MECHANICS_GUARD_PUBLIC_VISIBILITIES], [
    "HIDDEN",
    "SUMMARY_ONLY",
    "PUBLIC",
  ]);
});

test("fixture inventory covers empty, current, legacy, and malformed guards", () => {
  assert.deepEqual(
    MECHANICS_GUARD_FIXTURES.map((item) => item.id),
    ["EMPTY", "CURRENT", "LEGACY", "MALFORMED"]
  );
});

test("Guard normalization is idempotent", () => {
  for (const item of MECHANICS_GUARD_FIXTURES) {
    const once = normalizeMechanicsGuards(item.guards);
    const twice = normalizeMechanicsGuards(once);
    assert.deepEqual(twice, once, item.id);
  }
});

test("document normalization delegates Guards to M7C", () => {
  const document = normalizeMechanicsDocument({
    instanceData: {
      guard_rules: fixture("LEGACY").guards,
    },
  });
  assert.equal(document.instanceData.guards[0].id, "legacy_soft_guard");
  assert.equal(document.instanceData.guards[0].enforcement, "SOFT_LOCK");
  assert.equal(document.instanceData.guards[0].mode, "ANY");
});

test("Mechanics JSON canonicalization delegates Guards to M7C", () => {
  const data = canonicalizeMechanicsModuleData({
    moduleDefinitionId: "core.trackers.v1",
    instanceData: { guard_rules: fixture("LEGACY").guards },
  });
  assert.equal(data.instanceData.guards[0].composerVisibility, "SUMMARY_ONLY");
  assert.equal(data.instanceData.guards[0].publicVisibility, "PUBLIC");
  assert.equal(data.instanceData.guards[0].conditions[0].operator, "gte");
});

test("legacy Guard and condition aliases project into canonical fields", () => {
  const normalized = normalizeMechanicsGuards(fixture("LEGACY").guards);
  const guard = normalized[0];
  assert.equal(guard.id, "legacy_soft_guard");
  assert.equal(guard.label, "Legacy Soft Guard");
  assert.equal(guard.enforcement, "SOFT_LOCK");
  assert.equal(guard.mode, "ANY");
  assert.equal(guard.conditions[0].conditionType, "COUNTER");
  assert.equal(guard.conditions[0].id, "legacy_counter");
  assert.equal(guard.conditions[0].operator, "gte");
  assert.equal(guard.conditions[0].value, 2);
  assert.equal(guard.conditions[1].conditionType, "FLAG");
  assert.equal(guard.conditions[1].value, true);
  assert.equal(guard.onFail.summary, "Legacy guard failed.");
  assert.equal(guard.onFail.composerGuidance, "Use legacy fallback guidance.");
  assert.equal(guard.onPass.summary, "Legacy guard passed.");
});

test("unknown Guard, outcome, and condition metadata survives normalization and patching", () => {
  const source = normalizeMechanicsGuards(fixture("CURRENT").guards);
  const patched = patchMechanicsGuard(source, 0, {
    label: "Updated Boundary Guard",
    onFail: { summary: "Updated fail summary." },
  });
  assert.deepEqual(patched[0].futureGuardMetadata, { retained: true });
  assert.deepEqual(patched[0].onFail.futureFailMetadata, { retained: true });
  assert.deepEqual(patched[0].onPass.futurePassMetadata, { retained: true });
  assert.deepEqual(patched[0].conditions[0].futureConditionMetadata, {
    retained: true,
  });
});

test("Guard operations preserve ordering and neighboring guards", () => {
  const source = normalizeMechanicsGuards(fixture("CURRENT").guards);
  const added = addMechanicsGuard(source);
  assert.equal(added.length, 3);
  assert.equal(added[0].id, "boundary_warning_lock");
  const removed = removeMechanicsGuard(added, 1);
  assert.equal(removed.length, 2);
  assert.equal(removed[1].id, added[2].id);
});

test("condition operations preserve ordering and unknown metadata", () => {
  const source = normalizeMechanicsGuards(fixture("CURRENT").guards);
  const added = addMechanicsGuardCondition(source, 0);
  assert.equal(added[0].conditions.length, 3);
  const patched = patchMechanicsGuardCondition(added, 0, 0, {
    value: "5",
  });
  assert.equal(patched[0].conditions[0].value, 5);
  assert.deepEqual(patched[0].conditions[0].futureConditionMetadata, {
    retained: true,
  });
  const removed = removeMechanicsGuardCondition(patched, 0, 1);
  assert.equal(removed[0].conditions.length, 2);
});

test("malformed Guards recover safely", () => {
  const normalized = normalizeMechanicsGuards(fixture("MALFORMED").guards);
  assert.equal(normalized[0].id, "guard_1");
  assert.equal(normalized[1].id, "guard_2");
  assert.equal(normalized[1].enforcement, "HARD_LOCK");
  assert.equal(normalized[1].mode, "ALL");
  assert.deepEqual(normalized[1].conditions, []);
  assert.equal(normalized[1].composerVisibility, "SUMMARY_ONLY");
  assert.equal(normalized[1].publicVisibility, "HIDDEN");
});

test("Guard summaries retain enforcement, mode, and condition count", () => {
  assert.equal(
    summarizeMechanicsGuard(fixture("CURRENT").guards[0]),
    "HARD_LOCK · ALL · 2 conditions"
  );
});

test("portable Guards View owns presentation without application imports", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/MechanicsGuards.view.jsx"
  );
  assert.match(view, /On Fail Composer Guidance/);
  assert.match(view, /Composer Visibility/);
  assert.match(view, /Public Visibility/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /MechanicsModuleFieldsSection/);
});

test("the main Mechanics parent mounts M7C and no longer owns Guard UI", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  assert.match(parent, /import MechanicsGuards/);
  assert.match(parent, /<MechanicsGuards/);
  const assemblyViewModel = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js"
  );
  assert.match(assemblyViewModel, /normalizeMechanicsGuards/);
  assert.doesNotMatch(parent, /const GUARD_ENFORCEMENTS/);
  assert.doesNotMatch(parent, /function GuardsVisualEditor/);
  assert.doesNotMatch(parent, /function GuardCard/);
  assert.doesNotMatch(parent, /function GuardConditionCard/);
  assert.doesNotMatch(parent, /function normalizeGuard/);
  assert.doesNotMatch(parent, /function normalizeGuardCondition/);
});

test("M7C package includes contract, View, ViewModel, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsGuards.contract.js",
    "MechanicsGuards.jsx",
    "MechanicsGuards.view.jsx",
    "useMechanicsGuardsViewModel.js",
    "mechanicsGuardsNormalization.js",
    "mechanicsGuardsOperations.js",
    "mechanicsGuards.fixtures.js",
    "mechanicsGuardsDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-guards/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m7c"] || "",
    /mechanicsGuardsDiagnostics\.mjs/
  );
});
