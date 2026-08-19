import {
  ROOM_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION,
} from "../RoomTemplateBuilder.contract.js";

import {
  SELECTED_CHARACTERS_PANEL_VIEW_CONTRACT_VERSION,
} from "../../../../room-templates/selected-characters-panel/SelectedCharactersPanel.contract.js";

import {
  STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  projectStoryOpeningLocationAuthoringPresentation,
} from "../../../../room-templates/story-opening-location-authoring/StoryOpeningLocationAuthoring.contract.js";

import {
  STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION,
  projectStoryCharacterLifecyclePresentation,
} from "../../../../room-templates/story-character-lifecycle-authoring/StoryCharacterLifecycleAuthoring.contract.js";

export const ROOM_TEMPLATE_STORY_AUTHORING_BINDING_CONTRACT_VERSION =
  "room_template_story_authoring_binding_v1";

export const ROOM_TEMPLATE_STORY_AUTHORING_CALLBACK_KEYS = Object.freeze([
  "onOpeningLocationModeChange",
  "onOpenAllowedLocationPicker",
  "onRemoveAllowedLocation",
  "onChangeCharacterLifecycle",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function array(value) {
  return Array.isArray(value) ? value : [];
}
function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
function normalizeSelectedCharacter(character = {}) {
  const source = object(character);
  const title = text(source.title || source.name) || "Untitled Character";
  return {
    ...source,
    id: text(source.id),
    title,
    subtitle: text(source.subtitle || source.description),
    initial: text(source.initial) || title.slice(0, 1).toUpperCase() || "?",
  };
}

export function projectRoomTemplateStoryAuthoringBinding({
  form = {},
  selectedCharacters = [],
  locationOptions = [],
  callbacks = {},
} = {}) {
  const safeForm = object(form);
  const callbackSource = object(callbacks);

  const openingLocation =
    projectStoryOpeningLocationAuthoringPresentation({
      storyData: safeForm,
      locationOptions,
    });

  const normalizedCharacters = array(selectedCharacters)
    .map(normalizeSelectedCharacter)
    .filter((character) => character.id);

  const characterLifecycle = projectStoryCharacterLifecyclePresentation({
    selectedCharacters: normalizedCharacters,
  });

  const characterLifecycleById = new Map(
    characterLifecycle.characters.map((character) => [character.id, character])
  );

  const selectedCharacterItems = normalizedCharacters.map((character) => {
    const lifecycle = characterLifecycleById.get(character.id);
    return {
      id: character.id,
      title: character.title,
      subtitle: character.subtitle,
      initial: character.initial,
      lifecycle: lifecycle
        ? {
            lifecycleKind: lifecycle.lifecycleKind,
            lifecycleLabel: lifecycle.lifecycleLabel,
            lifecycleDescription: lifecycle.lifecycleDescription,
            releasePolicy: lifecycle.releasePolicy,
          }
        : null,
    };
  });

  const characterLifecycleVisualExtensionRequired =
    characterLifecycle.characters.some(
      (character) => character.lifecycleKind !== "STORY_PINNED"
    );

  const fixedLocationCard = {
    label: "Location / Scene",
    mode: openingLocation.mode,
    fixedLocationId: openingLocation.fixedLocationId,
    playerSelect: openingLocation.playerSelect,
    helper: openingLocation.playerSelect
      ? "Player-select mode is active. The current fixed Location card is not the complete authoring surface."
      : openingLocation.fixedModeHelper,
  };

  const openingLocationExtension = {
    required: true,
    sectionId: "opening-location",
    eyebrow: "Opening",
    title: "Starting Location",
    description:
      "Choose whether the Story starts at one fixed Location or lets the player choose from a creator-authored allowed set.",
    mode: openingLocation.mode,
    modeOptions: openingLocation.modeOptions,
    fixedLocationId: openingLocation.fixedLocationId,
    allowedLocationIds: openingLocation.allowedLocationIds,
    allowedLocations: openingLocation.allowedLocations,
    allowedLocationCount: openingLocation.allowedLocationCount,
    selectionRequiredAtStoryStart: openingLocation.selectionRequiredAtStoryStart,
    validationMessage: openingLocation.validationMessage,
    canSaveAuthoring: openingLocation.canSaveAuthoring,
    playerSelectHelper: openingLocation.playerSelectHelper,
    callbacks: {
      onModeChange: callbackSource.onOpeningLocationModeChange || null,
      onOpenAllowedLocationPicker: callbackSource.onOpenAllowedLocationPicker || null,
      onRemoveAllowedLocation: callbackSource.onRemoveAllowedLocation || null,
    },
  };

  const characterLifecycleExtension = {
    required: characterLifecycleVisualExtensionRequired,
    sectionId: "story-character-lifecycle",
    fieldLabel: characterLifecycle.fieldLabel,
    lifecycleOptions: characterLifecycle.lifecycleOptions,
    characters: characterLifecycle.characters,
    summary: characterLifecycle.summary,
    currentPanelLimitation: "",
    callback: callbackSource.onChangeCharacterLifecycle || null,
  };

  return {
    bindingContractVersion: ROOM_TEMPLATE_STORY_AUTHORING_BINDING_CONTRACT_VERSION,
    roomTemplateBuilderViewContractVersion: ROOM_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION,
    selectedCharactersPanelViewContractVersion: SELECTED_CHARACTERS_PANEL_VIEW_CONTRACT_VERSION,
    openingLocationPresentationContractVersion: STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
    characterLifecyclePresentationContractVersion: STORY_CHARACTER_LIFECYCLE_PRESENTATION_CONTRACT_VERSION,

    roomTemplateBuilderProps: {
      openingLocationAuthoringProps: {
        mode: openingLocation.mode,
        modeOptions: openingLocation.modeOptions,
        allowedLocations: openingLocation.allowedLocations,
        validationMessage: openingLocation.validationMessage,
        onModeChange:
          callbackSource.onOpeningLocationModeChange || null,
        onOpenLocationPicker:
          callbackSource.onOpenAllowedLocationPicker || null,
        onRemoveAllowedLocation:
          callbackSource.onRemoveAllowedLocation || null,
      },
      selectedCharactersPanelProps: {
        characters: selectedCharacterItems.map((character) => ({
          ...character,
          lifecycleKind:
            character.lifecycle?.lifecycleKind || "STORY_PINNED",
        })),
        lifecycleOptions: characterLifecycle.lifecycleOptions,
        onChangeCharacterLifecycle:
          callbackSource.onChangeCharacterLifecycle || null,
      },
      fixedLocationCard,
      storyAuthoringExtensions: {
        openingLocation: openingLocationExtension,
        characterLifecycle: characterLifecycleExtension,
      },
    },

    openingLocation: openingLocationExtension,
    characterLifecycle: characterLifecycleExtension,

    functionalWiringStatus: {
      openingLocationControl: "WIRED",
      openingLocationPicker: "WIRED",
      openingLocationSaveValidation: "WIRED",
      characterLifecycleControl: "WIRED",
      lifecyclePayloadPersistence: "WIRED",
    },

    visualExtensionStatus: {
      openingLocationControl: "WIRED",
      characterLifecycleControl: "WIRED",
    },

    architecture: {
      storyFormStateOwnedByChassis: true,
      selectedCharacterStateOwnedByChassis: true,
      openingLocationMutationOwnedByChassis: true,
      characterLifecycleMutationOwnedByChassis: true,
      creationPayloadOwnedByChassis: true,
      persistenceOwnedByChassis: true,
      roomTemplateVisualCompositionOwnedByFe: true,
      openingLocationVisualExtensionOwnedByFe: true,
      characterLifecycleVisualExtensionOwnedByFe: true,
    },
  };
}
