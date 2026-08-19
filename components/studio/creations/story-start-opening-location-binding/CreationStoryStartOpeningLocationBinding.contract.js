import {
  CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,
} from "../creation-profile-page/CreationProfilePage.contract.js";

import {
  CREATION_PREVIEW_MODAL_VIEW_CONTRACT_VERSION,
} from "../creation-preview-modal/CreationPreviewModal.contract.js";

import {
  STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
  projectStoryStartOpeningLocationPresentation,
} from "../../story-rooms/story-start-opening-location/StoryStartOpeningLocationPresentation.contract.js";

export const CREATION_STORY_START_OPENING_LOCATION_BINDING_CONTRACT_VERSION =
  "creation_story_start_opening_location_binding_v1";

export const CREATION_STORY_START_SURFACES = Object.freeze({
  PROFILE_PAGE: "PROFILE_PAGE",
  PREVIEW_MODAL: "PREVIEW_MODAL",
});

export const CREATION_STORY_START_INTENTS = Object.freeze({
  START_DIRECTLY: "START_DIRECTLY",
  OPEN_LOCATION_PICKER: "OPEN_LOCATION_PICKER",
  BLOCK_INVALID_SELECTION: "BLOCK_INVALID_SELECTION",
  START_WITH_SELECTED_LOCATION: "START_WITH_SELECTED_LOCATION",
  BLOCK_BUSY: "BLOCK_BUSY",
  NOT_CHAT_CAPABLE: "NOT_CHAT_CAPABLE",
});

export const CREATION_STORY_START_CALLBACK_KEYS = Object.freeze([
  "onSelectLocation",
  "onCancelLocationPicker",
  "onConfirmLocation",
]);

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSurface(value) {
  const surface = text(value).toUpperCase();

  return Object.values(
    CREATION_STORY_START_SURFACES
  ).includes(surface)
    ? surface
    : CREATION_STORY_START_SURFACES.PROFILE_PAGE;
}

function normalizeOption(value = {}) {
  const source = object(value);
  const id = text(source.id);

  if (!id) return null;

  return {
    id,
    title:
      text(source.title) ||
      "Location",
    subtitle:
      text(source.subtitle),
    imageUrl:
      text(source.imageUrl) || null,
  };
}

function normalizeOpeningLocationState({
  openingLocation = {},
  starting = false,
  error = "",
  callbacks = {},
} = {}) {
  const source = object(openingLocation);
  const callbackSource = object(callbacks);

  const options =
    array(source.options)
      .map(normalizeOption)
      .filter(Boolean);

  const allowedLocationIds =
    [
      ...new Set(
        (
          array(source.allowedLocationIds).length > 0
            ? array(source.allowedLocationIds)
            : options.map((option) => option.id)
        )
          .map(text)
          .filter(Boolean)
      ),
    ];

  const requestedSelection =
    text(source.selectedLocationId);

  const selectedLocationId =
    allowedLocationIds.includes(
      requestedSelection
    )
      ? requestedSelection
      : "";

  return {
    selectionRequired:
      source.selectionRequired === true,

    pickerOpen:
      source.pickerOpen === true,

    options,

    allowedLocationIds,

    selectedLocationId,

    starting:
      starting === true,

    error:
      text(error),

    callbacks: {
      onSelect:
        callbackSource.onSelectLocation || null,
      onCancel:
        callbackSource.onCancelLocationPicker || null,
      onConfirm:
        callbackSource.onConfirmLocation || null,
    },
  };
}

export function projectCreationStoryStartIntent({
  supportsChat = true,
  selectionRequired = false,
  selectedLocationId = "",
  allowedLocationIds = [],
  starting = false,
  forceSelection = false,
} = {}) {
  if (supportsChat !== true) {
    return {
      intent:
        CREATION_STORY_START_INTENTS.NOT_CHAT_CAPABLE,
      invokeStoryStart: false,
      openLocationPicker: false,
      openingLocationId: null,
      errorMessage: "",
    };
  }

  if (starting === true) {
    return {
      intent:
        CREATION_STORY_START_INTENTS.BLOCK_BUSY,
      invokeStoryStart: false,
      openLocationPicker: false,
      openingLocationId: null,
      errorMessage: "",
    };
  }

  if (selectionRequired !== true) {
    return {
      intent:
        CREATION_STORY_START_INTENTS.START_DIRECTLY,
      invokeStoryStart: true,
      openLocationPicker: false,
      openingLocationId: null,
      errorMessage: "",
    };
  }

  const allowedIds =
    array(allowedLocationIds)
      .map(text)
      .filter(Boolean);

  const selected =
    text(selectedLocationId);

  const validSelection =
    Boolean(selected) &&
    allowedIds.includes(selected);

  if (!validSelection && forceSelection !== true) {
    return {
      intent:
        CREATION_STORY_START_INTENTS.OPEN_LOCATION_PICKER,
      invokeStoryStart: false,
      openLocationPicker: true,
      openingLocationId: null,
      errorMessage: "",
    };
  }

  if (!validSelection) {
    return {
      intent:
        CREATION_STORY_START_INTENTS.BLOCK_INVALID_SELECTION,
      invokeStoryStart: false,
      openLocationPicker: true,
      openingLocationId: null,
      errorMessage:
        "Choose one of the allowed starting Locations.",
    };
  }

  return {
    intent:
      CREATION_STORY_START_INTENTS.START_WITH_SELECTED_LOCATION,
    invokeStoryStart: true,
    openLocationPicker: false,
    openingLocationId: selected,
    errorMessage: "",
  };
}

export function projectCreationStoryStartOpeningLocationBinding({
  surface = "PROFILE_PAGE",
  supportsChat = true,
  starting = false,
  error = "",
  openingLocation = {},
  callbacks = {},
} = {}) {
  const normalizedSurface =
    normalizeSurface(surface);

  const state =
    normalizeOpeningLocationState({
      openingLocation,
      starting,
      error,
      callbacks,
    });

  const picker =
    projectStoryStartOpeningLocationPresentation({
      selectionRequired:
        state.selectionRequired,
      open:
        state.pickerOpen,
      options:
        state.options,
      selectedLocationId:
        state.selectedLocationId,
      pending:
        state.starting,
      error:
        state.error,
      callbacks:
        state.callbacks,
    });

  const initialStartIntent =
    projectCreationStoryStartIntent({
      supportsChat,
      selectionRequired:
        state.selectionRequired,
      selectedLocationId:
        state.selectedLocationId,
      allowedLocationIds:
        state.allowedLocationIds,
      starting:
        state.starting,
      forceSelection: false,
    });

  const confirmStartIntent =
    projectCreationStoryStartIntent({
      supportsChat,
      selectionRequired:
        state.selectionRequired,
      selectedLocationId:
        state.selectedLocationId,
      allowedLocationIds:
        state.allowedLocationIds,
      starting:
        state.starting,
      forceSelection: true,
    });

  const isProfile =
    normalizedSurface ===
    CREATION_STORY_START_SURFACES.PROFILE_PAGE;

  const visualSlot = isProfile
    ? {
        surface:
          "Creation Profile Page",
        slotName:
          "openingLocationPickerSlot",
        status:
          state.selectionRequired
            ? "WIRED"
            : "NOT_REQUIRED_FOR_FIXED_START",
      }
    : {
        surface:
          "Creation Preview Modal",
        slotName:
          "openingLocationPickerSlot",
        status:
          state.selectionRequired
            ? "WIRED"
            : "NOT_REQUIRED_FOR_FIXED_START",
      };

  return {
    bindingContractVersion:
      CREATION_STORY_START_OPENING_LOCATION_BINDING_CONTRACT_VERSION,

    creationProfilePageViewContractVersion:
      CREATION_PROFILE_PAGE_VIEW_CONTRACT_VERSION,

    creationPreviewModalViewContractVersion:
      CREATION_PREVIEW_MODAL_VIEW_CONTRACT_VERSION,

    storyStartOpeningLocationPresentationContractVersion:
      STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,

    surface:
      normalizedSurface,

    supportsChat:
      supportsChat === true,

    openingLocation: {
      selectionRequired:
        state.selectionRequired,
      allowedLocationIds:
        state.allowedLocationIds,
      selectedLocationId:
        state.selectedLocationId,
      picker,
    },

    startAction: {
      initial:
        initialStartIntent,
      confirm:
        confirmStartIntent,
    },

    surfaceIntegration: {
      profilePage:
        isProfile
          ? {
              startButtonBehavior:
                initialStartIntent.intent,
              openingLocationPicker:
                picker,
              requiredVisualSlot:
                visualSlot,
            }
          : null,

      previewModal:
        !isProfile
          ? {
              startButtonBehavior:
                initialStartIntent.intent,
              openingLocationPicker:
                picker,
              requiredVisualSlot:
                visualSlot,
            }
          : null,
    },

    callbacks: {
      onSelectLocation:
        state.callbacks.onSelect,
      onCancelLocationPicker:
        state.callbacks.onCancel,
      onConfirmLocation:
        state.callbacks.onConfirm,
    },

    functionalWiringStatus: {
      creationProfileOpeningLocationPicker:
        "WIRED",
      creationPreviewOpeningLocationPicker:
        "WIRED",
      creationCardStoryStartPreflight:
        "WIRED",
      selectedLocationValidation:
        "WIRED",
      selectedLocationCommitRouting:
        "WIRED",
    },

    visualExtensionStatus: {
      creationProfileOpeningLocationPicker:
        isProfile &&
        state.selectionRequired
          ? "WIRED"
          : "NOT_REQUIRED_BY_CURRENT_SURFACE",

      creationPreviewOpeningLocationPicker:
        !isProfile &&
        state.selectionRequired
          ? "WIRED"
          : "NOT_REQUIRED_BY_CURRENT_SURFACE",

      fixedStoryStart:
        state.selectionRequired
          ? "NOT_APPLICABLE"
          : "CURRENT_START_ACTION_COMPATIBLE",
    },

    architecture: {
      storyCreationParsingOwnedByChassis: true,
      openingLocationModeOwnedByChassis: true,
      allowedLocationIdsOwnedByChassis: true,
      selectedLocationStateOwnedByChassisApplicationViewModel: true,
      selectedLocationValidationOwnedByChassis: true,
      roomCreationOwnedByChassis: true,
      openingHardStateCommitOwnedByChassis: true,
      navigationOwnedByChassis: true,
      startGatePresentationProjectionOwnedByFe: true,
      pickerVisualCompositionOwnedByFe: true,
    },
  };
}
