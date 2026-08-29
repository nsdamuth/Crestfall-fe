import {
  CHARACTER_CREATOR_TYPES,
  normalizeCharacterCreatorType,
} from "@/components/studio/create/character/characterCreationMode";

// RULED 11 Aug 2026 (Sprint H render review, item 3): the preview
// generation cost, "cost value from fixtures." No pricing table
// exists yet for quick-create preview generation; this is the
// package-local placeholder value until CR-driven pricing lands.
export const CHARACTER_PREVIEW_TOKEN_COST = 40;

function resolveIdentityDisplayValue(
  selectedValue,
  customValue,
  emptyFallback,
  customFallback
) {
  const selected = String(selectedValue || "").trim();

  if (selected === "CUSTOM") {
    return String(customValue || "").trim() || customFallback;
  }

  return selected || emptyFallback;
}

export function useCharacterPreviewViewModel({
  form = {},
  creationType = CHARACTER_CREATOR_TYPES.CHARACTER,
} = {}) {
  const name = form?.name || "";
  const normalizedType = normalizeCharacterCreatorType(creationType);
  const fallbackName =
    normalizedType === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER
      ? "Unnamed Player Character"
      : "Unnamed Character";

  return {
    displayInitial: String(
      name ||
        (normalizedType === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER ? "P" : "C")
    )
      .slice(0, 1)
      .toUpperCase(),
    characterName: name || fallbackName,
    characterSubtitle:
      form?.title || form?.short_concept || "Private Draft",
    speciesLabel: resolveIdentityDisplayValue(
      form?.species,
      form?.custom_species,
      "Species not chosen yet.",
      "Custom species not entered yet."
    ),
    genderPresentationLabel: resolveIdentityDisplayValue(
      form?.gender_presentation,
      form?.custom_gender_presentation,
      "Gender presentation not chosen yet.",
      "Custom gender presentation not entered yet."
    ),
    clothingStyleLabel:
      form?.clothing_style || "Clothing style not chosen yet.",
    previewCostLabel: String(CHARACTER_PREVIEW_TOKEN_COST),
  };
}
