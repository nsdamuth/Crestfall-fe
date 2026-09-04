"use client";

import { useMemo } from "react";

import { getDefaultCreationImageForType } from "@/lib/shared/creations/creationMedia";
import { getPickerImageUrl } from "@/components/studio/create/room-template/roomTemplateUtils";

const PICKER_CONFIGS = {
  characters: {
    title: "Select Characters",
    iconName: "characters",
    emptyMessage: "No characters found.",
  },
  scenario: {
    title: "Select Scenario",
    iconName: "scenario",
    emptyMessage: "No scenarios found.",
  },
  narrator: {
    title: "Select Narrator",
    iconName: "narrator",
    emptyMessage: "No narrators found.",
  },
  location: {
    title: "Select Fixed Opening Location",
    iconName: "location",
    emptyMessage: "No locations found.",
  },
  openingLocations: {
    title: "Select Allowed Opening Locations",
    iconName: "location",
    emptyMessage: "No locations found.",
  },
  players: {
    title: "Select Players",
    iconName: "players",
    emptyMessage: "No mutual players found.",
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
  mutualPlayers,
}) {
  if (picker === "characters") return normalizeArray(characterOptions);
  if (picker === "scenario") return normalizeArray(scenarioOptions);
  if (picker === "narrator") return normalizeArray(narratorOptions);
  if (picker === "location" || picker === "openingLocations") {
    return normalizeArray(locationOptions);
  }
  if (picker === "players") return normalizeArray(mutualPlayers);

  return [];
}

function getSelectedIds({
  picker,
  selectedCharacters,
  selectedScenario,
  selectedNarrator,
  selectedLocation,
  selectedOpeningLocations,
  invitedPlayers,
}) {
  if (picker === "characters") {
    return normalizeArray(selectedCharacters)
      .map((character) => character?.id)
      .filter(Boolean);
  }

  if (picker === "players") {
    return normalizeArray(invitedPlayers)
      .map((player) => player?.id)
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

  if (picker === "openingLocations") {
    return normalizeArray(selectedOpeningLocations)
      .map((location) => location?.id)
      .filter(Boolean);
  }

  return [];
}

function toCreationViewItem(option) {
  return {
    id: option?.id || "",
    title: option?.title || option?.name || "Untitled Reference",
    subtitle:
      option?.subtitle ||
      option?.description ||
      option?.public_description ||
      "",
    type: option?.type || "REFERENCE",
    contentRating:
      option?.contentRating ||
      option?.content_rating ||
      option?.rating ||
      "SFW",
    imageUrl:
      option?.imageUrl ||
      option?.image_url ||
      getPickerImageUrl(option) ||
      getDefaultCreationImageForType(option?.type),
  };
}

function toPlayerViewItem(profile) {
  return {
    id: profile?.id || "",
    title: profile?.username || "Unnamed Player",
    subtitle: profile?.tagline || "Mutual follower",
    type: "PLAYER",
    contentRating: "USER",
    imageUrl:
      profile?.avatarUrl ||
      profile?.avatar_url ||
      getDefaultCreationImageForType("PLAYER_CHARACTER"),
  };
}

export function useRoomTemplatePackagePickerViewModel({
  picker,
  selectedCharacters = [],
  selectedScenario = null,
  selectedNarrator = null,
  selectedLocation = null,
  selectedOpeningLocations = [],
  characterOptions = [],
  scenarioOptions = [],
  narratorOptions = [],
  locationOptions = [],
  mutualPlayers = [],
  invitedPlayers = [],
  recommendedIds,
  onClose,
  onToggleCharacter,
  onTogglePlayer,
  onSelectScenario,
  onSelectNarrator,
  onSelectLocation,
  onToggleOpeningLocation,
}) {
  const normalizedPicker = PICKER_CONFIGS[picker] ? picker : "characters";
  const config = PICKER_CONFIGS[normalizedPicker];

  const rawOptions = useMemo(
    () =>
      getOptionsForPicker({
        picker: normalizedPicker,
        characterOptions,
        scenarioOptions,
        narratorOptions,
        locationOptions,
        mutualPlayers,
      }),
    [
      characterOptions,
      locationOptions,
      mutualPlayers,
      narratorOptions,
      normalizedPicker,
      scenarioOptions,
    ]
  );

  const rawOptionsById = useMemo(() => {
    const optionsById = new Map();

    rawOptions.forEach((option) => {
      if (option?.id) optionsById.set(option.id, option);
    });

    return optionsById;
  }, [rawOptions]);

  const items = useMemo(
    () =>
      rawOptions.map((option) =>
        normalizedPicker === "players"
          ? toPlayerViewItem(option)
          : toCreationViewItem(option)
      ),
    [normalizedPicker, rawOptions]
  );

  const selectedIds = useMemo(
    () =>
      getSelectedIds({
        picker: normalizedPicker,
        selectedCharacters,
        selectedScenario,
        selectedNarrator,
        selectedLocation,
        selectedOpeningLocations,
        invitedPlayers,
      }),
    [
      invitedPlayers,
      normalizedPicker,
      selectedCharacters,
      selectedLocation,
      selectedOpeningLocations,
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

    if (normalizedPicker === "players") {
      onTogglePlayer?.({
        id: selectedItem.id,
        username: selectedItem.username || selectedItem.title || "",
        avatarUrl: selectedItem.avatarUrl || null,
        tagline: selectedItem.tagline || "Mutual follower",
      });
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
      return;
    }

    if (normalizedPicker === "openingLocations") {
      onToggleOpeningLocation?.(selectedItem);
    }
  }

  return {
    eyebrow: "Story Picker",
    title: config.title,
    description:
      "Choose from your available Crestfall creations. Scenario recommendations are marked when available, but the room package remains editable.",
    iconName: config.iconName,
    items,
    selectedIds,
    recommendedIds: normalizedRecommendedIds,
    searchPlaceholder: "Search...",
    emptyMessage: config.emptyMessage,
    onClose,
    onChooseItem: chooseItem,
  };
}
