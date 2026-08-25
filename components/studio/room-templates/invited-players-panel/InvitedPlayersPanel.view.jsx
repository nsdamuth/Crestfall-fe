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
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Multiplayer Invitees
          </p>
          <p className="mt-1 text-sm text-[var(--ink-dim)]">
            Only mutual followers can be selected. Invites will require approval later.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenPlayerPicker?.()}
          className="cf-btn cf-btn--primary"
        >
          <Plus size={14} />
          Add player
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
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 font-display text-lg text-[var(--gold-ornament)]">
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
                <p className="text-sm text-[var(--ink)]">
                  @{player.username}
                </p>
                <p className="text-xs text-[var(--ink-dim)]">
                  Pending invite later
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemovePlayer?.(player.id)}
                className="cf-btn cf-btn--danger cf-btn--sm"
                aria-label={`Remove ${player.username}`}
              >
                <X size={14} />
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--ink-dim)]">
            No multiplayer invitees selected.
          </p>
        )}
      </div>
    </div>
  );
}
