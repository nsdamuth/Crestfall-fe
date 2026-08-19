import {
  CREATION_CARD_VIEW_CONTRACT_VERSION,
} from "../CreationCard.contract.js";

import {
  CREATION_STORY_START_INTENTS,
  projectCreationStoryStartIntent,
} from "../../story-start-opening-location-binding/CreationStoryStartOpeningLocationBinding.contract.js";

export const CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION =
  "creation_card_story_start_preflight_binding_v1";

export const CREATION_CARD_STORY_START_PREFLIGHT_STATUSES = Object.freeze({
  NOT_REQUIRED: "NOT_REQUIRED",
  REQUIRED: "REQUIRED",
  READY: "READY",
  FAILED_FALLBACK_READY: "FAILED_FALLBACK_READY",
});

export const CREATION_CARD_STORY_START_ACTIONS = Object.freeze({
  START_DIRECTLY: "START_DIRECTLY",
  HYDRATE_STORY_PREVIEW: "HYDRATE_STORY_PREVIEW",
  OPEN_PREVIEW_FOR_LOCATION_SELECTION:
    "OPEN_PREVIEW_FOR_LOCATION_SELECTION",
  START_HYDRATED_STORY: "START_HYDRATED_STORY",
  BLOCK_BUSY: "BLOCK_BUSY",
  NOT_CHAT_CAPABLE: "NOT_CHAT_CAPABLE",
});

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function upper(value) {
  return text(value).toUpperCase();
}

function isRoomTemplate(creation = {}) {
  return upper(object(creation).type) === "ROOM_TEMPLATE";
}

function hasCreationId(creation = {}) {
  return Boolean(text(object(creation).id));
}

function normalizePreflight(preflight = {}) {
  const source = object(preflight);
  const status = upper(source.status);

  return {
    status:
      Object.values(
        CREATION_CARD_STORY_START_PREFLIGHT_STATUSES
      ).includes(status)
        ? status
        : CREATION_CARD_STORY_START_PREFLIGHT_STATUSES.NOT_REQUIRED,

    storyCreation:
      source.storyCreation &&
      typeof source.storyCreation === "object"
        ? source.storyCreation
        : null,

    selectionRequired:
      source.selectionRequired === true,

    selectedLocationId:
      text(source.selectedLocationId),

    allowedLocationIds:
      Array.isArray(source.allowedLocationIds)
        ? source.allowedLocationIds
            .map(text)
            .filter(Boolean)
        : [],

    errorMessage:
      text(source.errorMessage),
  };
}

export function projectCreationCardStoryStartPreflightBinding({
  creation = {},
  supportsChat = true,
  starting = false,
  preflight = {},
} = {}) {
  const sourceCreation = object(creation);
  const normalizedPreflight =
    normalizePreflight(preflight);

  const roomTemplate =
    isRoomTemplate(sourceCreation);

  const savedCreation =
    hasCreationId(sourceCreation);

  if (supportsChat !== true) {
    return {
      bindingContractVersion:
        CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
      creationCardViewContractVersion:
        CREATION_CARD_VIEW_CONTRACT_VERSION,
      action:
        CREATION_CARD_STORY_START_ACTIONS.NOT_CHAT_CAPABLE,
      invokeStoryStart: false,
      hydratePreview: false,
      openPreview: false,
      storyCreation: null,
      openingLocationId: null,
      busy: false,
      preflight:
        normalizedPreflight,
    };
  }

  if (starting === true) {
    return {
      bindingContractVersion:
        CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
      creationCardViewContractVersion:
        CREATION_CARD_VIEW_CONTRACT_VERSION,
      action:
        CREATION_CARD_STORY_START_ACTIONS.BLOCK_BUSY,
      invokeStoryStart: false,
      hydratePreview: false,
      openPreview: false,
      storyCreation: null,
      openingLocationId: null,
      busy: true,
      preflight:
        normalizedPreflight,
    };
  }

  if (!roomTemplate || !savedCreation) {
    return {
      bindingContractVersion:
        CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
      creationCardViewContractVersion:
        CREATION_CARD_VIEW_CONTRACT_VERSION,
      action:
        CREATION_CARD_STORY_START_ACTIONS.START_DIRECTLY,
      invokeStoryStart: true,
      hydratePreview: false,
      openPreview: false,
      storyCreation:
        sourceCreation,
      openingLocationId: null,
      busy: false,
      preflight:
        normalizedPreflight,
    };
  }

  if (
    normalizedPreflight.status ===
      CREATION_CARD_STORY_START_PREFLIGHT_STATUSES.NOT_REQUIRED ||
    normalizedPreflight.status ===
      CREATION_CARD_STORY_START_PREFLIGHT_STATUSES.REQUIRED
  ) {
    return {
      bindingContractVersion:
        CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
      creationCardViewContractVersion:
        CREATION_CARD_VIEW_CONTRACT_VERSION,
      action:
        CREATION_CARD_STORY_START_ACTIONS.HYDRATE_STORY_PREVIEW,
      invokeStoryStart: false,
      hydratePreview: true,
      openPreview: false,
      storyCreation: null,
      openingLocationId: null,
      busy: true,
      preflight:
        normalizedPreflight,
    };
  }

  const storyCreation =
    normalizedPreflight.storyCreation ||
    sourceCreation;

  const startGate =
    projectCreationStoryStartIntent({
      supportsChat: true,
      selectionRequired:
        normalizedPreflight.selectionRequired,
      selectedLocationId:
        normalizedPreflight.selectedLocationId,
      allowedLocationIds:
        normalizedPreflight.allowedLocationIds,
      starting: false,
      forceSelection: false,
    });

  if (
    startGate.intent ===
    CREATION_STORY_START_INTENTS.OPEN_LOCATION_PICKER
  ) {
    return {
      bindingContractVersion:
        CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
      creationCardViewContractVersion:
        CREATION_CARD_VIEW_CONTRACT_VERSION,
      action:
        CREATION_CARD_STORY_START_ACTIONS
          .OPEN_PREVIEW_FOR_LOCATION_SELECTION,
      invokeStoryStart: false,
      hydratePreview: false,
      openPreview: true,
      storyCreation,
      openingLocationId: null,
      busy: false,
      preflight:
        normalizedPreflight,
    };
  }

  if (
    startGate.intent ===
      CREATION_STORY_START_INTENTS.START_DIRECTLY ||
    startGate.intent ===
      CREATION_STORY_START_INTENTS.START_WITH_SELECTED_LOCATION
  ) {
    return {
      bindingContractVersion:
        CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
      creationCardViewContractVersion:
        CREATION_CARD_VIEW_CONTRACT_VERSION,
      action:
        CREATION_CARD_STORY_START_ACTIONS.START_HYDRATED_STORY,
      invokeStoryStart: true,
      hydratePreview: false,
      openPreview: false,
      storyCreation,
      openingLocationId:
        startGate.openingLocationId,
      busy: false,
      preflight:
        normalizedPreflight,
    };
  }

  return {
    bindingContractVersion:
      CREATION_CARD_STORY_START_PREFLIGHT_BINDING_CONTRACT_VERSION,
    creationCardViewContractVersion:
      CREATION_CARD_VIEW_CONTRACT_VERSION,
    action:
      CREATION_CARD_STORY_START_ACTIONS
        .OPEN_PREVIEW_FOR_LOCATION_SELECTION,
    invokeStoryStart: false,
    hydratePreview: false,
    openPreview: true,
    storyCreation,
    openingLocationId: null,
    busy: false,
    preflight:
      normalizedPreflight,
  };
}

export function projectCreationCardStoryStartViewCompatibility({
  creation = {},
  supportsChat = true,
  starting = false,
  preflight = {},
  onStartChat = null,
  onOpenPreview = null,
} = {}) {
  const projection =
    projectCreationCardStoryStartPreflightBinding({
      creation,
      supportsChat,
      starting,
      preflight,
    });

  return {
    ...projection,

    currentCreationCardViewProps: {
      showStartChatAction:
        supportsChat === true,

      isStartingChat:
        starting === true ||
        projection.action ===
          CREATION_CARD_STORY_START_ACTIONS.HYDRATE_STORY_PREVIEW,

      onStartChat:
        onStartChat || null,

      onOpenPreview:
        onOpenPreview || null,
    },

    currentViewCompatibility: {
      existingStartButtonSufficient: true,
      existingPreviewModalTriggerSufficient: true,
      newVisualSlotRequired: false,
    },

    architecture: {
      chatCapabilityOwnedByChassis: true,
      roomTemplateIdentificationOwnedByChassis: true,
      creationPreviewFetchOwnedByChassis: true,
      previewGraphNormalizationOwnedByChassis: true,
      openingLocationConfigOwnedByChassis: true,
      roomCreationOwnedByChassis: true,
      navigationOwnedByChassis: true,
      cardStartGateProjectionOwnedByFe: true,
      existingCardVisualCompositionOwnedByFe: true,
    },
  };
}
