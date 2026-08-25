import {
  STORY_IMAGE_STYLE_LAUNCH_MODES,
  getStoryImageStyleLaunchStartConfig as getSharedStoryImageStyleLaunchStartConfig,
  normalizeStoryImageStyleValue,
} from "../../../shared/story-rooms/storyImageStyleLaunchContract.js";

async function readJsonResponse(response) {
  return response.json().catch(() => null);
}

function getStoryRoomApiErrorMessage(payload, fallbackMessage) {
  return (
    payload?.error?.message ||
    payload?.message ||
    payload?.error ||
    fallbackMessage
  );
}

async function requestStoryRoomApi({
  endpoint,
  method = "GET",
  body,
  fallbackMessage,
}) {
  const response = await fetch(endpoint, {
    method,
    headers: body
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await readJsonResponse(response);

  if (!response.ok || payload?.error || payload?.ok === false) {
    throw new Error(getStoryRoomApiErrorMessage(payload, fallbackMessage));
  }

  return payload;
}

function normalizeStoryOpeningLocationStartReference(reference) {
  if (!reference || typeof reference !== "object") return null;
  const id = String(
    reference.id || reference.creationId || reference.creation_id || ""
  ).trim();
  if (!id) return null;

  return {
    id,
    title: String(reference.title || "Location").trim() || "Location",
    subtitle: String(reference.subtitle || reference.description || "").trim(),
    imageUrl:
      String(
        reference.imageUrl ||
          reference.image_url ||
          reference.thumbnailUrl ||
          reference.url ||
          ""
      ).trim() || null,
  };
}

export function getStoryOpeningLocationStartConfig(creation = {}) {
  const creationType = String(creation?.type || "").trim().toUpperCase();
  const data = creation?.data && typeof creation.data === "object"
    ? creation.data
    : {};
  const authored =
    data.opening_location && typeof data.opening_location === "object"
      ? data.opening_location
      : data.openingLocation && typeof data.openingLocation === "object"
        ? data.openingLocation
        : {};
  const mode = String(authored.mode || "").trim().toUpperCase();

  if (
    creationType !== "ROOM_TEMPLATE" ||
    mode !== "PLAYER_SELECT"
  ) {
    return {
      mode: "FIXED",
      selectionRequired: false,
      allowedLocationIds: [],
      options: [],
    };
  }

  const allowedLocationIds = [
    ...new Set(
      (Array.isArray(authored.allowedLocationIds)
        ? authored.allowedLocationIds
        : Array.isArray(authored.allowed_location_ids)
          ? authored.allowed_location_ids
          : []
      )
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    ),
  ];
  const authoredReferences = Array.isArray(authored.allowedLocations)
    ? authored.allowedLocations
    : Array.isArray(authored.allowed_locations)
      ? authored.allowed_locations
      : [];
  const referencesById = new Map(
    authoredReferences
      .map(normalizeStoryOpeningLocationStartReference)
      .filter(Boolean)
      .map((reference) => [reference.id, reference])
  );
  const options = allowedLocationIds.map(
    (id) =>
      referencesById.get(id) || {
        id,
        title: `Location ${id.slice(0, 8)}`,
        subtitle: "",
        imageUrl: null,
      }
  );

  return {
    mode: "PLAYER_SELECT",
    selectionRequired: true,
    allowedLocationIds,
    options,
  };
}


export function getStoryImageStyleLaunchStartConfig(creation = {}) {
  const creationType = String(creation?.type || "").trim().toUpperCase();
  if (creationType !== "ROOM_TEMPLATE") {
    return getSharedStoryImageStyleLaunchStartConfig({});
  }

  const data =
    creation?.data && typeof creation.data === "object" ? creation.data : {};
  const requirements =
    data.story_launch_requirements &&
    typeof data.story_launch_requirements === "object"
      ? data.story_launch_requirements
      : null;
  const source =
    requirements?.imageStyle && typeof requirements.imageStyle === "object"
      ? requirements.imageStyle
      : data;

  return getSharedStoryImageStyleLaunchStartConfig(source);
}


function getStoryLaunchRequirementsEnvelope(creation = {}) {
  const data =
    creation?.data && typeof creation.data === "object" ? creation.data : {};
  const requirements =
    data.story_launch_requirements &&
    typeof data.story_launch_requirements === "object"
      ? data.story_launch_requirements
      : null;

  return requirements;
}

export function getStoryPlayerCharacterStartConfig(creation = {}) {
  const creationType = String(creation?.type || "").trim().toUpperCase();
  const data =
    creation?.data && typeof creation.data === "object" ? creation.data : {};
  const requirements = getStoryLaunchRequirementsEnvelope(creation);
  const authoredMode = String(
    requirements?.playerCharacter?.mode ||
      data.player_character_mode ||
      data.playerCharacterMode ||
      "OPTIONAL"
  )
    .trim()
    .toUpperCase();

  const mode =
    authoredMode === "NONE" || authoredMode === "DISABLED"
      ? "NONE"
      : authoredMode === "REQUIRED"
        ? "REQUIRED"
        : "OPTIONAL";
  const source =
    requirements?.playerCharacter &&
    typeof requirements.playerCharacter === "object"
      ? requirements.playerCharacter
      : {};
  const options = Array.isArray(source.options) ? source.options : [];
  const defaultPlayerCharacterId = String(
    source.defaultPlayerCharacterId || ""
  ).trim();

  return {
    mode,
    selectionRequired: Boolean(
      requirements && mode !== "NONE"
    ),
    allowNone: mode === "OPTIONAL",
    defaultPlayerCharacterId,
    defaultOption:
      source.defaultOption && typeof source.defaultOption === "object"
        ? source.defaultOption
        : options.find((option) => option?.id === defaultPlayerCharacterId) ||
          null,
    options,
    suggestedSelection: String(source.suggestedSelection || "").toUpperCase(),
  };
}

export function getStoryPlayerCharacterDefaultSelection(config = {}) {
  if (config.mode === "NONE") {
    return {
      selection: "NONE",
      playerCharacterId: "",
    };
  }

  if (config.defaultPlayerCharacterId) {
    return {
      selection: "DEFAULT",
      playerCharacterId: config.defaultPlayerCharacterId,
    };
  }

  if (config.allowNone) {
    return {
      selection: "NONE",
      playerCharacterId: "",
    };
  }

  return {
    selection: "",
    playerCharacterId: "",
  };
}

export async function fetchStoryLaunchRequirements(templateId) {
  const safeTemplateId = String(templateId || "").trim();

  if (!safeTemplateId) {
    throw new Error("A Story Template id is required.");
  }

  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/from-template/launch-requirements?templateId=${encodeURIComponent(
      safeTemplateId
    )}`,
    method: "GET",
    fallbackMessage: "Story launch requirements could not be loaded.",
  });

  return responsePayload?.data || null;
}

export function applyStoryLaunchRequirements(
  creation = {},
  requirements = {}
) {
  const creationType = String(creation?.type || "").trim().toUpperCase();

  if (creationType !== "ROOM_TEMPLATE") {
    return creation;
  }

  const data =
    creation?.data && typeof creation.data === "object" ? creation.data : {};
  const openingLocation =
    requirements?.openingLocation &&
    typeof requirements.openingLocation === "object"
      ? requirements.openingLocation
      : null;
  const imageStyle =
    requirements?.imageStyle && typeof requirements.imageStyle === "object"
      ? requirements.imageStyle
      : null;

  return {
    ...creation,
    data: {
      ...data,
      ...(openingLocation
        ? {
            opening_location:
              String(openingLocation.mode || "").toUpperCase() ===
              "PLAYER_SELECT"
                ? {
                    mode: "PLAYER_SELECT",
                    allowedLocationIds: Array.isArray(
                      openingLocation.allowedLocationIds
                    )
                      ? openingLocation.allowedLocationIds
                      : [],
                    allowedLocations: Array.isArray(openingLocation.options)
                      ? openingLocation.options
                      : [],
                  }
                : {
                    mode: "FIXED",
                    fixedLocationId:
                      openingLocation.fixedLocationId || null,
                  },
          }
        : {}),
      ...(imageStyle
        ? {
            image_style_launch: {
              version: imageStyle.version || "story_image_style_launch_v1",
              mode:
                String(imageStyle.mode || "").toUpperCase() ===
                STORY_IMAGE_STYLE_LAUNCH_MODES.PLAYER_SELECT
                  ? STORY_IMAGE_STYLE_LAUNCH_MODES.PLAYER_SELECT
                  : STORY_IMAGE_STYLE_LAUNCH_MODES.OFF,
              allowedStyles: Array.isArray(imageStyle.allowedStyles)
                ? imageStyle.allowedStyles
                : [],
              defaultStyle: imageStyle.defaultStyle || "",
            },
          }
        : {}),
      story_launch_requirements: requirements,
    },
  };
}

export async function prepareStoryCreationForLaunch(creation = {}) {
  const creationId = String(creation?.id || "").trim();
  const creationType = String(creation?.type || "").trim().toUpperCase();

  if (creationType !== "ROOM_TEMPLATE") {
    return creation;
  }

  if (!creationId) {
    throw new Error("Creation id is required to prepare Story launch.");
  }

  const requirements = await fetchStoryLaunchRequirements(creationId);
  return applyStoryLaunchRequirements(creation, requirements);
}

export async function createStoryRoom(payload) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: "/api/studio/story-rooms",
    method: "POST",
    body: payload,
    fallbackMessage: "Story room could not be created.",
  });

  return responsePayload?.data;
}
export async function playStoryTemplate(payload) {
  const body =
    typeof payload === "string"
      ? {
          templateId: payload,
        }
      : payload;

  const responsePayload = await requestStoryRoomApi({
    endpoint: "/api/studio/story-rooms/from-template",
    method: "POST",
    body,
    fallbackMessage: "Story Template could not be played.",
  });

  return responsePayload?.data;
}

export async function startStoryFromCreation(
  creation,
  {
    openingLocationId = null,
    playerCharacterSelection = null,
    playerCharacterId = null,
    imageStylePreference = null,
  } = {}
) {
  const creationId = creation?.id;
  const creationType = String(creation?.type || "").toUpperCase();

  if (!creationId) {
    throw new Error("Creation id is required to start a Story.");
  }

  if (creationType === "ROOM_TEMPLATE") {
    const openingLocation = getStoryOpeningLocationStartConfig(creation);
    const playerCharacter = getStoryPlayerCharacterStartConfig(creation);
    const imageStyle = getStoryImageStyleLaunchStartConfig(creation);
    const normalizedOpeningLocationId = String(openingLocationId || "").trim();
    const normalizedPlayerCharacterSelection = String(
      playerCharacterSelection || ""
    )
      .trim()
      .toUpperCase();
    const normalizedPlayerCharacterId = String(playerCharacterId || "").trim();
    const normalizedImageStylePreference =
      normalizeStoryImageStyleValue(imageStylePreference);

    if (openingLocation.selectionRequired && !normalizedOpeningLocationId) {
      const error = new Error(
        "Choose an allowed starting Location before starting this Story."
      );
      error.code = "STORY_OPENING_LOCATION_SELECTION_REQUIRED";
      error.openingLocation = openingLocation;
      throw error;
    }

    if (
      openingLocation.selectionRequired &&
      !openingLocation.allowedLocationIds.includes(normalizedOpeningLocationId)
    ) {
      const error = new Error(
        "The selected starting Location is not allowed by this Story."
      );
      error.code = "STORY_OPENING_LOCATION_NOT_ALLOWED";
      error.openingLocation = openingLocation;
      throw error;
    }

    if (
      playerCharacter.selectionRequired &&
      !normalizedPlayerCharacterSelection
    ) {
      const error = new Error(
        "Choose how to start this Story's Player Character before continuing."
      );
      error.code = "STORY_PLAYER_CHARACTER_SELECTION_REQUIRED";
      error.playerCharacter = playerCharacter;
      throw error;
    }

    if (
      normalizedPlayerCharacterSelection === "NONE" &&
      playerCharacter.mode === "REQUIRED"
    ) {
      const error = new Error("This Story requires a Player Character.");
      error.code = "PLAYER_CHARACTER_REQUIRED";
      throw error;
    }

    if (
      normalizedPlayerCharacterSelection === "DEFAULT" &&
      !playerCharacter.defaultPlayerCharacterId
    ) {
      const error = new Error(
        "Your default Player Character is not available for this Story."
      );
      error.code = "PLAYER_CHARACTER_DEFAULT_UNAVAILABLE";
      throw error;
    }

    if (normalizedPlayerCharacterSelection === "SELECTED") {
      if (!normalizedPlayerCharacterId) {
        const error = new Error(
          "Choose a Player Character before starting this Story."
        );
        error.code = "PLAYER_CHARACTER_SELECTION_REQUIRED";
        throw error;
      }

      if (
        playerCharacter.options.length &&
        !playerCharacter.options.some(
          (option) => option?.id === normalizedPlayerCharacterId
        )
      ) {
        const error = new Error(
          "The selected Player Character is no longer available."
        );
        error.code = "PLAYER_CHARACTER_SELECTION_NOT_AVAILABLE";
        throw error;
      }
    }

    if (imageStyle.selectionRequired && !normalizedImageStylePreference) {
      const error = new Error(
        "Choose an image style preference before starting this Story."
      );
      error.code = "STORY_IMAGE_STYLE_SELECTION_REQUIRED";
      error.imageStyle = imageStyle;
      throw error;
    }

    if (
      imageStyle.selectionRequired &&
      !imageStyle.allowedStyles.includes(normalizedImageStylePreference)
    ) {
      const error = new Error(
        "The selected image style preference is not allowed by this Story."
      );
      error.code = "STORY_IMAGE_STYLE_NOT_ALLOWED";
      error.imageStyle = imageStyle;
      throw error;
    }

    return playStoryTemplate({
      templateId: creationId,
      ...(normalizedOpeningLocationId
        ? { openingLocationId: normalizedOpeningLocationId }
        : {}),
      ...(normalizedPlayerCharacterSelection
        ? { playerCharacterSelection: normalizedPlayerCharacterSelection }
        : {}),
      ...(normalizedPlayerCharacterSelection === "SELECTED" &&
      normalizedPlayerCharacterId
        ? { playerCharacterId: normalizedPlayerCharacterId }
        : {}),
      ...(normalizedImageStylePreference
        ? { imageStylePreference: normalizedImageStylePreference }
        : {}),
    });
  }

  if (creationType === "CHARACTER") {
    return createStoryRoom({
      defaultCharacterId: creationId,
      title: creation?.title ? `${creation.title}` : undefined,
    });
  }

  throw new Error("This creation type is not chat-enabled yet.");
}

export async function fetchStoryRooms() {
  const responsePayload = await requestStoryRoomApi({
    endpoint: "/api/studio/story-rooms",
    method: "GET",
    fallbackMessage: "Story rooms could not be loaded.",
  });

  return responsePayload?.data?.rooms || [];
}
export async function fetchStoryRoom(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(roomId)}`,
    method: "GET",
    fallbackMessage: "Story room could not be loaded.",
  });

  return responsePayload?.data;
}
export async function fetchStoryRoomCommandCatalog(
  roomId,
  { requestedSpeakerId = "AUTO" } = {}
) {
  const query = new URLSearchParams();
  if (requestedSpeakerId) query.set("requestedSpeakerId", requestedSpeakerId);

  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/command-catalog?${query.toString()}`,
    method: "GET",
    fallbackMessage: "Story room commands could not be loaded.",
  });

  return responsePayload?.data?.catalog || responsePayload?.data || {
    version: "mechanics_command_catalog_v1",
    status: "EMPTY",
    entries: [],
  };
}

export async function fetchStoryRoomStatusSurfaces(
  roomId,
  { requestedSpeakerId = "AUTO" } = {}
) {
  const query = new URLSearchParams();
  if (requestedSpeakerId) query.set("requestedSpeakerId", requestedSpeakerId);

  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/status-surfaces?${query.toString()}`,
    method: "GET",
    fallbackMessage: "Story status surfaces could not be loaded.",
  });

  return responsePayload?.data?.projection || responsePayload?.data || {
    version: "story_status_surface_projection_v1",
    status: "EMPTY",
    surfaces: [],
  };
}

export async function deleteStoryRoom(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(roomId)}`,
    method: "DELETE",
    fallbackMessage: "Story room could not be deleted.",
  });

  return responsePayload?.data;
}
export async function fetchStoryRoomEngineModuleBindings(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/engine-module-bindings`,
    method: "GET",
    fallbackMessage: "Story room runtime modules could not be loaded.",
  });

  return responsePayload?.data?.bindings || responsePayload?.bindings || [];
}

export async function upsertStoryRoomEngineModuleBinding(roomId, binding) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/engine-module-bindings`,
    method: "POST",
    body: binding,
    fallbackMessage: "Story room runtime module could not be saved.",
  });

  return responsePayload?.data || responsePayload;
}

export async function deleteStoryRoomEngineModuleBinding(roomId, moduleId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/engine-module-bindings/${encodeURIComponent(moduleId)}`,
    method: "DELETE",
    fallbackMessage: "Story room runtime module could not be removed.",
  });

  return responsePayload?.data || responsePayload;
}
export async function setStoryRoomPlayerCharacter(
  roomId,
  playerCharacterId
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/player-character`,
    method: "POST",
    body: {
      playerCharacterId,
    },
    fallbackMessage: "Player Character could not be changed.",
  });

  return responsePayload?.data;
}

export async function finalizeStoryRoomPlayerCharacterOnboarding(
  roomId,
  playerCharacterId
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/player-character/onboarding/finalize`,
    method: "POST",
    body: {
      playerCharacterId,
    },
    fallbackMessage: "Player Character onboarding could not be finalized.",
  });

  return responsePayload?.data;
}
export async function fetchStoryStatsPoolsCharacterConfiguration(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/character-configuration/stats`,
    method: "GET",
    fallbackMessage: "Stats & Pools Character Configuration could not be loaded.",
  });

  return responsePayload?.data || null;
}

export async function commitStoryStatsPoolsCharacterConfiguration(
  roomId,
  allocations = []
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/character-configuration/stats`,
    method: "POST",
    body: { allocations },
    fallbackMessage: "Stats & Pools Character Configuration could not be saved.",
  });

  return responsePayload?.data || null;
}

export async function fetchStorySkillsCharacterConfiguration(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/character-configuration/skills`,
    method: "GET",
    fallbackMessage: "Skills Character Configuration could not be loaded.",
  });

  return responsePayload?.data || null;
}

export async function commitStorySkillsCharacterConfiguration(
  roomId,
  selections = []
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/character-configuration/skills`,
    method: "POST",
    body: { selections },
    fallbackMessage: "Skills Character Configuration could not be saved.",
  });

  return responsePayload?.data || null;
}

export async function fetchStoryAbilitySpellCharacterConfiguration(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/character-configuration/ability-spell`,
    method: "GET",
    fallbackMessage: "Ability/Spell Character Configuration could not be loaded.",
  });

  return responsePayload?.data || null;
}

export async function commitStoryAbilitySpellCharacterConfiguration(
  roomId,
  selections = [],
  authoredDefinitions = []
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/character-configuration/ability-spell`,
    method: "POST",
    body: { selections, authoredDefinitions },
    fallbackMessage: "Ability/Spell Character Configuration could not be saved.",
  });

  return responsePayload?.data || null;
}

export async function sendStoryRoomMessage(
  roomId,
  {
    message,
    inputMode = "DIALOGUE",
    requestedSpeakerId = "AUTO",
    participantMentions = [],
    locationMentions = [],
    actionType = "MESSAGE",
  }
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(roomId)}/messages`,
    method: "POST",
    body: {
      message,
      inputMode,
      requestedSpeakerId,
      participantMentions,
      locationMentions,
      actionType,
    },
    fallbackMessage: "Story room message could not be sent.",
  });

  return responsePayload?.data;
}

export async function fetchStoryRoomRegistryNpcs(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/registry-npcs`,
    method: "GET",
    fallbackMessage: "NPC Registry participants could not be loaded.",
  });

  return responsePayload?.data?.registryNpcs || null;
}

export async function loadStoryRoomRegistryNpc(
  roomId,
  { registryId, entryId }
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/registry-npcs`,
    method: "POST",
    body: {
      registryId,
      entryId,
    },
    fallbackMessage: "NPC Registry participant could not be loaded.",
  });

  return responsePayload?.data;
}

export async function unloadStoryRoomRegistryNpc(roomId, participantId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/registry-npcs/${encodeURIComponent(participantId)}`,
    method: "DELETE",
    fallbackMessage: "NPC Registry participant could not be unloaded.",
  });

  return responsePayload?.data;
}

export async function loadRandomLikedStoryRoomCharacter(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/random-liked`,
    method: "POST",
    fallbackMessage:
      "A random liked Character could not be loaded into this Story.",
  });

  return responsePayload?.data;
}

export async function runStoryRoomMessageAction(
  roomId,
  messageId,
  { actionType, messageActionRequestId, reasonCode = null, comment = "" }
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(roomId)}/messages/${encodeURIComponent(messageId)}/actions`,
    method: "POST",
    body: {
      actionType,
      messageActionRequestId,
      reasonCode,
      comment,
    },
    fallbackMessage: "Story room message action could not be completed.",
  });

  return responsePayload?.data;
}

export async function previewStoryRoomTranscriptRange(
  roomId,
  { preset = "RECENT_50", startMessageId = null, endMessageId = null } = {}
) {
  return requestJson({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(roomId)}/transcript-range/preview`,
    method: "POST",
    body: { preset, startMessageId, endMessageId },
    fallbackMessage: "Transcript range could not be previewed.",
  });
}

export async function exportStoryRoomTranscript(
  roomId,
  {
    preset = "RECENT_50",
    startMessageId = null,
    endMessageId = null,
    format = "TXT",
  } = {}
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/transcript-export`,
    method: "POST",
    body: {
      preset,
      startMessageId,
      endMessageId,
      format,
    },
    fallbackMessage: "Transcript could not be exported.",
  });

  const data = responsePayload?.data;

  if (!data?.content || !data?.filename) {
    throw new Error("Transcript export response was incomplete.");
  }

  const blob = new Blob([data.content], {
    type: data.mimeType || "text/plain; charset=utf-8",
  });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = data.filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);

  return data;
}

export async function createTemporaryStoryRoomShare(
  roomId,
  {
    preset = "RECENT_50",
    startMessageId = null,
    endMessageId = null,
  } = {}
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/temporary-share`,
    method: "POST",
    body: {
      preset,
      startMessageId,
      endMessageId,
    },
    fallbackMessage: "Temporary share could not be created.",
  });

  return responsePayload?.data;
}

export async function revokeTemporaryStoryRoomShare(
  roomId,
  shareId
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/temporary-share/${encodeURIComponent(shareId)}`,
    method: "DELETE",
    fallbackMessage: "Temporary share could not be revoked.",
  });

  return responsePayload?.data;
}

export async function createPersistentStoryRoomShare(
  roomId,
  {
    preset = "RECENT_50",
    startMessageId = null,
    endMessageId = null,
  } = {}
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/persistent-share`,
    method: "POST",
    body: {
      preset,
      startMessageId,
      endMessageId,
    },
    fallbackMessage:
      "Persistent reviewed share could not be created.",
  });

  return responsePayload?.data;
}

export async function revokePersistentStoryRoomShare(
  roomId,
  shareId
) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(
      roomId
    )}/persistent-share/${encodeURIComponent(shareId)}`,
    method: "DELETE",
    fallbackMessage:
      "Persistent share could not be revoked.",
  });

  return responsePayload?.data;
}

export async function summarizeStoryRoomCurrentBoundary(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(roomId)}/summary`,
    method: "POST",
    body: { actionType: "SUMMARIZE_CURRENT_BOUNDARY" },
    fallbackMessage: "Current scene summary could not be generated.",
  });
  return responsePayload?.data;
}
