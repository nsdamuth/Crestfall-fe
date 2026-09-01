import {
  CHARACTER_CREATOR_TYPES,
  normalizeCharacterCreatorType,
} from "@/components/studio/create/character/characterCreationMode";
import {
  CHARACTER_PREVIEW_COIN_COST,
} from "./characterPreviewGeneration";

export { CHARACTER_PREVIEW_COIN_COST };

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
  previewImageUrl = "",
  previewStatus = "idle",
  previewError = "",
  onGeneratePreview = null,
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
      form?.clothing_style || "Default clothing not chosen yet.",
    previewCostLabel: String(CHARACTER_PREVIEW_COIN_COST),
    previewImageUrl: String(previewImageUrl || ""),
    previewStatus: String(previewStatus || "idle"),
    previewError: String(previewError || ""),
    previewDisabled: ["preparing", "generating"].includes(previewStatus),
    onGeneratePreview,
  };
}
