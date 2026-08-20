import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  COMMAND_DOMAIN_ACTION_OUTCOMES,
  COMMAND_DOMAIN_ACTION_TYPE_VALUES,
  ABILITY_SPELL_KNOWLEDGE_STATES,
  ABILITY_SPELL_UNLOCK_STATES,
  LOCATION_TRAVEL_OPERATIONS,
  MECHANICS_COMMAND_DOMAIN_ACTIONS_CONTRACT_VERSION,
} from "./MechanicsCommandDomainActions.contract.js";
import { listMechanicsCommandDomainActionFixtures } from "./mechanicsCommandDomainActions.fixtures.js";
import {
  getMechanicsCommandDomainArgumentOptions,
  normalizeMechanicsCommandDomainAction,
  projectMechanicsCommandDomainAction,
} from "./mechanicsCommandDomainActionsNormalization.js";
import {
  changeMechanicsCommandDomainActionType,
  patchMechanicsCommandDomainAction,
  toggleMechanicsCommandDomainActionOutcome,
} from "./mechanicsCommandDomainActionsOperations.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "../../../../../../..");
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const fixtures = listMechanicsCommandDomainActionFixtures();

test("M5C contract freezes domain action, outcome, and travel identifiers", () => {
  assert.equal(
    MECHANICS_COMMAND_DOMAIN_ACTIONS_CONTRACT_VERSION,
    "crestfall.loom.mechanics-command-domain-actions.v1_2"
  );
  assert.ok(COMMAND_DOMAIN_ACTION_TYPE_VALUES.includes("ITEM_GIVE"));
  assert.ok(COMMAND_DOMAIN_ACTION_TYPE_VALUES.includes("LOCATION_TRANSITION"));
  assert.ok(COMMAND_DOMAIN_ACTION_TYPE_VALUES.includes("LOCATION_TRAVEL_OPERATION"));
  assert.ok(COMMAND_DOMAIN_ACTION_TYPE_VALUES.includes("ABILITY_SPELL_KNOWLEDGE_SET"));
  assert.ok(COMMAND_DOMAIN_ACTION_TYPE_VALUES.includes("ABILITY_SPELL_USE_REQUEST"));
  assert.deepEqual(ABILITY_SPELL_KNOWLEDGE_STATES, ["KEEP", "KNOWN", "UNKNOWN"]);
  assert.deepEqual(ABILITY_SPELL_UNLOCK_STATES, ["KEEP", "UNLOCKED", "LOCKED"]);
  assert.deepEqual(COMMAND_DOMAIN_ACTION_OUTCOMES, [
    "CRITICAL_SUCCESS",
    "SUCCESS",
    "FAILURE",
    "FUMBLE",
  ]);
  assert.ok(LOCATION_TRAVEL_OPERATIONS.includes("ARRIVE"));
});

test("fixture inventory covers none, items, participants, locations, legacy, and recovery", () => {
  assert.equal(fixtures.length, 10);
  assert.deepEqual(
    fixtures.map((fixture) => fixture.id),
    [
      "none",
      "item-custody",
      "item-condition",
      "participant-condition",
      "ability-spell-knowledge",
      "ability-spell-use",
      "location-transition",
      "active-journey",
      "legacy-aliases",
      "malformed",
    ]
  );
});

test("domain action normalization is idempotent", () => {
  for (const fixture of fixtures) {
    const once = normalizeMechanicsCommandDomainAction(fixture.domainAction);
    const twice = normalizeMechanicsCommandDomainAction(once);
    assert.deepEqual(twice, once, fixture.id);
  }
});

test("legacy aliases and unknown metadata survive normalization", () => {
  const legacy = normalizeMechanicsCommandDomainAction(
    fixtures.find((fixture) => fixture.id === "legacy-aliases").domainAction
  );
  assert.equal(legacy.type, "ITEM_DAMAGE");
  assert.equal(legacy.itemArgumentName, "visible_item");
  assert.equal(legacy.amountArgumentName, "damage");
  assert.deepEqual(legacy.applyOnOutcomes, ["SUCCESS", "FUMBLE"]);
  assert.deepEqual(legacy.futureLegacyMetadata, { retained: true });
});

test("argument options remain type-specific", () => {
  const options = getMechanicsCommandDomainArgumentOptions({
    arguments: [
      { name: "held", type: "ITEM_HELD" },
      { name: "visible", type: "ITEM_VISIBLE" },
      { name: "destination", type: "LOCATION_CONNECTED" },
      { name: "target", type: "CHARACTER_PRESENT" },
      { name: "actor", type: "PLAYER_CHARACTER" },
      { name: "text", type: "TEXT" },
      { name: "number", type: "NUMBER" },
    ],
  });
  assert.deepEqual(options.heldItems.map((item) => item.name), ["held"]);
  assert.deepEqual(options.visibleItems.map((item) => item.name), ["visible"]);
  assert.deepEqual(options.connectedLocations.map((item) => item.name), [
    "destination",
  ]);
  assert.deepEqual(options.presentCharacters.map((item) => item.name), ["target"]);
  assert.deepEqual(options.abilityActors.map((item) => item.name), ["target", "actor"]);
  assert.deepEqual(options.abilityUseActors.map((item) => item.name), ["actor"]);
  assert.deepEqual(options.text.map((item) => item.name), ["text"]);
  assert.deepEqual(options.numbers.map((item) => item.name), ["number"]);
});

test("changing action type selects compatible existing or first arguments", () => {
  const invocation = fixtures.find((fixture) => fixture.id === "item-custody").invocation;
  const give = changeMechanicsCommandDomainActionType({}, "ITEM_GIVE", invocation);
  assert.equal(give.itemArgumentName, "item");
  assert.equal(give.targetArgumentName, "recipient");
  assert.deepEqual(give.applyOnOutcomes, ["CRITICAL_SUCCESS", "SUCCESS"]);
  const store = changeMechanicsCommandDomainActionType(give, "ITEM_STORE", invocation);
  assert.equal(store.itemArgumentName, "item");
  assert.equal(store.placementArgumentName, "placement");
});

test("location transition and active journey operations remain separate", () => {
  const transitionFixture = fixtures.find(
    (fixture) => fixture.id === "location-transition"
  );
  const transition = normalizeMechanicsCommandDomainAction(
    transitionFixture.domainAction
  );
  assert.equal(transition.destinationArgumentName, "destination");
  assert.equal(transition.travelOperation, "");
  const journey = normalizeMechanicsCommandDomainAction(
    fixtures.find((fixture) => fixture.id === "active-journey").domainAction
  );
  assert.equal(journey.destinationArgumentName, "");
  assert.equal(journey.travelOperation, "APPROACH");
});

test("participant condition projection reports missing required arguments", () => {
  const projected = projectMechanicsCommandDomainAction(
    { enabled: true, type: "PARTICIPANT_CONDITION_APPLY" },
    { arguments: [] }
  );
  assert.match(projected.missingBindingMessage, /CHARACTER_PRESENT/);
  assert.match(projected.missingBindingMessage, /TEXT/);
});

test("ability spell knowledge projection and type change use typed actor and ability arguments", () => {
  const fixture = fixtures.find((entry) => entry.id === "ability-spell-knowledge");
  const normalized = normalizeMechanicsCommandDomainAction(fixture.domainAction);
  assert.equal(normalized.version, "mechanics_command_domain_action_v2");
  assert.equal(normalized.actorArgumentName, "actor");
  assert.equal(normalized.abilityArgumentName, "ability");
  assert.equal(normalized.knowledgeState, "KNOWN");
  assert.equal(normalized.unlockState, "UNLOCKED");

  const projected = projectMechanicsCommandDomainAction(
    normalized,
    fixture.invocation
  );
  assert.equal(projected.missingBindingMessage, "");
  assert.equal(projected.flags.usesAbilitySpellKnowledge, true);

  const changed = changeMechanicsCommandDomainActionType(
    {},
    "ABILITY_SPELL_KNOWLEDGE_SET",
    fixture.invocation
  );
  assert.equal(changed.version, "mechanics_command_domain_action_v2");
  assert.equal(changed.actorArgumentName, "actor");
  assert.equal(changed.abilityArgumentName, "ability");
  assert.equal(changed.knowledgeState, "KNOWN");
  assert.equal(changed.unlockState, "UNLOCKED");
});

test("ability spell use projection advances to v3 and keeps target optional", () => {
  const fixture = fixtures.find((entry) => entry.id === "ability-spell-use");
  const normalized = normalizeMechanicsCommandDomainAction(fixture.domainAction);
  assert.equal(normalized.version, "mechanics_command_domain_action_v3");
  assert.equal(normalized.type, "ABILITY_SPELL_USE_REQUEST");
  assert.equal(normalized.actorArgumentName, "actor");
  assert.equal(normalized.abilityArgumentName, "ability");
  assert.equal(normalized.targetArgumentName, "target");

  const projected = projectMechanicsCommandDomainAction(
    normalized,
    fixture.invocation
  );
  assert.equal(projected.missingBindingMessage, "");
  assert.equal(projected.flags.usesAbilitySpellUse, true);

  const changed = changeMechanicsCommandDomainActionType(
    {},
    "ABILITY_SPELL_USE_REQUEST",
    fixture.invocation
  );
  assert.equal(changed.version, "mechanics_command_domain_action_v3");
  assert.equal(changed.actorArgumentName, "actor");
  assert.equal(changed.abilityArgumentName, "ability");
  assert.equal(changed.targetArgumentName, "");
});

test("patch and outcome operations preserve unrelated metadata", () => {
  const original = fixtures.find((fixture) => fixture.id === "item-custody").domainAction;
  const patched = patchMechanicsCommandDomainAction(original, {
    targetArgumentName: "new_recipient",
  });
  assert.deepEqual(patched.futureActionMetadata, { retained: true });
  const toggled = toggleMechanicsCommandDomainActionOutcome(
    patched,
    "FAILURE",
    true
  );
  assert.ok(toggled.applyOnOutcomes.includes("FAILURE"));
  assert.deepEqual(toggled.futureActionMetadata, { retained: true });
});

test("malformed actions recover to the disabled NONE shape", () => {
  const malformed = normalizeMechanicsCommandDomainAction(
    fixtures.find((fixture) => fixture.id === "malformed").domainAction
  );
  assert.equal(malformed.type, "NONE");
  assert.equal(malformed.enabled, false);
  assert.deepEqual(malformed.applyOnOutcomes, []);
});

test("the portable View owns domain action presentation without application imports", () => {
  const view = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions.view.jsx"
  );
  assert.match(view, /Domain Adapter/);
  assert.match(view, /Active Journey Operation/);
  assert.match(view, /Apply On Outcomes/);
  assert.match(view, /ABILITY_SPELL_KNOWLEDGE_SET/);
  assert.match(view, /ABILITY_SPELL_USE_REQUEST/);
  assert.match(view, /EXECUTION_AUTHORIZED/);
  assert.match(view, /does not commit/);
  assert.match(view, /Known State/);
  assert.match(view, /Unlock State/);
  assert.doesNotMatch(view, /@\/lib\//);
  assert.doesNotMatch(view, /next\/(?:link|navigation)/);
  assert.doesNotMatch(view, /MechanicsModuleFieldsSection/);
});

test("the main Mechanics parent mounts M5C and no longer owns domain action helpers", () => {
  const parent = read(
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx"
  );
  assert.match(parent, /import MechanicsCommandDomainActions/);
  assert.match(parent, /<MechanicsCommandDomainActions/);
  assert.match(parent, /normalizeMechanicsCommandDomainAction/);
  assert.doesNotMatch(parent, /function normalizeCommandDomainAction/);
  assert.doesNotMatch(parent, /COMMAND_DOMAIN_ACTION_TYPES/);
  assert.doesNotMatch(parent, /LOCATION_TRAVEL_OPERATIONS/);
  assert.doesNotMatch(parent, /Domain Adapter/);
  assert.doesNotMatch(parent, /function patchDomainAction/);
});

test("M5C package includes contract, View, ViewModel, fixtures, README, diagnostics, and protected preview", () => {
  const required = [
    "MechanicsCommandDomainActions.contract.js",
    "MechanicsCommandDomainActions.jsx",
    "MechanicsCommandDomainActions.view.jsx",
    "useMechanicsCommandDomainActionsViewModel.js",
    "mechanicsCommandDomainActionsNormalization.js",
    "mechanicsCommandDomainActionsOperations.js",
    "mechanicsCommandDomainActions.fixtures.js",
    "mechanicsCommandDomainActionsDiagnostics.mjs",
    "README.md",
  ];
  for (const file of required) {
    assert.equal(fs.existsSync(path.join(currentDir, file)), true, file);
  }
  const preview = read("app/dev/ui-preview/mechanics-command-domain-actions/page.jsx");
  assert.match(preview, /process\.env\.NODE_ENV === "production"/);
  assert.match(preview, /notFound\(\)/);
  const packageJson = JSON.parse(read("package.json"));
  assert.match(
    packageJson.scripts?.["diagnostics:loom:mechanics-m5c"] || "",
    /mechanicsCommandDomainActionsDiagnostics\.mjs/
  );
});
