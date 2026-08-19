import assert from "node:assert/strict";
import fs from "node:fs";

import {
  MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS,
  MECHANICS_COMMAND_DOMAIN_QUERY_AUTHORING_CONTRACT_VERSION,
  MECHANICS_COMMAND_DOMAIN_QUERY_CALLBACK_KEYS,
  MECHANICS_COMMAND_DOMAIN_QUERY_PRESENTATION_CONTRACT_VERSION,
  projectMechanicsCommandDomainQueryPresentation,
} from "./MechanicsCommandDomainQueryPresentation.contract.js";

import {
  mechanicsCommandDomainQueryAbilitySpellFixture,
  mechanicsCommandDomainQueryBindingLimitFixture,
  mechanicsCommandDomainQueryDisabledFixture,
  mechanicsCommandDomainQueryIncompleteFixture,
  mechanicsCommandDomainQueryStatsPoolsFixture,
  mechanicsCommandDomainQueryUnknownArgumentFixture,
} from "./MechanicsCommandDomainQueryPresentation.fixtures.js";

assert.equal(
  MECHANICS_COMMAND_DOMAIN_QUERY_AUTHORING_CONTRACT_VERSION,
  "mechanics_command_domain_query_v1"
);
assert.equal(
  MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS,
  12
);

const abilitySpell =
  projectMechanicsCommandDomainQueryPresentation(
    mechanicsCommandDomainQueryAbilitySpellFixture
  );

assert.equal(
  abilitySpell.contractVersion,
  MECHANICS_COMMAND_DOMAIN_QUERY_PRESENTATION_CONTRACT_VERSION
);
assert.equal(
  abilitySpell.authoringContractVersion,
  MECHANICS_COMMAND_DOMAIN_QUERY_AUTHORING_CONTRACT_VERSION
);
assert.equal(abilitySpell.title, "Domain Query");
assert.equal(abilitySpell.enabled, true);
assert.equal(
  abilitySpell.domain.value,
  "ABILITY_SPELL"
);
assert.equal(
  abilitySpell.operation.value,
  "QUERY_AVAILABILITY"
);
assert.equal(
  abilitySpell.argumentBindings.count,
  2
);
assert.equal(
  abilitySpell.argumentBindings.incompleteCount,
  0
);
assert.equal(
  abilitySpell.argumentBindings.canAddBinding,
  true
);
assert.equal(
  abilitySpell.argumentOptions[0].displayLabel,
  "Ability (TEXT)"
);
assert.equal(
  abilitySpell.argumentOptions[1].displayLabel,
  "Target (CHARACTER_PRESENT)"
);
assert.equal(
  abilitySpell.argumentBindings.rows[0].complete,
  true
);
assert.equal(
  abilitySpell.authoringState.hasIncompleteAuthoring,
  false
);

assert.deepEqual(abilitySpell.authority, {
  readOnlyQuery: true,
  statePersistenceAllowed: false,
  mutationAllowed: false,
  executionAuthorityGranted: false,
  providerInvocationAllowed: false,
  runtimeAdapterRegistrationRequired: true,
  invocationArgumentsAreCreatorAuthored: true,
});

const statsPools =
  projectMechanicsCommandDomainQueryPresentation(
    mechanicsCommandDomainQueryStatsPoolsFixture
  );

assert.equal(statsPools.domain.value, "STATS_POOLS");
assert.equal(statsPools.operation.value, "QUERY_STATE");
assert.equal(
  statsPools.argumentBindings.rows[0].selectedArgument.type,
  "CHARACTER_BOUND"
);

const incomplete =
  projectMechanicsCommandDomainQueryPresentation(
    mechanicsCommandDomainQueryIncompleteFixture
  );

assert.equal(incomplete.enabled, true);
assert.equal(
  incomplete.authoringState.identifiersComplete,
  false
);
assert.equal(
  incomplete.argumentBindings.incompleteCount,
  1
);
assert.equal(
  incomplete.authoringState.hasIncompleteAuthoring,
  true
);
assert.deepEqual(
  incomplete.authoringState.hints,
  [
    "Enabled domain query requires a domain identifier.",
    "Enabled domain query requires an operation identifier.",
    "Domain query binding requires a command argument.",
  ]
);

const unknownArgument =
  projectMechanicsCommandDomainQueryPresentation(
    mechanicsCommandDomainQueryUnknownArgumentFixture
  );

assert.equal(
  unknownArgument.argumentBindings.rows[0].complete,
  false
);
assert.deepEqual(
  unknownArgument.argumentBindings.rows[0].authoringHints,
  [
    'Unknown command argument "removed_argument".',
  ]
);

const disabled =
  projectMechanicsCommandDomainQueryPresentation(
    mechanicsCommandDomainQueryDisabledFixture
  );

assert.equal(disabled.enabled, false);
assert.equal(
  disabled.authoringState.hasIncompleteAuthoring,
  false
);
assert.deepEqual(
  disabled.authoringState.hints,
  []
);

const atLimit =
  projectMechanicsCommandDomainQueryPresentation(
    mechanicsCommandDomainQueryBindingLimitFixture
  );

assert.equal(
  atLimit.argumentBindings.count,
  12
);
assert.equal(
  atLimit.argumentBindings.canAddBinding,
  false
);
assert.equal(
  atLimit.argumentBindings.incompleteCount,
  0
);

assert.deepEqual(
  MECHANICS_COMMAND_DOMAIN_QUERY_CALLBACK_KEYS,
  [
    "onPatch",
    "onAddBinding",
    "onPatchBinding",
    "onRemoveBinding",
  ]
);

assert.match(
  abilitySpell.description,
  /registered read-only Crestfall domain query/i
);
assert.match(
  abilitySpell.description,
  /Queries do not mutate state or grant execution authority/i
);
assert.match(
  abilitySpell.domain.helper,
  /Runtime rejects unregistered domain\/operation pairs/i
);
assert.match(
  abilitySpell.operation.helper,
  /does not define or execute game rules by itself/i
);

const source = fs.readFileSync(
  new URL(
    "./MechanicsCommandDomainQueryPresentation.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "normalizeMechanicsCommandDomainQuery",
  "patchMechanicsCommandDomainQuery",
  "addMechanicsCommandDomainQueryBinding",
  "removeMechanicsCommandDomainQueryBinding",
  "toUpperCase(",
  "replace(/[^A-Z",
  "@/lib/client",
  "fetch(",
  "executeMechanicsCommandDomainQueryForTurn",
  "REGISTERED_DOMAIN_QUERY_ADAPTERS",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `presentation contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "mechanics_command_domain_query_fe_presentation_contract_v1",
  status: "PASSED",
  presentationContractVersion:
    MECHANICS_COMMAND_DOMAIN_QUERY_PRESENTATION_CONTRACT_VERSION,
  authoringContractVersion:
    MECHANICS_COMMAND_DOMAIN_QUERY_AUTHORING_CONTRACT_VERSION,
  maxBindingCount:
    MAX_MECHANICS_COMMAND_DOMAIN_QUERY_BINDINGS,
  readOnlyAuthorityCarried: true,
  incompleteVisualAuthoringCovered: true,
  invocationArgumentProjectionCovered: true,
  unknownArgumentDegradedStateCovered: true,
  bindingLimitCovered: true,
  chassisNormalizationExcluded: true,
  chassisOperationsExcluded: true,
  runtimeAdaptersExcluded: true,
}, null, 2));
