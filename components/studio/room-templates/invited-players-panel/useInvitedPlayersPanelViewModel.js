function normalizeInvitedPlayer(player) {
  const username = String(player?.username || "Unknown player");
  const avatarUrl = player?.avatarUrl ? String(player.avatarUrl) : null;

  return {
    id: String(player?.id || ""),
    username,
    avatarUrl,
    displayInitial: username.slice(0, 1).toUpperCase() || "?",
  };
}

export function useInvitedPlayersPanelViewModel({
  invitedPlayers = [],
  onOpen,
  onRemove,
  mutualLoadError,
} = {}) {
  const normalizedPlayers = Array.isArray(invitedPlayers)
    ? invitedPlayers.map(normalizeInvitedPlayer)
    : [];

  return {
    invitedPlayers: normalizedPlayers,
    loadError: mutualLoadError ? String(mutualLoadError) : "",
    onOpenPlayerPicker: () => onOpen?.(),
    onRemovePlayer: (playerId) => {
      if (!playerId) {
        return;
      }

      onRemove?.(playerId);
    },
  };
}
