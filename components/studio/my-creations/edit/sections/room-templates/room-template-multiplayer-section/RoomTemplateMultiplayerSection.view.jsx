import { useMemo, useState } from "react";
import { Plus, Search, Users, X } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";
import KitModalFrame from "@/components/kit/KitModalFrame";

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
  addPlayerLabel = "Add player",
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

      <div className="mt-[var(--space-6)] grid gap-[var(--space-5)]">
        {/* 4.9 toggle: pill track plus a state word, no color-only
            state. */}
        <div>
          <button
            type="button"
            onClick={() => onToggleTurnBased?.()}
            aria-pressed={effectiveTurnBased}
            className="flex w-full items-center gap-[var(--space-4)] text-left"
          >
            <span
              className={`relative inline-flex h-[var(--control-sm)] w-[calc(var(--control-sm)*1.8)] flex-none items-center rounded-[var(--radius-full)] border transition-colors ${
                effectiveTurnBased
                  ? "border-[var(--gold-action)] bg-[var(--gold-action)]"
                  : "border-[var(--line)] bg-[var(--surface-1)]"
              }`}
            >
              <span
                className={`inline-block h-[calc(var(--control-sm)-4px)] w-[calc(var(--control-sm)-4px)] rounded-full bg-[var(--tag-fill-ink)] transition-transform ${
                  effectiveTurnBased
                    ? "translate-x-[calc(var(--control-sm)*0.8)]"
                    : "translate-x-[2px]"
                }`}
              />
            </span>

            <span>
              <span className="flex items-baseline gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                {turnBasedLabel}
                <span className="normal-case tracking-normal text-[var(--ink-dim)]">
                  {effectiveTurnBased ? "On" : "Off"}
                </span>
              </span>

              <span className="mt-[var(--space-1)] block text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                {turnBasedDescription}
              </span>

              {showTurnBasedRequiredMessage ? (
                <span className="mt-[var(--space-1)] block text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-faint)]">
                  {turnBasedRequiredMessage}
                </span>
              ) : null}
            </span>
          </button>
        </div>

        {/* Section 5 de-nesting: the inset-hairline sub-group pattern
            instead of a second bordered/backgrounded surface-2 box. */}
        <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
            <div>
              <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                {inviteesLabel}
              </p>
              <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                {inviteesDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="cf-btn cf-btn--primary cf-btn--sm"
            >
              <Plus size={14} />
              {addPlayerLabel}
            </button>
          </div>

          {mutualLoadError ? (
            <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--status-danger)]">
              {mutualLoadError}
            </p>
          ) : null}

          <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
            {invitedPlayers.length ? (
              invitedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]"
                >
                  <div className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center overflow-hidden rounded-full border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 text-[length:var(--text-body)] text-[var(--gold-ornament)]">
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
                    <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                      @{player.username}
                    </p>
                    <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                      {player.statusLabel || inviteeStatusLabel}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveInvitedPlayer?.(player.id)}
                    className="cf-btn cf-btn--danger cf-btn--sm"
                    aria-label={player.removeAriaLabel}
                  >
                    <X size={14} />
                    <span className="text-[10px]">Remove</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
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

// Ruling 3 (ED1G): hand-rolled fixed-inset overlay retired onto
// KitModalFrame. LARGE width tier (section 8, featured-image-picker
// exception): a media grid of player avatar cards. B4 selected
// recipe (--fill-whisper fill, no inset shadow ring); tier scale
// corrected on the title, card titles, and empty state.
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
    <KitModalFrame onClose={onClose} panelClassName="max-w-4xl" ariaLabel={pickerTitle}>
      <div className="flex max-h-[92dvh] flex-col">
        <div className="border-b border-[var(--line-fade)] p-[var(--space-5)]">
          <p className="mb-[var(--space-1)] inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            <Users size={15} />
            {pickerEyebrow}
          </p>

          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading-m)] leading-[var(--lh-heading-m)] min-[700px]:text-[length:var(--text-heading)] min-[700px]:leading-[var(--lh-heading)]">
            {pickerTitle}
          </h2>

          <p className="mt-[var(--space-2)] max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {pickerDescription}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-[var(--space-5)] pb-[var(--space-6)]">
          <div className="flex min-h-[var(--control-md)] items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)]">
            <Search size={16} className="text-[var(--ink-faint)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={pickerSearchPlaceholder}
              className="w-full bg-transparent text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
          </div>

          <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPlayers.length ? (
              filteredPlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => onTogglePlayer?.(player.id)}
                  className={`overflow-hidden rounded-[var(--radius-md)] border text-left transition ${
                    player.isSelected
                      ? "border-[var(--gold-action)] bg-[var(--fill-whisper)]"
                      : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] hover:border-[var(--state-hover-line)]"
                  }`}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[var(--surface-2)]">
                    <img
                      src={player.imageUrl}
                      alt={player.username}
                      className="h-full w-full object-cover opacity-90"
                    />
                  </div>

                  <div className="p-[var(--space-4)]">
                    <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
                      {player.username}
                    </p>

                    <p className="mt-[var(--space-2)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                      {player.tagline || "Mutual follower"}
                    </p>

                    <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-2)]">
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
              <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] p-[var(--space-8)] text-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="text-[length:var(--text-heading-m)] leading-[var(--lh-heading-m)] font-display">
                  {pickerEmptyTitle}
                </p>
                <p className="mx-auto mt-[var(--space-3)] max-w-xl text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                  {pickerEmptyDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </KitModalFrame>
  );
}
