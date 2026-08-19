export const STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION =
  "story_opening_location.presentation.v1";

export const STORY_OPENING_LOCATION_AUTHORING_VERSION =
  "story_opening_location_v0";

export const STORY_OPENING_LOCATION_MODES = Object.freeze({
  FIXED: "FIXED",
  PLAYER_SELECT: "PLAYER_SELECT",
});

export const STORY_OPENING_LOCATION_MODE_OPTIONS = Object.freeze([
  Object.freeze({
    value: STORY_OPENING_LOCATION_MODES.FIXED,
    label: "Fixed Starting Location",
  }),
  Object.freeze({
    value: STORY_OPENING_LOCATION_MODES.PLAYER_SELECT,
    label: "Player Selects Starting Location",
  }),
]);

export const STORY_OPENING_LOCATION_CALLBACK_KEYS = Object.freeze([
  "onModeChange",
  "onOpenLocationPicker",
  "onRemoveAllowedLocation",
]);

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeStoryOpeningLocationReference(reference) {
  const source = normalizeObject(reference);
  const id = normalizeString(
    source.id || source.creationId || source.creation_id
  );

  if (!id) return null;

  return {
    id,
    type: normalizeString(source.type) || "LOCATION",
    title: normalizeString(source.title) || "Location",
    subtitle: normalizeString(
      source.subtitle || source.description
    ),
    contentRating:
      normalizeString(
        source.contentRating || source.content_rating
      ) || "SFW",
    imageUrl:
      normalizeString(
        source.imageUrl ||
          source.image_url ||
          source.thumbnailUrl ||
          source.url
      ) || null,
  };
}

function uniqueReferences(references) {
  const byId = new Map();

  normalizeArray(references).forEach((reference) => {
    const normalized =
      normalizeStoryOpeningLocationReference(reference);

    if (normalized?.id && !byId.has(normalized.id)) {
      byId.set(normalized.id, normalized);
    }
  });

  return [...byId.values()];
}

export function normalizeStoryOpeningLocationAuthoring(
  storyData = {},
  locationOptions = []
) {
  const story = normalizeObject(storyData);
  const authored = normalizeObject(
    story.opening_location || story.openingLocation
  );
  const rawMode = normalizeString(authored.mode).toUpperCase();
  const mode = Object.values(
    STORY_OPENING_LOCATION_MODES
  ).includes(rawMode)
    ? rawMode
    : STORY_OPENING_LOCATION_MODES.FIXED;

  const optionById = new Map(
    normalizeArray(locationOptions)
      .map(normalizeStoryOpeningLocationReference)
      .filter(Boolean)
      .map((reference) => [reference.id, reference])
  );

  const storedAllowed = uniqueReferences(
    authored.allowedLocations || authored.allowed_locations
  );
  const storedById = new Map(
    storedAllowed.map((reference) => [
      reference.id,
      reference,
    ])
  );

  const allowedLocationIds = [
    ...new Set(
      normalizeArray(
        authored.allowedLocationIds ||
          authored.allowed_location_ids
      )
        .map(normalizeString)
        .filter(Boolean)
    ),
  ];

  const allowedLocations = allowedLocationIds.map(
    (id) =>
      optionById.get(id) ||
      storedById.get(id) || {
        id,
        type: "LOCATION",
        title: `Location ${id.slice(0, 8)}`,
        subtitle: "",
        contentRating: "SFW",
        imageUrl: null,
      }
  );

  const legacyFixedLocationId = normalizeString(
    story.location_id ||
      story.locationId ||
      story.selected_location?.id
  );

  const fixedLocationId = normalizeString(
    authored.fixedLocationId ||
      authored.fixed_location_id ||
      authored.locationId ||
      authored.location_id ||
      legacyFixedLocationId
  );

  return {
    version: STORY_OPENING_LOCATION_AUTHORING_VERSION,
    mode,
    fixedLocationId: fixedLocationId || null,
    allowedLocationIds,
    allowedLocations,
  };
}

export function buildPlayerSelectableOpeningLocationConfig(
  locations = []
) {
  const allowedLocations = uniqueReferences(locations);

  return {
    version: STORY_OPENING_LOCATION_AUTHORING_VERSION,
    mode: STORY_OPENING_LOCATION_MODES.PLAYER_SELECT,
    allowedLocationIds: allowedLocations.map(
      (location) => location.id
    ),
    allowedLocations,
  };
}

export function buildFixedOpeningLocationConfig(
  location = null
) {
  const fixedLocation =
    normalizeStoryOpeningLocationReference(location);

  return {
    version: STORY_OPENING_LOCATION_AUTHORING_VERSION,
    mode: STORY_OPENING_LOCATION_MODES.FIXED,
    fixedLocationId: fixedLocation?.id || null,
  };
}

export function toggleOpeningLocationReference(
  locations = [],
  location = null
) {
  const normalizedLocation =
    normalizeStoryOpeningLocationReference(location);
  const current = uniqueReferences(locations);

  if (!normalizedLocation?.id) return current;

  return current.some(
    (item) => item.id === normalizedLocation.id
  )
    ? current.filter(
        (item) => item.id !== normalizedLocation.id
      )
    : [...current, normalizedLocation];
}

export function projectStoryOpeningLocationAuthoringPresentation({
  storyData = {},
  locationOptions = [],
} = {}) {
  const normalized = normalizeStoryOpeningLocationAuthoring(
    storyData,
    locationOptions
  );
  const playerSelect =
    normalized.mode ===
    STORY_OPENING_LOCATION_MODES.PLAYER_SELECT;

  const validationMessage =
    playerSelect &&
    normalized.allowedLocations.length === 0
      ? "Add at least one allowed starting Location."
      : "";

  return {
    contractVersion:
      STORY_OPENING_LOCATION_PRESENTATION_CONTRACT_VERSION,
    authoringVersion:
      STORY_OPENING_LOCATION_AUTHORING_VERSION,
    mode: normalized.mode,
    modeOptions: STORY_OPENING_LOCATION_MODE_OPTIONS.map(
      (option) => ({ ...option })
    ),
    fixedLocationId: normalized.fixedLocationId,
    allowedLocationIds: [
      ...normalized.allowedLocationIds,
    ],
    allowedLocations: normalized.allowedLocations.map(
      (location) => ({ ...location })
    ),
    playerSelect,
    selectionRequiredAtStoryStart: playerSelect,
    allowedLocationCount:
      normalized.allowedLocations.length,
    validationMessage,
    canSaveAuthoring:
      !playerSelect ||
      normalized.allowedLocations.length > 0,
    fixedModeHelper:
      "The existing Location / Scene selection remains the authoritative fixed opening Location.",
    playerSelectHelper:
      "Only these Locations can be committed as the opening hard state.",
  };
}
