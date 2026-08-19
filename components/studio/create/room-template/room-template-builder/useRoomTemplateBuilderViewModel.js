"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  initialForm,
  initialOpeningMessages,
  visibilityOptions,
  contentRatingOptions,
  roomModeOptions,
  playerCharacterOptions,
} from "../constants";
import { useRoomTemplateReferenceData } from "@/components/studio/room-templates/hooks/useRoomTemplateReferenceData";
import { useMutualPlayers } from "@/components/studio/room-templates/hooks/useMutualPlayers";
import {
  STORY_OPENING_LOCATION_MODES,
  STORY_OPENING_LOCATION_MODE_OPTIONS,
  buildFixedOpeningLocationConfig,
  buildPlayerSelectableOpeningLocationConfig,
  normalizeStoryOpeningLocationAuthoring,
  toggleOpeningLocationReference,
} from "@/components/studio/room-templates/storyOpeningLocationAuthoring";
import {
  STORY_CHARACTER_LIFECYCLE_AUTHORING_OPTIONS,
  normalizeStoryCharacterLifecycleAuthoringKind,
  patchStoryCharacterLifecycleSelection,
} from "@/components/studio/room-templates/storyCharacterLifecycleAuthoring";
import { createRoomTemplateDraft } from "@/lib/client/studio/room-templates/roomTemplateClient";
import {
  addUniqueReferences,
  buildRoomTemplateCreationPayload,
  extractCreationFromApiResponse,
  getScenarioRecommendationData,
  mergeScenarioNpcRegistryRecommendations,
} from "@/components/studio/room-templates/roomTemplateUtils";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function cloneInitialForm(value) {
  const source = normalizeObject(value);

  return {
    ...initialForm,
    ...source,
    rulesCodexIds: Array.isArray(source.rulesCodexIds)
      ? [...source.rulesCodexIds]
      : [...initialForm.rulesCodexIds],
    rulesCodexLinks: Array.isArray(source.rulesCodexLinks)
      ? [...source.rulesCodexLinks]
      : [...initialForm.rulesCodexLinks],
  };
}

function cloneOpeningMessages(value) {
  const source = Array.isArray(value) && value.length
    ? value
    : initialOpeningMessages;

  return source.map((message, index) => ({
    id: message?.id || `message-${index + 1}`,
    speaker: message?.speaker || "Narrator",
    body: message?.body || "",
  }));
}

function normalizeSelectedCharacter(character) {
  const title = String(character?.title || "Untitled Character");

  return {
    id: String(character?.id || ""),
    title,
    subtitle: String(character?.subtitle || ""),
    initial: title.trim().slice(0, 1).toUpperCase() || "?",
    lifecycleKind: normalizeStoryCharacterLifecycleAuthoringKind(character),
  };
}

function normalizeInvitedPlayer(player) {
  const username = String(player?.username || "Unknown player");

  return {
    id: String(player?.id || ""),
    username,
    avatarUrl: player?.avatarUrl ? String(player.avatarUrl) : null,
    displayInitial: username.slice(0, 1).toUpperCase() || "?",
  };
}

function buildSummaryProps({
  selectedCharacters,
  selectedScenario,
  selectedNarrator,
  selectedLocation,
  openingLocationMode,
  allowedOpeningLocationCount,
}) {
  return {
    eyebrow: "Story",
    summaryRows: [
      {
        id: "characters",
        label: "Characters",
        value: selectedCharacters.length || "None selected",
      },
      {
        id: "scenario",
        label: "Scenario",
        value: selectedScenario?.title || "Not selected",
      },
      {
        id: "narrator",
        label: "Narrator",
        value: selectedNarrator?.title || "Not selected",
      },
      {
        id: "location",
        label: "Opening Location",
        value:
          openingLocationMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
            ? allowedOpeningLocationCount
              ? `Player selects from ${allowedOpeningLocationCount}`
              : "Player selection needs locations"
            : selectedLocation?.title || "Optional",
      },
    ],
  };
}

function buildOpeningMessageCards({
  openingMessages,
  selectedCharacters,
  updateOpeningMessage,
  removeOpeningMessage,
}) {
  const speakerOptions = [
    { value: "Narrator", label: "Narrator" },
    ...selectedCharacters.map((character) => ({
      value: String(character?.title || ""),
      label: String(character?.title || ""),
    })),
    { value: "Player Prompt", label: "Player Prompt" },
  ];

  return openingMessages.map((message, index) => ({
    id: message.id,
    messageLabel: `Opening Message ${index + 1}`,
    speakerValue: String(message?.speaker || ""),
    speakerOptions,
    bodyValue: String(message?.body || ""),
    canRemove: index > 0,
    onChangeSpeaker: (value) =>
      updateOpeningMessage(message.id, "speaker", value),
    onChangeBody: (value) =>
      updateOpeningMessage(message.id, "body", value),
    onRemoveMessage: () => removeOpeningMessage(message.id),
  }));
}

function buildScenarioRecommendationsProps({
  recommendations,
  applyAll,
  applyRequired,
  applyOptional,
  applyLocation,
  applyNarrator,
  applyNpcRegistries,
  skip,
}) {
  return {
    requiredCharacterTitles: recommendations.requiredCharacters.map(
      (item) => String(item?.title || "")
    ),
    optionalCharacterTitles: recommendations.optionalCharacters.map(
      (item) => String(item?.title || "")
    ),
    suggestedLocationTitle: String(
      recommendations.suggestedLocation?.title || ""
    ),
    suggestedNarratorTitle: String(
      recommendations.suggestedNarrator?.title || ""
    ),
    suggestedNpcRegistryTitles: recommendations.suggestedNpcRegistries.map(
      (item) => String(item?.title || "")
    ),
    canApplyRequiredCharacters:
      recommendations.requiredCharacters.length > 0,
    canApplyOptionalCharacters:
      recommendations.optionalCharacters.length > 0,
    canApplySuggestedLocation: Boolean(recommendations.suggestedLocation?.id),
    canApplySuggestedNarrator: Boolean(recommendations.suggestedNarrator?.id),
    canApplySuggestedNpcRegistries:
      recommendations.suggestedNpcRegistries.length > 0,
    onApplyAll: applyAll,
    onApplyRequiredCharacters: applyRequired,
    onApplyOptionalCharacters: applyOptional,
    onApplySuggestedLocation: applyLocation,
    onApplySuggestedNarrator: applyNarrator,
    onApplySuggestedNpcRegistries: applyNpcRegistries,
    onSkipRecommendations: skip,
  };
}

export function useRoomTemplateBuilderViewModel({
  initialRoomTemplateForm = null,
  initialSelectedCharacters = [],
  initialMessages = null,
  initialInvitedPlayers = [],
  createDraft = createRoomTemplateDraft,
  onCreated = null,
} = {}) {
  const router = useRouter();
  const [form, setForm] = useState(() =>
    cloneInitialForm(initialRoomTemplateForm)
  );
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState(() =>
    Array.isArray(initialSelectedCharacters)
      ? [...initialSelectedCharacters]
      : []
  );
  const [openingMessages, setOpeningMessages] = useState(() =>
    cloneOpeningMessages(initialMessages)
  );
  const [picker, setPicker] = useState(null);
  const [displayMediaSlot, setDisplayMediaSlot] = useState(0);
  const [invitedPlayers, setInvitedPlayers] = useState(() =>
    Array.isArray(initialInvitedPlayers) ? [...initialInvitedPlayers] : []
  );

  const {
    referenceOptions,
    referenceLoadError,
    referenceStatus,
    characterOptions,
    scenarioOptions,
    narratorOptions,
    locationOptions,
  } = useRoomTemplateReferenceData();

  const { mutualPlayers, mutualLoadError, mutualStatus } = useMutualPlayers();

  const effectiveTurnBased =
    Boolean(form.turn_based) || invitedPlayers.length > 0;

  const selectedScenario = scenarioOptions.find(
    (scenario) => scenario.id === form.scenario_id
  );
  const selectedNarrator = narratorOptions.find(
    (narrator) => narrator.id === form.narrator_id
  );
  const selectedLocation = locationOptions.find(
    (location) => location.id === form.location_id
  );
  const openingLocationConfig = normalizeStoryOpeningLocationAuthoring(
    form,
    locationOptions
  );
  const openingLocationMode = openingLocationConfig.mode;
  const selectedOpeningLocations = openingLocationConfig.allowedLocations;

  const scenarioRecommendations = useMemo(
    () => getScenarioRecommendationData(selectedScenario, referenceOptions),
    [selectedScenario, referenceOptions]
  );

  const recommendationsDismissed =
    Boolean(selectedScenario?.id) &&
    form.scenario_recommendations_dismissed_for === selectedScenario.id;

  const completion = useMemo(() => {
    const baseFields = [
      form.title,
      form.public_description,
      form.room_mode,
      form.visibility,
      form.content_rating,
      form.scenario_id,
      form.narrator_id,
      selectedCharacters.length ? "characters" : "",
      openingMessages.some((message) => message.body.trim()) ? "openings" : "",
    ];

    const filled = baseFields.filter(Boolean).length;
    return Math.round((filled / baseFields.length) * 100);
  }, [form, selectedCharacters, openingMessages]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function setOpeningLocationMode(nextMode) {
    const normalizedMode = String(nextMode || "").toUpperCase();

    setForm((current) => {
      const currentConfig = normalizeStoryOpeningLocationAuthoring(
        current,
        locationOptions
      );
      const fixedLocation = locationOptions.find(
        (location) => location.id === current.location_id
      );

      if (normalizedMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT) {
        const seedLocations = currentConfig.allowedLocations.length
          ? currentConfig.allowedLocations
          : fixedLocation
            ? [fixedLocation]
            : [];

        return {
          ...current,
          opening_location:
            buildPlayerSelectableOpeningLocationConfig(seedLocations),
        };
      }

      const fallbackFixedLocation =
        fixedLocation || currentConfig.allowedLocations[0] || null;

      return {
        ...current,
        location_id: fallbackFixedLocation?.id || current.location_id || "",
        opening_location: buildFixedOpeningLocationConfig(
          fallbackFixedLocation || { id: current.location_id || "" }
        ),
      };
    });
  }

  function toggleOpeningLocation(location) {
    setForm((current) => {
      const currentConfig = normalizeStoryOpeningLocationAuthoring(
        current,
        locationOptions
      );
      const nextLocations = toggleOpeningLocationReference(
        currentConfig.allowedLocations,
        location
      );

      return {
        ...current,
        opening_location:
          buildPlayerSelectableOpeningLocationConfig(nextLocations),
      };
    });
  }

  function removeOpeningLocation(locationId) {
    setForm((current) => {
      const currentConfig = normalizeStoryOpeningLocationAuthoring(
        current,
        locationOptions
      );
      const nextLocations = currentConfig.allowedLocations.filter(
        (location) => location.id !== locationId
      );

      return {
        ...current,
        opening_location:
          buildPlayerSelectableOpeningLocationConfig(nextLocations),
      };
    });
  }

  function toggleCharacter(character) {
    setSelectedCharacters((current) => {
      const exists = current.some((item) => item.id === character.id);

      return exists
        ? current.filter((item) => item.id !== character.id)
        : [...current, character];
    });
  }

  function removeCharacter(characterId) {
    setSelectedCharacters((current) =>
      current.filter((item) => item.id !== characterId)
    );
  }

  function changeCharacterLifecycle(characterId, lifecycleKind) {
    setSelectedCharacters((current) =>
      current.map((item) =>
        item?.id === characterId
          ? patchStoryCharacterLifecycleSelection(item, lifecycleKind)
          : item
      )
    );
  }

  function setSingleSelection(field, item) {
    if (field === "location_id") {
      setForm((current) => ({
        ...current,
        location_id: item.id,
        opening_location: buildFixedOpeningLocationConfig(item),
      }));
      setPicker(null);
      return;
    }

    updateField(field, item.id);

    if (field === "scenario_id") {
      updateField("scenario_recommendations_dismissed_for", null);
    }

    setPicker(null);
  }

  function dismissScenarioRecommendations() {
    if (!selectedScenario?.id) return;

    updateField(
      "scenario_recommendations_dismissed_for",
      selectedScenario.id
    );
  }

  function updateOpeningMessage(id, field, value) {
    setOpeningMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, [field]: value } : message
      )
    );
  }

  function addOpeningMessage() {
    setOpeningMessages((current) => [
      ...current,
      {
        id: `message-${current.length + 1}`,
        speaker: "Narrator",
        body: "",
      },
    ]);
  }

  function removeOpeningMessage(id) {
    setOpeningMessages((current) =>
      current.length === 1
        ? current
        : current.filter((message) => message.id !== id)
    );
  }

  function applyRecommendedCharacters(characters) {
    setSelectedCharacters((current) => addUniqueReferences(current, characters));
  }

  function applyRecommendedLocation(location) {
    if (!location?.id) return;

    if (openingLocationMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT) {
      const exists = selectedOpeningLocations.some(
        (item) => item.id === location.id
      );
      if (!exists) toggleOpeningLocation(location);
      return;
    }

    setForm((current) => ({
      ...current,
      location_id: location.id,
      opening_location: buildFixedOpeningLocationConfig(location),
    }));
  }

  function applyRecommendedNarrator(narrator) {
    if (narrator?.id) updateField("narrator_id", narrator.id);
  }

  function applyRecommendedNpcRegistries(registries) {
    setForm((current) => ({
      ...current,
      ...mergeScenarioNpcRegistryRecommendations(current, registries),
    }));
  }

  function applyAllScenarioRecommendations() {
    applyRecommendedCharacters([
      ...scenarioRecommendations.requiredCharacters,
      ...scenarioRecommendations.optionalCharacters,
    ]);
    applyRecommendedLocation(scenarioRecommendations.suggestedLocation);
    applyRecommendedNarrator(scenarioRecommendations.suggestedNarrator);
    applyRecommendedNpcRegistries(
      scenarioRecommendations.suggestedNpcRegistries
    );
    dismissScenarioRecommendations();
  }

  function toggleInvitedPlayer(player) {
    setInvitedPlayers((current) => {
      const exists = current.some((item) => item.id === player.id);

      return exists
        ? current.filter((item) => item.id !== player.id)
        : [...current, player];
    });
  }

  function removeInvitedPlayer(playerId) {
    setInvitedPlayers((current) =>
      current.filter((item) => item.id !== playerId)
    );
  }

  async function handleSaveDraft() {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const currentOpeningLocation = normalizeStoryOpeningLocationAuthoring(
        form,
        locationOptions
      );
      if (
        currentOpeningLocation.mode ===
          STORY_OPENING_LOCATION_MODES.PLAYER_SELECT &&
        currentOpeningLocation.allowedLocationIds.length === 0
      ) {
        throw new Error(
          "Player-selectable Stories require at least one allowed starting Location."
        );
      }

      const creationPayload = buildRoomTemplateCreationPayload({
        form,
        selectedCharacters,
        selectedScenario,
        selectedNarrator,
        selectedLocation,
        openingMessages,
        displayMediaSlot,
        invitedPlayers,
      });
      const apiPayload = await createDraft(creationPayload);
      const creation = extractCreationFromApiResponse(apiPayload);

      if (!creation?.id) {
        throw new Error(
          "Room template draft was saved, but no creation ID was returned."
        );
      }

      setSaveStatus("saved");
      setSaveMessage("Draft saved.");

      if (typeof onCreated === "function") {
        onCreated(creation);
      } else {
        router.push(`/studio/my-creations/${creation.id}/edit`);
      }
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error?.message || "Room template draft could not be saved."
      );
    }
  }

  const selectedCharactersPanelProps = {
    characters: selectedCharacters
      .filter((character) => character?.id)
      .map(normalizeSelectedCharacter),
    lifecycleOptions: STORY_CHARACTER_LIFECYCLE_AUTHORING_OPTIONS,
    onOpenCharacterPicker: () => setPicker("characters"),
    onRemoveCharacter: removeCharacter,
    onChangeCharacterLifecycle: changeCharacterLifecycle,
  };

  const invitedPlayersPanelProps = {
    invitedPlayers: invitedPlayers.map(normalizeInvitedPlayer),
    loadError: mutualLoadError ? String(mutualLoadError) : "",
    onOpenPlayerPicker: () => setPicker("players"),
    onRemovePlayer: removeInvitedPlayer,
  };

  const openingMessageCards = buildOpeningMessageCards({
    openingMessages,
    selectedCharacters,
    updateOpeningMessage,
    removeOpeningMessage,
  });

  const scenarioRecommendationsPanelProps =
    buildScenarioRecommendationsProps({
      recommendations: scenarioRecommendations,
      applyAll: applyAllScenarioRecommendations,
      applyRequired: () =>
        applyRecommendedCharacters(
          scenarioRecommendations.requiredCharacters
        ),
      applyOptional: () =>
        applyRecommendedCharacters(
          scenarioRecommendations.optionalCharacters
        ),
      applyLocation: () =>
        applyRecommendedLocation(scenarioRecommendations.suggestedLocation),
      applyNarrator: () =>
        applyRecommendedNarrator(scenarioRecommendations.suggestedNarrator),
      applyNpcRegistries: () =>
        applyRecommendedNpcRegistries(
          scenarioRecommendations.suggestedNpcRegistries
        ),
      skip: dismissScenarioRecommendations,
    });

  const pickerProps = picker
    ? {
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
        mutualPlayers,
        invitedPlayers,
        recommendedIds: scenarioRecommendations.recommendedIds,
        onClose: () => setPicker(null),
        onToggleCharacter: toggleCharacter,
        onTogglePlayer: toggleInvitedPlayer,
        onSelectScenario: (item) => setSingleSelection("scenario_id", item),
        onSelectNarrator: (item) => setSingleSelection("narrator_id", item),
        onSelectLocation: (item) => setSingleSelection("location_id", item),
        onToggleOpeningLocation: toggleOpeningLocation,
      }
    : null;

  return {
    viewProps: {
      form,
      completion,
      saveStatus,
      saveMessage,
      saveDisabled: saveStatus === "saving",
      referenceLoadError,
      referenceStatus,
      mutualStatus,
      effectiveTurnBased,
      selectedScenario,
      selectedNarrator,
      selectedLocation,
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
      showScenarioRecommendations:
        Boolean(selectedScenario) &&
        scenarioRecommendations.hasAny &&
        !recommendationsDismissed,
      summaryProps: buildSummaryProps({
        selectedCharacters,
        selectedScenario,
        selectedNarrator,
        selectedLocation,
        openingLocationMode,
        allowedOpeningLocationCount: selectedOpeningLocations.length,
      }),
      selectedCharactersPanelProps,
      scenarioRecommendationsPanelProps,
      invitedPlayersPanelProps,
      openingMessageCards,
      displayMediaSlot,
      visibilityOptions,
      contentRatingOptions,
      roomModeOptions,
      playerCharacterOptions,
      onUpdateField: updateField,
      onToggleTurnBased: () =>
        updateField("turn_based", !form.turn_based),
      onOpenScenarioPicker: () => setPicker("scenario"),
      onOpenNarratorPicker: () => setPicker("narrator"),
      onOpenLocationPicker: () => setPicker("location"),
      onAddOpeningMessage: addOpeningMessage,
      onSelectDisplayMediaSlot: setDisplayMediaSlot,
      onSave: handleSaveDraft,
    },
    applicationContentProps: {
      form,
      selectedCharacters,
      openingMessages,
      picker,
      displayMediaSlot,
      invitedPlayers,
      referenceOptions,
      referenceLoadError,
      referenceStatus,
      characterOptions,
      scenarioOptions,
      narratorOptions,
      locationOptions,
      mutualPlayers,
      mutualLoadError,
      mutualStatus,
      scenarioRecommendations,
      recommendationsDismissed,
      pickerProps,
      setPicker,
      setDisplayMediaSlot,
      setSelectedCharacters,
      updateField,
      toggleCharacter,
      removeCharacter,
      setSingleSelection,
      setOpeningLocationMode,
      toggleOpeningLocation,
      removeOpeningLocation,
      dismissScenarioRecommendations,
      updateOpeningMessage,
      addOpeningMessage,
      removeOpeningMessage,
      applyRecommendedCharacters,
      applyRecommendedLocation,
      applyRecommendedNarrator,
      applyRecommendedNpcRegistries,
      applyAllScenarioRecommendations,
      toggleInvitedPlayer,
      removeInvitedPlayer,
      handleSaveDraft,
    },
  };
}
