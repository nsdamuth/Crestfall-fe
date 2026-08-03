import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_PRESET_APPLY_MODES,
  MECHANICS_PRESET_CATALOG_VERSION,
  MECHANICS_PRESET_CATEGORIES,
  MECHANICS_PRESET_DEFINITION_VERSION,
  MECHANICS_PRESET_PAYLOAD_VERSION,
  MECHANICS_PRESET_SCOPES,
  normalizeMechanicsPresetDefinition,
} from "./MechanicsPresetCatalog.contract.js";
import {
  buildMechanicsPresetPayload,
  formatMechanicsPresetDefinitionSummary,
  getMechanicsPresetCatalogManifest,
  getMechanicsPresetDefinition,
  listMechanicsPresetCatalog,
  summarizeMechanicsPresetCatalog,
} from "./mechanicsPresetCatalog.js";
import {
  MECHANICS_COMMAND_RESOLUTION_VERSION,
} from "../mechanicsCommandResolutionBuilder.js";
import {
  MECHANICS_COMMAND_COMPOSITION_VERSION,
} from "../mechanicsCommandCompositionBuilder.js";
import {
  validateMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mechanicsRoot = path.resolve(__dirname, "..");

const ALL_ARGUMENT_OPTIONS = [
  {
    name: "target",
    label: "Target",
    type: "CHARACTER_PRESENT",
    required: true,
    consumeRemaining: false,
    allowQuoted: true,
  },
  {
    name: "item",
    label: "Item",
    type: "ITEM_HELD",
    required: true,
    consumeRemaining: false,
    allowQuoted: true,
  },
  {
    name: "condition",
    label: "Condition",
    type: "TEXT",
    required: true,
    consumeRemaining: false,
    allowQuoted: true,
  },
  {
    name: "destination",
    label: "Destination",
    type: "LOCATION_CONNECTED",
    required: true,
    consumeRemaining: false,
    allowQuoted: true,
  },
  {
    name: "amount",
    label: "Amount",
    type: "NUMBER",
    required: false,
    consumeRemaining: false,
    allowQuoted: false,
    min: 1,
    max: 100,
  },
];

function makeCommand({ id = "preset_probe", resolution, composition } = {}) {
  return {
    id,
    label: "Preset Probe",
    commandContractVersion: "mechanics_command_contract_v1",
    invocation: {
      version: "mechanics_command_invocation_v1",
      enabled: true,
      command: id,
      prefixes: ["/"],
      aliases: [],
      arguments: ALL_ARGUMENT_OPTIONS,
      caseSensitive: false,
    },
    requirements: [],
    attemptEffects: [],
    resolution: resolution || {
      version: MECHANICS_COMMAND_RESOLUTION_VERSION,
      mode: "NO_ROLL_DETERMINISTIC",
    },
    outcomes: {},
    domainAction: {
      version: "mechanics_command_domain_action_v1",
      enabled: false,
      type: "NONE",
      applyOnOutcomes: [],
    },
    presentation: {
      mode: "MECHANICS_ACTION",
      continueNarrative: true,
      advanceTime: true,
      resultVisibility: "FULL",
    },
    triggers: [],
    effects: [],
    ...(composition ? { composition } : {}),
  };
}

function makeModule(command) {
  return {
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    priority: 65,
    tags: ["mc7", "preset"],
    contractVersion: "trackers_instance_data.v0_2",
    instanceData: {
      contractVersion: "trackers_instance_data.v0_2",
      trackers: [],
      commands: [command],
      guards: [],
      statusBlocks: [],
      defaults: {
        flags: [],
        counters: [],
        stages: [],
      },
    },
  };
}

function assertCatalogPayloadComplies(preset) {
  const built = buildMechanicsPresetPayload(preset.id, {
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  });

  assert.equal(built.ok, true, built.error?.message);

  const command =
    built.payload.scope === "COMMAND_RESOLUTION"
      ? makeCommand({ resolution: built.payload.value })
      : makeCommand({ composition: built.payload.value });
  const compliance = validateMechanicsModuleData(makeModule(command));

  assert.equal(
    compliance.valid,
    true,
    compliance.errors.map((issue) => `${issue.path}: ${issue.message}`).join("\n")
  );
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test("Preset catalog contract starts at v1", () => {
  assert.equal(MECHANICS_PRESET_CATALOG_VERSION, "mechanics_preset_catalog_v1");
});

test("Preset definition contract starts at v1", () => {
  assert.equal(MECHANICS_PRESET_DEFINITION_VERSION, "mechanics_preset_definition_v1");
});

test("Preset payload contract starts at v1", () => {
  assert.equal(MECHANICS_PRESET_PAYLOAD_VERSION, "mechanics_preset_payload_v1");
});

test("Preset scopes reserve block command and module levels", () => {
  assert.deepEqual(MECHANICS_PRESET_SCOPES, [
    "COMMAND_RESOLUTION",
    "COMMAND_COMPOSITION",
    "COMMAND",
    "MODULE",
  ]);
});

test("Preset categories reserve future MC7 command and module catalogs", () => {
  assert.ok(MECHANICS_PRESET_CATEGORIES.includes("COMMAND_STARTER"));
  assert.ok(MECHANICS_PRESET_CATEGORIES.includes("MODULE_STARTER"));
  assert.ok(MECHANICS_PRESET_CATEGORIES.includes("DOMAIN_WORKFLOW"));
  assert.ok(MECHANICS_PRESET_CATEGORIES.includes("PROGRESSION"));
});

test("Preset apply modes reserve replace and merge semantics", () => {
  assert.ok(MECHANICS_PRESET_APPLY_MODES.includes("REPLACE_BLOCK"));
  assert.ok(MECHANICS_PRESET_APPLY_MODES.includes("MERGE_COMMAND"));
  assert.ok(MECHANICS_PRESET_APPLY_MODES.includes("MERGE_MODULE"));
});

test("Catalog manifest advertises frozen MC5 and MC6 contracts", () => {
  const manifest = getMechanicsPresetCatalogManifest();
  assert.equal(manifest.resolutionVersion, "mechanics_command_resolution_v6");
  assert.equal(manifest.compositionVersion, "mechanics_command_composition_v1");
});

test("Catalog contains six resolution and four composition references", () => {
  const summary = summarizeMechanicsPresetCatalog({
    categories: ["RESOLUTION", "COMPOSITION"],
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  });
  assert.equal(summary.total, 10);
  assert.equal(summary.byCategory.RESOLUTION, 6);
  assert.equal(summary.byCategory.COMPOSITION, 4);
});

test("Every catalog ID is stable and unique", () => {
  const presets = getMechanicsPresetCatalogManifest().presets;
  assert.equal(new Set(presets.map((preset) => preset.id)).size, presets.length);
  presets.forEach((preset) => {
    assert.match(preset.id, /^(resolution|composition|command|module)\.[a-z0-9._:-]+\.v1$/);
  });
});

test("Every definition uses the v1 semantic contract", () => {
  getMechanicsPresetCatalogManifest().presets.forEach((preset) => {
    assert.equal(preset.version, MECHANICS_PRESET_DEFINITION_VERSION);
    assert.equal(preset.revision, 1);
    assert.equal(preset.implementation.status, "READY");
    assert.equal(
      preset.implementation.phase,
      preset.scope === "MODULE"
        ? "MC7C"
        : preset.scope === "COMMAND"
          ? "MC7B"
          : "MC7A"
    );
  });
});

test("Resolution presets replace only command.resolution", () => {
  listMechanicsPresetCatalog({ category: "RESOLUTION" }).forEach((preset) => {
    assert.deepEqual(preset.application.replacementPaths, ["command.resolution"]);
    assert.equal(preset.application.defaultMode, "REPLACE_BLOCK");
    assert.ok(preset.application.preservedPaths.includes("command.composition"));
  });
});

test("Composition presets replace only command.composition", () => {
  listMechanicsPresetCatalog({
    category: "COMPOSITION",
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  }).forEach((preset) => {
    assert.deepEqual(preset.application.replacementPaths, ["command.composition"]);
    assert.equal(preset.application.defaultMode, "REPLACE_BLOCK");
    assert.ok(preset.application.preservedPaths.includes("command.resolution"));
  });
});

test("Manifest returns plain serializable definitions", () => {
  const serialized = JSON.stringify(getMechanicsPresetCatalogManifest());
  assert.ok(serialized.includes("resolution.standard_d20.v1"));
  assert.equal(serialized.includes("function"), false);
});

test("Manifest callers cannot mutate catalog truth", () => {
  const first = getMechanicsPresetCatalogManifest();
  first.presets[0].label = "Mutated";
  const second = getMechanicsPresetCatalogManifest();
  assert.notEqual(second.presets[0].label, "Mutated");
});

test("Catalog filters by scope", () => {
  const results = listMechanicsPresetCatalog({ scope: "COMMAND_RESOLUTION" });
  assert.equal(results.length, 6);
  assert.ok(results.every((preset) => preset.scope === "COMMAND_RESOLUTION"));
});

test("Catalog filters by category", () => {
  const results = listMechanicsPresetCatalog({
    category: "COMPOSITION",
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  });
  assert.equal(results.length, 4);
  assert.ok(results.every((preset) => preset.category === "COMPOSITION"));
});

test("Catalog search matches labels tags and source references", () => {
  assert.equal(listMechanicsPresetCatalog({ query: "automatic success" }).length, 1);
  assert.equal(listMechanicsPresetCatalog({ query: "milestone" }).length, 1);
  assert.equal(listMechanicsPresetCatalog({ query: "OPPOSED_D20" }).length, 1);
});

test("Definition lookup accepts canonical case-insensitive IDs", () => {
  const preset = getMechanicsPresetDefinition(" RESOLUTION.STANDARD_D20.V1 ");
  assert.equal(preset?.id, "resolution.standard_d20.v1");
});

test("Unknown definition lookup returns null", () => {
  assert.equal(getMechanicsPresetDefinition("missing.preset.v1"), null);
});

test("Unknown preset build returns a typed error", () => {
  const built = buildMechanicsPresetPayload("missing.preset.v1");
  assert.equal(built.ok, false);
  assert.equal(built.error.code, "MECHANICS_PRESET_NOT_FOUND");
});

test("Argument-free references are available without command context", () => {
  const presets = listMechanicsPresetCatalog({
    scopes: ["COMMAND_RESOLUTION", "COMMAND_COMPOSITION"],
    includeUnavailable: false,
  });
  assert.equal(presets.length, 8);
  assert.ok(
    presets.some((preset) => preset.id === "composition.conditional_milestone.v1")
  );
});

test("Item and condition composition reports missing typed arguments", () => {
  const preset = getMechanicsPresetDefinition("composition.item_and_condition.v1");
  assert.equal(preset.availability.available, false);
  assert.deepEqual(preset.availability.missingArgumentTypes, [
    "ITEM_HELD",
    "CHARACTER_PRESENT",
    "TEXT",
  ]);
});

test("Unavailable preset build returns applicability evidence", () => {
  const built = buildMechanicsPresetPayload("composition.item_and_condition.v1");
  assert.equal(built.ok, false);
  assert.equal(built.error.code, "MECHANICS_PRESET_NOT_APPLICABLE");
  assert.ok(built.error.missingArgumentTypes.includes("ITEM_HELD"));
});

test("Typed arguments make every MC7A reference available", () => {
  const summary = summarizeMechanicsPresetCatalog({
    categories: ["RESOLUTION", "COMPOSITION"],
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  });
  assert.equal(summary.available, 10);
  assert.equal(summary.unavailable, 0);
});

test("Resolution payloads retain resolution v6", () => {
  listMechanicsPresetCatalog({ category: "RESOLUTION" }).forEach((preset) => {
    const built = buildMechanicsPresetPayload(preset.id);
    assert.equal(built.ok, true);
    assert.equal(built.payload.value.version, MECHANICS_COMMAND_RESOLUTION_VERSION);
  });
});

test("Composition payloads retain composition v1", () => {
  listMechanicsPresetCatalog({
    category: "COMPOSITION",
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  }).forEach((preset) => {
    const built = buildMechanicsPresetPayload(preset.id, {
      argumentOptions: ALL_ARGUMENT_OPTIONS,
    });
    assert.equal(built.ok, true);
    assert.equal(built.payload.value.version, MECHANICS_COMMAND_COMPOSITION_VERSION);
  });
});

test("Every resolution reference passes complete Mechanics compliance", () => {
  listMechanicsPresetCatalog({ category: "RESOLUTION" })
    .forEach(assertCatalogPayloadComplies);
});

test("Every composition reference passes complete Mechanics compliance", () => {
  listMechanicsPresetCatalog({
    category: "COMPOSITION",
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  }).forEach(assertCatalogPayloadComplies);
});

test("Built payloads advertise explicit replacement and preservation boundaries", () => {
  const built = buildMechanicsPresetPayload("resolution.standard_d20.v1");
  assert.equal(built.payload.applyMode, "REPLACE_BLOCK");
  assert.deepEqual(built.payload.replacementPaths, ["command.resolution"]);
  assert.ok(built.payload.preservedPaths.includes("command.composition"));
});

test("Built payloads are isolated copies", () => {
  const first = buildMechanicsPresetPayload("resolution.standard_d20.v1");
  first.payload.value.targetNumber = 999;
  const second = buildMechanicsPresetPayload("resolution.standard_d20.v1");
  assert.notEqual(second.payload.value.targetNumber, 999);
});

test("Composition payload binds real typed argument names", () => {
  const built = buildMechanicsPresetPayload("composition.item_and_condition.v1", {
    argumentOptions: ALL_ARGUMENT_OPTIONS,
  });
  assert.equal(built.ok, true);
  assert.equal(built.payload.value.domainSteps[0].action.itemArgumentName, "item");
  assert.equal(built.payload.value.domainSteps[0].action.targetArgumentName, "target");
  assert.equal(built.payload.value.domainSteps[1].action.conditionArgumentName, "condition");
});

test("Location composition preserves location-last ordering", () => {
  const built = buildMechanicsPresetPayload(
    "composition.item_condition_location.v1",
    { argumentOptions: ALL_ARGUMENT_OPTIONS }
  );
  assert.equal(built.ok, true);
  const steps = built.payload.value.domainSteps;
  assert.equal(steps.at(-1).action.type, "LOCATION_TRANSITION");
});

test("Definition summaries are display-ready and storage-agnostic", () => {
  const preset = getMechanicsPresetDefinition("resolution.standard_d20.v1");
  const summary = formatMechanicsPresetDefinitionSummary(preset);
  assert.match(summary, /Standard d20 Check/);
  assert.match(summary, /COMMAND RESOLUTION/);
  assert.equal(summary.includes("instanceData"), false);
});

test("Definition normalizer rejects unsupported semantic enums safely", () => {
  const normalized = normalizeMechanicsPresetDefinition({
    id: " Example Preset ",
    scope: "UNKNOWN",
    category: "UNKNOWN",
    application: { defaultMode: "UNKNOWN" },
  });
  assert.equal(normalized.id, "example_preset");
  assert.equal(normalized.scope, "COMMAND");
  assert.equal(normalized.category, "COMMAND_STARTER");
  assert.equal(normalized.application.defaultMode, "REPLACE_BLOCK");
});

test("MC7A creates no UI, persistence, API, or runtime execution coupling", () => {
  const catalogSource = fs.readFileSync(
    path.join(__dirname, "mechanicsPresetCatalog.js"),
    "utf8"
  );
  assert.equal(/\bfetch\s*\(/.test(catalogSource), false);
  assert.equal(catalogSource.includes("supabase"), false);
  assert.equal(catalogSource.includes("PostGraphile"), false);
  assert.equal(catalogSource.includes("useState"), false);
  assert.equal(catalogSource.includes("services-api"), false);
});

test("MC6 LOOM builders and compliance validator remain present", () => {
  const required = [
    "mechanicsCommandResolutionBuilder.js",
    "mechanicsCommandCompositionBuilder.js",
    "mechanics-json-editor/mechanicsJsonEditor.validation.js",
    "MechanicsModuleFieldsSection.jsx",
  ];
  required.forEach((relativePath) => {
    assert.equal(fs.existsSync(path.join(mechanicsRoot, relativePath)), true);
  });
});

console.log("Crestfall mc7_reference_preset_catalog_diagnostics_v1");
console.log(`Node ${process.version}\n`);

let passed = 0;
let failed = 0;
const started = Date.now();

for (let index = 0; index < tests.length; index += 1) {
  const { name, fn } = tests[index];
  const testStarted = Date.now();

  try {
    await fn();
    passed += 1;
    console.log(
      `PASS ${String(index + 1).padStart(2, "0")} ${name} (${Date.now() - testStarted} ms)`
    );
  } catch (error) {
    failed += 1;
    console.log(
      `FAIL ${String(index + 1).padStart(2, "0")} ${name} (${Date.now() - testStarted} ms)`
    );
    console.error(error?.stack || error);
  }
}

console.log(`\nSummary: ${passed} passed, ${failed} failed, ${tests.length} total`);
console.log(`Elapsed: ${Date.now() - started} ms`);

if (failed > 0) process.exitCode = 1;
