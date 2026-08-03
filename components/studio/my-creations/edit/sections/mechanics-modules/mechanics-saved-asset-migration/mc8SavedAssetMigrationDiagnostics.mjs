import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_SAVED_ASSET_MIGRATION_VERSION,
  MECHANICS_SAVED_ASSET_EXPLICIT_ACTIONS,
  analyzeMechanicsSavedAssetMigration,
  analyzeMechanicsSavedCommandMigration,
  analyzeMechanicsSavedResolutionMigration,
  applyMechanicsSavedAssetMigration,
} from "./mechanicsSavedAssetMigration.js";
import {
  MECHANICS_LEGACY_FIXTURE_STATUS,
  listMechanicsLegacyFixtures,
} from "../mechanics-presets/mc8LegacyMechanicsFixtures.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../../../../../..");
const rootPackage = JSON.parse(
  fs.readFileSync(path.resolve(repoRoot, "package.json"), "utf8")
);
const fixtures = listMechanicsLegacyFixtures();

function fixture(id) {
  const found = fixtures.find((entry) => entry.id === id);
  assert.ok(found, `Missing fixture ${id}`);
  return found;
}

function minimalModule(patch = {}) {
  return {
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    priority: 65,
    tags: [],
    contractVersion: "trackers_instance_data.v0_2",
    instanceData: {
      contractVersion: "trackers_instance_data.v0_2",
      trackers: [],
      commands: [],
      guards: [],
      statusBlocks: [],
      defaults: { flags: [], counters: [], stages: [] },
    },
    ...patch,
  };
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

const triggerFixture = fixture("legacy.command.trigger_only.pre_mc1.v1");
const preCompositionFixture = fixture("legacy.command.pre_composition.mc5.v1");
const resolutionFixture = fixture("legacy.resolution.v1_saved_command.v1");
const preReadoutFixture = fixture(
  "legacy.character_advancement.pre_readout_snapshot.v1"
);
const missingCollectionsFixture = fixture(
  "legacy.module.missing_optional_collections.synthetic.v1"
);

test("MC8B migration contract starts at v1", () => {
  assert.equal(
    MECHANICS_SAVED_ASSET_MIGRATION_VERSION,
    "mechanics_saved_asset_migration_v1"
  );
});

test("MC8A fixture inventory remains inventoried before migration", () => {
  assert.equal(MECHANICS_LEGACY_FIXTURE_STATUS, "INVENTORIED_NOT_MIGRATED");
  assert.ok(fixtures.length >= 8);
});

test("root package exposes the MC8B aggregate command", () => {
  assert.equal(
    rootPackage.scripts?.["diagnostics:mc8b"],
    "npm run diagnostics:mc8a && node components/studio/my-creations/edit/sections/mechanics-modules/mechanics-saved-asset-migration/mc8SavedAssetMigrationDiagnostics.mjs --skip-baseline"
  );
});

test("canonical module remains current and unchanged", () => {
  const source = minimalModule();
  const result = analyzeMechanicsSavedAssetMigration(source);
  assert.equal(result.status, "CURRENT");
  assert.equal(result.changed, false);
  assert.equal(result.applyAllowed, true);
});

test("migration analysis never mutates its input", () => {
  const source = deepClone(missingCollectionsFixture.sample);
  const before = JSON.stringify(source);
  analyzeMechanicsSavedAssetMigration(source);
  assert.equal(JSON.stringify(source), before);
});

test("missing optional collections normalize to empty arrays", () => {
  const result = analyzeMechanicsSavedAssetMigration(
    missingCollectionsFixture.sample
  );
  assert.equal(result.status, "SAFE_NORMALIZATION_AVAILABLE");
  assert.deepEqual(result.data.instanceData.guards, []);
  assert.deepEqual(result.data.instanceData.statusBlocks, []);
  assert.deepEqual(result.data.instanceData.defaults.stages, []);
  assert.equal(result.data.moduleId, "core.trackers.v1");
});

test("safe normalization is idempotent", () => {
  const first = analyzeMechanicsSavedAssetMigration(
    missingCollectionsFixture.sample
  );
  const second = analyzeMechanicsSavedAssetMigration(first.data);
  assert.equal(second.status, "CURRENT");
  assert.equal(second.changed, false);
});

test("pre-MC6 command gains an empty canonical composition", () => {
  const result = analyzeMechanicsSavedCommandMigration(
    preCompositionFixture.sample
  );
  assert.equal(result.command.composition.version, "mechanics_command_composition_v1");
  assert.deepEqual(result.command.composition.mechanicsSteps, []);
  assert.deepEqual(result.command.composition.domainSteps, []);
});

test("historical resolution v1 normalizes to frozen v6", () => {
  const result = analyzeMechanicsSavedResolutionMigration(
    resolutionFixture.sample
  );
  assert.equal(result.validation.valid, true);
  assert.equal(result.resolution.version, "mechanics_command_resolution_v6");
  assert.equal(result.resolution.mode, "NO_ROLL_DETERMINISTIC");
});

test("trigger-only command requires explicit invocation synthesis", () => {
  const result = analyzeMechanicsSavedCommandMigration(triggerFixture.sample);
  assert.equal(result.status, "EXPLICIT_ACTION_REQUIRED");
  assert.equal(result.applyAllowed, false);
  assert.equal(
    result.explicitActions.some(
      (entry) =>
        entry.code ===
        MECHANICS_SAVED_ASSET_EXPLICIT_ACTIONS.SYNTHESIZE_STRUCTURED_INVOCATION
    ),
    true
  );
  assert.deepEqual(result.command.triggers, ["/settled"]);
});

test("explicit invocation synthesis converts only a simple trigger", () => {
  const result = analyzeMechanicsSavedCommandMigration(
    triggerFixture.sample,
    { allowInvocationSynthesis: true }
  );
  assert.equal(result.validation.valid, true);
  assert.equal(result.command.invocation.command, "settled");
  assert.deepEqual(result.command.invocation.prefixes, ["/"]);
  assert.deepEqual(result.command.triggers, ["/settled"]);
});

test("multi-word legacy triggers are retained instead of guessed", () => {
  const result = analyzeMechanicsSavedCommandMigration({
    id: "warn_boundary",
    label: "Warn Boundary",
    triggers: ["/warn boundary"],
    effects: [],
  }, { allowInvocationSynthesis: true });
  assert.equal(result.command.invocation.command, "");
  assert.deepEqual(result.command.triggers, ["/warn boundary"]);
  assert.equal(
    result.notices.some((entry) => entry.code === "LEGACY_TRIGGER_RETAINED"),
    true
  );
});

test("pre-readout advancement remains an explicit preset merge", () => {
  const result = analyzeMechanicsSavedAssetMigration(preReadoutFixture.sample);
  const commands = result.data.instanceData.commands.map(
    (command) => command.invocation.command
  );
  assert.equal(commands.includes("progress"), false);
  const action = result.explicitActions.find(
    (entry) =>
      entry.code ===
      MECHANICS_SAVED_ASSET_EXPLICIT_ACTIONS.MERGE_CHARACTER_PROGRESS_READOUT
  );
  assert.ok(action);
  assert.equal(action.presetId, "module.character_advancement_readout.v1");
  assert.equal(action.applyMode, "MERGE_MODULE");
});

test("unknown top-level and instance metadata is preserved", () => {
  const source = minimalModule({
    customMetadata: { preserved: true },
    instanceData: {
      ...minimalModule().instanceData,
      customInstanceMetadata: { retained: "yes" },
    },
  });
  const result = analyzeMechanicsSavedAssetMigration(source);
  assert.deepEqual(result.data.customMetadata, { preserved: true });
  assert.deepEqual(result.data.instanceData.customInstanceMetadata, {
    retained: "yes",
  });
});

test("changed paths are bounded and use JSON-style locations", () => {
  const result = analyzeMechanicsSavedAssetMigration(
    missingCollectionsFixture.sample
  );
  assert.ok(result.changedPaths.length > 0);
  assert.ok(result.changedPaths.every((entry) => entry.startsWith("$")));
  assert.ok(result.changedPaths.length <= 256);
});

test("unconfirmed apply returns no replacement data", () => {
  const result = applyMechanicsSavedAssetMigration({
    value: missingCollectionsFixture.sample,
  });
  assert.equal(result.status, "CONFIRMATION_REQUIRED");
  assert.equal(result.data, null);
});

test("confirmed safe apply returns an isolated in-memory replacement", () => {
  const result = applyMechanicsSavedAssetMigration({
    value: missingCollectionsFixture.sample,
    confirmed: true,
  });
  assert.equal(result.status, "APPLIED_IN_MEMORY");
  assert.ok(result.data);
  result.data.instanceData.commands.push({ id: "mutated" });
  const second = applyMechanicsSavedAssetMigration({
    value: missingCollectionsFixture.sample,
    confirmed: true,
  });
  assert.equal(
    second.data.instanceData.commands.some((entry) => entry.id === "mutated"),
    false
  );
});

test("trigger synthesis cannot apply without its explicit option", () => {
  const wrapper = minimalModule({
    instanceData: {
      ...minimalModule().instanceData,
      commands: [triggerFixture.sample],
    },
  });
  const result = applyMechanicsSavedAssetMigration({
    value: wrapper,
    confirmed: true,
  });
  assert.equal(result.status, "EXPLICIT_ACTION_REQUIRED");
  assert.equal(result.data, null);
});

test("trigger synthesis applies only when confirmed and enabled", () => {
  const wrapper = minimalModule({
    instanceData: {
      ...minimalModule().instanceData,
      commands: [triggerFixture.sample],
    },
  });
  const result = applyMechanicsSavedAssetMigration({
    value: wrapper,
    confirmed: true,
    allowInvocationSynthesis: true,
  });
  assert.equal(result.status, "APPLIED_IN_MEMORY");
  assert.equal(
    result.data.instanceData.commands[0].invocation.command,
    "settled"
  );
});

test("non-module metadata fixtures are not treated as saved assets", () => {
  const catalog = fixture("legacy.preset.core_only_library.mc7.v1");
  const result = analyzeMechanicsSavedAssetMigration(catalog.sample);
  assert.equal(result.status, "NOT_APPLICABLE");
  assert.equal(result.data, null);
});

test("arrays and malformed roots reject or remain not applicable atomically", () => {
  const arrayResult = analyzeMechanicsSavedAssetMigration([]);
  assert.equal(arrayResult.status, "NOT_APPLICABLE");
  const malformed = analyzeMechanicsSavedAssetMigration({ instanceData: [] });
  assert.equal(malformed.status, "NOT_APPLICABLE");
});

test("migration implementation remains frontend-only and persistence-free", () => {
  const source = fs.readFileSync(
    path.resolve(__dirname, "mechanicsSavedAssetMigration.js"),
    "utf8"
  );
  for (const forbidden of [
    "fetch(",
    "createClient(",
    "supabase",
    "PostGraphile",
    "services-api",
    "CRESTFALL_API_INTERNAL_URL",
  ]) {
    assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()), false);
  }
});

test("MC8B report records dry-run, idempotency, and no database writes", () => {
  const report = fs.readFileSync(
    path.resolve(__dirname, "MC8B_SAVED_ASSET_MIGRATION.md"),
    "utf8"
  );
  assert.match(report, /mechanics_saved_asset_migration_v1/);
  assert.match(report, /dry-run/i);
  assert.match(report, /idempotent/i);
  assert.match(report, /No database migration/i);
  assert.match(report, /MC8C/);
});

console.log("Crestfall mc8_saved_asset_migration_diagnostics_v1");
console.log(`Node ${process.version}`);
console.log("");

let passed = 0;
let failed = 0;
const started = Date.now();

for (let index = 0; index < tests.length; index += 1) {
  const current = tests[index];
  const testStarted = Date.now();
  try {
    await current.fn();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - testStarted} ms)`
    );
  } catch (error) {
    failed += 1;
    console.log(
      `FAIL ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - testStarted} ms)`
    );
    console.log(error?.stack || error);
  }
}

console.log("");
console.log(`Summary: ${passed} passed, ${failed} failed, ${tests.length} total`);
console.log(`Elapsed: ${Date.now() - started} ms`);
if (failed) process.exitCode = 1;

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
