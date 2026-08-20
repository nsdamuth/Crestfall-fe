export const MECHANICS_COMMAND_DOMAIN_ACTIONS_CONTRACT_VERSION =
  "crestfall.loom.mechanics-command-domain-actions.v1_2";

export const MECHANICS_COMMAND_DOMAIN_ACTION_VERSION =
  "mechanics_command_domain_action_v1";
export const MECHANICS_COMMAND_DOMAIN_ACTION_VERSION_V2 =
  "mechanics_command_domain_action_v2";
export const MECHANICS_COMMAND_DOMAIN_ACTION_VERSION_V3 =
  "mechanics_command_domain_action_v3";

export const COMMAND_DOMAIN_ACTION_TYPES = Object.freeze([
  Object.freeze({ value: "NONE", label: "None" }),
  Object.freeze({ value: "ITEM_GIVE", label: "Give Held Item" }),
  Object.freeze({ value: "ITEM_DROP", label: "Drop Held Item" }),
  Object.freeze({ value: "ITEM_TAKE", label: "Take Visible Item" }),
  Object.freeze({ value: "ITEM_EQUIP", label: "Equip Held Item" }),
  Object.freeze({ value: "ITEM_UNEQUIP", label: "Unequip Held Item" }),
  Object.freeze({ value: "ITEM_STORE", label: "Store Held Item" }),
  Object.freeze({ value: "ITEM_PLACE", label: "Place Held Item" }),
  Object.freeze({ value: "ITEM_USE", label: "Use Held Item" }),
  Object.freeze({ value: "ITEM_CONSUME", label: "Consume Held Item" }),
  Object.freeze({ value: "ITEM_DAMAGE", label: "Damage Visible Item" }),
  Object.freeze({ value: "ITEM_REPAIR", label: "Repair Visible Item" }),
  Object.freeze({
    value: "LOCATION_TRANSITION",
    label: "Travel to Connected Location",
  }),
  Object.freeze({
    value: "LOCATION_TRAVEL_OPERATION",
    label: "Active Journey Operation",
  }),
  Object.freeze({
    value: "PARTICIPANT_CONDITION_APPLY",
    label: "Apply Character Condition",
  }),
  Object.freeze({
    value: "PARTICIPANT_CONDITION_REMOVE",
    label: "Remove Character Condition",
  }),
  Object.freeze({
    value: "ABILITY_SPELL_KNOWLEDGE_SET",
    label: "Set Ability / Spell Knowledge",
  }),
  Object.freeze({
    value: "ABILITY_SPELL_USE_REQUEST",
    label: "Authorize Ability / Spell Use",
  }),
]);

export const COMMAND_DOMAIN_ACTION_TYPE_VALUES = Object.freeze(
  COMMAND_DOMAIN_ACTION_TYPES.map((item) => item.value)
);

export const COMMAND_DOMAIN_ACTION_OUTCOMES = Object.freeze([
  "CRITICAL_SUCCESS",
  "SUCCESS",
  "FAILURE",
  "FUMBLE",
]);

export const LOCATION_TRAVEL_OPERATIONS = Object.freeze([
  "CONTINUE",
  "STOP",
  "RESUME",
  "APPROACH",
  "ARRIVE",
]);

export const COMMAND_DOMAIN_ARGUMENT_TYPES = Object.freeze({
  heldItem: "ITEM_HELD",
  visibleItem: "ITEM_VISIBLE",
  connectedLocation: "LOCATION_CONNECTED",
  presentCharacter: "CHARACTER_PRESENT",
  text: "TEXT",
  number: "NUMBER",
});

export const ABILITY_SPELL_KNOWLEDGE_STATES = Object.freeze([
  "KEEP",
  "KNOWN",
  "UNKNOWN",
]);

export const ABILITY_SPELL_UNLOCK_STATES = Object.freeze([
  "KEEP",
  "UNLOCKED",
  "LOCKED",
]);

export const ABILITY_SPELL_ACTOR_ARGUMENT_TYPES = Object.freeze([
  "PLAYER_CHARACTER",
  "CHARACTER_PRESENT",
]);

export const ABILITY_SPELL_USE_ACTOR_ARGUMENT_TYPES = Object.freeze([
  "PLAYER_CHARACTER",
]);
