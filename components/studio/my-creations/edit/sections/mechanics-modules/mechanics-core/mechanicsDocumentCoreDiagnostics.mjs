import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  MECHANICS_DOCUMENT_CORE_CONTRACT_VERSION,
  MECHANICS_DOCUMENT_CORE_PHASE,
  MECHANICS_DOCUMENT_CORE_STATUS,
  MECHANICS_DOCUMENT_IDENTITIES,
} from "./MechanicsDocumentCore.contract.js";
import {
  createDefaultMechanicsDocument,
  createDefaultMechanicsInstanceData,
} from "./mechanicsDocumentDefaults.js";
import {
  replaceMechanicsCommands,
  replaceMechanicsDefaults,
  replaceMechanicsGuards,
  replaceMechanicsInstanceData,
  replaceMechanicsRootFields,
  replaceMechanicsStatusBlocks,
  replaceMechanicsTrackers,
} from "./mechanicsDocumentCompatibility.js";
import {
  normalizeMechanicsDocument,
  normalizeMechanicsTags,
} from "./mechanicsDocumentNormalization.js";
import {
  selectMechanicsDomainCounts,
  selectMechanicsInstanceData,
  selectMechanicsModuleIdentity,
} from "./mechanicsDocumentSelectors.js";
import { listMechanicsM0Fixtures } from "../mechanics-compatibility-baseline/mechanicsCompatibilityBaseline.fixtures.js";
import { buildMechanicsModuleCreationPayload } from "../../../../../create/mechanics-module/mechanics-module-builder/mechanicsModuleCreationPayload.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");

function read(relativePath) {
  return fs.readFileSync(path.resolve(repoRoot, relativePath), "utf8");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertUnknownProbe(document) {
  assert.deepEqual(document.futureRootData, {
    preservedByEditReplacement: true,
  });
  assert.deepEqual(document.instanceData.futureDomainData, {
    preservedByEditReplacement: true,
  });
}

test("M1 contract establishes the shared compatibility authority", () => {
  assert.equal(
    MECHANICS_DOCUMENT_CORE_CONTRACT_VERSION,
    "crestfall.loom.mechanics-document-core.v1"
  );
  assert.equal(MECHANICS_DOCUMENT_CORE_PHASE, "M1");
  assert.equal(
    MECHANICS_DOCUMENT_CORE_STATUS,
    "ACTIVE_SHARED_COMPATIBILITY_LAYER"
  );
  assert.deepEqual(MECHANICS_DOCUMENT_IDENTITIES, {
    builder: "MECHANICS_MODULE_BUILDER",
    builderVersion: "0.3",
    moduleDefinitionId: "core.trackers.v1",
    moduleId: "core.trackers.v1",
    contractVersion: "trackers_instance_data.v0_2",
    defaultOperation: "get_tracker_context",
    defaultPriority: 65,
  });
});

test("default factories return complete independent documents", () => {
  const first = createDefaultMechanicsDocument();
  const second = createDefaultMechanicsDocument();
  first.tags.push("mutated");
  first.instanceData.defaults.flags.push({ id: "mutated" });
  assert.deepEqual(second.tags, []);
  assert.deepEqual(second.instanceData.defaults.flags, []);
  assert.deepEqual(createDefaultMechanicsInstanceData(), {
    contractVersion: "trackers_instance_data.v0_2",
    trackers: [],
    commands: [],
    defaults: { flags: [], counters: [], stages: [] },
    statusBlocks: [],
    guards: [],
  });
});

test("all document-bearing M0 fixtures normalize idempotently", () => {
  const fixtures = listMechanicsM0Fixtures().filter(
    (fixture) => fixture.moduleData
  );
  assert.equal(fixtures.length, 8);

  for (const fixture of fixtures) {
    const normalized = normalizeMechanicsDocument(fixture.moduleData);
    assert.deepEqual(
      normalizeMechanicsDocument(normalized),
      normalized,
      fixture.id
    );
    assert.equal(normalized.moduleDefinitionId.length > 0, true, fixture.id);
    assert.equal(normalized.moduleId.length > 0, true, fixture.id);
    assert.equal(Array.isArray(normalized.instanceData.trackers), true, fixture.id);
    assert.equal(Array.isArray(normalized.instanceData.commands), true, fixture.id);
    assert.equal(Array.isArray(normalized.instanceData.statusBlocks), true, fixture.id);
    assert.equal(Array.isArray(normalized.instanceData.guards), true, fixture.id);
  }
});

test("legacy aliases populate canonical fields without deleting evidence", () => {
  const legacy = listMechanicsM0Fixtures().find(
    (fixture) => fixture.id === "legacy.partial-aliases.v1"
  ).moduleData;
  const normalized = normalizeMechanicsDocument(legacy);

  assert.equal(normalized.contractVersion, "trackers_instance_data.v0_2");
  assert.equal(
    normalized.instanceData.contractVersion,
    "trackers_instance_data.v0_2"
  );
  assert.equal(normalized.priority, 65);
  assert.deepEqual(normalized.tags, ["legacy", "partial"]);
  assert.deepEqual(normalized.instanceData.defaults.stages, []);
  assert.equal(normalized.contract_version, legacy.contract_version);
  assert.deepEqual(normalized.instance_data, legacy.instance_data);
});

test("malformed recoverable input receives canonical safe collections", () => {
  const malformed = listMechanicsM0Fixtures().find(
    (fixture) => fixture.id === "recoverable.malformed.v1"
  ).moduleData;
  const normalized = normalizeMechanicsDocument(malformed);

  assert.equal(normalized.priority, 65);
  assert.deepEqual(normalized.tags, ["recoverable"]);
  assert.deepEqual(normalized.operationTriggers, {
    chatTurnDefault: "get_tracker_context",
  });
  assert.deepEqual(normalized.instanceData.trackers, []);
  assert.deepEqual(normalized.instanceData.commands, []);
  assert.deepEqual(normalized.instanceData.defaults, {
    flags: [],
    counters: [],
    stages: [],
  });
  assert.deepEqual(normalized.instanceData.statusBlocks, []);
  assert.deepEqual(normalized.instanceData.guards, []);
});

test("unknown root, trigger, instance, and defaults metadata survives", () => {
  const source = {
    futureRoot: { version: 2 },
    operationTriggers: {
      chat_turn_default: "custom_operation",
      futureTrigger: { enabled: true },
    },
    instanceData: {
      futureInstance: { source: "extension" },
      defaults: {
        futureDefaults: { retained: true },
      },
    },
  };
  const normalized = normalizeMechanicsDocument(source);

  assert.deepEqual(normalized.futureRoot, source.futureRoot);
  assert.equal(normalized.operationTriggers.chatTurnDefault, "custom_operation");
  assert.deepEqual(
    normalized.operationTriggers.futureTrigger,
    source.operationTriggers.futureTrigger
  );
  assert.deepEqual(
    normalized.instanceData.futureInstance,
    source.instanceData.futureInstance
  );
  assert.deepEqual(
    normalized.instanceData.defaults.futureDefaults,
    source.instanceData.defaults.futureDefaults
  );
});

test("domain replacement helpers preserve unrelated and unknown data", () => {
  const mixed = listMechanicsM0Fixtures().find(
    (fixture) => fixture.id === "current.full-mixed.v1"
  ).moduleData;
  const normalized = normalizeMechanicsDocument(mixed);

  const replacements = [
    replaceMechanicsRootFields(normalized, { priority: 90 }),
    replaceMechanicsInstanceData(normalized, { futureM1: { retained: true } }),
    replaceMechanicsTrackers(normalized, [{ id: "replacement_tracker" }]),
    replaceMechanicsCommands(normalized, [{ id: "replacement_command" }]),
    replaceMechanicsDefaults(normalized, {
      ...normalized.instanceData.defaults,
      flags: [{ id: "replacement_flag" }],
    }),
    replaceMechanicsStatusBlocks(normalized, [{ id: "replacement_status" }]),
    replaceMechanicsGuards(normalized, [{ id: "replacement_guard" }]),
  ];

  replacements.forEach(assertUnknownProbe);
  assert.equal(replacements[0].priority, 90);
  assert.equal(replacements[1].instanceData.futureM1.retained, true);
  assert.deepEqual(replacements[2].instanceData.trackers, [
    { id: "replacement_tracker" },
  ]);
  assert.deepEqual(replacements[3].instanceData.commands, [
    { id: "replacement_command" },
  ]);
  assert.deepEqual(replacements[4].instanceData.defaults.flags, [
    {
      id: "replacement_flag",
      label: "replacement_flag",
      initial: false,
    },
  ]);
});

test("selectors expose canonical identity, instance data, and counts", () => {
  const fixture = listMechanicsM0Fixtures().find(
    (item) => item.id === "current.status-guard.v1"
  ).moduleData;
  const identity = selectMechanicsModuleIdentity(fixture);
  const instanceData = selectMechanicsInstanceData(fixture);
  const counts = selectMechanicsDomainCounts(fixture);

  assert.equal(identity.moduleId, "core.trackers.v1");
  assert.equal(identity.contractVersion, "trackers_instance_data.v0_2");
  assert.equal(instanceData.defaults.flags.length, 1);
  assert.deepEqual(counts, {
    trackers: 0,
    commands: 0,
    defaults: 3,
    statusBlocks: 1,
    guards: 1,
  });
});

test("create payload now preserves the complete normalized document", () => {
  const mixed = clone(
    listMechanicsM0Fixtures().find(
      (fixture) => fixture.id === "current.full-mixed.v1"
    ).moduleData
  );
  mixed.operationTriggers.futureTrigger = { retained: true };
  mixed.instanceData.defaults.futureDefaults = { retained: true };

  const payload = buildMechanicsModuleCreationPayload({
    title: " M1 Compatibility ",
    description: " Complete document payload ",
    visibility: "UNLISTED",
    content_rating: "MATURE",
    data: mixed,
  });

  assert.equal(payload.title, "M1 Compatibility");
  assert.equal(payload.description, "Complete document payload");
  assertUnknownProbe(payload.data);
  assert.equal(payload.data.operationTriggers.futureTrigger.retained, true);
  assert.equal(payload.data.instanceData.defaults.futureDefaults.retained, true);
  assert.deepEqual(payload.data, normalizeMechanicsDocument(mixed));
});

test("tag normalization retains current ordering and duplicate behavior", () => {
  assert.deepEqual(normalizeMechanicsTags(" one, two, one "), [
    "one",
    "two",
    "one",
  ]);
  assert.deepEqual(normalizeMechanicsTags([" one ", "", null, "two"]), [
    "one",
    "two",
  ]);
});

test("create and edit production parents consume the shared core", () => {
  const createViewModel = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/useMechanicsModuleBuilderViewModel.js"
  );
  const payloadBuilder = read(
    "components/studio/create/mechanics-module/mechanics-module-builder/mechanicsModuleCreationPayload.js"
  );
  const editor = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx"
  );
  const assemblyViewModel = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/useMechanicsModuleAssemblyViewModel.js"
  );
  const assemblyOperations = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/mechanicsModuleAssemblyOperations.js"
  );

  assert.match(createViewModel, /createDefaultMechanicsDocument/);
  assert.match(createViewModel, /normalizeMechanicsDocument/);
  assert.match(createViewModel, /replaceMechanicsRootFields/);
  assert.match(payloadBuilder, /data:\s*normalizeMechanicsDocument\(form\?\.data\)/);
  assert.match(assemblyOperations, /normalizeMechanicsDocument\(value\)/);
  assert.match(assemblyViewModel, /replaceMechanicsRootFields\(data, updates\)/);
  assert.match(assemblyViewModel, /replaceMechanicsInstanceData\(data, nextInstanceData\)/);
  assert.match(editor, /replaceData\(normalizeMechanicsDocument\(nextData\)\)/);
});

test("M1 package is complete and its preview is production-protected", () => {
  const base =
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core";
  for (const file of [
    "MechanicsDocumentCore.contract.js",
    "MechanicsDocumentCore.jsx",
    "MechanicsDocumentCore.view.jsx",
    "mechanicsDocumentDefaults.js",
    "mechanicsDocumentNormalization.js",
    "mechanicsDocumentCompatibility.js",
    "mechanicsDocumentSelectors.js",
    "mechanicsDocumentCore.fixtures.js",
    "useMechanicsDocumentCoreViewModel.js",
    "mechanicsDocumentCoreDiagnostics.mjs",
    "README.md",
  ]) {
    assert.equal(fs.existsSync(path.resolve(repoRoot, base, file)), true, file);
  }

  const preview = read("app/dev/ui-preview/mechanics-document-core/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);

  const view = read(`${base}/MechanicsDocumentCore.view.jsx`);
  assert.doesNotMatch(view, /@\/lib\/(?:client|server|supabase)/);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /fetch\s*\(/);
});
