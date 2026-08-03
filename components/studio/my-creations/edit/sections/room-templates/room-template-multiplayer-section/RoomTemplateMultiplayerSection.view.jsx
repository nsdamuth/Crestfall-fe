import { useMemo, useState } from "react";
import { Plus, Search, Users, X } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function RoomTemplateMultiplayerSectionView({
  sectionEyebrow = "Story Editor",
  sectionTitle = "Players and Turn Order",
  sectionDescription = "",
  turnBasedLabel = "Turn-Based Room",
  effectiveTurnBased = false,
  turnBasedDescription = "",
  showTurnBasedRequiredMessage = false,
  turnBasedRequiredMessage = "",
  inviteesLabel = "Multiplayer Invitees",
  inviteesDescription = "",
  addPlayerLabel = "Add Player",
  invitedPlayers = [],
  inviteeStatusLabel = "Pending invite later",
  emptyInviteesMessage = "No multiplayer invitees selected.",
  mutualLoadError = "",
  mutualPlayers = [],
  pickerEyebrow = "Multiplayer Picker",
  pickerTitle = "Select Players",
  pickerDescription = "",
  pickerSearchPlaceholder = "Search mutual followers...",
  pickerUserLabel = "User",
  pickerSelectedLabel = "Selected",
  pickerEmptyTitle = "No mutual followers found",
  pickerEmptyDescription = "",
  onToggleTurnBased = null,
  onToggleInvitedPlayer = null,
  onRemoveInvitedPlayer = null,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-5">
        <button
          type="button"
          onClick={() => onToggleTurnBased?.()}
          className={`rounded-2xl border p-5 text-left transition ${
            effectiveTurnBased
              ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
              : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            {turnBasedLabel}
          </p>

          <p className="mt-2 text-sm leading-6">{turnBasedDescription}</p>

          {showTurnBasedRequiredMessage ? (
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              {turnBasedRequiredMessage}
            </p>
          ) : null}
        </button>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                {inviteesLabel}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {inviteesDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
            >
              <Plus size={14} />
              {addPlayerLabel}
            </button>
          </div>

          {mutualLoadError ? (
            <p className="mt-3 text-sm text-red-200">{mutualLoadError}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            {invitedPlayers.length ? (
              invitedPlayers.map((player) => (
                <div
                  key={player.id}
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
                      {player.statusLabel || inviteeStatusLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveInvitedPlayer?.(player.id)}
                    className="rounded-lg border border-white/10 p-1 text-[var(--muted)] transition hover:text-red-200"
                    aria-label={player.removeAriaLabel}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">
                {emptyInviteesMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {pickerOpen ? (
        <PlayerPickerModal
          mutualPlayers={mutualPlayers}
          pickerEyebrow={pickerEyebrow}
          pickerTitle={pickerTitle}
          pickerDescription={pickerDescription}
          pickerSearchPlaceholder={pickerSearchPlaceholder}
          pickerUserLabel={pickerUserLabel}
          pickerSelectedLabel={pickerSelectedLabel}
          pickerEmptyTitle={pickerEmptyTitle}
          pickerEmptyDescription={pickerEmptyDescription}
          onTogglePlayer={onToggleInvitedPlayer}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  );
}

function PlayerPickerModal({
  mutualPlayers = [],
  pickerEyebrow = "Multiplayer Picker",
  pickerTitle = "Select Players",
  pickerDescription = "",
  pickerSearchPlaceholder = "Search mutual followers...",
  pickerUserLabel = "User",
  pickerSelectedLabel = "Selected",
  pickerEmptyTitle = "No mutual followers found",
  pickerEmptyDescription = "",
  onTogglePlayer = null,
  onClose = null,
}) {
  const [query, setQuery] = useState("");

  const filteredPlayers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return mutualPlayers.filter((player) => {
      if (!normalized) return true;

      return [player.username, player.tagline, player.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [mutualPlayers, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              <Users size={15} />
              {pickerEyebrow}
            </p>

            <h2 className="mt-2 font-display text-4xl">{pickerTitle}</h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {pickerDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={pickerSearchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          <div className="mt-5 grid max-h-[62vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlayers.length ? (
              filteredPlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => onTogglePlayer?.(player.id)}
                  className={`overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1 ${
                    player.isSelected
                      ? "border-[var(--muted-gold)]/65 bg-[var(--muted-gold)]/15"
                      : "border-white/10 bg-black/35 hover:border-[var(--muted-gold)]/35"
                  }`}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
                    <img
                      src={player.imageUrl}
                      alt={player.username}
                      className="h-full w-full object-cover opacity-90"
                    />
                  </div>

                  <div className="p-4">
                    <p className="font-display text-2xl leading-none text-[var(--foreground)]">
                      {player.username}
                    </p>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
                      {player.tagline || "Mutual follower"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        {pickerUserLabel}
                      </span>

                      {player.isSelected ? (
                        <span className="rounded-full border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--muted-gold)]">
                          {pickerSelectedLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="font-display text-3xl">{pickerEmptyTitle}</p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                  {pickerEmptyDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
