export const CREATION_TYPE_POLICIES = {
  CHARACTER: {
    label: "Character",
    chatCapable: true,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "CHARACTER",
  },

  PLAYER_CHARACTER: {
    label: "Player Character",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "CHARACTER",
  },

  SCENARIO: {
    label: "Scenario",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "SCENARIO",
  },

  LOCATION: {
    label: "Location",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: true,
    editMode: "LOCATION",
  },

  OUTFIT: {
    label: "Outfit",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: true,
    editMode: "OUTFIT",
  },

  POSE: {
    label: "Pose",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: true,
    editMode: "POSE",
  },

  NARRATOR: {
    label: "Narrator",
    chatCapable: true,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "NARRATOR",
  },

  IMAGE_PRESET: {
    label: "Image Preset",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: true,
    editMode: "IMAGE_PRESET",
  },

  ROOM_TEMPLATE: {
    label: "Story",
    chatCapable: true,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "ROOM_TEMPLATE",
  },

  CHARACTER_TEMPLATE: {
    label: "Character Template",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "CHARACTER_TEMPLATE",
  },

  NPC_REGISTRY: {
    label: "NPC Registry",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "REGISTRY",
  },

  LOCATION_REGISTRY: {
    label: "Location Registry",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "REGISTRY",
  },

  FACTION_REGISTRY: {
    label: "Faction Registry",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "REGISTRY",
  },

  ORGANIZATION_REGISTRY: {
    label: "Organization Registry",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "REGISTRY",
  },

  EVENT_REGISTRY: {
    label: "Event Registry",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "REGISTRY",
  },

  QUEST_REGISTRY: {
    label: "Quest Registry",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "REGISTRY",
  },

  ITEM_REGISTRY: {
    label: "Item Registry",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "REGISTRY",
  },

  STORYLINE: {
    label: "Storyline",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "STORYLINE",
  },

  MECHANICS_MODULE: {
    label: "Mechanics Module",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "MECHANICS_MODULE",
  },

  RULES_CODEX: {
    label: "Rules Codex",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "RULES_CODEX",
  },

  LORE: {
    label: "Lore Asset",
    chatCapable: false,
    communityDiscoverable: true,
    profileShowcase: true,
    imageIngredient: false,
    editMode: "LORE",
  },

  TIMELINE: {
    label: "Timeline",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "TIMELINE",
  },

  ACTOR_MECHANICS_PROFILE: {
    label: "Actor Mechanics Profile",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "ACTOR_MECHANICS_PROFILE",
  },

  STATS_POOLS_PROFILE: {
    label: "Stats & Pools Profile",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "STATS_POOLS_PROFILE",
  },

  PROGRESSION_PROFILE: {
    label: "Progression Profile",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "PROGRESSION_PROFILE",
  },

  SKILLS_PROFILE: {
    label: "Skills Profile",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "SKILLS_PROFILE",
  },

  ABILITY_SPELL_PROFILE: {
    label: "Ability & Spell Profile",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "ABILITY_SPELL_PROFILE",
  },

  WALLET_PROFILE: {
    label: "Wallet Profile",
    chatCapable: false,
    communityDiscoverable: false,
    profileShowcase: false,
    imageIngredient: false,
    editMode: "WALLET_PROFILE",
  },
};

export function normalizeCreationType(type) {
  return String(type || "").trim().toUpperCase();
}

export function getCreationTypePolicy(type) {
  const normalizedType = normalizeCreationType(type);

  return (
    CREATION_TYPE_POLICIES[normalizedType] || {
      label: normalizedType || "Creation",
      chatCapable: false,
      communityDiscoverable: false,
      profileShowcase: false,
      imageIngredient: false,
      editMode: "GENERIC",
    }
  );
}

export function isChatCapableCreationType(type) {
  return Boolean(getCreationTypePolicy(type).chatCapable);
}

export function isCommunityDiscoverableCreationType(type) {
  return Boolean(getCreationTypePolicy(type).communityDiscoverable);
}

export function isProfileShowcaseCreationType(type) {
  return Boolean(getCreationTypePolicy(type).profileShowcase);
}

export function isImageIngredientCreationType(type) {
  return Boolean(getCreationTypePolicy(type).imageIngredient);
}

export function getCreationEditMode(type) {
  return getCreationTypePolicy(type).editMode;
}

export const COMMUNITY_DISCOVERABLE_CREATION_TYPES = new Set(
  Object.entries(CREATION_TYPE_POLICIES)
    .filter(([, policy]) => policy.communityDiscoverable)
    .map(([type]) => type)
);

export const PROFILE_SHOWCASE_CREATION_TYPES = new Set(
  Object.entries(CREATION_TYPE_POLICIES)
    .filter(([, policy]) => policy.profileShowcase)
    .map(([type]) => type)
);