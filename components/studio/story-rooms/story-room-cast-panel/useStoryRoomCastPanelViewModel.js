"use client";

import { useCallback, useMemo, useState } from "react";

import { useStoryRoomNpcParticipantManagerViewModel } from "@/components/studio/story-rooms/story-room-npc-participant-manager/useStoryRoomNpcParticipantManagerViewModel";

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

  const typeLabel =
    participantType === "PLAYER_CHARACTER" || participantType === "USER"
      ? "Player"
      : participantType === "NARRATOR"
        ? "Narrator"
        : "Character";
  const state = displayText(member?.state);
  const displayState = /^(present|active)$/i.test(state) ? "" : state;

  return {
    id,
    name,
    avatarUrl: displayText(member?.avatarUrl),
    fallbackInitial: name.slice(0, 1).toUpperCase(),
    role: displayText(member?.role),
    typeLabel,
    state,
    displayState,
    note: displayText(member?.note),
    isActive: Boolean(member?.isActive),
    selectable,
    selected,
    selectionAriaLabel: selectable
      ? `Choose ${name} as the next responder`
      : "",
  };
}

function buildCastPanelState({
  cast,
  selectedResponderId,
  canSelectResponder,
  canSetPlayerCharacter,
  isSettingPlayerCharacter,
  setPlayerCharacterError,
  canLoadRandomLiked,
  randomLikedLoading,
  randomLikedError,
}) {
  const castMembers = (Array.isArray(cast) ? cast : []).map((member) =>
    normalizeCastMember(member, selectedResponderId, canSelectResponder)
  );

  // 2.0.0 (fe/chat-studio item 6): the roster and its actions only. The
  // story's media, title, id line, narrator line, delete, and the way
  // back belong to the details rail.
  return {
    castHeading: "Cast",
    castDescription: "",
    castMembers,
    playerCharacterAction: {
      visible: canSetPlayerCharacter,
      disabled: isSettingPlayerCharacter,
      busy: isSettingPlayerCharacter,
      label: "Set player character",
      busyLabel: "Setting",
    },
    setPlayerCharacterError: displayText(setPlayerCharacterError),
    randomLikedAction: {
      visible: canLoadRandomLiked,
      disabled: !canLoadRandomLiked || randomLikedLoading,
      busy: randomLikedLoading,
      label: "Random Liked",
      busyLabel: "Loading",
    },
    randomLikedError: displayText(randomLikedError),
  };
}

export function useStoryRoomCastPanelViewModel({
  cast,
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
  const [manageCastOpen, setManageCastOpen] = useState(false);

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
        cast,
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
      }),
    [
      canSetPlayerCharacter,
      cast,
      isSettingPlayerCharacter,
      onSelectResponder,
      onSetPlayerCharacter,
      onLoadRandomLiked,
      randomLikedError,
      randomLikedLoading,
      selectedResponderId,
      setPlayerCharacterError,
    ]
  );

  const onOpenManageCast = useCallback(() => {
    setManageCastOpen(true);

    if (!npcParticipantManager?.isOpen) {
      npcParticipantManager?.onTogglePanel?.();
    }
  }, [npcParticipantManager?.isOpen, npcParticipantManager?.onTogglePanel]);

  const onCloseManageCast = useCallback(() => {
    setManageCastOpen(false);
  }, []);

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
      npcParticipantManager,
      manageCastOpen,
      onSelectCastMember,
      onOpenPlayerCharacterPicker,
      onOpenManageCast,
      onCloseManageCast,
      onLoadRandomLiked,
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
