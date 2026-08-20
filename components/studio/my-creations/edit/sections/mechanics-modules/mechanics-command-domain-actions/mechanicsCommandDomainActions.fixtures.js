export const MECHANICS_COMMAND_DOMAIN_ACTION_FIXTURES = Object.freeze([
  Object.freeze({
    id: "none",
    label: "No Domain Action",
    invocation: { arguments: [] },
    domainAction: { type: "NONE", enabled: false },
  }),
  Object.freeze({
    id: "item-custody",
    label: "Item Custody",
    invocation: {
      arguments: [
        { name: "item", label: "Held Item", type: "ITEM_HELD" },
        { name: "recipient", label: "Recipient", type: "CHARACTER_PRESENT" },
        { name: "placement", label: "Placement", type: "TEXT" },
        { name: "quantity", label: "Quantity", type: "NUMBER" },
      ],
    },
    domainAction: {
      version: "mechanics_command_domain_action_v1",
      enabled: true,
      type: "ITEM_GIVE",
      itemArgumentName: "item",
      targetArgumentName: "recipient",
      applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
      futureActionMetadata: { retained: true },
    },
  }),
  Object.freeze({
    id: "item-condition",
    label: "Item Damage",
    invocation: {
      arguments: [
        { name: "item", label: "Visible Item", type: "ITEM_VISIBLE" },
        { name: "amount", label: "Condition Amount", type: "NUMBER" },
      ],
    },
    domainAction: {
      enabled: true,
      type: "ITEM_DAMAGE",
      itemArgumentName: "item",
      amountArgumentName: "amount",
      applyOnOutcomes: ["SUCCESS"],
    },
  }),
  Object.freeze({
    id: "participant-condition",
    label: "Participant Condition",
    invocation: {
      arguments: [
        { name: "target", label: "Target Character", type: "CHARACTER_PRESENT" },
        { name: "condition", label: "Condition", type: "TEXT" },
      ],
    },
    domainAction: {
      enabled: true,
      type: "PARTICIPANT_CONDITION_APPLY",
      targetArgumentName: "target",
      conditionArgumentName: "condition",
      applyOnOutcomes: ["SUCCESS"],
    },
  }),
  Object.freeze({
    id: "ability-spell-knowledge",
    label: "Ability / Spell Knowledge",
    invocation: {
      arguments: [
        { name: "actor", label: "Actor", type: "PLAYER_CHARACTER" },
        { name: "ability", label: "Ability or Spell", type: "TEXT" },
      ],
    },
    domainAction: {
      version: "mechanics_command_domain_action_v2",
      enabled: true,
      type: "ABILITY_SPELL_KNOWLEDGE_SET",
      actorArgumentName: "actor",
      abilityArgumentName: "ability",
      knowledgeState: "KNOWN",
      unlockState: "UNLOCKED",
      applyOnOutcomes: ["SUCCESS"],
    },
  }),
  Object.freeze({
    id: "ability-spell-use",
    label: "Ability / Spell Use Authorization",
    invocation: {
      arguments: [
        { name: "actor", label: "Actor", type: "PLAYER_CHARACTER" },
        { name: "ability", label: "Ability or Spell", type: "TEXT" },
        { name: "target", label: "Target", type: "CHARACTER_PRESENT" },
      ],
    },
    domainAction: {
      version: "mechanics_command_domain_action_v3",
      enabled: true,
      type: "ABILITY_SPELL_USE_REQUEST",
      actorArgumentName: "actor",
      abilityArgumentName: "ability",
      targetArgumentName: "target",
      applyOnOutcomes: ["SUCCESS"],
    },
  }),
  Object.freeze({
    id: "location-transition",
    label: "Location Transition",
    invocation: {
      arguments: [
        {
          name: "destination",
          label: "Connected Destination",
          type: "LOCATION_CONNECTED",
        },
      ],
    },
    domainAction: {
      enabled: true,
      type: "LOCATION_TRANSITION",
      destinationArgumentName: "destination",
      applyOnOutcomes: ["CRITICAL_SUCCESS", "SUCCESS"],
    },
  }),
  Object.freeze({
    id: "active-journey",
    label: "Active Journey Operation",
    invocation: { arguments: [] },
    domainAction: {
      enabled: true,
      type: "LOCATION_TRAVEL_OPERATION",
      travelOperation: "APPROACH",
      applyOnOutcomes: ["SUCCESS", "FAILURE"],
    },
  }),
  Object.freeze({
    id: "legacy-aliases",
    label: "Legacy Aliases",
    invocation: {
      arguments: [
        { name: "visible_item", label: "Visible Item", type: "ITEM_VISIBLE" },
        { name: "damage", label: "Damage", type: "NUMBER" },
      ],
    },
    domainAction: {
      action_type: "ITEM_DAMAGE",
      enabled: "yes",
      item_argument_name: "visible_item",
      condition_amount_argument_name: "damage",
      outcomes: "success, fumble",
      futureLegacyMetadata: { retained: true },
    },
  }),
  Object.freeze({
    id: "malformed",
    label: "Malformed but Recoverable",
    invocation: { arguments: null },
    domainAction: {
      type: "UNKNOWN_ACTION",
      enabled: "maybe",
      applyOnOutcomes: ["SUCCESS", "NOT_REAL"],
    },
  }),
]);

export function listMechanicsCommandDomainActionFixtures() {
  return MECHANICS_COMMAND_DOMAIN_ACTION_FIXTURES.map((fixture) => ({
    ...fixture,
    invocation: JSON.parse(JSON.stringify(fixture.invocation)),
    domainAction: JSON.parse(JSON.stringify(fixture.domainAction)),
  }));
}
