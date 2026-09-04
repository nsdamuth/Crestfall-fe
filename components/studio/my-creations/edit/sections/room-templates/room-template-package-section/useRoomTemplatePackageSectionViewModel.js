"use client";

import { useMemo, useState } from "react";

import { useSelectedCharactersPanelViewModel } from "@/components/studio/create/room-template/selected-characters-panel/useSelectedCharactersPanelViewModel";
import { useRoomTemplatePackagePickerViewModel } from "@/components/studio/create/room-template/room-template-package-picker/useRoomTemplatePackagePickerViewModel";
import { useScenarioRecommendationsPanelViewModel } from "@/components/studio/room-templates/scenario-recommendations-panel/useScenarioRecommendationsPanelViewModel";
import { useRoomTemplateReferenceData } from "@/components/studio/room-templates/hooks/useRoomTemplateReferenceData";
import {
  STORY_OPENING_LOCATION_MODES,
  addUniqueReferences,
  buildRoomTemplateOpeningLocationData,
  findOptionById,
  getRoomTemplateOpeningLocationAuthoring,
  getScenarioRecommendationData,
  mergeScenarioNpcRegistryRecommendations,
} from "@/components/studio/room-templates/roomTemplateUtils";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Story Editor",
  sectionTitle: "Story Package",
  sectionDescription:
    "Choose the actual ingredients that make this Story. Scenario recommendations can be applied, skipped, or replaced.",
});

function toSelectionCardValue(reference) {
  if (!reference) return null;

  return {
    title: reference.title || "",
    subtitle: reference.subtitle || "",
  };
}

export function useRoomTemplatePackageSectionViewModel({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};
  const [picker, setPicker] = useState(null);

  const {
    referenceOptions,
    referenceLoadError,
    characterOptions,
    scenarioOptions,
    narratorOptions,
    locationOptions,
  } = useRoomTemplateReferenceData();

  const selectedCharacters = Array.isArray(data.selected_characters)
    ? data.selected_characters
    : [];

  const selectedScenario =
    findOptionById(scenarioOptions, data.selected_scenario) ||
    data.selected_scenario ||
    null;

  const selectedNarrator =
    findOptionById(narratorOptions, data.selected_narrator) ||
    data.selected_narrator ||
    null;

  const selectedLocation =
    findOptionById(locationOptions, data.selected_location) ||
    data.selected_location ||
    null;

  const openingLocation = getRoomTemplateOpeningLocationAuthoring(
    data,
    locationOptions
  );

  const recommendationsDismissed =
    Boolean(selectedScenario?.id) &&
    data.scenario_recommendations_dismissed_for === selectedScenario.id;

  const scenarioRecommendations = useMemo(
    () => getScenarioRecommendationData(selectedScenario, referenceOptions),
    [referenceOptions, selectedScenario]
  );

  function setSelectedCharacters(nextCharacters) {
    updateDataField?.("selected_characters", nextCharacters);
  }

  function toggleCharacter(character) {
    const exists = selectedCharacters.some((item) => item.id === character.id);

    if (exists) {
      setSelectedCharacters(
        selectedCharacters.filter((item) => item.id !== character.id)
      );
      return;
    }

    setSelectedCharacters([...selectedCharacters, character]);
  }

  function removeCharacter(characterId) {
    setSelectedCharacters(
      selectedCharacters.filter((item) => item.id !== characterId)
    );
  }

  function selectScenario(item) {
    updateDataField?.("selected_scenario", item);
    updateDataField?.("scenario_id", item.id);
    updateDataField?.("scenario_recommendations_dismissed_for", null);
    setPicker(null);
  }

  function selectNarrator(item) {
    updateDataField?.("selected_narrator", item);
    updateDataField?.("narrator_id", item.id);
    setPicker(null);
  }

  function persistOpeningLocation({
    mode = openingLocation.mode,
    fixedLocation = openingLocation.fixedLocation,
    allowedLocations = openingLocation.allowedLocations,
  } = {}) {
    const next = buildRoomTemplateOpeningLocationData({
      mode,
      fixedLocation,
      allowedLocations,
    });

    updateDataField?.("opening_location", next);

    if (next.mode === STORY_OPENING_LOCATION_MODES.FIXED) {
      updateDataField?.("selected_location", next.fixedLocation || null);
      updateDataField?.("location_id", next.fixedLocationId || "");
    } else {
      updateDataField?.("selected_location", null);
      updateDataField?.("location_id", "");
    }
  }

  function selectLocation(item) {
    persistOpeningLocation({
      mode: STORY_OPENING_LOCATION_MODES.FIXED,
      fixedLocation: item,
      allowedLocations: item ? [item] : [],
    });
    setPicker(null);
  }

  function changeOpeningLocationMode(mode) {
    if (mode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT) {
      const startingAllowed = openingLocation.allowedLocations.length
        ? openingLocation.allowedLocations
        : openingLocation.fixedLocation
          ? [openingLocation.fixedLocation]
          : [];
      persistOpeningLocation({
        mode,
        fixedLocation: null,
        allowedLocations: startingAllowed,
      });
      return;
    }

    persistOpeningLocation({
      mode: STORY_OPENING_LOCATION_MODES.FIXED,
      fixedLocation:
        openingLocation.fixedLocation || openingLocation.allowedLocations[0] || null,
      allowedLocations: [],
    });
  }

  function toggleOpeningLocation(item) {
    if (!item?.id) return;

    const exists = openingLocation.allowedLocations.some(
      (location) => location?.id === item.id
    );
    const nextAllowedLocations = exists
      ? openingLocation.allowedLocations.filter(
          (location) => location?.id !== item.id
        )
      : [...openingLocation.allowedLocations, item];

    persistOpeningLocation({
      mode: STORY_OPENING_LOCATION_MODES.PLAYER_SELECT,
      fixedLocation: null,
      allowedLocations: nextAllowedLocations,
    });
  }

  function removeOpeningLocation(locationId) {
    persistOpeningLocation({
      mode: STORY_OPENING_LOCATION_MODES.PLAYER_SELECT,
      fixedLocation: null,
      allowedLocations: openingLocation.allowedLocations.filter(
        (location) => location?.id !== locationId
      ),
    });
  }

  function dismissScenarioRecommendations() {
    if (!selectedScenario?.id) return;

    updateDataField?.(
      "scenario_recommendations_dismissed_for",
      selectedScenario.id
    );
  }

  function applyRecommendedCharacters(characters) {
    setSelectedCharacters(addUniqueReferences(selectedCharacters, characters));
  }

  function applyRecommendedLocation(location) {
    if (!location?.id) return;

    if (openingLocation.mode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT) {
      if (
        !openingLocation.allowedLocations.some(
          (item) => item?.id === location.id
        )
      ) {
        persistOpeningLocation({
          mode: STORY_OPENING_LOCATION_MODES.PLAYER_SELECT,
          fixedLocation: null,
          allowedLocations: [...openingLocation.allowedLocations, location],
        });
      }
      return;
    }

    selectLocation(location);
  }

  function applyRecommendedNarrator(narrator) {
    if (!narrator?.id) return;
    selectNarrator(narrator);
  }

  function applyRecommendedNpcRegistries(registries) {
    const merged = mergeScenarioNpcRegistryRecommendations(data, registries);

    updateDataField?.("boundRegistries", merged.boundRegistries);
    updateDataField?.("boundRegistryLinks", merged.boundRegistryLinks);
  }

  function applyAllScenarioRecommendations() {
    applyRecommendedCharacters([
      ...scenarioRecommendations.requiredCharacters,
      ...scenarioRecommendations.optionalCharacters,
    ]);

    if (scenarioRecommendations.suggestedLocation?.id) {
      applyRecommendedLocation(scenarioRecommendations.suggestedLocation);
    }

    if (scenarioRecommendations.suggestedNarrator?.id) {
      updateDataField?.(
        "selected_narrator",
        scenarioRecommendations.suggestedNarrator
      );
      updateDataField?.(
        "narrator_id",
        scenarioRecommendations.suggestedNarrator.id
      );
    }

    applyRecommendedNpcRegistries(
      scenarioRecommendations.suggestedNpcRegistries
    );
    dismissScenarioRecommendations();
  }

  const selectedCharactersPanelProps = useSelectedCharactersPanelViewModel({
    selectedCharacters,
    onOpen: () => setPicker("characters"),
    onRemove: removeCharacter,
  });

  const scenarioRecommendationsPanelProps =
    useScenarioRecommendationsPanelViewModel({
      recommendations: scenarioRecommendations,
      onApplyAll: applyAllScenarioRecommendations,
      onApplyRequired: () =>
        applyRecommendedCharacters(scenarioRecommendations.requiredCharacters),
      onApplyOptional: () =>
        applyRecommendedCharacters(scenarioRecommendations.optionalCharacters),
      onApplyLocation: () =>
        applyRecommendedLocation(scenarioRecommendations.suggestedLocation),
      onApplyNarrator: () =>
        applyRecommendedNarrator(scenarioRecommendations.suggestedNarrator),
      onApplyNpcRegistries: () =>
        applyRecommendedNpcRegistries(
          scenarioRecommendations.suggestedNpcRegistries
        ),
      onSkip: dismissScenarioRecommendations,
    });

  const pickerViewProps = useRoomTemplatePackagePickerViewModel({
    picker,
    selectedCharacters,
    selectedScenario,
    selectedNarrator,
    selectedLocation,
    selectedOpeningLocations: openingLocation.allowedLocations,
    characterOptions,
    scenarioOptions,
    narratorOptions,
    locationOptions,
    recommendedIds: scenarioRecommendations.recommendedIds,
    onClose: () => setPicker(null),
    onToggleCharacter: toggleCharacter,
    onSelectScenario: selectScenario,
    onSelectNarrator: selectNarrator,
    onSelectLocation: selectLocation,
    onToggleOpeningLocation: toggleOpeningLocation,
  });

  return {
    ...DEFAULT_COPY,
    selectedCharactersPanelProps,
    showScenarioRecommendations:
      Boolean(selectedScenario) &&
      scenarioRecommendations.hasAny &&
      !recommendationsDismissed,
    scenarioRecommendationsPanelProps,
    selectionCards: [
      {
        id: "scenario",
        iconName: "scenario",
        label: "Scenario",
        value: toSelectionCardValue(selectedScenario),
        placeholder: "Select Scenario",
        onOpen: () => setPicker("scenario"),
      },
      {
        id: "narrator",
        iconName: "narrator",
        label: "Narrator",
        value: toSelectionCardValue(selectedNarrator),
        placeholder: "Select Narrator",
        onOpen: () => setPicker("narrator"),
      },
    ],
    openingLocationProps: {
      mode: openingLocation.mode,
      fixedLocation: toSelectionCardValue(openingLocation.fixedLocation),
      allowedLocations: openingLocation.allowedLocations,
      onChangeMode: changeOpeningLocationMode,
      onOpenFixedLocationPicker: () => setPicker("location"),
      onOpenAllowedLocationsPicker: () => setPicker("openingLocations"),
      onRemoveAllowedLocation: removeOpeningLocation,
    },
    referenceLoadError,
    pickerViewProps: picker ? pickerViewProps : null,
  };
}
