import { getDefaultCreationImageForType } from "@/lib/shared/creations/creationMedia";
import { useMutualPlayers } from "@/components/studio/room-templates/hooks/useMutualPlayers";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Story Editor",
  sectionTitle: "Players and Turn Order",
  sectionDescription:
    "Invite mutual followers for future multiplayer rooms. Multiplayer rooms are always turn-based.",
  turnBasedLabel: "Turn-Based Room",
  turnBasedEnabledDescription:
    "Turn-based mode is enabled. Player turns and NPC response cycles can be handled by the room runtime later.",
  turnBasedDisabledDescription:
    "Freeform mode. Players can choose who responds until turn-based mode is enabled.",
  turnBasedRequiredMessage:
    "Multiplayer invitees are selected, so turn-based mode is required.",
  inviteesLabel: "Multiplayer Invitees",
  inviteesDescription:
    "Only mutual followers can be selected. Invites will require approval later.",
  addPlayerLabel: "Add Player",
  inviteeStatusLabel: "Pending invite later",
  emptyInviteesMessage: "No multiplayer invitees selected.",
  pickerEyebrow: "Multiplayer Picker",
  pickerTitle: "Select Players",
  pickerDescription:
    "Choose mutual followers. Invites will become real pending invitations later.",
  pickerSearchPlaceholder: "Search mutual followers...",
  pickerUserLabel: "User",
  pickerSelectedLabel: "Selected",
  pickerEmptyTitle: "No mutual followers found",
  pickerEmptyDescription:
    "Only users who follow you and whom you also follow can be invited.",
});

export function normalizeRoomTemplateInvitedPlayers(players) {
  if (!Array.isArray(players)) return [];

  return players
    .map((player) => ({
      id: player?.id || "",
      username: player?.username || "",
      avatarUrl: player?.avatarUrl || null,
      tagline: player?.tagline || "",
    }))
    .filter((player) => player.id && player.username);
}

export function normalizeRoomTemplateMutualPlayersResult(result) {
  if (Array.isArray(result)) {
    return {
      mutualPlayers: result,
      mutualLoadError: "",
    };
  }

  const errorValue =
    result?.mutualLoadError ||
    result?.error ||
    result?.loadError ||
    "";

  return {
    mutualPlayers:
      result?.mutualPlayers ||
      result?.players ||
      result?.mutuals ||
      result?.data?.mutuals ||
      [],
    mutualLoadError:
      typeof errorValue === "string" ? errorValue : errorValue?.message || "",
  };
}

export function normalizeRoomTemplateMutualPlayers(players, invitedPlayers) {
  const invitedIds = new Set(invitedPlayers.map((player) => player.id));
  const fallbackImageUrl = getDefaultCreationImageForType("PLAYER_CHARACTER");

  if (!Array.isArray(players)) return [];

  return players
    .map((player) => {
      const id = player?.id || "";
      const username = player?.username || "";

      return {
        id,
        username,
        tagline: player?.tagline || "",
        description: player?.description || "",
        imageUrl: player?.avatarUrl || fallbackImageUrl,
        isSelected: invitedIds.has(id),
      };
    })
    .filter((player) => player.id && player.username);
}

function toDisplayInvitee(player, statusLabel) {
  return {
    ...player,
    displayInitial: player.username.slice(0, 1).toUpperCase(),
    statusLabel,
    removeAriaLabel: `Remove ${player.username}`,
  };
}

export function getRoomTemplateMultiplayerSectionViewProps({
  form = {},
  updateDataField = null,
  mutualPlayersResult = [],
} = {}) {
  const data = form?.data || {};
  const invitedPlayers = normalizeRoomTemplateInvitedPlayers(
    data.invited_players
  );
  const normalizedMutualResult = normalizeRoomTemplateMutualPlayersResult(
    mutualPlayersResult
  );
  const effectiveTurnBased =
    Boolean(data.turn_based) || invitedPlayers.length > 0;

  function updateMultiplayerState(
    nextPlayers,
    turnBased = data.turn_based
  ) {
    const nextTurnBased = Boolean(turnBased) || nextPlayers.length > 0;

    updateDataField?.("invited_players", nextPlayers);
    updateDataField?.("turn_based", nextTurnBased);
    updateDataField?.(
      "turn_mode",
      nextTurnBased ? "TURN_BASED" : "FREEFORM"
    );
    updateDataField?.("multiplayer_enabled", nextPlayers.length > 0);
    updateDataField?.(
      "invite_status",
      nextPlayers.length > 0 ? "DRAFT_PENDING_INVITES" : "NONE"
    );
  }

  function toggleInvitedPlayer(playerId) {
    const player = normalizedMutualResult.mutualPlayers.find(
      (item) => item?.id === playerId
    );

    if (!player?.id || !player?.username) return;

    const exists = invitedPlayers.some((item) => item.id === player.id);
    const nextPlayers = exists
      ? invitedPlayers.filter((item) => item.id !== player.id)
      : [
          ...invitedPlayers,
          {
            id: player.id,
            username: player.username,
            avatarUrl: player.avatarUrl || null,
            tagline: player.tagline || "",
          },
        ];

    updateMultiplayerState(nextPlayers);
  }

  return {
    ...DEFAULT_COPY,
    effectiveTurnBased,
    turnBasedDescription: effectiveTurnBased
      ? DEFAULT_COPY.turnBasedEnabledDescription
      : DEFAULT_COPY.turnBasedDisabledDescription,
    showTurnBasedRequiredMessage: invitedPlayers.length > 0,
    invitedPlayers: invitedPlayers.map((player) =>
      toDisplayInvitee(player, DEFAULT_COPY.inviteeStatusLabel)
    ),
    mutualPlayers: normalizeRoomTemplateMutualPlayers(
      normalizedMutualResult.mutualPlayers,
      invitedPlayers
    ),
    mutualLoadError: normalizedMutualResult.mutualLoadError,
    onToggleTurnBased: () =>
      updateMultiplayerState(invitedPlayers, !data.turn_based),
    onToggleInvitedPlayer: toggleInvitedPlayer,
    onRemoveInvitedPlayer: (playerId) =>
      updateMultiplayerState(
        invitedPlayers.filter((player) => player.id !== playerId)
      ),
  };
}

export function useRoomTemplateMultiplayerSectionViewModel(props = {}) {
  const mutualPlayersResult = useMutualPlayers();

  return getRoomTemplateMultiplayerSectionViewProps({
    ...props,
    mutualPlayersResult,
  });
}
