import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_COMPATIBILITY_BASELINE_MANIFEST_VERSION,
  MECHANICS_COMPATIBILITY_BASELINE_PHASE,
  MECHANICS_COMPATIBILITY_BASELINE_STATUS,
  MECHANICS_COMPATIBILITY_FROZEN_COUNTS,
  MECHANICS_COMPATIBILITY_CONTRACTS_BY_PHASE,
  MECHANICS_COMPATIBILITY_SHARED_IDENTITIES,
  MECHANICS_COMPATIBILITY_PACKAGE_BASELINE,
  MECHANICS_COMPATIBILITY_REQUIRED_DIAGNOSTIC_GROUPS,
  MECHANICS_COMPATIBILITY_OPTIONAL_DIAGNOSTICS,
  getMechanicsCompatibilityBaselineManifest,
} from "./mechanicsCompatibilityBaselineManifest.js";
import {
  MECHANICS_LEGACY_FIXTURE_INVENTORY_VERSION,
  MECHANICS_LEGACY_FIXTURE_STATUS,
  MECHANICS_LEGACY_FIXTURES,
  listMechanicsLegacyFixtures,
} from "./mc8LegacyMechanicsFixtures.js";
import {
  MECHANICS_PRESET_FREEZE_MANIFEST_VERSION,
  MECHANICS_PRESET_FROZEN_COUNTS,
  MECHANICS_PRESET_FROZEN_IDS,
} from "./mechanicsPresetFreezeManifest.js";
import {
  MECHANICS_PRESET_EXTENSION_FREEZE_MANIFEST_VERSION,
  MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS,
  MECHANICS_PRESET_EXTENSION_FROZEN_IDS,
  MECHANICS_PRESET_EXTENSION_LEGACY_IDS,
} from "./mechanicsPresetExtensionFreezeManifest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../../../../../..");
const args = new Set(process.argv.slice(2));
const preflightOnly = args.has("--preflight-only");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8"));
}

function flattenDiagnosticGroups(groups) {
  return Object.entries(groups).flatMap(([group, paths]) =>
    paths.map((relativePath) => ({ group, relativePath }))
  );
}

function resolveDiagnosticPath(relativePath) {
  const direct = path.resolve(repoRoot, relativePath);
  return fs.existsSync(direct) ? direct : null;
}

function runDiagnostic({ group, relativePath }) {
  const diagnosticPath = resolveDiagnosticPath(relativePath);
  assert.ok(diagnosticPath, `Missing diagnostic: ${relativePath}`);
  const result = spawnSync(process.execPath, [diagnosticPath], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  assert.equal(
    result.status,
    0,
    `Diagnostic failed [${group}]: ${relativePath}`
  );
}

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

const baseline = getMechanicsCompatibilityBaselineManifest();
const fixtures = listMechanicsLegacyFixtures();
const rootPackage = readJson("package.json");
const apiPackage = readJson("services/api/package.json");
const requiredDiagnostics = flattenDiagnosticGroups(
  MECHANICS_COMPATIBILITY_REQUIRED_DIAGNOSTIC_GROUPS
);

check("MC8 compatibility baseline manifest starts at v1", () => {
  assert.equal(
    MECHANICS_COMPATIBILITY_BASELINE_MANIFEST_VERSION,
    "mechanics_compatibility_baseline_manifest_v1"
  );
});

check("MC8A phase is baselined without migration", () => {
  assert.equal(MECHANICS_COMPATIBILITY_BASELINE_PHASE, "MC8A");
  assert.equal(MECHANICS_COMPATIBILITY_BASELINE_STATUS, "BASELINED");
});

check("compatibility baseline returns isolated clones", () => {
  const first = getMechanicsCompatibilityBaselineManifest();
  first.frozenCounts.corePresets = 0;
  assert.equal(
    getMechanicsCompatibilityBaselineManifest().frozenCounts.corePresets,
    20
  );
});

check("core and extension freeze counts remain authoritative", () => {
  assert.equal(MECHANICS_PRESET_FREEZE_MANIFEST_VERSION, "mechanics_preset_freeze_manifest_v1");
  assert.equal(MECHANICS_PRESET_EXTENSION_FREEZE_MANIFEST_VERSION, "mechanics_preset_extension_freeze_manifest_v1");
  assert.equal(MECHANICS_PRESET_FROZEN_COUNTS.total, 20);
  assert.deepEqual(MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS, {
    core: 20,
    extension: 2,
    liveLibrary: 22,
  });
  assert.deepEqual(MECHANICS_COMPATIBILITY_FROZEN_COUNTS, {
    corePresets: 20,
    extensionPresets: 2,
    livePresetLibrary: 22,
    referenceRuntimeImplementations: 5,
  });
});

check("extension identities stay outside the core freeze", () => {
  for (const id of MECHANICS_PRESET_EXTENSION_FROZEN_IDS) {
    assert.equal(MECHANICS_PRESET_FROZEN_IDS.includes(id), false, id);
  }
  assert.deepEqual(
    [...MECHANICS_PRESET_EXTENSION_LEGACY_IDS],
    [MECHANICS_COMPATIBILITY_SHARED_IDENTITIES.progressionLegacyAlias]
  );
});

check("all MC1 through MC7X phase inventories are present", () => {
  assert.deepEqual(
    Object.keys(MECHANICS_COMPATIBILITY_CONTRACTS_BY_PHASE),
    ["MC1", "MC2", "MC3", "MC4", "MC5", "MC6", "MC7", "MC7X"]
  );
  for (const contracts of Object.values(
    MECHANICS_COMPATIBILITY_CONTRACTS_BY_PHASE
  )) {
    assert.ok(contracts.length > 0);
    assert.equal(new Set(contracts).size, contracts.length);
  }
});

check("root package exposes the authoritative MC8A entry point", () => {
  assert.equal(rootPackage.name, MECHANICS_COMPATIBILITY_PACKAGE_BASELINE.root.name);
  assert.equal(
    rootPackage.scripts?.["diagnostics:mc8a"],
    MECHANICS_COMPATIBILITY_PACKAGE_BASELINE.root.command
  );
});

check("services-api exposes the bounded service baseline command", () => {
  assert.equal(
    apiPackage.name,
    MECHANICS_COMPATIBILITY_PACKAGE_BASELINE.servicesApi.name
  );
  assert.equal(
    apiPackage.scripts?.["diagnostics:mc8a"],
    MECHANICS_COMPATIBILITY_PACKAGE_BASELINE.servicesApi.command
  );
  assert.equal(apiPackage.type, "module");
});

check("legacy fixture inventory starts at v1 and is not a migration", () => {
  assert.equal(
    MECHANICS_LEGACY_FIXTURE_INVENTORY_VERSION,
    "mechanics_legacy_fixture_inventory_v1"
  );
  assert.equal(MECHANICS_LEGACY_FIXTURE_STATUS, "INVENTORIED_NOT_MIGRATED");
  assert.equal(Object.isFrozen(MECHANICS_LEGACY_FIXTURES), true);
});

check("legacy fixture inventory returns isolated clones", () => {
  const first = listMechanicsLegacyFixtures();
  first[0].id = "mutated";
  assert.notEqual(listMechanicsLegacyFixtures()[0].id, "mutated");
});

check("legacy fixture identities are unique and classified", () => {
  assert.equal(new Set(fixtures.map((entry) => entry.id)).size, fixtures.length);
  assert.ok(fixtures.length >= 8);
  for (const fixture of fixtures) {
    assert.ok(fixture.confidence);
    assert.ok(fixture.kind);
    assert.ok(fixture.originBoundary);
    assert.ok(fixture.completeness);
    assert.ok(fixture.expectedMC8Treatment);
    assert.ok(fixture.sample && typeof fixture.sample === "object");
  }
});

check("pre-readout advancement remains an explicit migration inventory case", () => {
  const fixture = fixtures.find(
    (entry) => entry.id === "legacy.character_advancement.pre_readout_snapshot.v1"
  );
  assert.ok(fixture);
  const commands = fixture.sample.instanceData.commands.map(
    (command) => command.invocation.command
  );
  assert.equal(commands.includes("progress"), false);
  assert.match(fixture.expectedMC8Treatment, /explicit MERGE_MODULE/);
});

check("required diagnostics are grouped by frontend service cross-tier and freeze", () => {
  assert.deepEqual(
    Object.keys(MECHANICS_COMPATIBILITY_REQUIRED_DIAGNOSTIC_GROUPS),
    ["FRONTEND", "SERVICES_API", "CROSS_TIER", "FREEZE_GATE"]
  );
  assert.equal(requiredDiagnostics.length, 8);
});

check("all required diagnostics exist before any execution", () => {
  const missing = requiredDiagnostics.filter(
    ({ relativePath }) => !resolveDiagnosticPath(relativePath)
  );
  assert.deepEqual(
    missing,
    [],
    missing.map((entry) => `${entry.group}: ${entry.relativePath}`).join("\n")
  );
});

check("optional historical diagnostics are inventoried without becoming required", () => {
  assert.equal(MECHANICS_COMPATIBILITY_OPTIONAL_DIAGNOSTICS.length, 4);
  assert.equal(
    baseline.optionalDiagnostics.length,
    MECHANICS_COMPATIBILITY_OPTIONAL_DIAGNOSTICS.length
  );
});

check("MC8A report is present and explicitly non-mutating", () => {
  const report = fs.readFileSync(
    path.resolve(__dirname, "MC8A_REGRESSION_BASELINE_AND_MIGRATION_INVENTORY.md"),
    "utf8"
  );
  assert.match(report, /Status:\*\* BASELINED/);
  assert.match(report, /No runtime behavior changes/);
  assert.match(report, /INVENTORIED_NOT_MIGRATED/);
  assert.match(report, /MC8B/);
});

console.log("Crestfall mc8_regression_baseline_v1");
console.log(`Node ${process.version}`);
console.log(`Mode: ${preflightOnly ? "PREFLIGHT_ONLY" : "FULL"}`);
console.log("");

let passed = 0;
let failed = 0;
const started = Date.now();

for (let index = 0; index < checks.length; index += 1) {
  const current = checks[index];
  const checkStarted = Date.now();
  try {
    await current.fn();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - checkStarted} ms)`
    );
  } catch (error) {
    failed += 1;
    console.log(
      `FAIL ${String(index + 1).padStart(2, "0")} ${current.name} (${Date.now() - checkStarted} ms)`
    );
    console.log(error?.stack || error);
  }
}

if (!failed) {
  console.log("");
  for (const relativePath of MECHANICS_COMPATIBILITY_OPTIONAL_DIAGNOSTICS) {
    console.log(
      `${resolveDiagnosticPath(relativePath) ? "OPTIONAL PRESENT" : "OPTIONAL MISSING"} ${relativePath}`
    );
  }
}

if (!failed && !preflightOnly) {
  console.log("");
  for (const diagnostic of requiredDiagnostics) {
    console.log(`RUN [${diagnostic.group}] ${diagnostic.relativePath}`);
    try {
      runDiagnostic(diagnostic);
      console.log(`PASS [${diagnostic.group}] ${diagnostic.relativePath}`);
    } catch (error) {
      failed += 1;
      console.log(`FAIL [${diagnostic.group}] ${diagnostic.relativePath}`);
      console.log(error?.stack || error);
      break;
    }
  }
}

console.log("");
console.log(`Summary: ${passed} baseline checks passed, ${failed} failed`);
console.log(`Elapsed: ${Date.now() - started} ms`);
if (failed) process.exitCode = 1;
