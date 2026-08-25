"use client";

import { Search, UserPlus } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

function FilterChip({ chip, active, onSelectFilter }) {
  return (
    <button
      type="button"
      onClick={() => onSelectFilter?.(chip.value)}
      aria-pressed={active}
      className={`inline-flex h-[var(--control-filter)] touch-manipulation items-center rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition [@media(pointer:coarse)]:h-[var(--control-md)] ${
        active
          ? "border-[var(--gold-action)]/55 bg-[var(--fill)] text-[var(--gold-bright)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
      }`}
    >
      {chip.label}
    </button>
  );
}

function RosterRow({ row, atCap, onAddMember, onRemoveMember }) {
  const disabledAdd = atCap && !row.inParty;

  return (
    <div className="flex min-h-[var(--control-md)] items-center gap-[var(--space-3)] rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-2)] transition hover:bg-[var(--state-hover-fill)]">
      <span
        aria-hidden="true"
        className="flex h-[var(--control-filter)] w-[var(--control-filter)] shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--chat-avatar-fill)]"
        style={row.color ? { "--chat-speaker": row.color } : undefined}
      >
        {row.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-[length:var(--text-ui)] text-[var(--chat-speaker-name)]">
            {row.fallbackInitial || "?"}
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[length:var(--text-ui)] text-[var(--ink)]">{row.name}</p>
        {row.role ? (
          <p className="mt-[2px] truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
            {row.role}
          </p>
        ) : null}
      </div>

      {row.inParty ? (
        <div className="flex shrink-0 flex-col items-end gap-[var(--space-1)]">
          <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            In party
          </span>
          <button
            type="button"
            onClick={() => onRemoveMember?.(row.id)}
            className="text-[length:var(--text-label)] text-[var(--ink-faint)] underline-offset-2 hover:text-[var(--status-danger)] hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 flex-col items-end gap-[var(--space-1)]">
          <button
            type="button"
            onClick={() => onAddMember?.(row.id)}
            disabled={disabledAdd}
            className="inline-flex h-[var(--control-sm)] touch-manipulation items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
          >
            <UserPlus size={13} aria-hidden="true" />
            Add
          </button>
          {disabledAdd ? (
            <span className="text-[length:var(--text-label)] text-[var(--ink-faint)]">Party full</span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function ChatPartyRosterView({
  title = "Party",
  slotCountLabel = "",
  searchValue = "",
  searchPlaceholder = "Search characters and NPCs",
  filterChips = [],
  activeFilter = "all",
  sortLabel = "Recent",
  rows = [],
  atCap = false,
  loading = false,
  errorMessage = "",
  onClose = null,
  onChangeSearch = null,
  onSelectFilter = null,
  onAddMember = null,
  onRemoveMember = null,
}) {
  const safeChips = Array.isArray(filterChips) ? filterChips : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-[560px]"
      onClose={onClose}
      ariaLabel={title}
    >
      <div className="p-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {title}
        </p>
        {slotCountLabel ? (
          <p className="mt-[var(--space-1)] text-[length:var(--text-label)] text-[var(--ink-dim)]">{slotCountLabel}</p>
        ) : null}

        <div className="relative mt-[var(--space-4)]">
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-[var(--space-3)] top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onChangeSearch?.(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-[var(--control-md)] w-full rounded-[var(--radius-md)] bg-[var(--bed-deep)] pl-[var(--space-10)] pr-[var(--space-3)] text-[length:var(--text-input)] leading-[var(--lh-input)] text-[var(--ink-typed)] shadow-[var(--shadow-bed)] outline-none placeholder:text-[var(--ink-faint)]"
          />
        </div>

        <div className="mt-[var(--space-3)] flex flex-wrap items-center justify-between gap-[var(--space-2)]">
          <div className="flex flex-wrap gap-[var(--space-2)]">
            {safeChips.map((chip) => (
              <FilterChip key={chip.value} chip={chip} active={activeFilter === chip.value} onSelectFilter={onSelectFilter} />
            ))}
          </div>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            Sort: {sortLabel}
          </p>
        </div>

        <div className="mt-[var(--space-4)] max-h-[50vh] overflow-y-auto">
          {loading ? (
            <p className="py-[var(--space-6)] text-center text-[length:var(--text-body)] text-[var(--ink-dim)]">
              Loading roster
            </p>
          ) : errorMessage ? (
            <p className="py-[var(--space-6)] text-center text-[length:var(--text-body)] text-[var(--status-danger)]" role="alert">
              {errorMessage}
            </p>
          ) : safeRows.length ? (
            <div className="space-y-[var(--space-1)]">
              {safeRows.map((row) => (
                <RosterRow key={row.id} row={row} atCap={atCap} onAddMember={onAddMember} onRemoveMember={onRemoveMember} />
              ))}
            </div>
          ) : (
            <p className="py-[var(--space-6)] text-center text-[length:var(--text-body)] text-[var(--ink-dim)]">
              No matches for this search.
            </p>
          )}
        </div>
      </div>
    </KitModalFrame>
  );
}
