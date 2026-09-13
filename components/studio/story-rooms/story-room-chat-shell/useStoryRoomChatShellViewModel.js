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
  "Delete this story?",
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

export const STORY_ROOM_NEW_CHAT_LABEL = "New chat";

// The cast cap (brief 4 item 5): the player plus four NPCs. A frontend
// constant until the Chassis serves one (CR-071); no cast cap exists in
// services/api today (the participant limits found there are summary
// and scene grounding windows, not a cast size).
export const STORY_ROOM_CAST_NPC_CAP = 4;
export const STORY_ROOM_CAST_CAP_TITLE = `Up to ${STORY_ROOM_CAST_NPC_CAP} characters`;

// One participants source (brief 4 item 5, gate G5): `cast` from
// useStoryRoomChat (buildCastViewModel over snapshot.participants) feeds
// the rail's Cast list as is, and this selector derives the composer's
// cast row from the same list: every present, selectable responder
// (active Characters, including NPCs the story auto-loaded, and the
// Narrator), in participant order.
export function selectCastRowOptions(cast = []) {
  return (Array.isArray(cast) ? cast : [])
    .filter((member) => member?.id && member?.isSelectableResponder)
    .map((member) => ({
      id: String(member.id),
      label: String(member.name || member.participantType || "").trim(),
      participantType: String(member.participantType || "").trim(),
      creationId: member?.participant?.creationId || null,
      avatarUrl: String(member.avatarUrl || "").trim(),
    }));
}

// NPCs present in the chat, counted from the same source: active
// Characters (the Narrator and the player are not NPCs).
export function countStoryRoomNpcs(cast = []) {
  return (Array.isArray(cast) ? cast : []).filter(
    (member) =>
      String(member?.participantType || "").toUpperCase() === "CHARACTER" &&
      Boolean(member?.isActive)
  ).length;
}

// The creation a new chat starts from (brief 4 item 3): the room's
// source template when it launched from one (room.data.source), else,
// for a private character chat, the default Character's creation; the
// shape the launch controller's prepare step reads (id, type, title).
// Null when the story resolves to neither.
export function resolveStorySourceCreation({ room = {}, cast = [] } = {}) {
  const source = room?.rawRoom?.data?.source || {};
  const templateId = String(source.templateId || source.template_id || "").trim();

  if (templateId) {
    return {
      id: templateId,
      type: "ROOM_TEMPLATE",
      title: String(source.templateTitle || source.template_title || room?.title || "").trim(),
    };
  }

  const members = Array.isArray(cast) ? cast : [];
  const isCharacter = (member) =>
    String(member?.participantType || "").toUpperCase() === "CHARACTER" &&
    String(member?.participant?.creationId || "").trim();
  const character =
    members.find((member) => isCharacter(member) && member?.participant?.isDefault) ||
    members.find(isCharacter) ||
    null;

  return character
    ? {
        id: String(character.participant.creationId).trim(),
        type: "CHARACTER",
        title: String(character.name || "").trim(),
      }
    : null;
}

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

// Player chat color is independent from whichever Character/Narrator spoke
// last. With no explicit Player preference, use Crestfall's stock palette.
// The 13 catalog palettes remain available in Preferences; the selected
// palette's `speaker` role is the anchor the Player bubble takes.
function normalizePaletteId(value) {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized && CHARACTER_COLOR_PALETTES.some((palette) => palette.id === normalized)
    ? normalized
    : "";
}

export function resolvePlayerChatColorDefaultPaletteId() {
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
  newChatLaunch = null,
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
  // The cast row reads the same participants list the rail's Cast list
  // reads (brief 4 item 5, gate G5): selectCastRowOptions over `cast`.
  const castRowOptions = useMemo(() => selectCastRowOptions(cast), [cast]);
  const npcCount = useMemo(() => countStoryRoomNpcs(cast), [cast]);

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
  // Below md: "stories" (the story list as a left sheet), "details"
  // (the details rail as a bottom sheet), or null.
  const [mobilePanel, setMobilePanel] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isConfirmingDeleteRoom, setIsConfirmingDeleteRoom] = useState(false);
  const [composerHelpPanel, setComposerHelpPanel] = useState(null);
  const [playerCharacterPickerOpen, setPlayerCharacterPickerOpen] = useState(false);
  const [firstMessageSubmitted, setFirstMessageSubmitted] = useState(false);
  // The Manage cast dialog (brief 4 item 5) is owned here so the
  // composer's add character circle opens it whether or not the rail's
  // Cast drill-in is mounted; the binding shell renders it.
  const [manageCastOpen, setManageCastOpen] = useState(false);
  // The user's chat color override lives in page state until the Chassis
  // serves a preference field (CR-066); null means Crestfall stock default.
  const [chatColorOverrideId, setChatColorOverrideId] = useState(null);
  const defaultChatColorPaletteId = resolvePlayerChatColorDefaultPaletteId();
  const chatColorPaletteId = chatColorOverrideId || defaultChatColorPaletteId;
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

  // A new room resets the pre-first-message state and closes any open
  // mobile sheet (the story list sheet navigates to the next story, so
  // it must not stay open over it; brief 2 item 11). Adjusted during
  // render (the React-sanctioned pattern) rather than in an effect, so
  // no cascading render and no setState-in-effect lint error.
  const [seenRoomId, setSeenRoomId] = useState(roomId);
  if (roomId !== seenRoomId) {
    setSeenRoomId(roomId);
    setFirstMessageSubmitted(false);
    setPlayerCharacterPickerOpen(false);
    setMobilePanel(null);
    setManageCastOpen(false);
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
    const option = castRowOptions.find(
      (candidate) => candidate?.participantType === "CHARACTER"
    );

    return option
      ? { label: option.label || "", avatarUrl: option.avatarUrl || "" }
      : null;
  }, [castRowOptions]);

  const nextSpeakerOptions = useMemo(
    () => buildNextSpeakerOptions(castRowOptions),
    [castRowOptions]
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
    castRowOptions.some((option) => option?.id === nextSpeaker);
  if (!selectedResponderStillAvailable) {
    setNextSpeaker("AUTO");
  }

  const selectNextResponder = useCallback(
    (participantId, { closeMobile = false } = {}) => {
      if (!castRowOptions.some((option) => option?.id === participantId)) {
        return;
      }

      setNextSpeaker(participantId);

      if (closeMobile) {
        setMobilePanel(null);
      }
    },
    [castRowOptions]
  );

  const openManageCast = useCallback(() => setManageCastOpen(true), []);
  const closeManageCast = useCallback(() => setManageCastOpen(false), []);

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

  // New chat (brief 4 item 3): the story list's button above New story
  // starts a fresh chat from this story's source creation through the
  // launch controller the binding shell owns; the controller navigates
  // to the new chat itself. Disabled with "not available yet" only when
  // the story resolves to no source creation.
  const sourceCreation = useMemo(
    () => resolveStorySourceCreation({ room, cast }),
    [room, cast]
  );
  const launchNewChat = newChatLaunch?.launch;
  const newChatPending = Boolean(
    sourceCreation && newChatLaunch?.launchingCreationId === sourceCreation.id
  );
  const onNewChat = useCallback(() => {
    if (!sourceCreation || typeof launchNewChat !== "function") return;
    void launchNewChat(sourceCreation);
  }, [launchNewChat, sourceCreation]);
  const newChat = {
    label: STORY_ROOM_NEW_CHAT_LABEL,
    pendingLabel: "Starting",
    pending: newChatPending,
    disabled: !sourceCreation || typeof launchNewChat !== "function" || newChatPending,
    title: sourceCreation
      ? `${STORY_ROOM_NEW_CHAT_LABEL} from ${sourceCreation.title || "this story"}`
      : "New chat, not available yet",
    errorMessage: String(newChatLaunch?.launchError || ""),
    onPress: onNewChat,
  };

  const castPanelProps = {
    room,
    cast,
    roomId,
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
    onOpenManageCast: openManageCast,
  };

  // The Manage cast dialog's binding props (brief 4 item 5): the same
  // registry NPC lifecycle and Random liked action the cast panel binds.
  const manageCast = manageCastOpen
    ? {
        registryNpcs,
        registryNpcsLoading,
        registryNpcActionKey,
        registryNpcError,
        onLoadRegistryNpc: loadRegistryNpc,
        onUnloadRegistryNpc: unloadRegistryNpc,
        randomLikedLoading,
        randomLikedError,
        onLoadRandomLiked: loadRandomLikedCharacter,
        onClose: closeManageCast,
      }
    : null;

  // Add character (brief 4 item 5): the plus circle after the last cast
  // circle; disabled at the cap with the cap as its title.
  const atCastCap = npcCount >= STORY_ROOM_CAST_NPC_CAP;
  const addCharacter = {
    disabled: atCastCap,
    title: atCastCap ? STORY_ROOM_CAST_CAP_TITLE : "Add character",
    onPress: openManageCast,
  };

  // Inside the mobile sheet, choosing a responder closes the sheet.
  const mobileCastPanelProps = {
    ...castPanelProps,
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

  const desktopStatePanelProps = {
    room,
    roomId,
    messages,
    onExportTranscript: exportTranscript,
    onCreateTemporaryShare: createTemporaryShare,
    onRevokeTemporaryShare: revokeTemporaryShare,
    onCreatePersistentShare: createPersistentShare,
    onRevokePersistentShare: revokePersistentShare,
  };

  const mobileStatePanelProps = {
    room,
    roomId,
    messages,
    onExportTranscript: exportTranscript,
    onCreateTemporaryShare: createTemporaryShare,
    onRevokeTemporaryShare: revokeTemporaryShare,
    onCreatePersistentShare: createPersistentShare,
    onRevokePersistentShare: revokePersistentShare,
  };

  const chatColorProps = {
    paletteId: chatColorPaletteId,
    defaultPaletteId: defaultChatColorPaletteId,
    isOverridden: Boolean(chatColorOverrideId),
    options: CHAT_COLOR_OPTIONS,
    onChange: (paletteId) =>
      setChatColorOverrideId(
        normalizePaletteId(paletteId) === defaultChatColorPaletteId
          ? null
          : normalizePaletteId(paletteId) || null
      ),
    onReset: () => setChatColorOverrideId(null),
  };

  // The right rail (item 6) and the right sheet below md compose the
  // same panels; the sheet's cast roster closes the sheet on a pick.
  const detailsRailProps = {
    room,
    cast,
    messages,
    castPanelProps,
    statePanelProps: desktopStatePanelProps,
    runtimeMechanicsPanelProps,
    chatColorProps,
    deleteError,
    onRequestDeleteRoom: requestDeleteRoom,
    isDeletingRoom: deletingRoom,
  };

  const mobileDetailsRailProps = {
    ...detailsRailProps,
    castPanelProps: mobileCastPanelProps,
    statePanelProps: mobileStatePanelProps,
  };

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
      newChat,
    },
    mobilePanel,
    composerHelpPanel,
    commands,
    statusSurfaces: storyStatusSurfaces,
    commandCatalogError,
    statusSurfaceError,
    detailsRailProps,
    mobileDetailsRailProps,
    transcriptProps: {
      openingHeroImage: room?.openingHeroImage || null,
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
      // The player circle (brief 3 item 2, brief 4 item 4): the selected
      // player character's name and avatar, or nothing when none is
      // chosen. Its tap never opens the picker (the player character is
      // set once at the start, through the transcript prompt); it runs
      // the existing continuation call with the player character as the
      // requested speaker so the player character responds. The Chassis
      // accepts any participant id on a yielded turn; its regulator
      // notes PLAYER_CHARACTER_AS_RESPONDER for the middleware and does
      // not reject the turn. Absent when no player character is set:
      // the "You" mark has no participant that can be asked to speak.
      playerCharacter: selectedPlayerCharacter
        ? {
            label: selectedPlayerCharacter.name || "",
            avatarUrl: selectedPlayerCharacter.avatarUrl || "",
          }
        : null,
      onPlayerSpeak: selectedPlayerCharacter?.id
        ? () =>
            sendMessage({
              requestedSpeakerId: selectedPlayerCharacter.id,
              actionType: "PLAYER_YIELD_TO_CHARACTER",
            })
        : null,
      addCharacter,
    },
    manageCast,
    chatColorProps,
    onToggleLeftPanel: toggleLeftPanel,
    onToggleRightPanel: toggleRightPanel,
    onOpenMobileDetails: () => setMobilePanel("details"),
    onOpenMobileStoryList: () => setMobilePanel("stories"),
    onCloseMobilePanel: closeMobilePanel,
    onCloseComposerHelpPanel: closeComposerHelpPanel,
    isConfirmingDeleteRoom,
    isDeletingRoom: deletingRoom,
    // Delete authority remains in this shell; the Details rail receives
    // requestDeleteRoom through its binding props and presents the safe
    // explicit bottom danger action on both desktop and mobile.
    onRequestDeleteRoom: requestDeleteRoom,
    onCancelDeleteRoom: cancelDeleteRoom,
    onConfirmDeleteRoom: confirmDeleteRoom,
  };
}
