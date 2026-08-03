import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_DEFAULTS_LOOM_CONTRACT,
  MECHANICS_DEFAULT_BUCKETS,
} from "./MechanicsDefaults.contract.js";
import { MECHANICS_DEFAULTS_FIXTURES } from "./mechanicsDefaults.fixtures.js";
import {
  countMechanicsDefaultEntries,
  normalizeMechanicsDefaults,
} from "./mechanicsDefaultsNormalization.js";
import {
  addMechanicsDefaultEntry,
  patchMechanicsDefaultEntry,
  removeMechanicsDefaultEntry,
} from "./mechanicsDefaultsOperations.js";
import {
  normalizeMechanicsDocument,
} from "../mechanics-core/mechanicsDocumentNormalization.js";
import {
  canonicalizeMechanicsModuleData,
} from "../mechanics-json-editor/mechanicsJsonEditor.validation.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
const fixture = (id) => MECHANICS_DEFAULTS_FIXTURES.find((item) => item.id === id);

test("M7A contract freezes defaults ownership", () => {
  assert.equal(MECHANICS_DEFAULTS_LOOM_CONTRACT.id, "crestfall.loom.mechanics-defaults.v1");
  assert.equal(MECHANICS_DEFAULTS_LOOM_CONTRACT.storagePath, "instanceData.defaults");
  assert.deepEqual(MECHANICS_DEFAULT_BUCKETS.map((item) => item.key), [
    "flags",
    "counters",
    "stages",
  ]);
});

test("fixture inventory covers empty, current, legacy, and malformed defaults", () => {
  assert.deepEqual(MECHANICS_DEFAULTS_FIXTURES.map((item) => item.id), [
    "EMPTY",
    "CURRENT",
    "LEGACY",
    "MALFORMED",
  ]);
});

test("defaults normalization is idempotent", () => {
  for (const item of MECHANICS_DEFAULTS_FIXTURES) {
    const once = normalizeMechanicsDefaults(item.defaults);
    const twice = normalizeMechanicsDefaults(once);
    assert.deepEqual(twice, once, item.id);
  }
});

test("document normalization delegates defaults to the M7A authority", () => {
  const document = normalizeMechanicsDocument({
    instanceData: {
      defaults: fixture("LEGACY").defaults,
    },
  });
  assert.equal(document.instanceData.defaults.flags[0].id, "legacy_flag");
  assert.equal(document.instanceData.defaults.counters[0].initial, 7);
  assert.equal(document.instanceData.defaults.stages[0].initial, "active");
});

test("Mechanics JSON canonicalization delegates defaults to M7A", () => {
  const data = canonicalizeMechanicsModuleData({
    moduleDefinitionId: "core.trackers.v1",
    instanceData: { defaults: fixture("LEGACY").defaults },
  });
  assert.equal(data.instanceData.defaults.flags[0].id, "legacy_flag");
  assert.equal(data.instanceData.defaults.counters[0].initial, 7);
  assert.equal(data.instanceData.defaults.stages[0].initial, "active");
});

test("legacy bucket and entry aliases project into canonical defaults", () => {
  const normalized = normalizeMechanicsDefaults(fixture("LEGACY").defaults);
  assert.deepEqual(normalized.flags[0], {
    key: "legacy_flag",
    title: "Legacy Flag",
    value: "yes",
    id: "legacy_flag",
    label: "Legacy Flag",
    initial: true,
  });
  assert.equal(normalized.counters[0].initial, 7);
  assert.equal(normalized.stages[0].initial, "active");
});

test("unknown defaults and entry metadata survive normalization and patching", () => {
  const source = normalizeMechanicsDefaults(fixture("CURRENT").defaults);
  const patched = patchMechanicsDefaultEntry(source, "flags", 0, {
    label: "Updated Flag",
  });
  assert.deepEqual(patched.futureDefaultsMetadata, { retained: true });
  assert.deepEqual(patched.flags[0].futureEntryMetadata, { retained: true });
  assert.equal(patched.flags[0].label, "Updated Flag");
});

test("bucket operations preserve neighboring buckets and ordering", () => {
  const source = normalizeMechanicsDefaults(fixture("CURRENT").defaults);
  const added = addMechanicsDefaultEntry(source, "counters");
  assert.equal(added.counters.length, 2);
  assert.equal(added.flags[0].id, "feature_enabled");
  assert.equal(added.stages[0].id, "phase");
  const removed = removeMechanicsDefaultEntry(added, "counters", 0);
  assert.equal(removed.counters.length, 1);
  assert.equal(removed.counters[0].id, added.counters[1].id);
});

test("entry values normalize by bucket type", () => {
  let defaults = normalizeMechanicsDefaults(fixture("EMPTY").defaults);
  defaults = addMechanicsDefaultEntry(defaults, "flags");
  defaults = patchMechanicsDefaultEntry(defaults, "flags", 0, { initial: "yes" });
  defaults = addMechanicsDefaultEntry(defaults, "counters");
  defaults = patchMechanicsDefaultEntry(defaults, "counters", 0, { initial: "9" });
  defaults = addMechanicsDefaultEntry(defaults, "stages");
  defaults = patchMechanicsDefaultEntry(defaults, "stages", 0, { initial: " active " });
  assert.equal(defaults.flags[0].initial, true);
  assert.equal(defaults.counters[0].initial, 9);
  assert.equal(defaults.stages[0].initial, "active");
});

test("malformed defaults recover to safe arrays and values", () => {
  const normalized = normalizeMechanicsDefaults(fixture("MALFORMED").defaults);
  assert.deepEqual(normalized.flags, []);
  assert.equal(normalized.counters[0].id, "counter_1");
  assert.equal(normalized.counters[0].initial, 0);
  assert.equal(normalized.stages[0].id, "stage_1");
  assert.equal(normalized.stages[0].initial, "auto");
});

test("default entry count covers all three buckets", () => {
  assert.equal(countMechanicsDefaultEntries(fixture("CURRENT").defaults), 3);
});

test("portable Defaults View owns presentation without application imports", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/MechanicsDefaults.view.jsx"
  );
  assert.match(view, /Defaults: Flags, Counters, and Stages/);
  assert.match(view, /bucket\.title/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /MechanicsModuleFieldsSection/);
});

test("the main Mechanics parent mounts M7A and no longer owns Defaults UI", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  assert.match(parent, /import MechanicsDefaults/);
  assert.match(parent, /<MechanicsDefaults/);
  const assemblyViewModel = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js"
  );
  assert.match(assemblyViewModel, /normalizeMechanicsDefaults/);
  assert.doesNotMatch(parent, /const MECHANICS_DEFAULT_BUCKETS/);
  assert.doesNotMatch(parent, /function MechanicsDefaultsVisualEditor/);
  assert.doesNotMatch(parent, /function MechanicsDefaultCard/);
  assert.doesNotMatch(parent, /function normalizeMechanicsDefaultEntry/);
});

test("M7A package includes contract, View, ViewModel, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsDefaults.contract.js",
    "MechanicsDefaults.jsx",
    "MechanicsDefaults.view.jsx",
    "useMechanicsDefaultsViewModel.js",
    "mechanicsDefaultsNormalization.js",
    "mechanicsDefaultsOperations.js",
    "mechanicsDefaults.fixtures.js",
    "mechanicsDefaultsDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-defaults/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m7a"] || "",
    /mechanicsDefaultsDiagnostics\.mjs/
  );
});
