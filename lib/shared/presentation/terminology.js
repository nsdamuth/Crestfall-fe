// Backend name -> display name, per docs/CRESTFALL-PRODUCT-MODEL.md's
// "Naming gaps owed by Nick" section and the 9 Aug 2026 rulings logged in
// docs/CONTRACT-REQUESTS.md (CR-024, CR-025). Presentation mapping only;
// backend type/table/field names are unchanged. No component wires this
// in yet -- see CR-024 and CR-025 for the pending backend renames this
// module is standing in for.

export const CREATION_TYPE_DISPLAY_NAMES = {
  CHARACTER: "Character",
  PLAYER_CHARACTER: "Player Character",
  SCENARIO: "Scenario",
  LOCATION: "Location",
  OUTFIT: "Outfit",
  WARDROBE: "Wardrobe",
  POSE: "Pose",
  NARRATOR: "Narrator",
  IMAGE_PRESET: "Image Preset",
  ROOM_TEMPLATE: "Story",
  CHARACTER_TEMPLATE: "Character Template",
  NPC_REGISTRY: "NPC Registry",
  LOCATION_REGISTRY: "Location Registry",
  FACTION_REGISTRY: "Faction Registry",
  ORGANIZATION_REGISTRY: "Organization Registry",
  EVENT_REGISTRY: "Event Registry",
  QUEST_REGISTRY: "Quest Registry",
  ITEM_REGISTRY: "Item Registry",
  STORYLINE: "Adventure",
  MECHANICS_MODULE: "Mechanics Module",
  RULES_CODEX: "Rules Codex",
  LORE: "Lore Asset",
  ACTOR_MECHANICS_PROFILE: "Actor Mechanics Profile",
  STATS_POOLS_PROFILE: "Stats & Pools Profile",
  PROGRESSION_PROFILE: "Progression Profile",
};

// The Scenario asset type's "category" field carries its own enum
// (components/studio/create/scenario/constants.js), separate from the
// creation-type enum above. Its "ADVENTURE" category value collides in
// name with the Storyline -> Adventure rename, so it is ruled to display
// as "Scenario" instead, no alias.
export const SCENARIO_CATEGORY_DISPLAY_NAMES = {
  ADVENTURE: "Scenario",
};

export function getCreationTypeDisplayName(creationType) {
  const normalized = String(creationType || "").trim().toUpperCase();
  return CREATION_TYPE_DISPLAY_NAMES[normalized] || normalized || "Creation";
}

export function getScenarioCategoryDisplayName(categoryValue) {
  const normalized = String(categoryValue || "").trim().toUpperCase();
  return SCENARIO_CATEGORY_DISPLAY_NAMES[normalized] || categoryValue || "";
}

// Content rating presentation, ruled 9 Aug 2026 (kit revision pass),
// corrected 9 Aug 2026 (demo prep pass), ruled final 9 Aug 2026 (kit
// polish 2 pass, see docs/CONTRACT-REQUESTS.md CR-027). Three backend
// values (lib/server/creations/constants.js: SFW, MATURE, EXPLICIT)
// map one to one onto three live display tiers: SFW is Everyone,
// MATURE is Teen, EXPLICIT is Adult. No disabled row, no interim
// note, no NC-17 anywhere. Film anchors surface as the row tooltip
// (native title attribute), never as the tier label or a visible
// description line.
export const CONTENT_RATING_DISPLAY_NAMES = {
  SFW: "Everyone",
  MATURE: "Teen",
  EXPLICIT: "Adult",
};

export const CONTENT_RATING_TIERS = [
  {
    tier: "EVERYONE",
    backendValue: "SFW",
    label: "Everyone",
    tooltip: "Comparable to a G or PG film.",
  },
  {
    tier: "TEEN",
    backendValue: "MATURE",
    label: "Teen",
    tooltip: "Comparable to a PG-13 film.",
  },
  {
    tier: "ADULT",
    backendValue: "EXPLICIT",
    label: "Adult",
    tooltip: "Comparable to an R film.",
  },
];

export function getContentRatingDisplayName(contentRating) {
  const normalized = String(contentRating || "").trim().toUpperCase();
  return CONTENT_RATING_DISPLAY_NAMES[normalized] || normalized || "";
}
