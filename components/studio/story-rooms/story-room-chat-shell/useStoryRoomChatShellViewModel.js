"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { deleteStoryRoom } from "@/lib/client/studio/story-rooms/storyRoomClient";
import {
  STORY_ROOM_COMMANDS,
  mergeStoryRoomCommandsWithMechanicsCatalog,
  resolveLocalStoryRoomCommand,
} from "@/components/studio/story-rooms/story-room-composer/storyRoomCommandRegistry";
import { getMechanicsModuleBindings } from "@/components/studio/story-rooms/story-room-runtime-mechanics-panel/useStoryRoomRuntimeMechanicsPanelViewModel";
import {
  CHARACTER_COLOR_PALETTES,
  DEFAULT_CHARACTER_COLOR_PALETTE_ID,
  getCharacterColorPalette,
} from "@/components/studio/create/character/constants/characterColorPalettes";
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

// Auto plus every selectable responder (fe/chat-studio item 2 retired
// the Random option).
export function buildNextSpeakerOptions(speakerOptions = []) {
  return [
    { id: "AUTO", label: "Auto" },
    ...(Array.isArray(speakerOptions) ? speakerOptions : []),
  ];
}

export const STORY_ROOM_BACK_HREF = "/studio/v2/stories";

// Rail geometry lives in app/design-system.css (.cf-story-room-grid,
// decision K1); the ViewModel only names the state.
export function buildStoryRoomRailsState({ leftOpen, rightOpen }) {
  if (leftOpen && rightOpen) return "both";
  if (leftOpen) return "left";
  if (rightOpen) return "right";
  return "none";
}

const MD_UP_QUERY = "(min-width: 48rem)";
const XL_UP_QUERY = "(min-width: 80rem)";

// Same shape as components/kit/modal-frame/usePhoneWidth.js: read once
// at mount, subscribe for changes, no setState in the effect body.
function useMediaQueryMatch(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(query);

    function onChange(event) {
      setMatches(event.matches);
    }

    mediaQuery.addEventListener("change", onChange);
    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [query]);

  return matches;
}

const NOOP_CHROME = Object.freeze({
  leftOwner: null,
  claimLeft: () => {},
  releaseLeft: () => {},
});

// Chat color (fe/chat-studio item 4): the creator default is the primary
// Character's palette id, read from the participant record the Chassis
// stamps at launch (participant.metadata.characterColorPaletteId), else
// the latest Character message's presentation palette, else the catalog
// default. The 13 catalog palettes are the combos Preferences offers
// (item 6); the palette's `speaker` role is the anchor the bubble takes.
function normalizePaletteId(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized && CHARACTER_COLOR_PALETTES.some((palette) => palette.id === normalized)
    ? normalized
    : "";
}

export function resolveCreatorChatColorPaletteId({ cast = [], messages = [] } = {}) {
  const primaryCharacter = (Array.isArray(cast) ? cast : []).find(
    (member) => String(member?.participantType || "").toUpperCase() === "CHARACTER"
  );
  const participantPaletteId = normalizePaletteId(
    primaryCharacter?.participant?.metadata?.characterColorPaletteId
  );
  if (participantPaletteId) return participantPaletteId;

  const safeMessages = Array.isArray(messages) ? messages : [];
  for (let index = safeMessages.length - 1; index >= 0; index -= 1) {
    const message = safeMessages[index];
    if (String(message?.type || "").toLowerCase() !== "character") continue;
    const messagePaletteId = normalizePaletteId(
      message?.metadata?.presentation?.paletteId ||
        message?.metadata?.openingCharacterPaletteId
    );
    if (messagePaletteId) return messagePaletteId;
  }

  return DEFAULT_CHARACTER_COLOR_PALETTE_ID;
}

export const CHAT_COLOR_OPTIONS = Object.freeze(
  CHARACTER_COLOR_PALETTES.map((palette) => ({
    id: palette.id,
    label: palette.label,
    family: palette.family,
    swatch: palette.colors.speaker,
  }))
);

function normalizeChat(chat) {
  return chat && typeof chat === "object" ? chat : {};
}

function normalizeChrome(chrome) {
  return chrome && typeof chrome === "object" ? chrome : NOOP_CHROME;
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
  chrome,
} = {}) {
  const safeChat = normalizeChat(chat);
  const safeChrome = normalizeChrome(chrome);
  const { chatAllowed, chatUnavailableReason } =
    getChatCapabilityPresentation(account);
  const {
    room = {},
    cast = [],
    messages = [],
    speakerOptions = [],
    participantMentionOptions: chatParticipantMentionOptions = [],
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

  const safeSpeakerOptions = useMemo(
    () => (Array.isArray(speakerOptions) ? speakerOptions : []),
    [speakerOptions]
  );

  const [inputMode, setInputMode] = useState("DIALOGUE");
  const [nextSpeaker, setNextSpeaker] = useState("AUTO");
  const [draft, setDraft] = useState("");
  const [participantMentions, setParticipantMentions] = useState([]);
  const [locationMentions, setLocationMentions] = useState([]);
  // Rails (decision B1): the story list starts closed and the details
  // rail open at md and up; below xl the two are mutually exclusive.
  // The left rail is owned through the studio chrome context (J1): open
  // means the page holds the left edge and the primary nav reads
  // collapsed; the nav expanding hands the edge back and closes it.
  const isMdUp = useMediaQueryMatch(MD_UP_QUERY);
  const isXlUp = useMediaQueryMatch(XL_UP_QUERY);
  const [rightOpen, setRightOpen] = useState(true);
  const leftOpen = isMdUp && safeChrome.leftOwner === "page";
  const { claimLeft, releaseLeft } = safeChrome;
  const [mobilePanel, setMobilePanel] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isConfirmingDeleteRoom, setIsConfirmingDeleteRoom] = useState(false);
  const [composerHelpPanel, setComposerHelpPanel] = useState(null);
  const [playerCharacterPickerOpen, setPlayerCharacterPickerOpen] = useState(false);
  const [firstMessageSubmitted, setFirstMessageSubmitted] = useState(false);
  // The user's chat color override lives in page state until the Chassis
  // serves a preference field (CR-066); null means the creator default.
  const [chatColorOverrideId, setChatColorOverrideId] = useState(null);
  const creatorChatColorPaletteId = useMemo(
    () => resolveCreatorChatColorPaletteId({ cast, messages }),
    [cast, messages]
  );
  const chatColorPaletteId = chatColorOverrideId || creatorChatColorPaletteId;
  const chatColor = getCharacterColorPalette(chatColorPaletteId)?.colors?.speaker || null;

  const selectedPlayerCharacter = useMemo(
    () =>
      (Array.isArray(cast) ? cast : []).find(
        (member) =>
          String(member?.participantType || "").toUpperCase() ===
          "PLAYER_CHARACTER"
      ) || null,
    [cast]
  );

  // A new room resets the pre-first-message state. Adjusted during
  // render (the React-sanctioned pattern) rather than in an effect, so
  // no cascading render and no setState-in-effect lint error.
  const [seenRoomId, setSeenRoomId] = useState(roomId);
  if (roomId !== seenRoomId) {
    setSeenRoomId(roomId);
    setFirstMessageSubmitted(false);
    setPlayerCharacterPickerOpen(false);
  }

  // Leaving the route hands the left edge back to the primary nav.
  useEffect(() => () => releaseLeft?.(), [releaseLeft]);

  const toggleLeftPanel = useCallback(() => {
    if (leftOpen) {
      releaseLeft?.();
      return;
    }

    claimLeft?.("page");
    if (!isXlUp) setRightOpen(false);
  }, [claimLeft, isXlUp, leftOpen, releaseLeft]);

  const toggleRightPanel = useCallback(() => {
    setRightOpen((current) => {
      const next = !current;
      if (next && !isXlUp && leftOpen) releaseLeft?.();
      return next;
    });
  }, [isXlUp, leftOpen, releaseLeft]);

  const primaryCharacter = useMemo(() => {
    const option = safeSpeakerOptions.find(
      (candidate) => candidate?.participantType === "CHARACTER"
    );

    return option
      ? { label: option.label || "", avatarUrl: option.avatarUrl || "" }
      : null;
  }, [safeSpeakerOptions]);

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

  const participantMentionOptions = useMemo(() => {
    if (Array.isArray(chatParticipantMentionOptions) && chatParticipantMentionOptions.length) {
      return chatParticipantMentionOptions;
    }

    return safeSpeakerOptions.filter(
      (option) => option?.participantType === "CHARACTER"
    );
  }, [chatParticipantMentionOptions, safeSpeakerOptions]);

  // A chosen responder that left the cast falls back to Auto, adjusted
  // during render for the same reason as the room reset above.
  const selectedResponderStillAvailable =
    nextSpeaker === "AUTO" ||
    safeSpeakerOptions.some((option) => option?.id === nextSpeaker);
  if (!selectedResponderStillAvailable) {
    setNextSpeaker("AUTO");
  }

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
    railsState: buildStoryRoomRailsState({ leftOpen, rightOpen }),
    leftOpen,
    rightOpen,
    swipeEnabled: !isMdUp,
    primaryCharacter,
    backHref: STORY_ROOM_BACK_HREF,
    storyListProps: {
      currentRoomId: roomId,
      refetchKey: Array.isArray(messages) ? messages.length : 0,
    },
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
      chatColor,
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
      onClose: toggleRightPanel,
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
    chatColorProps: {
      paletteId: chatColorPaletteId,
      creatorPaletteId: creatorChatColorPaletteId,
      isOverridden: Boolean(chatColorOverrideId),
      options: CHAT_COLOR_OPTIONS,
      onChange: (paletteId) =>
        setChatColorOverrideId(
          normalizePaletteId(paletteId) === creatorChatColorPaletteId
            ? null
            : normalizePaletteId(paletteId) || null
        ),
      onReset: () => setChatColorOverrideId(null),
    },
    onToggleLeftPanel: toggleLeftPanel,
    onToggleRightPanel: toggleRightPanel,
    onOpenMobileCast: () => setMobilePanel("cast"),
    onOpenMobileState: () => setMobilePanel("state"),
    onCloseMobilePanel: closeMobilePanel,
    onCloseComposerHelpPanel: closeComposerHelpPanel,
    isConfirmingDeleteRoom,
    onCancelDeleteRoom: cancelDeleteRoom,
    onConfirmDeleteRoom: confirmDeleteRoom,
  };
}
