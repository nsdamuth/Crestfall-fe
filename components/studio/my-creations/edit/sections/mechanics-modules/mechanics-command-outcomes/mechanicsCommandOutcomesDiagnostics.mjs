import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  COMMAND_OUTCOME_EFFECT_MODES,
  COMMAND_RESOLUTION_OUTCOMES,
  MECHANICS_COMMAND_OUTCOMES_CONTRACT_VERSION,
} from "./MechanicsCommandOutcomes.contract.js";
import { MECHANICS_COMMAND_OUTCOME_FIXTURES } from "./mechanicsCommandOutcomes.fixtures.js";
import {
  countCustomCommandOutcomeBranches,
  getDefaultCommandOutcomeEffectMode,
  listCommandOutcomeEffects,
  normalizeCommandOutcomeBranch,
  normalizeCommandOutcomes,
} from "./mechanicsCommandOutcomesNormalization.js";
import { createMechanicsCommandOutcomesController } from "./mechanicsCommandOutcomesOperations.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function normalizeEffect(effect, requestedType) {
  const source = effect && typeof effect === "object" ? effect : {};
  return {
    ...source,
    type: requestedType || source.type || "FLAG_SET",
  };
}

test("M4B package contains the complete LOOM support surface", () => {
  const required = [
    "MechanicsCommandOutcomes.jsx",
    "MechanicsCommandOutcomes.view.jsx",
    "MechanicsCommandOutcomes.contract.js",
    "useMechanicsCommandOutcomesViewModel.js",
    "mechanicsCommandOutcomesNormalization.js",
    "mechanicsCommandOutcomesOperations.js",
    "mechanicsCommandOutcomes.fixtures.js",
    "README.md",
  ];

  for (const file of required) {
    assert.equal(exists(path.join(path.relative(repoRoot, currentDir), file)), true, file);
  }
});

test("the outcome contract freezes branch order and effect modes", () => {
  assert.equal(
    MECHANICS_COMMAND_OUTCOMES_CONTRACT_VERSION,
    "crestfall.loom.mechanics-command-outcomes.v1"
  );
  assert.deepEqual(COMMAND_RESOLUTION_OUTCOMES, [
    "CRITICAL_SUCCESS",
    "SUCCESS",
    "FAILURE",
    "FUMBLE",
  ]);
  assert.deepEqual(COMMAND_OUTCOME_EFFECT_MODES, [
    "INHERIT",
    "REPLACE",
    "APPEND",
    "NONE",
  ]);
});

test("default outcome modes preserve backward-compatible success inheritance", () => {
  assert.equal(getDefaultCommandOutcomeEffectMode("CRITICAL_SUCCESS"), "INHERIT");
  assert.equal(getDefaultCommandOutcomeEffectMode("SUCCESS"), "INHERIT");
  assert.equal(getDefaultCommandOutcomeEffectMode("FAILURE"), "NONE");
  assert.equal(getDefaultCommandOutcomeEffectMode("FUMBLE"), "NONE");
});

test("legacy lowercase and camel-case branches normalize without metadata loss", () => {
  const fixture = MECHANICS_COMMAND_OUTCOME_FIXTURES.find(
    (item) => item.id === "legacy-aliases"
  );
  const normalized = normalizeCommandOutcomes(fixture.outcomes, {
    normalizeEffect,
  });

  assert.equal(normalized.CRITICAL_SUCCESS.effectMode, "APPEND");
  assert.equal(normalized.CRITICAL_SUCCESS.summary, "Legacy camel-case branch.");
  assert.equal(normalized.CRITICAL_SUCCESS.futureBranchMetadata.retained, true);
  assert.equal(normalized.FAILURE.effectMode, "NONE");
  assert.equal(normalized.FAILURE.summary, "Legacy lowercase branch.");
  assert.equal(normalized.futureOutcomeMetadata.retained, true);
});

test("malformed branches recover to safe canonical values", () => {
  const fixture = MECHANICS_COMMAND_OUTCOME_FIXTURES.find(
    (item) => item.id === "malformed-recoverable"
  );
  const normalized = normalizeCommandOutcomes(fixture.outcomes, {
    normalizeEffect,
  });

  assert.equal(normalized.version, "mechanics_command_outcomes_v1");
  assert.equal(normalized.SUCCESS.effectMode, "INHERIT");
  assert.deepEqual(normalized.SUCCESS.effects, []);
  assert.equal(normalized.SUCCESS.summary, "");
  assert.equal(normalized.FUMBLE.effectMode, "NONE");
});

test("effects make an unspecified branch default to REPLACE", () => {
  const branch = normalizeCommandOutcomeBranch(
    {
      effects: [{ id: "effect_1", type: "FLAG_SET" }],
    },
    "FAILURE",
    { normalizeEffect }
  );

  assert.equal(branch.effectMode, "REPLACE");
  assert.equal(branch.effects.length, 1);
});

test("custom branch counting and effect listing share canonical normalization", () => {
  const fixture = MECHANICS_COMMAND_OUTCOME_FIXTURES.find(
    (item) => item.id === "custom-branches"
  );

  assert.equal(
    countCustomCommandOutcomeBranches(fixture.outcomes, { normalizeEffect }),
    2
  );
  assert.equal(
    listCommandOutcomeEffects(fixture.outcomes, { normalizeEffect }).length,
    2
  );
});

test("outcome operations patch only the outcomes field on the selected command", () => {
  const patches = [];
  const controller = createMechanicsCommandOutcomesController({
    outcomes: {},
    commandIndex: 2,
    onPatchCommand: (index, patch) => patches.push({ index, patch }),
    normalizeEffect,
  });

  controller.patchOutcome("FAILURE", {
    effectMode: "NONE",
    summary: "No effect on failure.",
  });

  assert.equal(patches.length, 1);
  assert.equal(patches[0].index, 2);
  assert.deepEqual(Object.keys(patches[0].patch), ["outcomes"]);
  assert.equal(patches[0].patch.outcomes.FAILURE.summary, "No effect on failure.");
});

test("outcome effect add, patch, and remove preserve branch metadata", () => {
  const patches = [];
  const outcomes = {
    SUCCESS: {
      effectMode: "APPEND",
      futureBranchMetadata: { retained: true },
      effects: [],
    },
  };
  const controller = createMechanicsCommandOutcomesController({
    outcomes,
    commandIndex: 0,
    onPatchCommand: (_index, patch) => patches.push(patch),
    normalizeEffect,
  });

  controller.addOutcomeEffect("SUCCESS");
  const added = patches.at(-1).outcomes;
  assert.equal(added.SUCCESS.effects.length, 1);
  assert.equal(added.SUCCESS.futureBranchMetadata.retained, true);

  const patchController = createMechanicsCommandOutcomesController({
    outcomes: added,
    commandIndex: 0,
    onPatchCommand: (_index, patch) => patches.push(patch),
    normalizeEffect,
  });
  patchController.patchOutcomeEffect("SUCCESS", 0, { targetId: "ready" });
  assert.equal(patches.at(-1).outcomes.SUCCESS.effects[0].targetId, "ready");

  const removeController = createMechanicsCommandOutcomesController({
    outcomes: patches.at(-1).outcomes,
    commandIndex: 0,
    onPatchCommand: (_index, patch) => patches.push(patch),
    normalizeEffect,
  });
  removeController.removeOutcomeEffect("SUCCESS", 0);
  assert.equal(patches.at(-1).outcomes.SUCCESS.effects.length, 0);
});

test("the portable View owns branch shape but receives effect authoring by injection", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-outcomes/MechanicsCommandOutcomes.view.jsx"
  );

  assert.match(view, /COMMAND_OUTCOME_EFFECT_MODES/);
  assert.match(view, /EffectCardComponent/);
  assert.match(view, /Outcome Summary/);
  assert.doesNotMatch(view, /CommandOutcomeEffectCard/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
});

test("the main Mechanics parent mounts M4B and no longer owns branch-shape helpers", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );

  assert.match(parent, /import MechanicsCommandOutcomes/);
  assert.match(parent, /<MechanicsCommandOutcomes/);
  assert.match(parent, /EffectCardComponent=\{MechanicsCommandEffectCard\}/);
  assert.doesNotMatch(parent, /function normalizeCommandOutcomes/);
  assert.doesNotMatch(parent, /function normalizeCommandOutcomeBranch/);
  assert.doesNotMatch(parent, /function patchOutcome\(/);
  assert.doesNotMatch(parent, /Conditional Outcome Effects/);
});

test("M4B preview is protected and the package script is registered", () => {
  const preview = read(
    "app/dev/ui-preview/mechanics-command-outcomes/page.jsx"
  );
  const packageJson = JSON.parse(read("package.json"));

  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m4b"] || "",
    /mechanicsCommandOutcomesDiagnostics\.mjs/
  );
});
