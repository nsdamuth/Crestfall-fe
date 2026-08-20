"use client";

import { useMemo, useState } from "react";

import { useSelectedCharactersPanelViewModel } from "@/components/studio/create/room-template/selected-characters-panel/useSelectedCharactersPanelViewModel";
import { useRoomTemplatePackagePickerViewModel } from "@/components/studio/create/room-template/room-template-package-picker/useRoomTemplatePackagePickerViewModel";
import { useScenarioRecommendationsPanelViewModel } from "@/components/studio/room-templates/scenario-recommendations-panel/useScenarioRecommendationsPanelViewModel";
import { useRoomTemplateReferenceData } from "@/components/studio/room-templates/hooks/useRoomTemplateReferenceData";
import { patchStoryCharacterLifecycleSelection } from "@/components/studio/room-templates/storyCharacterLifecycleAuthoring";
import {
  STORY_OPENING_LOCATION_MODES,
  STORY_OPENING_LOCATION_MODE_OPTIONS,
  buildFixedOpeningLocationConfig,
  buildPlayerSelectableOpeningLocationConfig,
  normalizeStoryOpeningLocationAuthoring,
  toggleOpeningLocationReference,
} from "@/components/studio/room-templates/storyOpeningLocationAuthoring";
import {
  addUniqueReferences,
  findOptionById,
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

  const openingLocationConfig = normalizeStoryOpeningLocationAuthoring(
    data,
    locationOptions
  );
  const openingLocationMode = openingLocationConfig.mode;
  const selectedOpeningLocations = openingLocationConfig.allowedLocations;

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

  function changeCharacterLifecycle(characterId, lifecycleKind) {
    setSelectedCharacters(
      selectedCharacters.map((item) =>
        item?.id === characterId
          ? patchStoryCharacterLifecycleSelection(item, lifecycleKind)
          : item
      )
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

  function selectLocation(item) {
    updateDataField?.("selected_location", item);
    updateDataField?.("location_id", item.id);
    updateDataField?.("opening_location", buildFixedOpeningLocationConfig(item));
    setPicker(null);
  }

  function setOpeningLocationMode(nextMode) {
    const normalizedMode = String(nextMode || "").toUpperCase();

    if (normalizedMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT) {
      const seedLocations = selectedOpeningLocations.length
        ? selectedOpeningLocations
        : selectedLocation
          ? [selectedLocation]
          : [];
      updateDataField?.(
        "opening_location",
        buildPlayerSelectableOpeningLocationConfig(seedLocations)
      );
      return;
    }

    const fixedLocation = selectedLocation || selectedOpeningLocations[0] || null;
    if (fixedLocation?.id && !selectedLocation?.id) {
      updateDataField?.("selected_location", fixedLocation);
      updateDataField?.("location_id", fixedLocation.id);
    }
    updateDataField?.(
      "opening_location",
      buildFixedOpeningLocationConfig(fixedLocation)
    );
  }

  function toggleOpeningLocation(location) {
    const nextLocations = toggleOpeningLocationReference(
      selectedOpeningLocations,
      location
    );
    updateDataField?.(
      "opening_location",
      buildPlayerSelectableOpeningLocationConfig(nextLocations)
    );
  }

  function removeOpeningLocation(locationId) {
    updateDataField?.(
      "opening_location",
      buildPlayerSelectableOpeningLocationConfig(
        selectedOpeningLocations.filter((location) => location.id !== locationId)
      )
    );
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
    if (openingLocationMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT) {
      if (!selectedOpeningLocations.some((item) => item.id === location.id)) {
        toggleOpeningLocation(location);
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
    onLifecycleChange: changeCharacterLifecycle,
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
    selectedOpeningLocations,
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
    openingLocationAuthoringProps: {
      mode: openingLocationMode,
      modeOptions: STORY_OPENING_LOCATION_MODE_OPTIONS,
      allowedLocations: selectedOpeningLocations,
      validationMessage:
        openingLocationMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT &&
        selectedOpeningLocations.length === 0
          ? "Select at least one allowed starting Location before saving."
          : "",
      onModeChange: setOpeningLocationMode,
      onOpenLocationPicker: () => setPicker("openingLocations"),
      onRemoveAllowedLocation: removeOpeningLocation,
    },
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
      ...(openingLocationMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
        ? []
        : [
            {
              id: "location",
              iconName: "location",
              label: "Location / Scene",
              value: toSelectionCardValue(selectedLocation),
              placeholder: "Optional Location",
              onOpen: () => setPicker("location"),
            },
          ]),
    ],
    referenceLoadError,
    pickerViewProps: picker ? pickerViewProps : null,
  };
}
