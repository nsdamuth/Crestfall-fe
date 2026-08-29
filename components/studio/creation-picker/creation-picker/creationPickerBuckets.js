// Vault-bucket grammar for the creation picker, ruling N7 (option A,
// ratified 12 Aug 2026, docs/plans/FABLE-GATE-2-STUDIO.md): the
// picker lists ALL owned creations, filtered by the five vault
// buckets plus a More bucket carrying the remaining pro types. Every
// one of the product's 28 creation types
// (lib/server/creations/constants.js CREATION_TYPES) maps onto
// exactly one bucket below; a type absent from this map is a defect,
// never a silent "More" fallback.

export const CREATION_PICKER_BUCKETS = [
  { value: "characters", label: "Characters" },
  { value: "worlds", label: "Worlds" },
  { value: "looks", label: "Looks" },
  { value: "stories", label: "Stories" },
  { value: "adventures", label: "Adventures" },
  { value: "more", label: "More" },
];

export const CREATION_TYPE_TO_BUCKET = {
  CHARACTER: "characters",
  PLAYER_CHARACTER: "characters",
  CHARACTER_TEMPLATE: "characters",

  LOCATION: "worlds",
  LOCATION_REGISTRY: "worlds",
  FACTION_REGISTRY: "worlds",
  ORGANIZATION_REGISTRY: "worlds",
  EVENT_REGISTRY: "worlds",

  OUTFIT: "looks",
  WARDROBE: "looks",
  POSE: "looks",
  IMAGE_PRESET: "looks",

  ROOM_TEMPLATE: "stories",

  STORYLINE: "adventures",
  SCENARIO: "adventures",

  NARRATOR: "more",
  NPC_REGISTRY: "more",
  QUEST_REGISTRY: "more",
  ITEM_REGISTRY: "more",
  MECHANICS_MODULE: "more",
  RULES_CODEX: "more",
  LORE: "more",
  TIMELINE: "more",
  ACTOR_MECHANICS_PROFILE: "more",
  STATS_POOLS_PROFILE: "more",
  PROGRESSION_PROFILE: "more",
  SKILLS_PROFILE: "more",
  ABILITY_SPELL_PROFILE: "more",
  WALLET_PROFILE: "more",
};

export function resolveCreationBucket(creationType) {
  const normalized = String(creationType || "").trim().toUpperCase();
  return CREATION_TYPE_TO_BUCKET[normalized] || "more";
}
