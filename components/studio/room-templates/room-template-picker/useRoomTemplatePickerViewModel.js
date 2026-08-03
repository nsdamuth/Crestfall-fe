"use client";

import { useMemo } from "react";

import { getPickerImageUrl } from "@/components/studio/room-templates/roomTemplateUtils";

const PICKER_CONFIGS = {
  characters: {
    eyebrow: "Character Picker",
    title: "Select Characters",
    description:
      "Choose the characters that will actually be included in this Story package.",
    iconName: "characters",
    searchPlaceholder: "Search characters...",
    emptyMessage: "No characters found.",
  },
  scenario: {
    eyebrow: "Scenario Picker",
    title: "Select Scenario",
    description:
      "Choose the script/recommendation layer that this Story can use as guidance.",
    iconName: "scenario",
    searchPlaceholder: "Search scenarios...",
    emptyMessage: "No scenarios found.",
  },
  narrator: {
    eyebrow: "Narrator Picker",
    title: "Select Narrator",
    description:
      "Choose the reusable prose, pacing, and runtime voice object for this Story.",
    iconName: "narrator",
    searchPlaceholder: "Search narrators...",
    emptyMessage: "No narrators found.",
  },
  location: {
    eyebrow: "Location Picker",
    title: "Select Location",
    description:
      "Choose the optional location or scene anchor for this Story.",
    iconName: "location",
    searchPlaceholder: "Search locations...",
    emptyMessage: "No locations found.",
  },
  reference: {
    eyebrow: "Story Picker",
    title: "Select Reference",
    description: "Choose a Story reference.",
    iconName: "reference",
    searchPlaceholder: "Search references...",
    emptyMessage: "No references found.",
  },
};

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeRecommendedIds(recommendedIds) {
  if (recommendedIds instanceof Set) return [...recommendedIds];
  return normalizeArray(recommendedIds);
}

function getOptionsForPicker({
  picker,
  characterOptions,
  scenarioOptions,
  narratorOptions,
  locationOptions,
}) {
  if (picker === "characters") return normalizeArray(characterOptions);
  if (picker === "scenario") return normalizeArray(scenarioOptions);
  if (picker === "narrator") return normalizeArray(narratorOptions);
  if (picker === "location") return normalizeArray(locationOptions);

  return [];
}

function getSelectedIds({
  picker,
  selectedCharacters,
  selectedScenario,
  selectedNarrator,
  selectedLocation,
}) {
  if (picker === "characters") {
    return normalizeArray(selectedCharacters)
      .map((character) => character?.id)
      .filter(Boolean);
  }

  if (picker === "scenario") {
    return selectedScenario?.id ? [selectedScenario.id] : [];
  }

  if (picker === "narrator") {
    return selectedNarrator?.id ? [selectedNarrator.id] : [];
  }

  if (picker === "location") {
    return selectedLocation?.id ? [selectedLocation.id] : [];
  }

  return [];
}

function toViewItem(option) {
  const title = option?.title || option?.name || "Untitled Reference";
  const subtitle =
    option?.subtitle ||
    option?.description ||
    option?.public_description ||
    "";

  return {
    id: option?.id || "",
    title,
    subtitle,
    description:
      option?.description ||
      option?.subtitle ||
      option?.public_description ||
      "",
    type: option?.type || "REFERENCE",
    imageUrl:
      option?.imageUrl || option?.image_url || getPickerImageUrl(option),
    contentRating:
      option?.contentRating ||
      option?.content_rating ||
      option?.rating ||
      "SFW",
  };
}

export function useRoomTemplatePickerViewModel({
  picker,
  selectedCharacters = [],
  selectedScenario = null,
  selectedNarrator = null,
  selectedLocation = null,
  characterOptions = [],
  scenarioOptions = [],
  narratorOptions = [],
  locationOptions = [],
  recommendedIds,
  onClose,
  onToggleCharacter,
  onSelectScenario,
  onSelectNarrator,
  onSelectLocation,
}) {
  const normalizedPicker = PICKER_CONFIGS[picker] ? picker : "reference";
  const config = PICKER_CONFIGS[normalizedPicker];

  const rawOptions = useMemo(
    () =>
      getOptionsForPicker({
        picker: normalizedPicker,
        characterOptions,
        scenarioOptions,
        narratorOptions,
        locationOptions,
      }),
    [
      characterOptions,
      locationOptions,
      narratorOptions,
      normalizedPicker,
      scenarioOptions,
    ]
  );

  const rawOptionsById = useMemo(() => {
    const byId = new Map();

    rawOptions.forEach((option) => {
      if (option?.id) byId.set(option.id, option);
    });

    return byId;
  }, [rawOptions]);

  const items = useMemo(() => rawOptions.map(toViewItem), [rawOptions]);

  const selectedIds = useMemo(
    () =>
      getSelectedIds({
        picker: normalizedPicker,
        selectedCharacters,
        selectedScenario,
        selectedNarrator,
        selectedLocation,
      }),
    [
      normalizedPicker,
      selectedCharacters,
      selectedLocation,
      selectedNarrator,
      selectedScenario,
    ]
  );

  const normalizedRecommendedIds = useMemo(
    () => normalizeRecommendedIds(recommendedIds),
    [recommendedIds]
  );

  function chooseItem(itemId) {
    const selectedItem = rawOptionsById.get(itemId);

    if (!selectedItem) return;

    if (normalizedPicker === "characters") {
      onToggleCharacter?.(selectedItem);
      return;
    }

    if (normalizedPicker === "scenario") {
      onSelectScenario?.(selectedItem);
      return;
    }

    if (normalizedPicker === "narrator") {
      onSelectNarrator?.(selectedItem);
      return;
    }

    if (normalizedPicker === "location") {
      onSelectLocation?.(selectedItem);
    }
  }

  return {
    ...config,
    items,
    selectedIds,
    recommendedIds: normalizedRecommendedIds,
    onClose,
    onChooseItem: chooseItem,
  };
}
