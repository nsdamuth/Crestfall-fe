import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_PRESET_EXTENSION_FREEZE_MANIFEST_VERSION,
  MECHANICS_PRESET_EXTENSION_FREEZE_PHASE,
  MECHANICS_PRESET_EXTENSION_FREEZE_STATUS,
  MECHANICS_PRESET_EXTENSION_CORE_BASELINE,
  MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS,
  MECHANICS_PRESET_EXTENSION_FROZEN_IDS,
  MECHANICS_PRESET_EXTENSION_LEGACY_IDS,
  MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS,
  MECHANICS_PRESET_EXTENSION_FROZEN_UI_BASELINES,
  MECHANICS_PRESET_EXTENSION_REQUIRED_DIAGNOSTICS,
  getMechanicsPresetExtensionFreezeManifest,
} from "./mechanicsPresetExtensionFreezeManifest.js";
import {
  MECHANICS_PRESET_FREEZE_MANIFEST_VERSION,
  MECHANICS_PRESET_FROZEN_COUNTS,
  MECHANICS_PRESET_FROZEN_IDS,
} from "./mechanicsPresetFreezeManifest.js";
import {
  getMechanicsPresetLibraryManifest,
  listMechanicsPresetCatalog,
} from "./mechanicsPresetLibrary.js";
import {
  MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS,
  MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID,
  MECHANICS_CHARACTER_ADVANCEMENT_PRESET_VERSION,
  MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
  buildCharacterAdvancementProgressionProfile,
  buildMechanicsCharacterAdvancementPreset,
  buildMechanicsCharacterAdvancementReadoutPreset,
} from "./mechanicsCharacterAdvancementPreset.js";
import {
  MECHANICS_EFFECT_VALUE_BINDING_VERSION,
} from "../mechanicsEffectValueBindingBuilder.js";
import {
  MECHANICS_PROGRESSION_PROFILE_VERSION,
  generateMechanicsProgressionTable,
  resolveMechanicsProgressionDerivedValue,
  resolveMechanicsProgressionRank,
} from "../mechanicsProgressionProfileBuilder.js";
import {
  MECHANICS_COMMAND_STATE_READOUT_VERSION,
} from "../mechanicsCommandStateReadoutBuilder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mechanicsRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(__dirname, "../../../../../../..");

function readMechanics(relativePath) {
  return fs.readFileSync(path.resolve(mechanicsRoot, relativePath), "utf8");
}

function readRepo(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function commandTokens(command = {}) {
  const invocation = command.invocation || {};
  return [invocation.command, ...(Array.isArray(invocation.aliases) ? invocation.aliases : [])]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean);
}

function resolveDiagnosticPath(relativePath) {
  const candidates = [
    path.resolve(__dirname, relativePath),
    path.resolve(mechanicsRoot, relativePath),
  ];
  const diagnosticPath = candidates.find((candidate) => fs.existsSync(candidate));

  assert.equal(
    Boolean(diagnosticPath),
    true,
    [
      `Missing diagnostic: ${relativePath}`,
      ...candidates.map((candidate) => `Checked: ${candidate}`),
    ].join("\n")
  );

  return diagnosticPath;
}

function runDiagnostic(relativePath) {
  const diagnosticPath = resolveDiagnosticPath(relativePath);

  const result = spawnSync(process.execPath, [diagnosticPath], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
  });

  assert.equal(
    result.status,
    0,
    [
      `Diagnostic failed: ${relativePath}`,
      result.stdout || "",
      result.stderr || "",
    ].filter(Boolean).join("\n")
  );
}

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

const extensionManifest = getMechanicsPresetExtensionFreezeManifest();
const liveCatalog = listMechanicsPresetCatalog();
const liveManifest = getMechanicsPresetLibraryManifest();
const advancementModule = buildMechanicsCharacterAdvancementPreset();
const readoutModule = buildMechanicsCharacterAdvancementReadoutPreset();
const progressionProfile = buildCharacterAdvancementProgressionProfile();
const progressionTable = generateMechanicsProgressionTable(progressionProfile);

check("Extension freeze manifest starts at v1", () => {
  assert.equal(
    MECHANICS_PRESET_EXTENSION_FREEZE_MANIFEST_VERSION,
    "mechanics_preset_extension_freeze_manifest_v1"
  );
});
check("Extension freeze phase and status are final and frozen", () => {
  assert.equal(MECHANICS_PRESET_EXTENSION_FREEZE_PHASE, "MC7G_FINAL_CLOSEOUT");
  assert.equal(MECHANICS_PRESET_EXTENSION_FREEZE_STATUS, "FROZEN");
});
check("Extension manifest returns isolated clones", () => {
  const first = getMechanicsPresetExtensionFreezeManifest();
  first.presetIds[0] = "mutated";
  assert.equal(
    getMechanicsPresetExtensionFreezeManifest().presetIds[0],
    MECHANICS_PRESET_EXTENSION_FROZEN_IDS[0]
  );
});
check("Extension freeze arrays and objects are immutable", () => {
  assert.equal(Object.isFrozen(MECHANICS_PRESET_EXTENSION_CORE_BASELINE), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_EXTENSION_FROZEN_IDS), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_EXTENSION_LEGACY_IDS), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_EXTENSION_FROZEN_UI_BASELINES), true);
  assert.equal(Object.isFrozen(MECHANICS_PRESET_EXTENSION_REQUIRED_DIAGNOSTICS), true);
});
check("Core MC7 freeze remains version one with twenty presets", () => {
  assert.equal(MECHANICS_PRESET_FREEZE_MANIFEST_VERSION, "mechanics_preset_freeze_manifest_v1");
  assert.equal(MECHANICS_PRESET_FROZEN_COUNTS.total, 20);
  assert.equal(MECHANICS_PRESET_FROZEN_IDS.length, 20);
  assert.equal(MECHANICS_PRESET_EXTENSION_CORE_BASELINE.manifestVersion, MECHANICS_PRESET_FREEZE_MANIFEST_VERSION);
  assert.equal(MECHANICS_PRESET_EXTENSION_CORE_BASELINE.presetCount, 20);
});
check("Core freeze excludes additive extension presets", () => {
  for (const id of MECHANICS_PRESET_EXTENSION_FROZEN_IDS) {
    assert.equal(MECHANICS_PRESET_FROZEN_IDS.includes(id), false, id);
  }
  for (const id of MECHANICS_PRESET_EXTENSION_LEGACY_IDS) {
    assert.equal(MECHANICS_PRESET_FROZEN_IDS.includes(id), false, id);
  }
});
check("Live extension catalog closes at twenty-two presets", () => {
  assert.deepEqual(MECHANICS_PRESET_EXTENSION_FROZEN_COUNTS, {
    core: 20,
    extension: 2,
    liveLibrary: 22,
  });
  assert.equal(liveManifest.presetCount, 22);
  assert.equal(liveCatalog.length, 22);
});
check("Live catalog contains both frozen extension identities exactly once", () => {
  const ids = liveCatalog.map((entry) => entry.id);
  for (const id of MECHANICS_PRESET_EXTENSION_FROZEN_IDS) {
    assert.equal(ids.filter((candidate) => candidate === id).length, 1, id);
  }
});
check("Character advancement preset and aliases remain frozen", () => {
  assert.equal(
    MECHANICS_CHARACTER_ADVANCEMENT_PRESET_VERSION,
    MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS.characterAdvancementPreset
  );
  assert.equal(
    MECHANICS_CHARACTER_ADVANCEMENT_PRESET_ID,
    MECHANICS_PRESET_EXTENSION_FROZEN_IDS[0]
  );
  assert.equal(
    MECHANICS_CHARACTER_ADVANCEMENT_READOUT_PRESET_ID,
    MECHANICS_PRESET_EXTENSION_FROZEN_IDS[1]
  );
  assert.deepEqual(
    [...MECHANICS_CHARACTER_ADVANCEMENT_LEGACY_PRESET_IDS],
    [...MECHANICS_PRESET_EXTENSION_LEGACY_IDS]
  );
});
check("Extension contract versions remain frozen", () => {
  assert.equal(
    MECHANICS_PROGRESSION_PROFILE_VERSION,
    MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS.progressionProfile
  );
  assert.equal(
    MECHANICS_EFFECT_VALUE_BINDING_VERSION,
    MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS.effectValueBinding
  );
  assert.equal(
    MECHANICS_COMMAND_STATE_READOUT_VERSION,
    MECHANICS_PRESET_EXTENSION_FROZEN_CONTRACTS.commandStateReadout
  );
});
check("Generated progression curve retains frozen thresholds", () => {
  assert.equal(progressionTable.length, 20);
  assert.equal(progressionTable.find((row) => row.rank === 2)?.totalRequirement, 300);
  assert.equal(progressionTable.find((row) => row.rank === 5)?.totalRequirement, 4200);
  assert.equal(progressionTable.at(-1)?.totalRequirement, 361400);
  assert.equal(resolveMechanicsProgressionRank(progressionProfile, 4199).rank, 4);
  assert.equal(resolveMechanicsProgressionRank(progressionProfile, 4200).rank, 5);
});
check("Derived proficiency remains rank-interval based", () => {
  const rule = progressionProfile.derivedValues.find(
    (entry) => entry.id === "proficiency_bonus"
  );
  assert.ok(rule);
  assert.equal(resolveMechanicsProgressionDerivedValue(rule, 1, 1), 2);
  assert.equal(resolveMechanicsProgressionDerivedValue(rule, 5, 1), 3);
  assert.equal(resolveMechanicsProgressionDerivedValue(rule, 20, 1), 6);
});
check("Advancement module retains four command surfaces", () => {
  const commands = advancementModule.instanceData.commands;
  assert.equal(commands.length, 4);
  const tokens = commands.flatMap(commandTokens);
  for (const token of [
    "award_xp",
    "grant_xp",
    "add_xp",
    "progress",
    "level",
    "xp_status",
    "advancement_status",
    "advancement_on",
    "enable_advancement",
    "advancement_off",
    "disable_advancement",
  ]) {
    assert.equal(tokens.includes(token), true, token);
  }
});
check("Readout add-on remains query-only and merge-safe", () => {
  assert.equal(readoutModule.instanceData.commands.length, 1);
  const command = readoutModule.instanceData.commands[0];
  assert.equal(command.invocation.command, "progress");
  assert.equal(command.presentation.mode, "QUERY");
  assert.equal(command.effects.length, 0);
  assert.equal(command.composition.mechanicsSteps.length, 0);
  assert.deepEqual(readoutModule.instanceData.defaults, {
    flags: [],
    counters: [],
    stages: [],
  });
});
check("Runtime applicator retains pending-patch-aware progression reconciliation", () => {
  const source = readRepo(
    "services/api/src/services/chat/mechanics/mechanicsApplicatorService.js"
  );
  assert.match(source, /mechanics_applicator_v1_2/);
  assert.match(source, /function applyProgressionReconcileEffect/);
  assert.match(source, /pendingPatch:\s*pendingMechanicsPatch/);
  assert.match(source, /resolveMechanicsProgressionRank\(profile, sourceValue\)/);
  assert.match(source, /profile\.derivedValues/);
  assert.match(source, /advancementDelta/);
});
check("Progression service contract and modes remain frozen", () => {
  const source = readRepo(
    "services/api/src/services/chat/mechanics/mechanicsProgressionProfileService.js"
  );
  assert.match(source, /mechanics_progression_profile_service_v1/);
  assert.match(source, /GENERATED_CURVE/);
  assert.match(source, /GENERATED_CURVE_WITH_OVERRIDES/);
  assert.match(source, /EXPLICIT_TABLE/);
  assert.match(source, /resolveMechanicsProgressionRank/);
});
check("Preset Library retains the MC7X.2.3 single-scroll baseline", () => {
  const view = readMechanics(
    "mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx"
  );
  const diagnostic = readMechanics(
    "mechanics-preset-application/mc7PresetLibraryLayoutDiagnostics.mjs"
  );
  assert.equal(MECHANICS_PRESET_EXTENSION_FROZEN_UI_BASELINES.presetLibrary, "MC7X.2.3");
  assert.match(view, /crestfall-preset-library-scroll/);
  assert.match(view, /gridTemplateRows:\s*"auto minmax\(0, 1fr\) auto"/);
  assert.match(view, /overflowY:\s*"scroll"/);
  assert.match(view, /scrollbarGutter:\s*"stable"/);
  assert.match(view, /scrollbar-width:\s*auto !important/);
  assert.match(diagnostic, /mc7_preset_library_layout_diagnostics_v4/);
});
check("Frontend extension surfaces remain free of product-data bypasses", () => {
  for (const relativePath of [
    "mechanics-presets/mechanicsCharacterAdvancementPreset.js",
    "mechanicsProgressionProfileBuilder.js",
    "mechanicsCommandStateReadoutBuilder.js",
    "mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx",
  ]) {
    const source = readMechanics(relativePath);
    assert.doesNotMatch(
      source,
      /createClient\(|\bsupabase\b|PostGraphile|services-api|\bfetch\s*\(/i,
      relativePath
    );
  }
});
check("Final closeout report records the frozen transition to MC8", () => {
  const source = readMechanics("mechanics-presets/MC7_FINAL_CLOSEOUT_REPORT.md");
  assert.match(source, /mechanics_preset_extension_freeze_manifest_v1/);
  assert.match(source, /20 frozen core MC7 presets/);
  assert.match(source, /module\.character_advancement_curve\.v1/);
  assert.match(source, /module\.character_advancement_readout\.v1/);
  assert.match(source, /MC8 — Regression, Migration, Diagnostics, and Production Hardening/);
});
check("Manifest names the complete aggregate diagnostic gate", () => {
  assert.deepEqual(extensionManifest.diagnostics, [
    ...MECHANICS_PRESET_EXTENSION_REQUIRED_DIAGNOSTICS,
  ]);
  assert.equal(extensionManifest.diagnostics.length, 5);
});

for (const relativePath of MECHANICS_PRESET_EXTENSION_REQUIRED_DIAGNOSTICS) {
  check(`Aggregate diagnostic passes: ${relativePath}`, () => {
    runDiagnostic(relativePath);
  });
}

console.log("Crestfall mc7_final_closeout_audit_v2");
console.log(`Node ${process.version}`);
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

console.log("");
console.log(`Summary: ${passed} passed, ${failed} failed, ${checks.length} total`);
console.log(`Elapsed: ${Date.now() - started} ms`);
if (failed) process.exitCode = 1;
