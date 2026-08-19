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
  const data =
    creation?.data && typeof creation.data === "object" ? creation.data : {};
  const authored =
    data.opening_location && typeof data.opening_location === "object"
      ? data.opening_location
      : data.openingLocation && typeof data.openingLocation === "object"
        ? data.openingLocation
        : {};
  const mode = String(authored.mode || "").trim().toUpperCase();

  if (creationType !== "ROOM_TEMPLATE" || mode !== "PLAYER_SELECT") {
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
  { openingLocationId = null } = {}
) {
  const creationId = creation?.id;
  const creationType = String(creation?.type || "").toUpperCase();

  if (!creationId) {
    throw new Error("Creation id is required to start a Story.");
  }

  if (creationType === "ROOM_TEMPLATE") {
    const openingLocation = getStoryOpeningLocationStartConfig(creation);
    const normalizedOpeningLocationId = String(openingLocationId || "").trim();

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

    return playStoryTemplate({
      templateId: creationId,
      ...(normalizedOpeningLocationId
        ? { openingLocationId: normalizedOpeningLocationId }
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

export async function summarizeStoryRoomCurrentBoundary(roomId) {
  const responsePayload = await requestStoryRoomApi({
    endpoint: `/api/studio/story-rooms/${encodeURIComponent(roomId)}/summary`,
    method: "POST",
    body: { actionType: "SUMMARIZE_CURRENT_BOUNDARY" },
    fallbackMessage: "Current scene summary could not be generated.",
  });
  return responsePayload?.data;
}
