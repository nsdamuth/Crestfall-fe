"use client";

import { getFirstCreationMediaUrl } from "@/lib/shared/creations/creationMedia";

const ICON_NAME_BY_SLOT_ID = Object.freeze({
  character: "users",
  playerCharacter: "user",
  pose: "theater",
  outfit: "shirt",
  location: "map-pin",
  preset: "sparkles",
});

function getItemId(item, index) {
  return item?.id ? String(item.id) : `ingredient-option-${index}`;
}

function toViewItem(item, index) {
  const featuredMedia = Array.isArray(item?.featuredMedia)
    ? item.featuredMedia
    : Array.isArray(item?.featured_media)
      ? item.featured_media
      : [];
  const thumbnailUrl = getFirstCreationMediaUrl(featuredMedia, {
    variant: "thumbnail",
    fallback:
      item?.thumbnailUrl ||
      item?.thumbnail_url ||
      item?.imageUrl ||
      item?.image_url ||
      "",
  });

  return {
    id: getItemId(item, index),
    title: item?.title || "Untitled Creation",
    subtitle: item?.subtitle || "",
    description: item?.description || "",
    type: item?.type || "Creation",
    contentRating: item?.contentRating || item?.content_rating || "SFW",
    imageUrl: thumbnailUrl || "",
  };
}

export function useIngredientPickerViewModel({
  slot = {},
  items = [],
  loadError = "",
  selected = null,
  onSelect = null,
  onUseCustom = null,
  onCreatePreset = null,
  onClose = null,
} = {}) {
  const ingredientLabel = slot?.label || "Ingredient";
  const viewItems = (items || []).map(toViewItem);
  const rawItemById = new Map(
    (items || []).map((item, index) => [getItemId(item, index), item])
  );

  function chooseIngredient(itemId) {
    const item = rawItemById.get(String(itemId || ""));
    if (!item) return;

    onSelect?.(item);
  }

  function useCustom() {
    onUseCustom?.(slot);
  }

  function createPreset() {
    onCreatePreset?.(slot);
  }

  return {
    ingredientLabel,
    headerIconName: ICON_NAME_BY_SLOT_ID[slot?.id] || "sparkles",
    items: viewItems,
    selectedItemId: selected?.id ? String(selected.id) : "",
    loadErrorMessage: loadError || "",
    searchPlaceholder: `Search ${ingredientLabel.toLowerCase()}...`,
    emptyMessage: `No ${ingredientLabel.toLowerCase()} assets found.`,
    showUseCustomAction: slot?.allowCustom !== false,
    showCreatePresetAction: Boolean(slot?.allowCreatePreset),
    onClose,
    onChooseIngredient: chooseIngredient,
    onUseCustom: useCustom,
    onCreatePreset: createPreset,
  };
}
