import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  ACTOR_MECHANICS_COMMAND_REQUIREMENT_TYPES,
  COMMAND_PROGRESSION_ENFORCEMENTS,
  COMMAND_REQUIREMENT_OPERATORS,
  COMMAND_REQUIREMENT_TYPES,
  MECHANICS_COMMAND_REQUIREMENTS_CONTRACT,
} from "./MechanicsCommandRequirements.contract.js";
import { mechanicsCommandRequirementsFixtures } from "./mechanicsCommandRequirements.fixtures.js";
import {
  getDefaultActorMechanicsRequirementBindingId,
  getDefaultCommandRequirementOperator,
  isActorMechanicsCommandRequirementType,
  isProgressionCommandRequirementType,
  isTargetCommandRequirementType,
  normalizeMechanicsCommandRequirement,
  normalizeMechanicsRequirementReferenceId,
  normalizeMechanicsCommandRequirements,
  normalizeProgressionRequirementTierIds,
  summarizeMechanicsCommandRequirements,
} from "./mechanicsCommandRequirementsNormalization.js";
import { createMechanicsCommandRequirementsController } from "./mechanicsCommandRequirementsOperations.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

test("M5A package contains the complete LOOM support surface", () => {
  const required = [
    "MechanicsCommandRequirements.jsx",
    "MechanicsCommandRequirements.view.jsx",
    "MechanicsCommandRequirements.contract.js",
    "useMechanicsCommandRequirementsViewModel.js",
    "mechanicsCommandRequirementsNormalization.js",
    "mechanicsCommandRequirementsOperations.js",
    "mechanicsCommandRequirements.fixtures.js",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(exists(path.join(path.relative(repoRoot, currentDir), file)), true, file);
  }
});

test("the requirements contract freezes types, operators, and progression enforcement", () => {
  assert.equal(
    MECHANICS_COMMAND_REQUIREMENTS_CONTRACT,
    "crestfall.loom.mechanics-command-requirements.v1"
  );
  assert.equal(COMMAND_REQUIREMENT_TYPES.length, 19);
  assert.deepEqual(COMMAND_PROGRESSION_ENFORCEMENTS, ["ADVISORY", "HARD_LOCK"]);
  assert.deepEqual(COMMAND_REQUIREMENT_OPERATORS, [
    "EQ", "NEQ", "GT", "GTE", "LT", "LTE", "TRUTHY", "FALSY",
  ]);
});

test("ordinary requirement defaults remain compatible", () => {
  assert.equal(getDefaultCommandRequirementOperator("FLAG"), "EQ");
  assert.equal(getDefaultCommandRequirementOperator("METER"), "GTE");
  assert.equal(getDefaultCommandRequirementOperator("STAGE"), "EQ");
  const normalized = normalizeMechanicsCommandRequirement({ type: "METER" }, 0);
  assert.equal(normalized.id, "requirement_1");
  assert.equal(normalized.targetId, "");
  assert.equal(normalized.value, 1);
  assert.equal(normalized.enabled, true);
});

test("target requirements bind arguments and do not retain mechanics state IDs", () => {
  assert.equal(isTargetCommandRequirementType("TARGET_PRESENT"), true);
  const normalized = normalizeMechanicsCommandRequirement({
    id: "present",
    type: "TARGET_PRESENT",
    target_id: "should_clear",
    target_argument: "Target Person",
  });
  assert.equal(normalized.targetId, "");
  assert.equal(normalized.argumentName, "target_person");
  assert.equal(normalized.operator, "TRUTHY");
});

test("progression requirement aliases and enforcement normalize canonically", () => {
  const fixture = mechanicsCommandRequirementsFixtures.find((item) => item.id === "legacy");
  const normalized = normalizeMechanicsCommandRequirements(fixture.requirements);
  assert.equal(normalized[0].type, "PROGRESSION_MINIMUM_LEVEL");
  assert.equal(normalized[0].targetId, "progression");
  assert.equal(normalized[0].value, 3);
  assert.equal(normalized[0].enforcement, "HARD_LOCK");
  assert.equal(normalized[0].message, "Reach level 3.");
  assert.equal(normalized[1].enforcement, "ADVISORY");
  assert.deepEqual(normalized[1].value, ["tier.veteran", "tier.master"]);
});

test("Progression tier requirements use the shared authoring normalizer", () => {
  assert.deepEqual(
    normalizeProgressionRequirementTierIds(
      " Tier Novice, tier.veteran, Tier Novice "
    ),
    ["tier_novice", "tier.veteran"]
  );
});

test("all five Progression requirement types are classified", () => {
  for (const type of [
    "PROGRESSION_MINIMUM_LEVEL",
    "PROGRESSION_MAXIMUM_LEVEL",
    "PROGRESSION_REQUIRED_TIER",
    "PROGRESSION_FORBIDDEN_TIER",
    "PROGRESSION_AT_MAXIMUM_LEVEL",
  ]) {
    assert.equal(isProgressionCommandRequirementType(type), true, type);
  }
});



test("Actor Mechanics requirement authoring preserves typed definition and binding IDs", () => {
  assert.equal(ACTOR_MECHANICS_COMMAND_REQUIREMENT_TYPES.length, 8);
  assert.equal(isActorMechanicsCommandRequirementType("STATS_POOLS_STAT_CURRENT"), true);
  assert.equal(isActorMechanicsCommandRequirementType("SKILLS_RANK"), true);
  assert.equal(isProgressionCommandRequirementType("STATS_POOLS_STAT_CURRENT"), false);
  assert.equal(isProgressionCommandRequirementType("SKILLS_RANK"), false);
  assert.equal(getDefaultActorMechanicsRequirementBindingId("STATS_POOLS_POOL_CURRENT"), "stats");
  assert.equal(getDefaultActorMechanicsRequirementBindingId("SKILLS_RANK"), "skills");
  assert.equal(normalizeMechanicsRequirementReferenceId(" Stat.Strength "), "stat.strength");

  const stat = normalizeMechanicsCommandRequirement({
    id: "strength",
    type: "STATS_POOLS_STAT_CURRENT",
    bindingId: "stats",
    targetId: "stat.strength",
    operator: "GTE",
    value: 40,
  });
  assert.equal(stat.targetId, "stat.strength");
  assert.equal(stat.bindingId, "stats");
  assert.equal(stat.operator, "GTE");
  assert.equal(stat.value, 40);

  const condition = normalizeMechanicsCommandRequirement({
    type: "STATS_POOLS_CONDITION_INACTIVE",
    targetId: "condition.injured",
  });
  assert.equal(condition.bindingId, "stats");
  assert.equal(condition.targetId, "condition.injured");
  assert.equal(condition.operator, "EQ");
  assert.equal(condition.value, true);
});

test("malformed inputs recover and disabled requirements remain excluded", () => {
  const fixture = mechanicsCommandRequirementsFixtures.find((item) => item.id === "recoverable");
  const normalized = normalizeMechanicsCommandRequirements(fixture.requirements);
  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].type, "FLAG");
  assert.equal(normalized[0].operator, "EQ");
  assert.equal(normalized[0].value, true);
  assert.equal(normalized[1].enabled, true);
});

test("requirement and future metadata survive normalization and visual patch operations", () => {
  const source = {
    id: "future",
    type: "PROGRESSION_REQUIRED_TIER",
    value: ["tier.veteran"],
    futureRequirementMetadata: { retained: true },
  };
  const normalized = normalizeMechanicsCommandRequirement(source);
  assert.equal(normalized.futureRequirementMetadata.retained, true);

  const patches = [];
  const controller = createMechanicsCommandRequirementsController({
    requirements: [normalized],
    commandIndex: 3,
    onPatchCommand: (index, patch) => patches.push({ index, patch }),
  });
  controller.patchRequirement(0, { message: "Updated" });
  assert.equal(patches[0].index, 3);
  assert.deepEqual(Object.keys(patches[0].patch), ["requirements"]);
  assert.equal(
    patches[0].patch.requirements[0].futureRequirementMetadata.retained,
    true
  );
});

test("add and remove operations mutate only the command requirements field", () => {
  const patches = [];
  const controller = createMechanicsCommandRequirementsController({
    requirements: [],
    commandIndex: 1,
    onPatchCommand: (_index, patch) => patches.push(patch),
  });
  controller.addRequirement();
  assert.equal(patches.at(-1).requirements.length, 1);
  assert.equal(patches.at(-1).requirements[0].type, "FLAG");

  const removeController = createMechanicsCommandRequirementsController({
    requirements: patches.at(-1).requirements,
    commandIndex: 1,
    onPatchCommand: (_index, patch) => patches.push(patch),
  });
  removeController.removeRequirement(0);
  assert.deepEqual(patches.at(-1).requirements, []);
});

test("requirement summaries distinguish Progression, hard locks, and target checks", () => {
  const summary = summarizeMechanicsCommandRequirements([
    { type: "TARGET_PRESENT" },
    { type: "PROGRESSION_MINIMUM_LEVEL", enforcement: "ADVISORY" },
    { type: "PROGRESSION_REQUIRED_TIER", enforcement: "HARD_LOCK", value: ["tier.master"] },
  ]);
  assert.deepEqual(summary, {
    total: 3,
    progression: 2,
    hardLocks: 1,
    targetRequirements: 1,
  });
});

test("the portable View owns requirement authoring without application imports", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements/MechanicsCommandRequirements.view.jsx"
  );
  assert.match(view, /Enforcement Policy/);
  assert.match(view, /Failure Message/);
  assert.match(view, /PROGRESSION_AT_MAXIMUM_LEVEL/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /MechanicsModuleFieldsSection/);
});

test("the main Mechanics parent mounts M5A and no longer owns requirement helpers", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  assert.match(parent, /import MechanicsCommandRequirements/);
  assert.match(parent, /<MechanicsCommandRequirements/);
  assert.match(parent, /normalizeMechanicsCommandRequirements/);
  assert.doesNotMatch(parent, /function normalizeCommandRequirement/);
  assert.doesNotMatch(parent, /function CommandRequirementCard/);
  assert.doesNotMatch(parent, /COMMAND_REQUIREMENT_TYPES/);
  assert.doesNotMatch(parent, /function addRequirement\(/);
});

test("M5A preview is protected and the package script is registered", () => {
  const preview = read("app/dev/ui-preview/mechanics-command-requirements/page.jsx");
  const packageJson = JSON.parse(read("package.json"));
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m5a"] || "",
    /mechanicsCommandRequirementsDiagnostics\.mjs/
  );
});
