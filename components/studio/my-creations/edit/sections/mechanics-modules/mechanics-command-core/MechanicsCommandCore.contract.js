export const MECHANICS_COMMAND_CORE_CONTRACT_VERSION =
  "crestfall.loom.mechanics-command-core.v1";

export const MECHANICS_COMMAND_CONTRACT_VERSION =
  "mechanics_command_contract_v1";

export const MECHANICS_COMMAND_INVOCATION_VERSION =
  "mechanics_command_invocation_v1";

export const COMMAND_ARGUMENT_TYPES = Object.freeze([
  "SELF",
  "CHARACTER_PRESENT",
  "CHARACTER_KNOWN",
  "CHARACTER_BOUND",
  "PLAYER_CHARACTER",
  "ITEM_HELD",
  "ITEM_VISIBLE",
  "ITEM_KNOWN",
  "LOCATION_CURRENT",
  "LOCATION_KNOWN",
  "LOCATION_CONNECTED",
  "NUMBER",
  "ENUM",
  "TEXT",
]);

export const COMMAND_PRESENTATION_MODES = Object.freeze([
  "MECHANICS_ACTION",
  "QUERY",
  "STATE_SETTING",
  "PRESENTATION_ACTION",
  "SYSTEM_RESPONSE",
]);

export const COMMAND_RESULT_VISIBILITIES = Object.freeze([
  "FULL",
  "FULL",
  "TOTAL_ONLY",
  "OUTCOME_ONLY",
  "HIDDEN",
  "PRIVATE_TO_ENGINE",
]);

export const IMPLICIT_COMMAND_ARGUMENT_TYPES = Object.freeze([
  "SELF",
  "PLAYER_CHARACTER",
]);
