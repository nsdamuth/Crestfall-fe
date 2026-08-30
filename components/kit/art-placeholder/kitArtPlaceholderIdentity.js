const GENERIC_IDENTITY = Object.freeze({
  glyph: "✦",
  tone: "neutral",
});

const IDENTITIES = Object.freeze({
  CHARACTER: Object.freeze({ glyph: "C", tone: "ember" }),
  PLAYER_CHARACTER: Object.freeze({ glyph: "P", tone: "ember" }),
  CHARACTER_TEMPLATE: Object.freeze({ glyph: "T", tone: "ember" }),
  NARRATOR: Object.freeze({ glyph: "N", tone: "plum" }),
  OUTFIT: Object.freeze({ glyph: "O", tone: "plum" }),
  CLOTHING: Object.freeze({ glyph: "O", tone: "plum" }),
  POSE: Object.freeze({ glyph: "P", tone: "plum" }),

  ROOM_TEMPLATE: Object.freeze({ glyph: "S", tone: "navy" }),
  STORY: Object.freeze({ glyph: "S", tone: "navy" }),
  SCENARIO: Object.freeze({ glyph: "S", tone: "navy" }),
  STORYLINE: Object.freeze({ glyph: "A", tone: "navy" }),
  ADVENTURE: Object.freeze({ glyph: "A", tone: "navy" }),

  LOCATION: Object.freeze({ glyph: "L", tone: "moss" }),
  LOCATION_REGISTRY: Object.freeze({ glyph: "L", tone: "moss" }),
  NPC_REGISTRY: Object.freeze({ glyph: "N", tone: "moss" }),
  FACTION_REGISTRY: Object.freeze({ glyph: "F", tone: "moss" }),
  ORGANIZATION_REGISTRY: Object.freeze({ glyph: "O", tone: "moss" }),
  EVENT_REGISTRY: Object.freeze({ glyph: "E", tone: "moss" }),
  QUEST_REGISTRY: Object.freeze({ glyph: "Q", tone: "moss" }),
  ITEM_REGISTRY: Object.freeze({ glyph: "I", tone: "moss" }),

  LORE: Object.freeze({ glyph: "§", tone: "bronze" }),
  TIMELINE: Object.freeze({ glyph: "T", tone: "bronze" }),
  RULES_CODEX: Object.freeze({ glyph: "§", tone: "bronze" }),
  MECHANICS_MODULE: Object.freeze({ glyph: "M", tone: "bronze" }),
  ACTOR_MECHANICS_PROFILE: Object.freeze({ glyph: "M", tone: "bronze" }),
  STATS_POOLS_PROFILE: Object.freeze({ glyph: "Σ", tone: "bronze" }),
  PROGRESSION_PROFILE: Object.freeze({ glyph: "↑", tone: "bronze" }),
  SKILLS_PROFILE: Object.freeze({ glyph: "K", tone: "bronze" }),
  ABILITY_SPELL_PROFILE: Object.freeze({ glyph: "A", tone: "bronze" }),
  WALLET_PROFILE: Object.freeze({ glyph: "W", tone: "bronze" }),

  IMAGE_PRESET: Object.freeze({ glyph: "✦", tone: "plum" }),
  IMAGE: Object.freeze({ glyph: "✦", tone: "plum" }),

  DESTINATION_STORIES: Object.freeze({ glyph: "S", tone: "navy" }),
  DESTINATION_ADVENTURES: Object.freeze({ glyph: "A", tone: "navy" }),
  DESTINATION_STUDIO: Object.freeze({ glyph: "✦", tone: "bronze" }),
  DESTINATION_IMAGES: Object.freeze({ glyph: "I", tone: "plum" }),
  DESTINATION_VAULT: Object.freeze({ glyph: "V", tone: "bronze" }),
  DESTINATION_COMMUNITY: Object.freeze({ glyph: "C", tone: "moss" }),
  DESTINATION_CREATORS: Object.freeze({ glyph: "@", tone: "ember" }),
  DESTINATION_LORE: Object.freeze({ glyph: "§", tone: "bronze" }),

  STUDIO_CATEGORY_CHARACTERS_VISUALS: Object.freeze({ glyph: "C", tone: "ember" }),
  STUDIO_CATEGORY_STORIES_SESSIONS: Object.freeze({ glyph: "S", tone: "navy" }),
  STUDIO_CATEGORY_WORLDS_CONTINUITY: Object.freeze({ glyph: "W", tone: "moss" }),
  STUDIO_CATEGORY_RULES_MECHANICS: Object.freeze({ glyph: "M", tone: "bronze" }),
  STUDIO_CATEGORY_TEMPLATES_GENERATION: Object.freeze({ glyph: "T", tone: "plum" }),
});

export const KIT_ART_PLACEHOLDER_TONES = Object.freeze({
  neutral: Object.freeze({
    background:
      "radial-gradient(circle at 70% 30%, rgba(183, 145, 82, 0.11), transparent 34%), linear-gradient(145deg, rgba(18, 17, 15, 0.98), rgba(10, 10, 9, 1))",
  }),
  ember: Object.freeze({
    background:
      "radial-gradient(circle at 70% 28%, rgba(127, 50, 35, 0.22), transparent 36%), linear-gradient(145deg, rgba(31, 19, 17, 0.98), rgba(10, 9, 9, 1))",
  }),
  navy: Object.freeze({
    background:
      "radial-gradient(circle at 72% 28%, rgba(39, 76, 112, 0.22), transparent 38%), linear-gradient(145deg, rgba(15, 23, 31, 0.98), rgba(9, 10, 11, 1))",
  }),
  moss: Object.freeze({
    background:
      "radial-gradient(circle at 72% 28%, rgba(54, 94, 61, 0.20), transparent 38%), linear-gradient(145deg, rgba(16, 27, 20, 0.98), rgba(9, 10, 9, 1))",
  }),
  plum: Object.freeze({
    background:
      "radial-gradient(circle at 72% 28%, rgba(96, 50, 84, 0.22), transparent 38%), linear-gradient(145deg, rgba(28, 17, 26, 0.98), rgba(10, 9, 10, 1))",
  }),
  bronze: Object.freeze({
    background:
      "radial-gradient(circle at 72% 28%, rgba(119, 87, 48, 0.20), transparent 38%), linear-gradient(145deg, rgba(28, 23, 17, 0.98), rgba(10, 9, 8, 1))",
  }),
});

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function getKitArtPlaceholderIdentity(identityKey) {
  const normalizedKey = normalizeKey(identityKey);
  const identity = IDENTITIES[normalizedKey] || GENERIC_IDENTITY;

  return {
    ...identity,
    toneStyle:
      KIT_ART_PLACEHOLDER_TONES[identity.tone] ||
      KIT_ART_PLACEHOLDER_TONES.neutral,
  };
}
