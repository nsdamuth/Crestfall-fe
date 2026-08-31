export const LORE_ENGINE_USE_CONTRACT_VERSION =
  "lore_engine_use_contract_v2";

export const LORE_ENGINE_USE_KNOWLEDGE_MODES = Object.freeze([
  {
    value: "PERSONAL_PARTICIPANT",
    label: "Personal participant",
  },
  {
    value: "DIRECT_WITNESS",
    label: "Direct witness",
  },
  {
    value: "SECONDHAND",
    label: "Secondhand knowledge",
  },
  {
    value: "INSTITUTIONAL",
    label: "Institutional knowledge",
  },
  {
    value: "CULTURAL",
    label: "Cultural knowledge",
  },
  {
    value: "RUMOR",
    label: "Rumor",
  },
  {
    value: "SCHOLARLY",
    label: "Scholarly knowledge",
  },
  {
    value: "PRIVATE_BELIEF",
    label: "Private belief",
  },
]);

export const LORE_ENGINE_USE_BINDING_SCOPE_TYPES = Object.freeze([
  {
    value: "ASSET",
    label: "All submitted Lore",
  },
  {
    value: "CHAPTER",
    label: "One chapter",
  },
  {
    value: "SECTION",
    label: "One section",
  },
]);

export const LORE_ENGINE_USE_AVAILABILITY_MODES = Object.freeze([
  { value: "ALWAYS", label: "Always available" },
  { value: "FROM", label: "Available starting at a story time" },
  { value: "UNTIL", label: "Available until a story time" },
  { value: "BETWEEN", label: "Available between story times" },
]);
