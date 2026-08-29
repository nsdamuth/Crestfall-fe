"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchStoryRoom,
  fetchStoryRoomCommandCatalog,
  fetchStoryRoomRegistryNpcs,
  fetchStoryRoomStatusSurfaces,
  exportStoryRoomTranscript,
  createTemporaryStoryRoomShare,
  revokeTemporaryStoryRoomShare,
  createPersistentStoryRoomShare,
  revokePersistentStoryRoomShare,
  loadStoryRoomRegistryNpc,
  loadRandomLikedStoryRoomCharacter,
  runStoryRoomMessageAction,
  sendStoryRoomMessage,
  setStoryRoomPlayerCharacter,
  unloadStoryRoomRegistryNpc,
} from "@/lib/client/studio/story-rooms/storyRoomClient";

function normalizeMessages(snapshot) {
  return (Array.isArray(snapshot?.messages) ? snapshot.messages : []).filter(
    (message) =>
      message?.metadata?.turnAction?.transcriptVisibility !== "HIDDEN"
  );
}
function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}
function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}
function createEmptyRegistryNpcLifecycle() {
  return {
    version: "registry_npc_participant_lifecycle_v1",
    registryCount: 0,
    attachedRegistries: [],
    entries: [],
    counts: {
      available: 0,
      loaded: 0,
      inactive: 0,
    },
  };
}

function isPendingNpcArrival(participant) {
  const metadata = normalizeObject(participant?.metadata);
  const arrivalLifecycle = normalizeObject(metadata.arrivalLifecycle);

  return (
    participant?.isActive !== false &&
    String(arrivalLifecycle.status || "").toUpperCase() ===
      "PENDING_ARRIVAL"
  );
}

function isInactiveRegistryManagedParticipant(participant) {
  const metadata = normalizeObject(participant?.metadata);

  return (
    !participant?.isActive &&
    String(metadata.loadPolicy || "").toUpperCase() === "REGISTRY_MANAGED"
  );
}

function getParticipantMediaImageUrls(participant) {
  return normalizeArray(participant?.metadata?.mediaImageUrls).filter(Boolean);
}

function getParticipantAvatarUrl(participant) {
  return (
    participant?.metadata?.avatarUrl ||
    participant?.metadata?.primaryImageUrl ||
    getParticipantMediaImageUrls(participant)[0] ||
    null
  );
}

function pickStableImage(images = [], seed = "") {
  const safeImages = normalizeArray(images).filter(Boolean);

  if (!safeImages.length) return null;

  let hash = 0;

  String(seed || "").split("").forEach((character) => {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  });

  return safeImages[hash % safeImages.length];
}

function getLastVisualSpeaker({ messages = [], participants = [] }) {
  const latestSpeakerMessage = [...messages]
    .reverse()
    .find((message) =>
      ["character", "narrator"].includes(message?.type)
    );

  if (latestSpeakerMessage) {
    const participant = participants.find(
      (item) => item.id === latestSpeakerMessage.senderParticipantId
    );

    const mediaImageUrls =
      normalizeArray(latestSpeakerMessage.speakerMediaImageUrls).length
        ? normalizeArray(latestSpeakerMessage.speakerMediaImageUrls)
        : getParticipantMediaImageUrls(participant);

    return {
      name: latestSpeakerMessage.speaker,
      avatarUrl:
        latestSpeakerMessage.speakerAvatarUrl ||
        getParticipantAvatarUrl(participant),
      mediaImageUrls,
      seed: latestSpeakerMessage.id,
    };
  }

  const fallbackParticipant = participants.find((participant) =>
    ["CHARACTER", "NARRATOR"].includes(participant.participantType)
  );

  if (!fallbackParticipant) {
    return {
      name: "",
      avatarUrl: null,
      mediaImageUrls: [],
      seed: "",
    };
  }

  return {
    name: fallbackParticipant.displayName || fallbackParticipant.participantType,
    avatarUrl: getParticipantAvatarUrl(fallbackParticipant),
    mediaImageUrls: getParticipantMediaImageUrls(fallbackParticipant),
    seed: fallbackParticipant.id,
  };
}
function getLatestEngineModuleOperations(messages = []) {
  const latestMessageWithOperations = normalizeArray(messages)
    .slice()
    .reverse()
    .find((message) => {
      const metadata = normalizeObject(message?.metadata);
      const engineModuleOperations = normalizeObject(
        metadata.engineModuleOperations
      );

      return Array.isArray(engineModuleOperations.operations);
    });

  return normalizeObject(
    latestMessageWithOperations?.metadata?.engineModuleOperations
  );
}

function getEngineModuleOperation(engineModuleOperations, moduleId) {
  const operations = Array.isArray(engineModuleOperations?.operations)
    ? engineModuleOperations.operations
    : [];

  return (
    operations.find(
      (operation) =>
        operation?.status === "completed" && operation?.moduleId === moduleId
    ) || null
  );
}

function getEngineTimeState(engineModuleOperations) {
  const operation = getEngineModuleOperation(
    engineModuleOperations,
    "core.timeDay.v1"
  );

  const result = normalizeObject(operation?.result);
  const stateContext = normalizeObject(result.stateContext);
  const storyTime = normalizeObject(result.storyTime);

  const dayCandidate = Number(stateContext.day ?? storyTime.day);
  const minutesCandidate = Number(stateContext.minutes ?? storyTime.minutes);

  return {
    operation,
    day: Number.isFinite(dayCandidate) ? dayCandidate : null,
    minutes: Number.isFinite(minutesCandidate) ? minutesCandidate : null,
    timeLabel:
      stateContext.timeLabel || storyTime.timeLabel
        ? String(stateContext.timeLabel || storyTime.timeLabel)
        : "",
  };
}

function getEngineWeatherState(engineModuleOperations) {
  const operation = getEngineModuleOperation(
    engineModuleOperations,
    "core.inWorldWeather.v1"
  );

  const result = normalizeObject(operation?.result);
  const stateContext = normalizeObject(result.stateContext);

  return {
    operation,
    weather:
      stateContext.weather || result.weather
        ? String(stateContext.weather || result.weather)
        : "",
  };
}
function buildRoomViewModel(snapshot, roomId) {
  const room = snapshot?.room || {};
  const state = snapshot?.state || {};
  const roomData = room.data || {};
  const stateData = state.state || {};
  const messages = normalizeMessages(snapshot);
  const participants = Array.isArray(snapshot?.participants)
    ? snapshot.participants
    : [];

  const lastVisualSpeaker = getLastVisualSpeaker({
    messages,
    participants,
  });

  const featuredSpeakerImageUrl =
    pickStableImage(lastVisualSpeaker.mediaImageUrls, lastVisualSpeaker.seed) ||
    lastVisualSpeaker.avatarUrl ||
    null;

  const scenarioTitle =
    stateData.scenario?.title ||
    (room.scenarioId ? "Scenario Attached" : "Character Chat");

  const narratorTitle =
    stateData.narrator?.title ||
    (room.narratorId ? "Narrator Attached" : "Default Crestfall Narrator");

  const npcMobilitySceneFocus =
    stateData.npcMobility?.sceneFocus &&
    typeof stateData.npcMobility.sceneFocus === "object"
      ? stateData.npcMobility.sceneFocus
      : null;

  const locationTitle =
    npcMobilitySceneFocus?.title ||
    npcMobilitySceneFocus?.location?.canonicalName ||
    stateData.location?.title ||
    (room.locationId ? "Location Attached" : "Unspecified Location");

  const roomModeRaw =
    roomData.roomMode ||
    roomData.room_mode ||
    stateData.template?.roomMode ||
    "";

  const roomMode =
    String(roomModeRaw).toUpperCase() === "GROUP"
      ? "Group Story"
      : String(roomModeRaw).toUpperCase() === "SOLO"
        ? "Solo Story"
        : roomData.source?.type === "ROOM_TEMPLATE"
          ? "Template Story"
          : "Private Character Chat";

  const engineModuleOperations = getLatestEngineModuleOperations(messages);
  const engineTimeState = getEngineTimeState(engineModuleOperations);
  const engineWeatherState = getEngineWeatherState(engineModuleOperations);

  const legacyWeather =
    stateData.weather?.condition ||
    stateData.weather?.label ||
    stateData.weather?.current ||
    stateData.currentWeather ||
    "Unknown";

  const weather = engineWeatherState.weather || legacyWeather;

  const worldTimeMinutes = Number.isFinite(Number(state.worldTimeMinutes))
    ? Number(state.worldTimeMinutes)
    : null;

  const hour =
    worldTimeMinutes === null ? null : Math.floor(worldTimeMinutes / 60);
  const minute = worldTimeMinutes === null ? null : worldTimeMinutes % 60;

  const clockTimeLabel =
    hour === null
      ? state.worldTimeLabel || "Unknown"
      : `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  const currentTimeLabel =
    engineTimeState.timeLabel || state.worldTimeLabel || clockTimeLabel;

  const currentWorldDay =
    engineTimeState.day ?? state.worldDay ?? 1;

  return {
    title: room.title || "Private Story",
    scenario: scenarioTitle,
    narrator: narratorTitle,
    location: locationTitle,
    roomMode,
    weather,
    timeLabel: currentTimeLabel,
    turnCount: state.turnCount ?? 0,
    worldDay: currentWorldDay,
    objective: `Turn ${state.turnCount ?? 0} · Day ${currentWorldDay} · ${currentTimeLabel}`,
    engineModuleState: {
      operationCount: Number(engineModuleOperations?.operationCount || 0),
      timeSource: engineTimeState.operation ? "Engine Module" : "Room State",
      weatherSource: engineWeatherState.operation ? "Engine Module" : "Room State",
      timeModuleId: engineTimeState.operation?.moduleId || null,
      weatherModuleId: engineWeatherState.operation?.moduleId || null,
    },
    rawRoom: room,
    rawState: state,
    roomId,
    featuredSpeakerImageUrl,
    featuredSpeakerName: lastVisualSpeaker.name || "",
  };
}

function isSelectableResponderParticipant(participant) {
  return (
    Boolean(participant?.isActive) &&
    ["CHARACTER", "NARRATOR"].includes(participant?.participantType)
  );
}

function formatParticipantRole(participant, isDefault) {
  if (participant.participantType === "USER") return "You";
  if (participant.participantType === "PLAYER_CHARACTER") return "Player Character";
  if (participant.participantType === "NARRATOR") return "Narrator";
  if (isDefault) return "Default Speaker";

  return participant.participantType || "Participant";
}

function buildCastViewModel(snapshot) {
  const participants = Array.isArray(snapshot?.participants)
    ? snapshot.participants
    : [];

  const hasPlayerCharacter = participants.some(
    (participant) => participant.participantType === "PLAYER_CHARACTER"
  );

  return participants
    .filter((participant) => {
      if (hasPlayerCharacter && participant.participantType === "USER") {
        return false;
      }

      if (isInactiveRegistryManagedParticipant(participant)) {
        return false;
      }

      return true;
    })
    .map((participant) => {
      const isUser = participant.participantType === "USER";
      const isDefault = Boolean(participant.isDefault);
      const role = formatParticipantRole(participant, isDefault);
      const participantMetadata = normalizeObject(participant.metadata);
      const registryNpcFrame = normalizeObject(
        participantMetadata.registryNpcFrame
      );
      const isRegistryManaged =
        String(participantMetadata.loadPolicy || "").toUpperCase() ===
        "REGISTRY_MANAGED";
      const pendingArrival = isPendingNpcArrival(participant);
      const isRandomLiked =
        String(participantMetadata.source || "").toUpperCase() ===
        "RANDOM_LIKED";

      return {
        id: participant.id,
        name:
          participant.displayName ||
          (isUser ? "You" : participant.participantType || "Participant"),
        role,
        state: pendingArrival
          ? "Arriving"
          : participant.isActive
            ? "Present"
            : "Inactive",
        note: pendingArrival
          ? isRandomLiked
            ? "Random liked Character; will enter on their first turn."
            : "Will enter on their first turn."
          : isRegistryManaged
            ? registryNpcFrame.notes ||
              participantMetadata.sourceRegistryTitle ||
              "Registry-managed NPC"
            : null,
        participant,
        participantType: participant.participantType,
        isActive: Boolean(participant.isActive),
        isSelectableResponder: isSelectableResponderParticipant(participant),
        loadPolicy: participantMetadata.loadPolicy || null,
        participantSource: participantMetadata.source || null,
        avatarUrl: getParticipantAvatarUrl(participant),
        mediaImageUrls: getParticipantMediaImageUrls(participant),
      };
    });
}


function buildLocationMentionOptions(snapshot) {
  const context = normalizeObject(snapshot?.composerContext?.locations);
  return normalizeArray(context.options).map((option) => ({
    ...option,
    isCurrent:
      option.runtimeEntryId === context.currentEntryRuntimeId ||
      (option.linkedLocationCreationId &&
        option.linkedLocationCreationId === context.activeLocationCreationId),
  }));
}

function buildSpeakerOptions(snapshot) {
  const participants = Array.isArray(snapshot?.participants)
    ? snapshot.participants
    : [];

  const characterOptions = participants
    .filter(isSelectableResponderParticipant)
    .map((participant) => ({
      id: participant.id,
      label: participant.displayName || participant.participantType,
      participantType: participant.participantType,
      creationId: participant.creationId || null,
      avatarUrl: getParticipantAvatarUrl(participant),
    }));

  return characterOptions;
}

  function areSameUserMessage(left, right) {
    return (
      left?.type === "player" &&
      right?.type === "player" &&
      String(left?.body || "") === String(right?.body || "") &&
      String(left?.mode || "") === String(right?.mode || "")
    );
  }

function getReturnedResponseMessages(data) {
  const orderedResponseMessages =
    normalizeArray(
      data?.responseMessages
    ).filter(Boolean);

  if (orderedResponseMessages.length) {
    return orderedResponseMessages;
  }

  /*
   * Backward-compatible fallback for services-api responses that still
   * return one primary response plus optional Engine event messages.
   */
  return [
    data?.responseMessage || null,
    ...normalizeArray(
      data?.engineMessages
    ),
  ].filter(Boolean);
}

function appendOrReplaceReturnedMessage(
  messages,
  message
) {
  if (!message) return;

  const existingIndex =
    message.id
      ? messages.findIndex(
          (candidate) =>
            candidate?.id === message.id
        )
      : -1;

  if (existingIndex >= 0) {
    messages[existingIndex] = message;
    return;
  }

  messages.push(message);
}

    function createOptimisticUserMessage({
    message,
    inputMode = "DIALOGUE",
  }) {
    return {
      id: `optimistic-user-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`,
      speaker: "You",
      type: "player",
      kind: "CHAT",
      mode: inputMode,
      body: message,
      createdAt: new Date().toISOString(),
      metadata: {
        optimistic: true,
      },
    };
  }
export default function useStoryRoomChat(roomId) {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [settingPlayerCharacter, setSettingPlayerCharacter] = useState(false);
  const [setPlayerCharacterError, setSetPlayerCharacterError] = useState("");
  const [registryNpcs, setRegistryNpcs] = useState(
    createEmptyRegistryNpcLifecycle
  );
  const [registryNpcsLoading, setRegistryNpcsLoading] = useState(false);
  const [registryNpcActionKey, setRegistryNpcActionKey] = useState("");
  const [registryNpcError, setRegistryNpcError] = useState("");
  const [randomLikedLoading, setRandomLikedLoading] = useState(false);
  const [randomLikedError, setRandomLikedError] = useState("");
  const [commandCatalog, setCommandCatalog] = useState({
    version: "mechanics_command_catalog_v1",
    status: "EMPTY",
    entries: [],
  });
  const [commandCatalogError, setCommandCatalogError] = useState("");
  const [statusSurfaces, setStatusSurfaces] = useState({
    version: "story_status_surface_projection_v1",
    status: "EMPTY",
    surfaces: [],
  });
  const [statusSurfaceError, setStatusSurfaceError] = useState("");
  const [messageActionState, setMessageActionState] = useState({});
  const activeMessageActionRequestsRef = useRef(new Map());

  const reloadCommandCatalog = useCallback(
    async ({ requestedSpeakerId = "AUTO" } = {}) => {
      if (!roomId) return null;

      try {
        const catalog = await fetchStoryRoomCommandCatalog(roomId, {
          requestedSpeakerId,
        });
        const nextCatalog =
          catalog && typeof catalog === "object"
            ? catalog
            : {
                version: "mechanics_command_catalog_v1",
                status: "EMPTY",
                entries: [],
              };
        setCommandCatalog(nextCatalog);
        setCommandCatalogError("");
        return nextCatalog;
      } catch (catalogError) {
        setCommandCatalog({
          version: "mechanics_command_catalog_v1",
          status: "EMPTY",
          entries: [],
        });
        setCommandCatalogError(
          catalogError?.message || "Story room commands could not be loaded."
        );
        return null;
      }
    },
    [roomId]
  );

  const reloadStatusSurfaces = useCallback(async () => {
    if (!roomId) return null;

    setStatusSurfaceError("");

    try {
      const projection = await fetchStoryRoomStatusSurfaces(roomId);
      setStatusSurfaces(
        projection || {
          version: "story_status_surface_projection_v1",
          status: "EMPTY",
          surfaces: [],
        }
      );
      return projection || null;
    } catch (surfaceError) {
      setStatusSurfaces({
        version: "story_status_surface_projection_v1",
        status: "EMPTY",
        surfaces: [],
      });
      setStatusSurfaceError(
        surfaceError?.message || "Story status surfaces could not be loaded."
      );
      return null;
    }
  }, [roomId]);

  const reload = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);

    try {
      const [data] = await Promise.all([
        fetchStoryRoom(roomId),
        reloadStatusSurfaces(),
        reloadCommandCatalog(),
      ]);
      setSnapshot(data || null);

      setRegistryNpcsLoading(true);
      setRegistryNpcError("");

      try {
        const lifecycle = await fetchStoryRoomRegistryNpcs(roomId);
        setRegistryNpcs(lifecycle || createEmptyRegistryNpcLifecycle());
      } catch (registryLoadError) {
        setRegistryNpcs(createEmptyRegistryNpcLifecycle());
        setRegistryNpcError(
          registryLoadError.message ||
            "NPC Registry participants could not be loaded."
        );
      } finally {
        setRegistryNpcsLoading(false);
      }
    } catch (loadError) {
      setError(loadError.message || "Story could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [reloadCommandCatalog, reloadStatusSurfaces, roomId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    activeMessageActionRequestsRef.current.clear();
    setMessageActionState({});
  }, [roomId]);

const sendMessage = useCallback(
  async ({
    message,
    inputMode,
    requestedSpeakerId,
    participantMentions = [],
    locationMentions = [],
    actionType = "MESSAGE",
  }) => {
    const body = typeof message === "string" ? message.trim() : "";
    const isYieldTurn = [
      "PLAYER_YIELD_TO_CHARACTER",
      "PLAYER_YIELD_TO_AUTO",
    ].includes(actionType);

    if ((!body && !isYieldTurn) || sending) return null;

    const optimisticUserMessage = isYieldTurn
      ? null
      : createOptimisticUserMessage({
          message: body,
          inputMode,
        });

    setSending(true);
    setError(null);

    setSnapshot((current) => {
      const currentMessages = normalizeMessages(current);

      return {
        ...(current || {}),
        messages: optimisticUserMessage
          ? [...currentMessages, optimisticUserMessage]
          : currentMessages,
      };
    });

    try {
      const data = await sendStoryRoomMessage(roomId, {
        message: body,
        inputMode,
        requestedSpeakerId,
        participantMentions,
        locationMentions,
        actionType,
      });

      if (data?.registryNpcs) {
        setRegistryNpcs(data.registryNpcs);
      }

      setSnapshot((current) => {
        const currentMessages = normalizeMessages(current);
        const nextMessages = [...currentMessages];

        const optimisticIndex = optimisticUserMessage
          ? nextMessages.findIndex(
              (item) => item.id === optimisticUserMessage.id
            )
          : -1;

        if (data?.userMessage) {
          if (optimisticIndex >= 0) {
            nextMessages[optimisticIndex] = data.userMessage;
          } else if (
            !nextMessages.some((item) =>
              areSameUserMessage(item, data.userMessage)
            )
          ) {
            nextMessages.push(data.userMessage);
          }
        } else if (optimisticUserMessage && optimisticIndex < 0) {
          nextMessages.push(optimisticUserMessage);
        }

        getReturnedResponseMessages(
          data
        ).forEach((message) => {
          appendOrReplaceReturnedMessage(
            nextMessages,
            message
          );
        });

        return {
          ...(current || {}),
          room: data?.room || current?.room || null,
          participants: data?.participants || current?.participants || [],
          state: data?.state || current?.state || null,
          composerContext:
            data?.composerContext || current?.composerContext || null,
          messages: nextMessages,
        };
      });

      void reloadStatusSurfaces();
      void reloadCommandCatalog({
        requestedSpeakerId: requestedSpeakerId || "AUTO",
      });
      return data;
    } catch (sendError) {
      if (optimisticUserMessage) {
        setSnapshot((current) => {
          const currentMessages = normalizeMessages(current);

          return {
            ...(current || {}),
            messages: currentMessages.map((item) =>
              item.id === optimisticUserMessage.id
                ? {
                    ...item,
                    metadata: {
                      ...(item.metadata || {}),
                      optimistic: false,
                      failed: true,
                    },
                  }
                : item
            ),
          };
        });
      }

      setError(sendError.message || "Story message could not be sent.");
      return null;
    } finally {
      setSending(false);
    }
  },
  [reloadCommandCatalog, reloadStatusSurfaces, roomId, sending]
);
  const exportTranscript = useCallback(
    async ({
      preset = "RECENT_50",
      startMessageId = null,
      endMessageId = null,
      format = "TXT",
    } = {}) => {
      if (!roomId) throw new Error("Story room id is required.");
      return exportStoryRoomTranscript(roomId, {
        preset,
        startMessageId,
        endMessageId,
        format,
      });
    },
    [roomId]
  );

  const createTemporaryShare = useCallback(
    async ({ preset = "RECENT_50", startMessageId = null, endMessageId = null } = {}) => {
      if (!roomId) throw new Error("Story room id is required.");
      return createTemporaryStoryRoomShare(roomId, {
        preset,
        startMessageId,
        endMessageId,
      });
    },
    [roomId]
  );

  const revokeTemporaryShare = useCallback(
    async (shareId) => {
      if (!roomId || !shareId) throw new Error("Temporary share id is required.");
      return revokeTemporaryStoryRoomShare(roomId, shareId);
    },
    [roomId]
  );

  const createPersistentShare = useCallback(
    async ({ preset = "RECENT_50", startMessageId = null, endMessageId = null } = {}) => {
      if (!roomId) throw new Error("Story room id is required.");
      return createPersistentStoryRoomShare(roomId, {
        preset,
        startMessageId,
        endMessageId,
      });
    },
    [roomId]
  );

  const revokePersistentShare = useCallback(
    async (shareId) => {
      if (!roomId || !shareId) throw new Error("Persistent share id is required.");
      return revokePersistentStoryRoomShare(roomId, shareId);
    },
    [roomId]
  );

  const loadRegistryNpc = useCallback(
    async ({ registryId, entryId }) => {
      if (!roomId || registryNpcActionKey || !registryId || !entryId) {
        return null;
      }

      const actionKey = `load:${registryId}:${entryId}`;
      setRegistryNpcActionKey(actionKey);
      setRegistryNpcError("");

      try {
        const data = await loadStoryRoomRegistryNpc(roomId, {
          registryId,
          entryId,
        });

        if (data?.snapshot) {
          setSnapshot(data.snapshot);
        }

        if (data?.registryNpcs) {
          setRegistryNpcs(data.registryNpcs);
        }

        void reloadCommandCatalog();
        return data;
      } catch (loadError) {
        setRegistryNpcError(
          loadError.message || "NPC Registry participant could not be loaded."
        );
        return null;
      } finally {
        setRegistryNpcActionKey("");
      }
    },
    [reloadCommandCatalog, roomId, registryNpcActionKey]
  );

  const unloadRegistryNpc = useCallback(
    async (participantId) => {
      if (!roomId || registryNpcActionKey || !participantId) {
        return null;
      }

      const actionKey = `unload:${participantId}`;
      setRegistryNpcActionKey(actionKey);
      setRegistryNpcError("");

      try {
        const data = await unloadStoryRoomRegistryNpc(roomId, participantId);

        if (data?.snapshot) {
          setSnapshot(data.snapshot);
        }

        if (data?.registryNpcs) {
          setRegistryNpcs(data.registryNpcs);
        }

        void reloadCommandCatalog();
        return data;
      } catch (unloadError) {
        setRegistryNpcError(
          unloadError.message || "NPC Registry participant could not be unloaded."
        );
        return null;
      } finally {
        setRegistryNpcActionKey("");
      }
    },
    [reloadCommandCatalog, roomId, registryNpcActionKey]
  );

  const loadRandomLikedCharacter = useCallback(async () => {
    if (!roomId || randomLikedLoading) return null;

    setRandomLikedLoading(true);
    setRandomLikedError("");

    try {
      const data = await loadRandomLikedStoryRoomCharacter(roomId);

      if (data?.snapshot) {
        setSnapshot(data.snapshot);
      }

      void reloadCommandCatalog();
      return data;
    } catch (loadError) {
      setRandomLikedError(
        loadError.message ||
          "A random liked Character could not be loaded into this Story."
      );
      return null;
    } finally {
      setRandomLikedLoading(false);
    }
  }, [reloadCommandCatalog, roomId, randomLikedLoading]);

  const setPlayerCharacter = useCallback(
    async (playerCharacterId) => {
      if (!roomId || settingPlayerCharacter) return null;

      setSettingPlayerCharacter(true);
      setSetPlayerCharacterError("");

      try {
        const data = await setStoryRoomPlayerCharacter(
          roomId,
          playerCharacterId
        );

        setSnapshot(data || null);
        void reloadStatusSurfaces();
        void reloadCommandCatalog();

        return data;
      } catch (setError) {
        setSetPlayerCharacterError(
          setError.message || "Player Character could not be changed."
        );
        return null;
      } finally {
        setSettingPlayerCharacter(false);
      }
    },
    [reloadCommandCatalog, reloadStatusSurfaces, roomId, settingPlayerCharacter]
  );
  const beginMessageAction = useCallback((messageId, actionType) => {
    const normalizedMessageId = String(messageId || "");

    if (
      !normalizedMessageId ||
      activeMessageActionRequestsRef.current.has(normalizedMessageId)
    ) {
      return null;
    }

    const requestId = crypto.randomUUID();
    activeMessageActionRequestsRef.current.set(normalizedMessageId, requestId);

    setMessageActionState((current) => ({
      ...current,
      [normalizedMessageId]: {
        ...(current[normalizedMessageId] || {}),
        pending: true,
        pendingAction: actionType,
        activeRequestId: requestId,
        errorAction: "",
        error: "",
      },
    }));

    return requestId;
  }, []);

  const isCurrentMessageActionRequest = useCallback((messageId, requestId) => {
    return (
      activeMessageActionRequestsRef.current.get(String(messageId || "")) ===
      requestId
    );
  }, []);

  const finishMessageAction = useCallback(
    (messageId, requestId, nextState) => {
      const normalizedMessageId = String(messageId || "");

      if (!isCurrentMessageActionRequest(normalizedMessageId, requestId)) {
        return false;
      }

      activeMessageActionRequestsRef.current.delete(normalizedMessageId);
      setMessageActionState((current) => ({
        ...current,
        [normalizedMessageId]: {
          ...(current[normalizedMessageId] || {}),
          pending: false,
          pendingAction: "",
          activeRequestId: "",
          ...nextState,
        },
      }));

      return true;
    },
    [isCurrentMessageActionRequest]
  );

  const replaceMessageFromAction = useCallback(
    (messageId, requestId, updatedMessage) => {
      if (
        !updatedMessage ||
        !isCurrentMessageActionRequest(messageId, requestId)
      ) {
        return;
      }

      setSnapshot((current) => {
        if (!isCurrentMessageActionRequest(messageId, requestId)) {
          return current;
        }

        const currentMessages = Array.isArray(current?.messages)
          ? current.messages
          : [];
        const updatedMessageId = String(updatedMessage.id || messageId || "");
        const targetIndex = currentMessages.findIndex(
          (message) => String(message?.id || "") === updatedMessageId
        );

        if (targetIndex < 0) {
          return current;
        }

        return {
          ...(current || {}),
          messages: currentMessages.map((message, index) =>
            index === targetIndex
              ? {
                  ...message,
                  ...updatedMessage,
                  id: message.id,
                }
              : message
          ),
        };
      });
    },
    [isCurrentMessageActionRequest]
  );

  const regenerateMessage = useCallback(
    async (messageId) => {
      if (!roomId || !messageId) return null;

      const messageActionRequestId = beginMessageAction(
        messageId,
        "REGENERATE_RESPONSE"
      );

      if (!messageActionRequestId) return null;

      try {
        const data = await runStoryRoomMessageAction(roomId, messageId, {
          actionType: "REGENERATE_RESPONSE",
          messageActionRequestId,
        });

        replaceMessageFromAction(
          messageId,
          messageActionRequestId,
          data?.message
        );
        finishMessageAction(messageId, messageActionRequestId, {
          errorAction: "",
          error: "",
        });

        return data || null;
      } catch (actionError) {
        finishMessageAction(messageId, messageActionRequestId, {
          errorAction: "REGENERATE_RESPONSE",
          error: actionError?.message || "Response could not be regenerated.",
        });
        return null;
      }
    },
    [beginMessageAction, finishMessageAction, replaceMessageFromAction, roomId]
  );

  const continueMessage = useCallback(
    async (messageId) => {
      if (!roomId || !messageId) return null;

      const messageActionRequestId = beginMessageAction(
        messageId,
        "CONTINUE_RESPONSE"
      );

      if (!messageActionRequestId) return null;

      try {
        const data = await runStoryRoomMessageAction(roomId, messageId, {
          actionType: "CONTINUE_RESPONSE",
          messageActionRequestId,
        });

        replaceMessageFromAction(
          messageId,
          messageActionRequestId,
          data?.message
        );
        finishMessageAction(messageId, messageActionRequestId, {
          errorAction: "",
          error: "",
        });

        return data || null;
      } catch (actionError) {
        finishMessageAction(messageId, messageActionRequestId, {
          errorAction: "CONTINUE_RESPONSE",
          error: actionError?.message || "Response could not be continued.",
        });
        return null;
      }
    },
    [beginMessageAction, finishMessageAction, replaceMessageFromAction, roomId]
  );

  const reportMessage = useCallback(
    async (messageId, { reasonCode, comment = "" } = {}) => {
      if (!roomId || !messageId) return null;

      const messageActionRequestId = beginMessageAction(
        messageId,
        "REPORT_MESSAGE"
      );

      if (!messageActionRequestId) return null;

      try {
        const data = await runStoryRoomMessageAction(roomId, messageId, {
          actionType: "REPORT_MESSAGE",
          messageActionRequestId,
          reasonCode,
          comment,
        });

        finishMessageAction(messageId, messageActionRequestId, {
          errorAction: "",
          error: "",
          reported: true,
        });

        return data || null;
      } catch (actionError) {
        finishMessageAction(messageId, messageActionRequestId, {
          errorAction: "REPORT_MESSAGE",
          error: actionError?.message || "Message could not be reported.",
        });
        return null;
      }
    },
    [beginMessageAction, finishMessageAction, roomId]
  );

  const room = useMemo(
    () => buildRoomViewModel(snapshot, roomId),
    [snapshot, roomId]
  );
  const canSetPlayerCharacter =
    Number(snapshot?.state?.turnCount || 0) === 0;
  const cast = useMemo(() => buildCastViewModel(snapshot), [snapshot]);
  const messages = useMemo(() => normalizeMessages(snapshot), [snapshot]);
  const speakerOptions = useMemo(() => buildSpeakerOptions(snapshot), [snapshot]);
  const locationMentionOptions = useMemo(
    () => buildLocationMentionOptions(snapshot),
    [snapshot]
  );

  return {
    room,
    cast,
    messages,
    snapshot,
    speakerOptions,
    locationMentionOptions,
    loading,
    sending,
    error,
    reload,
    sendMessage,
    regenerateMessage,
    continueMessage,
    reportMessage,
    messageActionState,
    exportTranscript,
    createTemporaryShare,
    revokeTemporaryShare,
    createPersistentShare,
    revokePersistentShare,
    canSetPlayerCharacter,
    settingPlayerCharacter,
    setPlayerCharacterError,
    setPlayerCharacter,
    registryNpcs,
    registryNpcsLoading,
    registryNpcActionKey,
    registryNpcError,
    loadRegistryNpc,
    unloadRegistryNpc,
    randomLikedLoading,
    randomLikedError,
    loadRandomLikedCharacter,
    commandCatalog,
    commandCatalogError,
    reloadCommandCatalog,
    statusSurfaces,
    statusSurfaceError,
    reloadStatusSurfaces,
  };
}
