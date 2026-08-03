import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  COMMAND_ARGUMENT_TYPES,
  MECHANICS_COMMAND_CONTRACT_VERSION,
  MECHANICS_COMMAND_CORE_CONTRACT_VERSION,
  MECHANICS_COMMAND_INVOCATION_VERSION,
} from "./MechanicsCommandCore.contract.js";
import { listMechanicsCommandCoreFixtures } from "./mechanicsCommandCore.fixtures.js";
import {
  getLastPositionalArgumentIndex,
  isImplicitTargetArgumentType,
  normalizeCommandArgument,
  normalizeCommandArguments,
  normalizeCommandInvocation,
  normalizeCommandPresentation,
} from "./mechanicsCommandCoreNormalization.js";
import { createCommandCoreController } from "./mechanicsCommandCoreOperations.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../../../..");
const parentPath = path.join(here, "../mechanics-module-assembly/MechanicsModuleAssembly.jsx");
const shellPath = path.join(here, "MechanicsCommandCore.jsx");
const viewPath = path.join(here, "MechanicsCommandCore.view.jsx");
const previewPage = path.join(
  repoRoot,
  "app/dev/ui-preview/mechanics-command-core/page.jsx"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const manifestPath = path.join(
  repoRoot,
  "components/studio/pre-mechanics-closeout/mechanicsAssessmentManifest.mjs"
);

const read = (filePath) => fs.readFileSync(filePath, "utf8");

test("M4A contract freezes command identity and invocation boundaries", () => {
  assert.equal(
    MECHANICS_COMMAND_CORE_CONTRACT_VERSION,
    "crestfall.loom.mechanics-command-core.v1"
  );
  assert.equal(MECHANICS_COMMAND_CONTRACT_VERSION, "mechanics_command_contract_v1");
  assert.equal(MECHANICS_COMMAND_INVOCATION_VERSION, "mechanics_command_invocation_v1");
  assert.ok(COMMAND_ARGUMENT_TYPES.includes("CHARACTER_PRESENT"));
  assert.ok(COMMAND_ARGUMENT_TYPES.includes("LOCATION_CONNECTED"));
});

test("standard, implicit, legacy, and recoverable fixtures normalize", () => {
  const fixtures = listMechanicsCommandCoreFixtures();
  assert.equal(fixtures.length, 4);
  for (const fixture of fixtures) {
    assert.equal(typeof fixture.command.invocation.command, "string");
    assert.ok(Array.isArray(fixture.command.invocation.arguments));
    assert.ok(Array.isArray(fixture.command.triggers));
  }
});

test("legacy aliases and unknown metadata survive command normalization", () => {
  const legacy = listMechanicsCommandCoreFixtures().find(
    (fixture) => fixture.id === "legacy"
  ).command;
  assert.equal(legacy.invocation.command, "legacy-command");
  assert.equal(legacy.invocation.arguments[0].consumeRemaining, true);
  assert.equal(legacy.invocation.arguments[0].allowQuoted, false);
  assert.equal(legacy.invocation.arguments[0].min, 1);
  assert.equal(legacy.presentation.mode, "STATE_SETTING");
  assert.equal(legacy.presentation.resultVisibility, "OUTCOME_ONLY");
  assert.deepEqual(legacy.invocation.futureInvocationMetadata, { retained: true });
  assert.deepEqual(legacy.invocation.arguments[0].futureArgumentMetadata, {
    retained: true,
  });
  assert.deepEqual(legacy.presentation.futurePresentationMetadata, {
    retained: true,
  });
});

test("implicit arguments remain non-positional and cannot consume text", () => {
  const implicit = normalizeCommandArgument(
    {
      name: "actor",
      type: "SELF",
      required: true,
      consumeRemaining: true,
      allowQuoted: true,
    },
    0
  );
  assert.equal(isImplicitTargetArgumentType("SELF"), true);
  assert.equal(implicit.required, false);
  assert.equal(implicit.consumeRemaining, false);
  assert.equal(implicit.allowQuoted, false);
});

test("only the last positional argument may consume remaining text", () => {
  const argumentsList = normalizeCommandArguments([
    { name: "actor", type: "SELF", consumeRemaining: true },
    { name: "first", type: "TEXT", consumeRemaining: true },
    { name: "second", type: "TEXT", consumeRemaining: true },
  ]);
  assert.equal(getLastPositionalArgumentIndex(argumentsList), 2);
  assert.equal(argumentsList[0].consumeRemaining, false);
  assert.equal(argumentsList[1].consumeRemaining, false);
  assert.equal(argumentsList[2].consumeRemaining, true);
});

test("command operations preserve unrelated and unknown command metadata", () => {
  const original = {
    id: "inspect",
    label: "Inspect",
    futureCommandMetadata: { retained: true },
    requirements: [{ id: "requirement_1" }],
    effects: [{ id: "effect_1" }],
    invocation: {
      command: "inspect",
      prefixes: ["/"],
      arguments: [],
      futureInvocationMetadata: { retained: true },
    },
    presentation: {
      mode: "QUERY",
      futurePresentationMetadata: { retained: true },
    },
  };
  let patch = null;
  const controller = createCommandCoreController({
    command: original,
    commandIndex: 0,
    commands: [original],
    onPatchCommand: (_index, nextPatch) => {
      patch = nextPatch;
    },
  });
  controller.patchInvocation({ aliases: ["look"] });
  const next = { ...original, ...patch };
  assert.deepEqual(next.futureCommandMetadata, { retained: true });
  assert.deepEqual(next.requirements, original.requirements);
  assert.deepEqual(next.effects, original.effects);
  assert.deepEqual(next.invocation.futureInvocationMetadata, { retained: true });
  assert.deepEqual(next.invocation.aliases, ["look"]);
});

test("presentation normalization preserves unknown metadata and canonical defaults", () => {
  const presentation = normalizeCommandPresentation({
    mode: "query",
    result_visibility: "total_only",
    futurePresentationMetadata: { retained: true },
  });
  assert.equal(presentation.mode, "QUERY");
  assert.equal(presentation.resultVisibility, "TOTAL_ONLY");
  assert.equal(presentation.continueNarrative, false);
  assert.equal(presentation.advanceTime, false);
  assert.deepEqual(presentation.futurePresentationMetadata, { retained: true });
});

test("the main Mechanics parent mounts all extracted command-core sections", () => {
  const source = read(parentPath);
  assert.match(source, /MechanicsCommandIdentitySection/);
  assert.match(source, /MechanicsCommandInvocationSection/);
  assert.match(source, /MechanicsCommandArgumentsSection/);
  assert.match(source, /MechanicsCommandTriggersSection/);
  assert.doesNotMatch(source, /function TokenListField/);
  assert.doesNotMatch(source, /const COMMAND_ARGUMENT_TYPES/);
  assert.doesNotMatch(source, /function normalizeCommandArgument/);
  assert.doesNotMatch(source, /normalizeCommandStringList/);
  assert.doesNotMatch(source, /\bnormalizeStringList\s*\(/);
});

test("requirements, effects, domain actions, and resolution are extracted while composition remains in the parent", () => {
  const source = read(parentPath);
  assert.match(source, /MechanicsCommandRequirements/);
  assert.doesNotMatch(source, /function CommandRequirementCard/);
  assert.match(source, /MechanicsCommandEffects/);
  assert.match(source, /MechanicsCommandEffectCard/);
  assert.doesNotMatch(source, /function CommandOutcomeEffectCard/);
  assert.match(source, /MechanicsCommandResolution/);
  assert.match(source, /normalizeMechanicsCommandResolution/);
  assert.doesNotMatch(source, /function ResolutionModifierList/);
  assert.match(source, /MechanicsCommandDomainActions/);
  assert.doesNotMatch(source, /function normalizeCommandDomainAction/);
  assert.match(source, /<MechanicsCompositionBuilder/);
  assert.doesNotMatch(source, /function EffectValueFields/);
});

test("the portable command-core View owns no application data access", () => {
  const source = read(viewPath);
  assert.doesNotMatch(source, /next\/link|next\/navigation/);
  assert.doesNotMatch(source, /@\/lib\/(client|server|supabase)/);
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.match(source, /Structured Invocation v1/);
  assert.match(source, /Consume remaining text/);
});

test("the command-core Binding Shell composes semantic portable Views", () => {
  const source = read(shellPath);
  assert.match(source, /useMechanicsCommandCoreViewModel/);
  assert.match(source, /MechanicsCommandIdentityView/);
  assert.match(source, /MechanicsCommandInvocationView/);
  assert.match(source, /MechanicsCommandArgumentsView/);
  assert.match(source, /MechanicsCommandTriggersView/);
});

test("the M4A preview, package command, and assessment are registered", () => {
  const preview = read(previewPage);
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);

  const packageJson = JSON.parse(read(packageJsonPath));
  assert.equal(
    packageJson.scripts["diagnostics:loom:mechanics-m4"],
    "node --test components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/mechanicsCommandCoreDiagnostics.mjs"
  );

  const manifest = read(manifestPath);
  assert.match(manifest, /crestfall\.loom\.mechanics-assessment\.v15/);
  assert.match(manifest, /MECHANICS_DECOMPOSITION_CLOSED_READY_FOR_REPOSITORY_EXTRACTION/);
  assert.match(manifest, /commandCore/);
});
