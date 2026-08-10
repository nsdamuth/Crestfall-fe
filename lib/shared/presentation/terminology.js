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

// Content rating presentation, ruled 9 Aug 2026 (kit revision pass).
// The backend carries three values (lib/server/creations/constants.js:
// SFW, MATURE, EXPLICIT); the presentation layer shows a four-tier
// system. Teen has no backend value yet: it is a stub pending CR-027
// (backend four-tier rating field, owner Nick) and Brian's final
// ruling on labels and tier count per CRESTFALL-CONTENT-STANDARDS.md
// (draft). Film anchors appear in description text only, never as the
// tier label.
export const CONTENT_RATING_DISPLAY_NAMES = {
  SFW: "Everyone",
  MATURE: "Mature",
  EXPLICIT: "Adult 18+",
};

export const CONTENT_RATING_TIERS = [
  {
    tier: "EVERYONE",
    backendValue: "SFW",
    label: "Everyone",
    description: "Open to all. Comparable to a G or PG film.",
  },
  {
    tier: "TEEN",
    backendValue: null,
    label: "Teen",
    description: "Comparable to a PG-13 film. Arrives with CR-027.",
    isPending: true,
  },
  {
    tier: "MATURE",
    backendValue: "MATURE",
    label: "Mature",
    description: "Comparable to an R film.",
  },
  {
    tier: "ADULT",
    backendValue: "EXPLICIT",
    label: "Adult 18+",
    description: "Comparable to an NC-17 film. Age-gated.",
  },
];

export function getContentRatingDisplayName(contentRating) {
  const normalized = String(contentRating || "").trim().toUpperCase();
  return CONTENT_RATING_DISPLAY_NAMES[normalized] || normalized || "";
}
