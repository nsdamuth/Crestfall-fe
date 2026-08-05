import {
  Plus,
  X,
} from "lucide-react";

export default function InvitedPlayersPanelView({
  invitedPlayers = [],
  loadError = "",
  onOpenPlayerPicker,
  onRemovePlayer,
} = {}) {
  const players = Array.isArray(invitedPlayers) ? invitedPlayers : [];

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            Multiplayer Invitees
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Only mutual followers can be selected. Invites will require approval later.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenPlayerPicker?.()}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          <Plus size={14} />
          Add Player
        </button>
      </div>

      {loadError ? (
        <p className="mt-3 text-sm text-red-200">{loadError}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        {players.length ? (
          players.map((player, index) => (
            <div
              key={player.id || `${player.username}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 p-3"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 font-display text-lg text-[var(--muted-gold)]">
                {player.avatarUrl ? (
                  <img
                    src={player.avatarUrl}
                    alt={player.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  player.displayInitial
                )}
              </div>

              <div>
                <p className="text-sm text-[var(--foreground)]">
                  @{player.username}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  Pending invite later
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemovePlayer?.(player.id)}
                className="rounded-[var(--radius-md)] border border-white/10 p-1 text-[var(--muted)] transition hover:text-[var(--status-danger)]"
                aria-label={`Remove ${player.username}`}
              >
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">
            No multiplayer invitees selected.
          </p>
        )}
      </div>
    </div>
  );
}
