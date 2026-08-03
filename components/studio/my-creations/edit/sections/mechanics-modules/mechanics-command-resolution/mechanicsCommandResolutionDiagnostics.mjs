import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { MECHANICS_COMMAND_RESOLUTION_LOOM_CONTRACT } from "./MechanicsCommandResolution.contract.js";
import {
  MECHANICS_COMMAND_RESOLUTION_FIXTURES,
} from "./mechanicsCommandResolution.fixtures.js";
import {
  COMMAND_RESOLUTION_MODES,
  buildMechanicsCommandResolutionReference,
  formatMechanicsCommandResolutionSummary,
  normalizeMechanicsCommandResolution,
} from "./mechanicsCommandResolutionNormalization.js";
import {
  addMechanicsCommandResolutionModifier,
  addMechanicsCommandResolutionModifierSource,
  patchMechanicsCommandOpposedResolution,
  patchMechanicsCommandResolution,
  patchMechanicsCommandResolutionModifierSource,
} from "./mechanicsCommandResolutionOperations.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const fixture = (id) =>
  MECHANICS_COMMAND_RESOLUTION_FIXTURES.find((item) => item.id === id);

test("M6 contract freezes command resolution ownership", () => {
  assert.equal(
    MECHANICS_COMMAND_RESOLUTION_LOOM_CONTRACT.id,
    "crestfall.loom.mechanics-command-resolution.v1"
  );
  assert.equal(
    MECHANICS_COMMAND_RESOLUTION_LOOM_CONTRACT.storagePath,
    "instanceData.commands[].resolution"
  );
  assert.deepEqual(COMMAND_RESOLUTION_MODES, [
    "NO_ROLL_DETERMINISTIC",
    "THRESHOLD_DIE",
    "OPPOSED_DIE",
  ]);
});

test("fixture inventory covers automatic, threshold, opposed, legacy, and recovery", () => {
  assert.deepEqual(
    MECHANICS_COMMAND_RESOLUTION_FIXTURES.map((item) => item.id),
    ["NO_ROLL", "THRESHOLD", "OPPOSED", "LEGACY", "MALFORMED"]
  );
});

test("resolution normalization is idempotent", () => {
  for (const item of MECHANICS_COMMAND_RESOLUTION_FIXTURES) {
    const once = normalizeMechanicsCommandResolution(item.resolution);
    const twice = normalizeMechanicsCommandResolution(once);
    assert.deepEqual(twice, once, item.id);
  }
});

test("legacy aliases project into canonical opposed resolution", () => {
  const legacy = normalizeMechanicsCommandResolution(fixture("LEGACY").resolution);
  assert.equal(legacy.version, "mechanics_command_resolution_v6");
  assert.equal(legacy.mode, "OPPOSED_DIE");
  assert.equal(legacy.rollMode, "ADVANTAGE");
  assert.deepEqual(legacy.die, { number: 2, size: 10, count: 2, sides: 10 });
  assert.equal(legacy.opposed.label, "Legacy Opposition");
  assert.equal(legacy.opposed.rollMode, "DISADVANTAGE");
  assert.equal(legacy.opposed.tiePolicy, "OPPOSITION_WINS");
  assert.equal(legacy.degreeOfSuccess.criticalSuccessMargin, 7);
  assert.equal(legacy.degreeOfSuccess.fumbleMargin, -7);
});

test("unknown resolution metadata survives normalization and patching", () => {
  const source = normalizeMechanicsCommandResolution(fixture("THRESHOLD").resolution);
  const patched = patchMechanicsCommandResolution(source, { targetNumber: 17 });
  assert.deepEqual(patched.futureResolutionMetadata, undefined);
  assert.deepEqual(patched.degreeOfSuccess.futureDegreeMetadata, { retained: true });
  assert.deepEqual(patched.modifiers[0].futureModifierMetadata, { retained: true });
  assert.deepEqual(patched.modifierSources[0].futureSourceMetadata, { retained: true });
});

test("unknown root, opposed, die, and degree metadata are retained", () => {
  const source = normalizeMechanicsCommandResolution({
    mode: "OPPOSED_DIE",
    futureRootMetadata: { retained: true },
    die: { count: 1, sides: 20, futureDieMetadata: { retained: true } },
    opposed: {
      label: "Defense",
      futureOpposedMetadata: { retained: true },
      die: { count: 1, sides: 12, futureOpposedDieMetadata: { retained: true } },
    },
    degreeOfSuccess: {
      enabled: true,
      futureDegreeMetadata: { retained: true },
    },
  });
  assert.deepEqual(source.futureRootMetadata, { retained: true });
  assert.deepEqual(source.die.futureDieMetadata, { retained: true });
  assert.deepEqual(source.opposed.futureOpposedMetadata, { retained: true });
  assert.deepEqual(source.opposed.die.futureOpposedDieMetadata, { retained: true });
  assert.deepEqual(source.degreeOfSuccess.futureDegreeMetadata, { retained: true });
});

test("modifier and authoritative-source operations preserve neighboring resolution data", () => {
  const source = normalizeMechanicsCommandResolution(fixture("THRESHOLD").resolution);
  const withModifier = addMechanicsCommandResolutionModifier(source, "ACTOR");
  assert.equal(withModifier.modifiers.length, source.modifiers.length + 1);
  assert.equal(withModifier.targetNumber, 14);
  const withSource = addMechanicsCommandResolutionModifierSource(
    withModifier,
    "ACTOR"
  );
  assert.equal(withSource.modifierSources.length, source.modifierSources.length + 1);
  assert.deepEqual(withSource.degreeOfSuccess.futureDegreeMetadata, { retained: true });
});

test("authoritative source patching normalizes divisor, bounds, and aliases", () => {
  const source = normalizeMechanicsCommandResolution(fixture("THRESHOLD").resolution);
  const patched = patchMechanicsCommandResolutionModifierSource(
    source,
    "ACTOR",
    0,
    {
      divisor: 0,
      minModifier: 10,
      maxModifier: -10,
      type: "TRACKER_VALUE",
    }
  );
  assert.equal(patched.modifierSources[0].divisor, 1);
  assert.equal(patched.modifierSources[0].minModifier, -10);
  assert.equal(patched.modifierSources[0].maxModifier, 10);
  assert.equal(patched.modifierSources[0].type, "MECHANICS_VALUE");
});

test("opposed patching preserves root and opposition metadata", () => {
  const source = normalizeMechanicsCommandResolution(fixture("OPPOSED").resolution);
  const patched = patchMechanicsCommandOpposedResolution(source, {
    tiePolicy: "OPPOSITION_WINS",
    label: "Guard",
  });
  assert.equal(patched.opposed.label, "Guard");
  assert.equal(patched.opposed.tiePolicy, "OPPOSITION_WINS");
  assert.deepEqual(patched.opposed.futureOpposedMetadata, { retained: true });
});

test("reference configurations replace only the resolution object", () => {
  const reference = buildMechanicsCommandResolutionReference("DEGREE_D20");
  assert.equal(reference.mode, "THRESHOLD_DIE");
  assert.equal(reference.degreeOfSuccess.enabled, true);
  assert.equal(reference.degreeOfSuccess.criticalSuccessMargin, 5);
  assert.equal(formatMechanicsCommandResolutionSummary(reference), "1d20 ≥ 11");
});

test("malformed resolution recovers to a safe deterministic shape", () => {
  const malformed = normalizeMechanicsCommandResolution(
    fixture("MALFORMED").resolution
  );
  assert.equal(malformed.mode, "NO_ROLL_DETERMINISTIC");
  assert.equal(malformed.rollMode, "NORMAL");
  assert.deepEqual(malformed.modifiers, []);
  assert.equal(malformed.degreeOfSuccess.enabled, false);
});

test("portable resolution View owns presentation without application imports", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/MechanicsCommandResolution.view.jsx"
  );
  assert.match(view, /Reference Configuration/);
  assert.match(view, /Actor Authoritative Modifier Sources/);
  assert.match(view, /Opposition Check/);
  assert.match(view, /degree-of-success margin bands/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /MechanicsModuleFieldsSection/);
});

test("the main Mechanics parent mounts M6 and no longer owns resolution UI", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  assert.match(parent, /import MechanicsCommandResolution/);
  assert.match(parent, /<MechanicsCommandResolution/);
  assert.match(parent, /normalizeMechanicsCommandResolution/);
  assert.doesNotMatch(parent, /function ResolutionModifierList/);
  assert.doesNotMatch(parent, /function ResolutionModifierSourceCard/);
  assert.doesNotMatch(parent, /Reference Configuration/);
  assert.doesNotMatch(parent, /function patchResolution/);
});

test("M6 package includes contract, View, ViewModel, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsCommandResolution.contract.js",
    "MechanicsCommandResolution.jsx",
    "MechanicsCommandResolution.view.jsx",
    "useMechanicsCommandResolutionViewModel.js",
    "mechanicsCommandResolutionNormalization.js",
    "mechanicsCommandResolutionOperations.js",
    "mechanicsCommandResolution.fixtures.js",
    "mechanicsCommandResolutionDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-command-resolution/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m6"] || "",
    /mechanicsCommandResolutionDiagnostics\.mjs/
  );
});
