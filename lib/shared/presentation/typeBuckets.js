// Five-bucket type filter, RULED 23 Aug 2026 (build-0823 pass 3):
// promoted from two identical copies (Vault, Community) into one
// shared module. Applies to mixed-asset-kind lists (Vault, Community);
// Stories keeps its own playable-kinds filter, other list pages keep
// their own domain filters.
//
// W2 live-catalog convergence (24 Aug 2026): the original V2 mock only
// knew four fixture card kinds. Real Crestfall owns a much broader set
// of creation types, so this presentation layer now owns the explicit
// raw creation-type -> V2 card-kind mapping as well. This is display
// grouping only; backend creation types remain unchanged.
export const ASSET_KIND_TO_TYPE_BUCKET = Object.freeze({
  character: "characters",
  world: "worlds",
  look: "looks",
  image: "looks",
  story: "stories",
  adventure: "adventures",
});

export const TYPE_BUCKET_OPTIONS = Object.freeze([
  { value: "characters", label: "Characters" },
  { value: "worlds", label: "Worlds" },
  { value: "looks", label: "Looks" },
  { value: "stories", label: "Stories" },
  { value: "adventures", label: "Adventures" },
]);

const CHARACTER_TYPES = new Set([
  "CHARACTER",
  "PLAYER_CHARACTER",
  "CHARACTER_TEMPLATE",
  "NARRATOR",
]);

const LOOK_TYPES = new Set([
  "OUTFIT",
  "WARDROBE",
  "POSE",
  "IMAGE_PRESET",
]);

const STORY_TYPES = new Set(["ROOM_TEMPLATE"]);
const ADVENTURE_TYPES = new Set(["STORYLINE"]);

export function getAssetKindForCreationType(creationType) {
  const normalizedType = String(creationType || "").trim().toUpperCase();

  if (CHARACTER_TYPES.has(normalizedType)) return "character";
  if (LOOK_TYPES.has(normalizedType)) return "look";
  if (STORY_TYPES.has(normalizedType)) return "story";
  if (ADVENTURE_TYPES.has(normalizedType)) return "adventure";

  // Locations, scenarios, registries, lore/rules and mechanics/profile
  // assets are grouped under Worlds until V2 introduces a narrower
  // product bucket. Keeping them visible is preferable to silently
  // dropping supported Crestfall creation types from Vault/Community.
  return "world";
}

export function getTypeBucketForCreationType(creationType) {
  return ASSET_KIND_TO_TYPE_BUCKET[getAssetKindForCreationType(creationType)] || "worlds";
}
