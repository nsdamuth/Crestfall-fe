"use client";

import { useCallback, useMemo, useState } from "react";

import { useStoryRoomNpcParticipantManagerViewModel } from "@/components/studio/story-rooms/story-room-npc-participant-manager/useStoryRoomNpcParticipantManagerViewModel";
import {
  projectStoryCharacterLifecycleRuntimePresentation,
} from "../story-character-lifecycle-runtime/StoryCharacterLifecycleRuntimePresentation.contract.js";
import {
  projectStoryRoomCastLifecycleBinding,
} from "./lifecycle-binding/StoryRoomCastLifecycleBinding.contract.js";

function displayText(value, fallback = "") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function normalizeCastMember(member, selectedResponderId, canSelectResponder) {
  const id = displayText(member?.id);
  const name = displayText(member?.name, "Unnamed Participant");
  const selectable =
    Boolean(member?.isSelectableResponder) && Boolean(canSelectResponder);
  const selected = selectable && selectedResponderId === id;
  const participantType = displayText(member?.participantType);
  const isPlayerControlled =
    participantType === "PLAYER_CHARACTER" || participantType === "USER";

  let selectionLabel = "Inactive";

  if (selected) {
    selectionLabel = "Next responder";
  } else if (selectable) {
    selectionLabel = "Select responder";
  } else if (isPlayerControlled) {
    selectionLabel = "Player-controlled";
  } else if (member?.isActive) {
    selectionLabel = "Not selectable";
  }

  return {
    id,
    name,
    avatarUrl: displayText(member?.avatarUrl),
    fallbackInitial: name.slice(0, 1).toUpperCase(),
    role: displayText(member?.role),
    state: displayText(member?.state),
    note: displayText(member?.note),
    isActive: Boolean(member?.isActive),
    selectable,
    selected,
    selectionLabel,
    selectionAriaLabel: selectable
      ? `Choose ${name} as the next responder`
      : "",
  };
}

function buildCastPanelState({
  room,
  cast,
  roomId,
  selectedResponderId,
  canSelectResponder,
  canSetPlayerCharacter,
  isSettingPlayerCharacter,
  setPlayerCharacterError,
  canLoadRandomLiked,
  randomLikedLoading,
  randomLikedError,
  canDeleteRoom,
  isDeletingRoom,
  deleteError,
  canClose,
}) {
  const safeRoom = room && typeof room === "object" ? room : {};
  const castMembers = (Array.isArray(cast) ? cast : []).map((member) =>
    normalizeCastMember(member, selectedResponderId, canSelectResponder)
  );
  const featuredImageUrl = displayText(safeRoom.featuredSpeakerImageUrl);
  const featuredSpeakerName = displayText(
    safeRoom.featuredSpeakerName,
    "Story"
  );

  return {
    eyebrow: "Room & Cast",
    canClose,
    featuredMedia: {
      imageUrl: featuredImageUrl,
      imageAltText: displayText(
        safeRoom.featuredSpeakerName,
        "Room media"
      ),
      speakerName: featuredSpeakerName,
      emptyEyebrow: "Room Media",
      emptyMessage: "Featured room image will appear here.",
      imageEyebrow: "Last Speaker Media",
    },
    roomTitle: displayText(safeRoom.title, "Untitled Story"),
    roomIdLabel: displayText(roomId),
    narrator: {
      label: "Narrator",
      value: displayText(safeRoom.narrator),
    },
    castHeading: "Cast",
    castDescription:
      "Select an active Character or Narrator to choose the next responder.",
    castMembers,
    playerCharacterAction: {
      visible: canSetPlayerCharacter,
      disabled: isSettingPlayerCharacter,
      busy: isSettingPlayerCharacter,
      label: "Set Player Character",
      busyLabel: "Setting...",
    },
    setPlayerCharacterError: displayText(setPlayerCharacterError),
    randomLikedAction: {
      visible: canLoadRandomLiked,
      disabled: !canLoadRandomLiked || randomLikedLoading,
      busy: randomLikedLoading,
      label: "Random Liked",
      busyLabel: "Loading...",
    },
    randomLikedError: displayText(randomLikedError),
    deleteAction: {
      visible: canDeleteRoom,
      disabled: isDeletingRoom,
      busy: isDeletingRoom,
      label: "Delete Story",
      busyLabel: "Deleting...",
    },
    deleteError: displayText(deleteError),
    roomListHref: "/studio/story-rooms",
    roomListLabel: "← Room List",
  };
}

export function useStoryRoomCastPanelViewModel({
  room,
  snapshot = null,
  cast,
  roomId,
  onClose,
  onDeleteRoom,
  isDeletingRoom = false,
  deleteError = "",
  canSetPlayerCharacter = false,
  onSetPlayerCharacter,
  isSettingPlayerCharacter = false,
  setPlayerCharacterError = "",
  selectedResponderId = "AUTO",
  onSelectResponder,
  registryNpcs,
  registryNpcsLoading = false,
  registryNpcActionKey = "",
  registryNpcError = "",
  onLoadRegistryNpc,
  onUnloadRegistryNpc,
  randomLikedLoading = false,
  randomLikedError = "",
  onLoadRandomLiked,
} = {}) {
  const [playerCharacterPickerOpen, setPlayerCharacterPickerOpen] =
    useState(false);

  const npcParticipantManager =
    useStoryRoomNpcParticipantManagerViewModel({
      registryNpcs,
      loading: registryNpcsLoading,
      actionKey: registryNpcActionKey,
      error: registryNpcError,
      onLoad: onLoadRegistryNpc,
      onUnload: onUnloadRegistryNpc,
    });

  const state = useMemo(
    () =>
      buildCastPanelState({
        room,
        cast,
        roomId,
        selectedResponderId,
        canSelectResponder: typeof onSelectResponder === "function",
        canSetPlayerCharacter:
          Boolean(canSetPlayerCharacter) &&
          typeof onSetPlayerCharacter === "function",
        isSettingPlayerCharacter: Boolean(isSettingPlayerCharacter),
        setPlayerCharacterError,
        canLoadRandomLiked: typeof onLoadRandomLiked === "function",
        randomLikedLoading: Boolean(randomLikedLoading),
        randomLikedError,
        canDeleteRoom: typeof onDeleteRoom === "function",
        isDeletingRoom: Boolean(isDeletingRoom),
        deleteError,
        canClose: typeof onClose === "function",
      }),
    [
      canSetPlayerCharacter,
      cast,
      deleteError,
      isDeletingRoom,
      isSettingPlayerCharacter,
      onClose,
      onDeleteRoom,
      onSelectResponder,
      onSetPlayerCharacter,
      onLoadRandomLiked,
      randomLikedError,
      randomLikedLoading,
      room,
      roomId,
      selectedResponderId,
      setPlayerCharacterError,
    ]
  );

  const lifecycleRuntimePresentation = useMemo(
    () =>
      projectStoryCharacterLifecycleRuntimePresentation({
        participants: Array.isArray(snapshot?.participants)
          ? snapshot.participants
          : [],
      }),
    [snapshot]
  );

  const lifecycleCastBinding = useMemo(
    () =>
      projectStoryRoomCastLifecycleBinding({
        castMembers: state.castMembers,
        lifecycleRuntimePresentation,
      }),
    [
      lifecycleRuntimePresentation,
      state.castMembers,
    ]
  );

  const onOpenPlayerCharacterPicker = useCallback(() => {
    setPlayerCharacterPickerOpen(true);
  }, []);

  const onClosePlayerCharacterPicker = useCallback(() => {
    setPlayerCharacterPickerOpen(false);
  }, []);

  const onChoosePlayerCharacter = useCallback(
    async (playerCharacter) => {
      if (
        !playerCharacter?.id ||
        typeof onSetPlayerCharacter !== "function"
      ) {
        return;
      }

      const result = await onSetPlayerCharacter(playerCharacter.id);

      if (result) {
        setPlayerCharacterPickerOpen(false);
      }
    },
    [onSetPlayerCharacter]
  );

  const onSelectCastMember = useCallback(
    (participantId) => {
      onSelectResponder?.(participantId);
    },
    [onSelectResponder]
  );

  return {
    viewProps: {
      ...state,
      castMembers:
        lifecycleCastBinding.castMembers,
      lifecycleSummary:
        lifecycleCastBinding.summary,
      npcParticipantManager,
      onClosePanel: onClose,
      onSelectCastMember,
      onOpenPlayerCharacterPicker,
      onLoadRandomLiked,
      onDeleteRoom,
    },
    playerCharacterPickerProps: playerCharacterPickerOpen
      ? {
          onClose: onClosePlayerCharacterPicker,
          onSelect: onChoosePlayerCharacter,
        }
      : null,
  };
}

export { buildCastPanelState };
