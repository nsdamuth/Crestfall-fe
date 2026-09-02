"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { deleteStoryRoom } from "@/lib/client/studio/story-rooms/storyRoomClient";
import {
  STORY_ROOM_COMMANDS,
  mergeStoryRoomCommandsWithMechanicsCatalog,
  resolveLocalStoryRoomCommand,
} from "@/components/studio/story-rooms/story-room-composer/storyRoomCommandRegistry";
import { getMechanicsModuleBindings } from "@/components/studio/story-rooms/story-room-runtime-mechanics-panel/useStoryRoomRuntimeMechanicsPanelViewModel";
import { getPersistentStatusSurfaceDomains } from "./storyRoomStatusSurfacePresentation";

export const STORY_ROOM_DELETE_CONFIRMATION_LINES = [
  "Delete this Story?",
  "",
  "This permanently deletes this chat session and all messages.",
  "Underlying characters, templates, scenarios, narrators, and locations are not deleted.",
  "Interaction totals will remain.",
  "",
  "This cannot be undone.",
];

export function buildNextSpeakerOptions(speakerOptions = []) {
  return [
    { id: "AUTO", label: "Auto" },
    ...(Array.isArray(speakerOptions) ? speakerOptions : []),
    { id: "RANDOM", label: "Random" },
  ];
}

export function buildStoryRoomLayoutClass({ leftOpen, rightOpen }) {
  return [
    "grid min-h-0 flex-1 gap-5",
    leftOpen && rightOpen
      ? "xl:grid-cols-[280px_minmax(0,1fr)_320px]"
      : leftOpen && !rightOpen
        ? "xl:grid-cols-[280px_minmax(0,1fr)_44px]"
        : !leftOpen && rightOpen
          ? "xl:grid-cols-[44px_minmax(0,1fr)_320px]"
          : "xl:grid-cols-[44px_minmax(0,1fr)_44px]",
  ].join(" ");
}

function normalizeChat(chat) {
  return chat && typeof chat === "object" ? chat : {};
}


export function getChatCapabilityPresentation(account) {
  const explicitlyDenied = account?.capabilities?.chat === false;

  return {
    chatAllowed: !explicitlyDenied,
    chatUnavailableReason: explicitlyDenied
      ? "Chat is not available for this account."
      : "",
  };
}

export function useStoryRoomChatShellViewModel({
  roomId,
  chat,
  account,
  onRoomDeleted,
} = {}) {
  const safeChat = normalizeChat(chat);
  const { chatAllowed, chatUnavailableReason } =
    getChatCapabilityPresentation(account);
  const {
    room = {},
    cast = [],
    messages = [],
    speakerOptions = [],
    locationMentionOptions = [],
    loading = false,
    sending = false,
    error = null,
    reload: reloadStoryRoom,
    sendMessage: sendStoryMessage,
    regenerateMessage,
    continueMessage,
    reportMessage,
    messageActionState = {},
    exportTranscript,
    createTemporaryShare,
    revokeTemporaryShare,
    createPersistentShare,
    revokePersistentShare,
    canSetPlayerCharacter = false,
    settingPlayerCharacter = false,
    setPlayerCharacterError = "",
    setPlayerCharacter,
    registryNpcs,
    registryNpcsLoading = false,
    registryNpcActionKey = "",
    registryNpcError = "",
    loadRegistryNpc,
    unloadRegistryNpc,
    randomLikedLoading = false,
    randomLikedError = "",
    loadRandomLikedCharacter,
    commandCatalog = {},
    commandCatalogError = "",
    reloadCommandCatalog,
    statusSurfaces = {},
    statusSurfaceError = "",
  } = safeChat;

  const safeSpeakerOptions = Array.isArray(speakerOptions)
    ? speakerOptions
    : [];

  const [inputMode, setInputMode] = useState("DIALOGUE");
  const [nextSpeaker, setNextSpeaker] = useState("AUTO");
  const [draft, setDraft] = useState("");
  const [participantMentions, setParticipantMentions] = useState([]);
  const [locationMentions, setLocationMentions] = useState([]);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobilePanel, setMobilePanel] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isConfirmingDeleteRoom, setIsConfirmingDeleteRoom] = useState(false);
  const [composerHelpPanel, setComposerHelpPanel] = useState(null);
  const [playerCharacterPickerOpen, setPlayerCharacterPickerOpen] = useState(false);
  const [firstMessageSubmitted, setFirstMessageSubmitted] = useState(false);

  const selectedPlayerCharacter = useMemo(
    () =>
      (Array.isArray(cast) ? cast : []).find(
        (member) =>
          String(member?.participantType || "").toUpperCase() ===
          "PLAYER_CHARACTER"
      ) || null,
    [cast]
  );

  useEffect(() => {
    setFirstMessageSubmitted(false);
    setPlayerCharacterPickerOpen(false);
  }, [roomId]);

  const nextSpeakerOptions = useMemo(
    () => buildNextSpeakerOptions(safeSpeakerOptions),
    [safeSpeakerOptions]
  );

  const commands = useMemo(
    () =>
      mergeStoryRoomCommandsWithMechanicsCatalog(
        commandCatalog,
        STORY_ROOM_COMMANDS
      ),
    [commandCatalog]
  );

  useEffect(() => {
    void reloadCommandCatalog?.({ requestedSpeakerId: nextSpeaker });
  }, [nextSpeaker, reloadCommandCatalog]);

  const participantMentionOptions = useMemo(
    () =>
      safeSpeakerOptions.filter(
        (option) => option?.participantType === "CHARACTER"
      ),
    [safeSpeakerOptions]
  );

  useEffect(() => {
    if (nextSpeaker === "AUTO" || nextSpeaker === "RANDOM") {
      return;
    }

    const selectedResponderStillAvailable = safeSpeakerOptions.some(
      (option) => option?.id === nextSpeaker
    );

    if (!selectedResponderStillAvailable) {
      setNextSpeaker("AUTO");
    }
  }, [nextSpeaker, safeSpeakerOptions]);

  const selectNextResponder = useCallback(
    (participantId, { closeMobile = false } = {}) => {
      if (!safeSpeakerOptions.some((option) => option?.id === participantId)) {
        return;
      }

      setNextSpeaker(participantId);

      if (closeMobile) {
        setMobilePanel(null);
      }
    },
    [safeSpeakerOptions]
  );

  const requestDeleteRoom = useCallback(() => {
    if (deletingRoom || !roomId) return;
    setIsConfirmingDeleteRoom(true);
  }, [deletingRoom, roomId]);

  const cancelDeleteRoom = useCallback(() => {
    setIsConfirmingDeleteRoom(false);
  }, []);

  const confirmDeleteRoom = useCallback(async () => {
    if (deletingRoom || !roomId) return;

    setIsConfirmingDeleteRoom(false);
    setDeletingRoom(true);
    setDeleteError("");

    try {
      await deleteStoryRoom(roomId);
      onRoomDeleted?.();
    } catch (deleteFailure) {
      setDeleteError(
        deleteFailure?.message || "Story could not be deleted."
      );
      setDeletingRoom(false);
    }
  }, [deletingRoom, onRoomDeleted, roomId]);

  const sendMessage = useCallback(
    async ({ requestedSpeakerId = nextSpeaker, actionType = "MESSAGE" } = {}) => {
      const body = draft.trim();
      const isYieldTurn = [
        "PLAYER_YIELD_TO_CHARACTER",
        "PLAYER_YIELD_TO_AUTO",
      ].includes(actionType);

      if (!chatAllowed || (!body && !isYieldTurn) || sending) return;

      const localCommand = isYieldTurn
        ? null
        : resolveLocalStoryRoomCommand(body);

      if (localCommand) {
        setComposerHelpPanel(localCommand.panel);
        setDraft("");
        setParticipantMentions([]);
        setLocationMentions([]);
        return;
      }

      const mentionsForSend = isYieldTurn ? [] : participantMentions;
      const locationMentionsForSend = isYieldTurn ? [] : locationMentions;

      if (!isYieldTurn) {
        setDraft("");
        setParticipantMentions([]);
        setLocationMentions([]);
      }

      if (!isYieldTurn) {
        setFirstMessageSubmitted(true);
      }

      const result = await sendStoryMessage?.({
        message: body,
        inputMode,
        requestedSpeakerId,
        participantMentions: mentionsForSend,
        locationMentions: locationMentionsForSend,
        actionType,
      });

      if (!result && !isYieldTurn) {
        setFirstMessageSubmitted(false);
        setDraft(body);
        setParticipantMentions(mentionsForSend);
        setLocationMentions(locationMentionsForSend);
      }
    },
    [
      chatAllowed,
      draft,
      inputMode,
      locationMentions,
      nextSpeaker,
      participantMentions,
      sendStoryMessage,
      sending,
    ]
  );

  const openPlayerCharacterPicker = useCallback(() => {
    if (!canSetPlayerCharacter || firstMessageSubmitted) return;
    setPlayerCharacterPickerOpen(true);
  }, [canSetPlayerCharacter, firstMessageSubmitted]);

  const closePlayerCharacterPicker = useCallback(() => {
    setPlayerCharacterPickerOpen(false);
  }, []);

  const choosePlayerCharacter = useCallback(
    async (playerCharacter) => {
      if (!playerCharacter?.id || typeof setPlayerCharacter !== "function") {
        return;
      }

      const result = await setPlayerCharacter(playerCharacter.id);
      if (result) {
        setPlayerCharacterPickerOpen(false);
      }
    },
    [setPlayerCharacter]
  );

  const closeMobilePanel = useCallback(() => setMobilePanel(null), []);
  const closeComposerHelpPanel = useCallback(
    () => setComposerHelpPanel(null),
    []
  );

  const castPanelProps = {
    room,
    cast,
    roomId,
    onClose: () => setLeftOpen(false),
    onDeleteRoom: requestDeleteRoom,
    isDeletingRoom: deletingRoom,
    deleteError,
    selectedResponderId: nextSpeaker,
    onSelectResponder: selectNextResponder,
    registryNpcs,
    registryNpcsLoading,
    registryNpcActionKey,
    registryNpcError,
    onLoadRegistryNpc: loadRegistryNpc,
    onUnloadRegistryNpc: unloadRegistryNpc,
    randomLikedLoading,
    randomLikedError,
    onLoadRandomLiked: loadRandomLikedCharacter,
  };

  const mobileCastPanelProps = {
    ...castPanelProps,
    onClose: undefined,
    onSelectResponder: (participantId) =>
      selectNextResponder(participantId, { closeMobile: true }),
  };

  const hasRoomMechanicsModule = useMemo(
    () => getMechanicsModuleBindings(room).length > 0,
    [room]
  );

  const runtimeMechanicsPanelProps = hasRoomMechanicsModule
    ? null
    : {
        room,
        roomId,
        onUpdated: reloadStoryRoom,
      };

  const storyStatusSurfaces = useMemo(
    () =>
      Array.isArray(statusSurfaces?.surfaces)
        ? statusSurfaces.surfaces.filter(
            (surface) => surface?.presentation?.host === "INLINE"
          )
        : [],
    [statusSurfaces]
  );
  const persistentStatusSurfaceDomains = useMemo(
    () => getPersistentStatusSurfaceDomains(storyStatusSurfaces),
    [storyStatusSurfaces]
  );

  return {
    room,
    layoutClass: buildStoryRoomLayoutClass({ leftOpen, rightOpen }),
    leftOpen,
    rightOpen,
    mobilePanel,
    composerHelpPanel,
    commands,
    statusSurfaces: storyStatusSurfaces,
    commandCatalogError,
    statusSurfaceError,
    castPanelProps,
    mobileCastPanelProps,
    transcriptProps: {
      messages,
      loading,
      sending,
      error,
      statusSurfaces: storyStatusSurfaces,
      persistentStatusSurfaceDomains,
      playerCharacterPrompt: {
        visible: Boolean(canSetPlayerCharacter) && !firstMessageSubmitted,
        selectedName: selectedPlayerCharacter?.name || "",
        busy: Boolean(settingPlayerCharacter),
        errorMessage: setPlayerCharacterError,
        onSelect: openPlayerCharacterPicker,
      },
      onRegenerateMessage: regenerateMessage,
      onContinueMessage: continueMessage,
      chatGenerationAllowed: chatAllowed,
      chatGenerationDisabledReason: chatUnavailableReason,
      onReportMessage: reportMessage,
      messageActionState,
    },
    playerCharacterPickerProps: playerCharacterPickerOpen
      ? {
          selectedId: selectedPlayerCharacter?.participant?.creationId || "",
          onClose: closePlayerCharacterPicker,
          onSelect: choosePlayerCharacter,
        }
      : null,
    composerProps: {
      inputMode,
      setInputMode,
      nextSpeaker,
      setNextSpeaker,
      nextSpeakerOptions,
      draft,
      setDraft,
      participantMentions,
      setParticipantMentions,
      participantMentionOptions,
      locationMentions,
      setLocationMentions,
      locationMentionOptions,
      commandOptions: commands,
      onSend: sendMessage,
      onOpenCast: () => setMobilePanel("cast"),
      onOpenState: () => setMobilePanel("state"),
      isSending: sending,
      disabled: loading || Boolean(error) || !chatAllowed,
      disabledReason: chatUnavailableReason,
    },
    desktopStatePanelProps: {
      room,
      roomId,
      messages,
      onExportTranscript: exportTranscript,
      onCreateTemporaryShare: createTemporaryShare,
      onRevokeTemporaryShare: revokeTemporaryShare,
      onCreatePersistentShare: createPersistentShare,
      onRevokePersistentShare: revokePersistentShare,
      onClose: () => setRightOpen(false),
    },
    mobileStatePanelProps: {
      room,
      roomId,
      messages,
      onExportTranscript: exportTranscript,
      onCreateTemporaryShare: createTemporaryShare,
      onRevokeTemporaryShare: revokeTemporaryShare,
      onCreatePersistentShare: createPersistentShare,
      onRevokePersistentShare: revokePersistentShare,
    },
    runtimeMechanicsPanelProps,
    onToggleLeftPanel: () => setLeftOpen((current) => !current),
    onToggleRightPanel: () => setRightOpen((current) => !current),
    onShowLeftPanel: () => setLeftOpen(true),
    onShowRightPanel: () => setRightOpen(true),
    onOpenMobileCast: () => setMobilePanel("cast"),
    onOpenMobileState: () => setMobilePanel("state"),
    onCloseMobilePanel: closeMobilePanel,
    onCloseComposerHelpPanel: closeComposerHelpPanel,
    isConfirmingDeleteRoom,
    onCancelDeleteRoom: cancelDeleteRoom,
    onConfirmDeleteRoom: confirmDeleteRoom,
  };
}
