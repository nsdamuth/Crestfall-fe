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
          className={`rounded-[var(--radius-md)] border p-[var(--space-5)] text-left transition ${
            effectiveTurnBased
              ? "border-[var(--gold-action)] bg-[var(--surface-1)] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
              : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            {turnBasedLabel}
          </p>

          <p className="mt-2 text-sm leading-6">{turnBasedDescription}</p>

          {showTurnBasedRequiredMessage ? (
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              {turnBasedRequiredMessage}
            </p>
          ) : null}
        </button>

        <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-5)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                {inviteesLabel}
              </p>
              <p className="mt-1 text-sm text-[var(--ink-dim)]">
                {inviteesDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="inline-flex h-[var(--control-sm)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-action)] transition hover:border-[var(--gold-action)] hover:text-[var(--ink)] hover:shadow-[var(--glow-hover)]"
            >
              <Plus size={14} />
              {addPlayerLabel}
            </button>
          </div>

          {mutualLoadError ? (
            <p className="mt-3 text-sm text-[var(--status-danger)]">{mutualLoadError}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-3">
            {invitedPlayers.length ? (
              invitedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]"
                >
                  <div className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center overflow-hidden rounded-full border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 font-display text-lg text-[var(--gold-ornament)]">
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
                      {player.statusLabel || inviteeStatusLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveInvitedPlayer?.(player.id)}
                    className="rounded-lg border border-white/10 p-1 text-[var(--ink-dim)] transition hover:text-[var(--status-danger)]"
                    aria-label={player.removeAriaLabel}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--ink-dim)]">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-[var(--space-3)] border-b border-[var(--line-whisper)] px-[var(--space-4)] py-[var(--space-3)]">
          <div>
            <p className="mb-[var(--space-1)] inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              <Users size={15} />
              {pickerEyebrow}
            </p>

            <h2 className="mt-2 font-display text-4xl">{pickerTitle}</h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              {pickerDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-[var(--control-md)] w-[var(--control-md)] flex-shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-4 py-3">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={pickerSearchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
            />
          </div>

          <div className="mt-[var(--space-5)] grid max-h-[62vh] gap-4 overflow-y-auto pr-[var(--space-1)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlayers.length ? (
              filteredPlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => onTogglePlayer?.(player.id)}
                  className={`overflow-hidden rounded-[var(--radius-md)] border text-left transition hover:-translate-y-[2px] hover:shadow-[var(--glow-hover)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] ${
                    player.isSelected
                      ? "border-[var(--gold-action)] bg-[var(--surface-1)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                      : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
                  }`}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-[var(--canvas)] via-[var(--canvas)]/80 to-[var(--gold-ornament)]/10">
                    <img
                      src={player.imageUrl}
                      alt={player.username}
                      className="h-full w-full object-cover opacity-90"
                    />
                  </div>

                  <div className="p-4">
                    <p className="font-display text-2xl leading-none text-[var(--ink)]">
                      {player.username}
                    </p>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
                      {player.tagline || "Mutual follower"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
                        {pickerUserLabel}
                      </span>

                      {player.isSelected ? (
                        <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]">
                          {pickerSelectedLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-1)] p-8 text-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="font-display text-3xl">{pickerEmptyTitle}</p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--ink-dim)]">
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
