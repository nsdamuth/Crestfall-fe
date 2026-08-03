import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { MECHANICS_COMMAND_EFFECTS_FIXTURES } from "./mechanicsCommandEffects.fixtures.js";
import {
  countTargetBoundMechanicsEffects,
  getMechanicsEffectNumericArgumentOptions,
  getMechanicsEffectTargetArgumentOptions,
  normalizeMechanicsCommandEffect,
  normalizeMechanicsCommandEffects,
} from "./mechanicsCommandEffectsNormalization.js";
import {
  addMechanicsCommandEffect,
  patchMechanicsCommandEffect,
  removeMechanicsCommandEffect,
} from "./mechanicsCommandEffectsOperations.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const mechanicsDir = path.resolve(currentDir, "..");
const repoRoot = path.resolve(currentDir, "../../../../../../..");
const read = (file) => fs.readFileSync(path.join(repoRoot, file), "utf8");

const roundTrip = MECHANICS_COMMAND_EFFECTS_FIXTURES[0];

test("M5B fixture inventory covers round-trip, costs, progression, legacy, and recovery", () => {
  assert.equal(MECHANICS_COMMAND_EFFECTS_FIXTURES.length, 5);
  assert.deepEqual(
    MECHANICS_COMMAND_EFFECTS_FIXTURES.map((fixture) => fixture.id),
    ["m5b-round-trip", "attempt-cost", "progression", "legacy-aliases", "malformed"]
  );
});

test("effect normalization is idempotent", () => {
  const once = normalizeMechanicsCommandEffects(roundTrip.effects);
  const twice = normalizeMechanicsCommandEffects(once);
  assert.deepEqual(twice, once);
});

test("the saved M5B sample retains fixed and argument-bound effects", () => {
  const effects = normalizeMechanicsCommandEffects(roundTrip.effects);
  assert.equal(effects.length, 2);
  assert.equal(effects[0].targetBinding.mode, "ARGUMENT");
  assert.equal(effects[0].valueBinding.mode, "ARGUMENT");
  assert.equal(effects[0].valueBinding.argumentName, "amount");
  assert.equal(effects[1].targetBinding.mode, "FIXED");
  assert.equal(effects[1].type, "FLAG_SET");
});

test("target and numeric argument options remain type-specific", () => {
  assert.deepEqual(
    getMechanicsEffectTargetArgumentOptions(roundTrip.invocation).map((item) => item.name),
    ["target"]
  );
  assert.deepEqual(
    getMechanicsEffectNumericArgumentOptions(roundTrip.invocation).map((item) => item.name),
    ["amount"]
  );
});

test("legacy aliases and unknown metadata survive normalization", () => {
  const effect = normalizeMechanicsCommandEffect(
    MECHANICS_COMMAND_EFFECTS_FIXTURES[3].effects[0]
  );
  assert.equal(effect.targetId, "affection");
  assert.equal(effect.targetBinding.mode, "ARGUMENT");
  assert.equal(effect.targetBinding.argumentName, "target");
  assert.deepEqual(effect.futureEffectMetadata, { retained: true });
});

test("value-binding unknown metadata survives visual normalization", () => {
  const effect = normalizeMechanicsCommandEffect({
    id: "future_binding",
    type: "COUNTER_SET",
    valueBinding: {
      mode: "ARGUMENT",
      argumentName: "amount",
      futureBindingMetadata: { retained: true },
    },
  });
  assert.deepEqual(effect.valueBinding.futureBindingMetadata, { retained: true });
});

test("target-binding unknown metadata survives visual normalization", () => {
  const effect = normalizeMechanicsCommandEffect({
    id: "future_target",
    type: "METER_DELTA",
    targetBinding: {
      mode: "ARGUMENT",
      argumentName: "target",
      futureTargetMetadata: { retained: true },
    },
  });
  assert.deepEqual(effect.targetBinding.futureTargetMetadata, { retained: true });
});

test("add, patch, and remove operations preserve ordering and unrelated metadata", () => {
  const added = addMechanicsCommandEffect(roundTrip.effects, {
    type: "FLAG_SET",
    idPrefix: "effect",
  });
  assert.equal(added.length, 3);
  const patched = patchMechanicsCommandEffect(added, 0, { reason: "Changed" });
  assert.equal(patched[0].reason, "Changed");
  assert.equal(patched[1].id, "set_effect_test_flag");
  const removed = removeMechanicsCommandEffect(patched, 1);
  assert.deepEqual(removed.map((item) => item.id), ["apply_target_meter", "effect_3"]);
});

test("target-bound summary counts extracted effects", () => {
  assert.equal(countTargetBoundMechanicsEffects(roundTrip.effects), 1);
});

test("progression effects retain the shared progression profile boundary", () => {
  const effect = normalizeMechanicsCommandEffect(
    MECHANICS_COMMAND_EFFECTS_FIXTURES[2].effects[0]
  );
  assert.equal(effect.type, "PROGRESSION_RECONCILE");
  assert.equal(effect.targetId, effect.progressionProfile.rankValueId);
  assert.equal(effect.valueBinding.mode, "FIXED");
});

test("malformed effects recover to a safe canonical effect", () => {
  const effect = normalizeMechanicsCommandEffect(
    MECHANICS_COMMAND_EFFECTS_FIXTURES[4].effects[0]
  );
  assert.equal(effect.id, "effect_1");
  assert.equal(effect.type, "FLAG_SET");
  assert.equal(effect.targetBinding.mode, "FIXED");
});

test("the parent mounts extracted effect sections and no longer defines effect field editors", () => {
  const parent = read("components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx");
  assert.match(parent, /MechanicsCommandEffects/);
  assert.match(parent, /MechanicsCommandEffectCard/);
  assert.doesNotMatch(parent, /function EffectValueFields/);
  assert.doesNotMatch(parent, /function EffectTargetBindingFields/);
  assert.doesNotMatch(parent, /function CommandOutcomeEffectCard/);
  assert.doesNotMatch(parent, /function normalizeEffectForType/);
});

test("M5B package includes contract, view, ViewModel, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsCommandEffects.contract.js",
    "MechanicsCommandEffects.jsx",
    "MechanicsCommandEffects.view.jsx",
    "MechanicsCommandEffectCard.view.jsx",
    "useMechanicsCommandEffectsViewModel.js",
    "mechanicsCommandEffectsNormalization.js",
    "mechanicsCommandEffectsOperations.js",
    "mechanicsCommandEffects.fixtures.js",
    "mechanicsCommandEffectsDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  const preview = read("app/dev/ui-preview/mechanics-command-effects/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
});
