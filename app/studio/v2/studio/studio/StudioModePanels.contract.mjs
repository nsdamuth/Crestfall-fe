export const FULL_STUDIO_CATEGORY_PRESENTATION = Object.freeze({
  CHARACTERS_VISUALS: Object.freeze({
    slug: "characters",
    identityKey: "STUDIO_CATEGORY_CHARACTERS_VISUALS",
  }),
  STORIES_SESSIONS: Object.freeze({
    slug: "stories",
    identityKey: "STUDIO_CATEGORY_STORIES_SESSIONS",
  }),
  WORLDS_CONTINUITY: Object.freeze({
    slug: "worlds",
    identityKey: "STUDIO_CATEGORY_WORLDS_CONTINUITY",
  }),
  RULES_MECHANICS: Object.freeze({
    slug: "mechanics",
    identityKey: "STUDIO_CATEGORY_RULES_MECHANICS",
  }),
  TEMPLATES_GENERATION: Object.freeze({
    slug: "templates",
    identityKey: "STUDIO_CATEGORY_TEMPLATES_GENERATION",
  }),
});

const STUDIO_ASSET_IDENTITY_BY_TITLE = Object.freeze({
  Character: "CHARACTER",
  "Player Character": "PLAYER_CHARACTER",
  Location: "LOCATION",
  Scenario: "SCENARIO",
  Story: "STORY",
  Storyline: "STORYLINE",
  "Outfit / Clothing": "OUTFIT",
  Outfit: "OUTFIT",
  Wardrobe: "OUTFIT",
  Pose: "POSE",
  Narrator: "NARRATOR",
  "Image Preset": "IMAGE_PRESET",
  "NPC Registry": "NPC_REGISTRY",
  "Location Registry": "LOCATION_REGISTRY",
  "Faction Registry": "FACTION_REGISTRY",
  "Organization Registry": "ORGANIZATION_REGISTRY",
  "Item Registry": "ITEM_REGISTRY",
  "Event Registry": "EVENT_REGISTRY",
  "Quest Registry": "QUEST_REGISTRY",
  "Stats & Pools Profile": "STATS_POOLS_PROFILE",
  "Progression Profile": "PROGRESSION_PROFILE",
  "Skills Profile": "SKILLS_PROFILE",
  "Ability & Spell Profile": "ABILITY_SPELL_PROFILE",
  "Wallet Profile": "WALLET_PROFILE",
  "Mechanics Module": "MECHANICS_MODULE",
  "Actor Mechanics Profile": "ACTOR_MECHANICS_PROFILE",
  "Rules Codex": "RULES_CODEX",
  "Character Template": "CHARACTER_TEMPLATE",
  "Lore Asset": "LORE",
});

export function getFullStudioCategoryPresentation(sectionId = "") {
  return FULL_STUDIO_CATEGORY_PRESENTATION[String(sectionId || "").trim()] || null;
}

export function getStudioAssetIdentityKey(assetOrTitle = "") {
  const title =
    typeof assetOrTitle === "string"
      ? assetOrTitle
      : String(assetOrTitle?.title || "");
  return STUDIO_ASSET_IDENTITY_BY_TITLE[title.trim()] || "IMAGE";
}

export function getFullStudioSectionSlug(sectionId = "") {
  return getFullStudioCategoryPresentation(sectionId)?.slug || "";
}

export function findFullStudioSectionBySlug(sections = [], slug = "") {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) return null;

  return (
    sections.find(
      (section) => getFullStudioSectionSlug(section?.id) === normalizedSlug
    ) || null
  );
}
