export const ASSET_NEGATIVE_PROMPT_GUIDANCE_MAX_LENGTH = 300;

export const ASSET_NEGATIVE_PROMPT_GUIDANCE_CREATION_TYPES = Object.freeze([
  "CHARACTER",
  "PLAYER_CHARACTER",
  "OUTFIT",
  "WARDROBE",
  "LOCATION",
]);

const CREATION_TYPE_SET = new Set(ASSET_NEGATIVE_PROMPT_GUIDANCE_CREATION_TYPES);

export function limitAssetNegativePromptGuidance(value) {
  return String(value || "").slice(0, ASSET_NEGATIVE_PROMPT_GUIDANCE_MAX_LENGTH);
}

export function getCreationAssetNegativePromptGuidance(creation = null) {
  const source = creation?.rawCreation || creation || {};
  const type = String(source?.type || creation?.type || "").trim().toUpperCase();

  if (!CREATION_TYPE_SET.has(type)) return "";

  const data = source?.data && typeof source.data === "object" ? source.data : {};
  return limitAssetNegativePromptGuidance(data.negative_prompt);
}

const INHERITED_SLOT_LABELS = Object.freeze([
  ["character", "Character"],
  ["playerCharacter", "Player Character"],
  ["outfit", "Clothing Source"],
  ["location", "Location"],
]);

export function getInheritedAssetNegativePromptItems(selectedIngredients = {}) {
  const ingredients =
    selectedIngredients && typeof selectedIngredients === "object"
      ? selectedIngredients
      : {};

  return INHERITED_SLOT_LABELS.flatMap(([slotId, fallbackLabel]) => {
    const item = ingredients[slotId];
    if (!item || item.custom) return [];

    const text = getCreationAssetNegativePromptGuidance(item);
    if (!text) return [];

    return [{
      id: slotId,
      label: String(item.title || fallbackLabel),
      sourceLabel: fallbackLabel,
      text,
    }];
  });
}
