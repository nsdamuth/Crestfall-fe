import { getDefaultCreationImageForType } from "@/lib/shared/creations/creationMedia";

function normalizeCreationType(type) {
  return String(type || "").trim().toUpperCase();
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}
function getPickerImageUrl(item) {
  if (!item) return getDefaultCreationImageForType("ROOM_TEMPLATE");

  if (item.imageUrl) return item.imageUrl;
  if (item.image_url) return item.image_url;
  if (item.avatarUrl) return item.avatarUrl;
  if (item.avatar_url) return item.avatar_url;

  const normalizedType = normalizeCreationType(item.type);

  if (normalizedType === "PLAYER" || normalizedType === "USER") {
    return getDefaultCreationImageForType("PLAYER_CHARACTER");
  }

  return getDefaultCreationImageForType(normalizedType);
}
function getReferenceImageUrl(creation) {
  const featuredMedia = creation.featuredMedia || creation.featured_media || [];
  const firstMedia = Array.isArray(featuredMedia) ? featuredMedia[0] : null;

  return (
    creation.imageUrl ||
    creation.image_url ||
    firstMedia?.imageUrl ||
    firstMedia?.image_url ||
    firstMedia?.url ||
    null
  );
}

function toRoomReferenceOption(creation) {
  const type = normalizeCreationType(creation.type);

  if (!creation.id || !type) return null;

  return {
    id: creation.id,
    type,
    title: creation.title || "Untitled Creation",
    subtitle: creation.subtitle || creation.description || "",
    contentRating: creation.contentRating || creation.content_rating || "SFW",
    imageUrl: getReferenceImageUrl(creation),
    data: creation.data || {},
  };
}

function filterReferenceOptions(options, allowedTypes = []) {
  const allowed = new Set(allowedTypes.map(normalizeCreationType));

  return options.filter((option) => allowed.has(normalizeCreationType(option.type)));
}

function normalizeReferenceArray(value) {
  if (!Array.isArray(value)) return [];

  return value.filter((item) => item?.id);
}

function findOptionById(options, reference) {
  if (!reference?.id) return null;

  return options.find((option) => option.id === reference.id) || null;
}

function addUniqueReferences(current, nextItems) {
  const seenIds = new Set(current.map((item) => item.id));
  const additions = [];

  nextItems.forEach((item) => {
    if (!item?.id || seenIds.has(item.id)) return;

    seenIds.add(item.id);
    additions.push(item);
  });

  return [...current, ...additions];
}

function getScenarioRecommendationData(scenario, referenceOptions) {
  const data = scenario?.data || {};

  const requiredCharacters = normalizeReferenceArray(data.required_characters)
    .map((reference) => findOptionById(referenceOptions, reference) || reference)
    .filter(Boolean);

  const optionalCharacters = normalizeReferenceArray(data.optional_characters)
    .map((reference) => findOptionById(referenceOptions, reference) || reference)
    .filter(Boolean);

  const suggestedLocation =
    findOptionById(referenceOptions, data.suggested_location) ||
    data.suggested_location ||
    null;

  const suggestedNarrator =
    findOptionById(referenceOptions, data.suggested_narrator) ||
    data.suggested_narrator ||
    null;

  const suggestedNpcRegistries = normalizeReferenceArray(
    data.suggested_npc_registries
  )
    .map((reference) => findOptionById(referenceOptions, reference) || reference)
    .filter(Boolean);

  const recommendedIds = new Set([
    ...requiredCharacters.map((item) => item.id),
    ...optionalCharacters.map((item) => item.id),
    suggestedLocation?.id,
    suggestedNarrator?.id,
    ...suggestedNpcRegistries.map((item) => item.id),
  ].filter(Boolean));

  return {
    requiredCharacters,
    optionalCharacters,
    suggestedLocation,
    suggestedNarrator,
    suggestedNpcRegistries,
    recommendedIds,
    hasAny:
      requiredCharacters.length > 0 ||
      optionalCharacters.length > 0 ||
      Boolean(suggestedLocation) ||
      Boolean(suggestedNarrator) ||
      suggestedNpcRegistries.length > 0,
  };
}

function buildScenarioRegistryLink(reference) {
  const normalized = normalizeReference(reference);

  if (!normalized?.id) return null;

  return {
    id: `scenario_recommendation_${normalized.id}`,
    creationId: normalized.id,
    title: normalized.title || "NPC Registry",
    type: normalized.type || "NPC_REGISTRY",
    description: normalized.subtitle || "",
    imageUrl: normalized.imageUrl || "",
    notes: "",
  };
}

function mergeScenarioNpcRegistryRecommendations(data, recommendations) {
  const safeData = normalizeObject(data);
  const boundRegistries = normalizeObject(safeData.boundRegistries);
  const boundRegistryLinks = normalizeObject(safeData.boundRegistryLinks);
  const currentIds = Array.isArray(boundRegistries.npcRegistryIds)
    ? boundRegistries.npcRegistryIds.filter(Boolean)
    : [];
  const currentLinks = Array.isArray(boundRegistryLinks.npcRegistries)
    ? boundRegistryLinks.npcRegistries.filter(Boolean)
    : [];

  const normalizedRecommendations = [
    ...new Map(
      normalizeReferenceArray(recommendations)
        .map(normalizeReference)
        .filter((item) => item?.id)
        .map((item) => [item.id, item])
    ).values(),
  ];

  const nextIds = [...new Set([
    ...currentIds,
    ...normalizedRecommendations.map((item) => item.id),
  ])];

  const existingLinkIds = new Set(
    currentLinks
      .map((link) => link?.creationId || link?.creation_id)
      .filter(Boolean)
  );

  const addedLinks = normalizedRecommendations
    .filter((item) => !existingLinkIds.has(item.id))
    .map(buildScenarioRegistryLink)
    .filter(Boolean);

  return {
    boundRegistries: {
      ...boundRegistries,
      npcRegistryIds: nextIds,
    },
    boundRegistryLinks: {
      ...boundRegistryLinks,
      npcRegistries: [...currentLinks, ...addedLinks],
    },
  };
}
function parseTags(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeReference(reference) {
  if (!reference || typeof reference !== "object") return null;

  return {
    id: reference.id,
    type: reference.type,
    title: reference.title,
    subtitle: reference.subtitle || "",
    contentRating: reference.contentRating || reference.content_rating || "SFW",
    imageUrl: reference.imageUrl || reference.image_url || reference.url || null,
  };
}


const STORY_OPENING_LOCATION_CONTRACT_VERSION = "story_opening_location_v0";

const STORY_OPENING_LOCATION_MODES = Object.freeze({
  FIXED: "FIXED",
  PLAYER_SELECT: "PLAYER_SELECT",
});

function normalizeStoryOpeningLocationMode(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
    ? STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
    : STORY_OPENING_LOCATION_MODES.FIXED;
}

function normalizeUniqueIds(values = []) {
  return [
    ...new Set(
      (Array.isArray(values) ? values : [])
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    ),
  ];
}

function getRoomTemplateOpeningLocationAuthoring(
  data = {},
  locationOptions = []
) {
  const source = normalizeObject(data);
  const authored = normalizeObject(
    source.opening_location || source.openingLocation
  );
  const mode = normalizeStoryOpeningLocationMode(authored.mode);
  const fixedLocationId = String(
    authored.fixedLocationId ||
      authored.fixed_location_id ||
      source.location_id ||
      source.locationId ||
      source.selected_location?.id ||
      ""
  ).trim();
  const authoredAllowedIds = normalizeUniqueIds(
    authored.allowedLocationIds || authored.allowed_location_ids
  );
  const authoredAllowedReferences = Array.isArray(authored.allowedLocations)
    ? authored.allowedLocations
    : Array.isArray(authored.allowed_locations)
      ? authored.allowed_locations
      : [];
  const authoredReferencesById = new Map(
    authoredAllowedReferences
      .filter((item) => item?.id)
      .map((item) => [item.id, item])
  );
  const optionsById = new Map(
    (Array.isArray(locationOptions) ? locationOptions : [])
      .filter((item) => item?.id)
      .map((item) => [item.id, item])
  );
  const fixedLocation = fixedLocationId
    ? optionsById.get(fixedLocationId) ||
      (source.selected_location?.id === fixedLocationId
        ? source.selected_location
        : null) ||
      authored.fixedLocation ||
      authored.fixed_location ||
      { id: fixedLocationId, type: "LOCATION", title: fixedLocationId }
    : null;
  const allowedLocationIds =
    mode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT
      ? authoredAllowedIds
      : fixedLocationId
        ? [fixedLocationId]
        : [];
  const allowedLocations = allowedLocationIds.map((id) =>
    optionsById.get(id) ||
    authoredReferencesById.get(id) ||
    { id, type: "LOCATION", title: id }
  );

  return {
    version: STORY_OPENING_LOCATION_CONTRACT_VERSION,
    mode,
    fixedLocation,
    fixedLocationId: fixedLocationId || null,
    allowedLocationIds,
    allowedLocations,
  };
}

function buildRoomTemplateOpeningLocationData({
  mode,
  fixedLocation = null,
  allowedLocations = [],
} = {}) {
  const normalizedMode = normalizeStoryOpeningLocationMode(mode);
  const normalizedFixed = normalizeReference(fixedLocation);
  const normalizedAllowed = normalizeReferenceArray(allowedLocations)
    .map(normalizeReference)
    .filter(Boolean);

  if (normalizedMode === STORY_OPENING_LOCATION_MODES.PLAYER_SELECT) {
    return {
      version: STORY_OPENING_LOCATION_CONTRACT_VERSION,
      mode: STORY_OPENING_LOCATION_MODES.PLAYER_SELECT,
      fixedLocationId: null,
      fixedLocation: null,
      allowedLocationIds: normalizeUniqueIds(
        normalizedAllowed.map((item) => item.id)
      ),
      allowedLocations: normalizedAllowed,
    };
  }

  return {
    version: STORY_OPENING_LOCATION_CONTRACT_VERSION,
    mode: STORY_OPENING_LOCATION_MODES.FIXED,
    fixedLocationId: normalizedFixed?.id || null,
    fixedLocation: normalizedFixed,
    allowedLocationIds: normalizedFixed?.id ? [normalizedFixed.id] : [],
    allowedLocations: normalizedFixed ? [normalizedFixed] : [],
  };
}

function normalizeOpeningMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .map((message, index) => ({
      id: message.id || `message-${index + 1}`,
      speaker: String(message.speaker || "Narrator").trim(),
      body: String(message.body || "").trim(),
    }))
    .filter((message) => message.body);
}

function buildRoomTemplateDescription(form) {
  return (
    form.public_description?.trim() ||
    form.title?.trim() ||
    "A reusable Crestfall story"
  );
}
function normalizeInvitedPlayers(players) {
  if (!Array.isArray(players)) return [];

  return players
    .map((player) => ({
      id: player.id,
      username: player.username,
      avatarUrl: player.avatarUrl || null,
    }))
    .filter((player) => player.id && player.username);
}
function buildRoomTemplateCreationPayload({
  form,
  selectedCharacters,
  selectedScenario,
  selectedNarrator,
  selectedLocation,
  openingMessages,
  displayMediaSlot,
  invitedPlayers,
}) {
  const title = form.title?.trim() || "Untitled Story";
  const tags = parseTags(form.tags);

  return {
    type: "ROOM_TEMPLATE",
    title,
    description: buildRoomTemplateDescription(form),
    visibility: form.visibility || "PRIVATE",
    content_rating: form.content_rating || "SFW",
    data: {
      ...form,
      title,
      tags,

      selected_scenario: normalizeReference(selectedScenario),
      selected_characters: normalizeReferenceArray(selectedCharacters),
      selected_narrator: normalizeReference(selectedNarrator),
      selected_location: normalizeReference(selectedLocation),

      opening_messages: normalizeOpeningMessages(openingMessages),
      active_display_media_slot: displayMediaSlot,
      display_media_slots: [],

      builder: "ROOM_TEMPLATE_BUILDER",
      builder_version: "1.0",
      creation_kind: "ROOM_TEMPLATE",

      scenario_id: selectedScenario?.id || form.scenario_id || "",
      narrator_id: selectedNarrator?.id || form.narrator_id || "",
      location_id: selectedLocation?.id || form.location_id || "",

      playable_directly: true,
      chat_enabled: false,
      image_gen_ingredient: false,
      turn_based: Boolean(form.turn_based) || invitedPlayers.length > 0,
      turn_mode:
        Boolean(form.turn_based) || invitedPlayers.length > 0
          ? "TURN_BASED"
          : "FREEFORM",

      multiplayer_enabled: invitedPlayers.length > 0,
      invited_players: normalizeInvitedPlayers(invitedPlayers),
      invite_status: invitedPlayers.length > 0 ? "DRAFT_PENDING_INVITES" : "NONE",
    },
  };
}
function extractCreationFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

function getApiErrorMessage(payload, fallback) {
  return payload?.error?.message || payload?.message || payload?.error || fallback;
}

export {
    normalizeCreationType,
    getPickerImageUrl,
    getReferenceImageUrl,
    toRoomReferenceOption,
    filterReferenceOptions,
    normalizeReferenceArray,
    findOptionById,
    addUniqueReferences,
    getScenarioRecommendationData,
    mergeScenarioNpcRegistryRecommendations,
    parseTags,
    normalizeReference,
    STORY_OPENING_LOCATION_CONTRACT_VERSION,
    STORY_OPENING_LOCATION_MODES,
    getRoomTemplateOpeningLocationAuthoring,
    buildRoomTemplateOpeningLocationData,
    normalizeOpeningMessages,
    buildRoomTemplateDescription,
    normalizeInvitedPlayers,
    buildRoomTemplateCreationPayload,
    extractCreationFromApiResponse,
    getApiErrorMessage,
}