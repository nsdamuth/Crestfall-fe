import {
  STORY_OPENING_LOCATION_AUTHORING_VERSION,
  STORY_OPENING_LOCATION_MODES,
} from "../../room-templates/story-opening-location-authoring/StoryOpeningLocationAuthoring.contract.js";

export const STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION =
  "story_start_opening_location.presentation.v1";

export const STORY_START_OPENING_LOCATION_CALLBACK_KEYS = Object.freeze([
  "onSelect",
  "onCancel",
  "onConfirm",
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

function normalizeOption(value = {}) {
  const source = object(value);
  const id = text(source.id);

  if (!id) return null;

  return {
    id,
    title: text(source.title) || "Location",
    subtitle: text(source.subtitle),
    imageUrl: text(source.imageUrl) || null,
  };
}

export function projectStoryStartOpeningLocationPresentation({
  selectionRequired = false,
  open = false,
  options = [],
  selectedLocationId = "",
  pending = false,
  error = "",
  callbacks = {},
} = {}) {
  const callbackSource = object(callbacks);
  const normalizedOptions = array(options)
    .map(normalizeOption)
    .filter(Boolean);

  const selectedId = text(selectedLocationId);
  const selectedOption =
    normalizedOptions.find((option) => option.id === selectedId) || null;

  const required = selectionRequired === true;
  const visible = required && open === true;
  const busy = pending === true;
  const hasOptions = normalizedOptions.length > 0;

  const optionCards = normalizedOptions.map((option) => ({
    ...option,
    selected: option.id === selectedOption?.id,
    disabled: busy,
    ariaPressed: option.id === selectedOption?.id,
  }));

  return {
    contractVersion:
      STORY_START_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
    authoringContractVersion:
      STORY_OPENING_LOCATION_AUTHORING_VERSION,
    mode:
      required
        ? STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
        : STORY_OPENING_LOCATION_MODES.FIXED,

    selectionRequired: required,
    open: visible,
    pending: busy,

    eyebrow: "Choose Starting Location",
    description:
      "This Story lets the player choose where the opening hard state begins. Only the creator-authored Locations below are valid.",

    options: optionCards,
    selectedLocationId: selectedOption?.id || "",
    selectedOption,

    emptyState:
      required && !hasOptions
        ? {
            title: "No starting Locations available",
            message:
              "This Story requires a player-selected starting Location, but no creator-authored allowed Locations are currently available.",
          }
        : null,

    errorMessage: text(error),

    actions: {
      cancelLabel: "Cancel",
      confirmLabel: busy ? "Starting..." : "Start Here",
      cancelDisabled: busy,
      confirmDisabled:
        busy ||
        !visible ||
        !selectedOption,
      canConfirm:
        visible &&
        !busy &&
        Boolean(selectedOption),
    },

    callbacks: {
      onSelect:
        callbackSource.onSelect || null,
      onCancel:
        callbackSource.onCancel || null,
      onConfirm:
        callbackSource.onConfirm || null,
    },

    architecture: {
      openingLocationConfigOwnedByChassis: true,
      allowedLocationIdsOwnedByChassis: true,
      selectedLocationValidationOwnedByChassis: true,
      roomCreationOwnedByChassis: true,
      openingHardStateCommitOwnedByChassis: true,
      pickerVisualCompositionOwnedByFe: true,
    },
  };
}
