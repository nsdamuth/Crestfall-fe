"use client";

import {
  Archive,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";

export default function StoryRoomsHubView({
  filters = [],
  activeFilter = "ACTIVE",
  activeFilterLabel = "Active",
  query = "",
  viewMode = "grid",
  mobileToolsOpen = false,
  manageMode = false,
  deletingRooms = false,
  selectedCount = 0,
  canDeleteSelected = false,
  visibleRooms = [],
  hasRooms = false,
  latestRoomHref = "",
  createTemplateHref = "/studio/create/room-template",
  loadError = "",
  deleteError = "",
  showLoading = false,
  showEmpty = false,
  libraryEyebrow = "Room Library",
  libraryDescription =
    "Storys are active playable sessions. Stories are reusable setups that package characters, scenarios, narrators, and openings.",
  desktopSearchPlaceholder =
    "Search rooms, scenarios, narrators, cast...",
  mobileSearchPlaceholder = "Search rooms...",
  loadingTitle = "Loading Storys",
  loadingMessage = "Crestfall is loading your active story sessions.",
  emptyTitle = "No rooms found",
  emptyMessage =
    "Active Storys and reusable stories will appear here once the backend is connected.",
  onToggleMobileTools = null,
  onQueryChange = null,
  onActiveFilterChange = null,
  onViewModeChange = null,
  onToggleManageMode = null,
  onToggleRoomSelection = null,
  onDeleteSelectedRooms = null,
  InternalLinkComponent = "a",
  ViewModeToggleComponent = null,
}) {
  const safeFilters = Array.isArray(filters) ? filters : [];
  const safeRooms = Array.isArray(visibleRooms) ? visibleRooms : [];

  return (
    <section className="mt-4 md:mt-8">
      <MobileStoryRoomsDrawer
        open={mobileToolsOpen}
        onToggle={onToggleMobileTools}
        query={query}
        onQueryChange={onQueryChange}
        filters={safeFilters}
        activeFilter={activeFilter}
        activeFilterLabel={activeFilterLabel}
        onActiveFilterChange={onActiveFilterChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        createTemplateHref={createTemplateHref}
        mobileSearchPlaceholder={mobileSearchPlaceholder}
        InternalLinkComponent={InternalLinkComponent}
        ViewModeToggleComponent={ViewModeToggleComponent}
      />

      <div className="hidden md:block">
        <div className="rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
                {libraryEyebrow}
              </p>
              <p className="mt-2 max-w-3xl leading-7 text-[var(--ink-dim)]">
                {libraryDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <InternalLinkComponent
                href={createTemplateHref}
                className="inline-flex h-[var(--control-md)] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:shadow-[var(--glow-hover)]"
              >
                <BookOpen size={14} />
                New Template
              </InternalLinkComponent>

              {hasRooms && latestRoomHref ? (
                <InternalLinkComponent
                  href={latestRoomHref}
                  className="inline-flex h-[var(--control-md)] items-center gap-2 rounded-[var(--radius-md)] bg-[var(--gold-action)] bg-[image:var(--grad-gold)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--tag-fill-ink)] transition hover:shadow-[var(--glow-hover)]"
                >
                  <Plus size={14} />
                  Open Latest Room
                </InternalLinkComponent>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-[var(--control-md)] items-center gap-2 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--ink-dim)] opacity-60"
                >
                  <Plus size={14} />
                  No Rooms Yet
                </button>
              )}

              {/* SKIPPED: the Manage/Delete Selected destructive red below is
                  left as raw Tailwind red, not --status-danger. Ruling 2 in
                  RESTYLE-RULES.md states the danger button treatment is
                  "not applied anywhere in this pass" for any package's
                  buttons; only geometry (height/padding/radius/type) is
                  brought into conformance here, not the color. */}
              <button
                type="button"
                onClick={onToggleManageMode || undefined}
                className={`inline-flex h-[var(--control-md)] items-center gap-2 rounded-[var(--radius-md)] border px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold transition ${
                  manageMode
                    ? "border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/15"
                    : "border-[var(--line-strong)] text-[var(--gold-action)] hover:shadow-[var(--glow-hover)]"
                }`}
              >
                <Trash2 size={14} />
                {manageMode ? "Cancel Manage" : "Manage"}
              </button>

              {manageMode ? (
                <button
                  type="button"
                  onClick={onDeleteSelectedRooms || undefined}
                  disabled={!canDeleteSelected}
                  className="inline-flex h-[var(--control-md)] items-center gap-2 rounded-[var(--radius-md)] border border-red-400/30 bg-red-400/10 px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-red-200 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {deletingRooms
                    ? "Deleting..."
                    : selectedCount
                      ? `Delete Selected (${selectedCount})`
                      : "Delete Selected"}
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex min-h-[var(--control-md)] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)]">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={query}
              onChange={(event) => onQueryChange?.(event.target.value)}
              placeholder={desktopSearchPlaceholder}
              className="w-full bg-transparent text-[length:var(--text-body)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {safeFilters.map((filter) => (
                <PillButton
                  key={filter.id}
                  active={filter.id === activeFilter}
                  onClick={() => onActiveFilterChange?.(filter.id)}
                >
                  {filter.label}
                </PillButton>
              ))}
            </div>

            {ViewModeToggleComponent ? (
              <ViewModeToggleComponent
                value={viewMode}
                onChange={onViewModeChange}
                label="View"
              />
            ) : null}
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="mt-4 rounded-2xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-5 text-sm leading-6 text-[var(--status-danger)] md:mt-6">
          {loadError}
        </div>
      ) : null}

      {deleteError ? (
        <div className="mt-4 rounded-2xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-5 text-sm leading-6 text-[var(--status-danger)] md:mt-6">
          {deleteError}
        </div>
      ) : null}

      {showLoading ? (
        <div className="mt-4 rounded-[var(--radius-lg)] border border-[var(--line-strong)] p-[var(--space-8)] text-center md:mt-6">
          <Sparkles className="mx-auto text-[var(--gold-ornament)]" size={28} />
          <p className="mt-4 font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] tabular-nums">
            {loadingTitle}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {loadingMessage}
          </p>
        </div>
      ) : safeRooms.length ? (
        viewMode === "grid" ? (
          <div className="mt-[var(--space-5)] grid gap-[var(--space-3)] xl:grid-cols-2">
            {safeRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                manageMode={manageMode}
                onToggleSelect={onToggleRoomSelection}
                InternalLinkComponent={InternalLinkComponent}
              />
            ))}
          </div>
        ) : (
          <RoomList
            rooms={safeRooms}
            manageMode={manageMode}
            onToggleSelect={onToggleRoomSelection}
            InternalLinkComponent={InternalLinkComponent}
          />
        )
      ) : showEmpty ? (
        <div className="mt-[var(--space-5)]">
          <EmptyRoomsState title={emptyTitle} message={emptyMessage} />
        </div>
      ) : null}
    </section>
  );
}

function MobileStoryRoomsDrawer({
  open,
  onToggle,
  query,
  onQueryChange,
  filters,
  activeFilter,
  activeFilterLabel,
  onActiveFilterChange,
  viewMode,
  onViewModeChange,
  createTemplateHref,
  mobileSearchPlaceholder,
  InternalLinkComponent,
  ViewModeToggleComponent,
}) {
  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={onToggle || undefined}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--gold-ornament)]/25 bg-black/45 px-4 py-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
            <SlidersHorizontal size={18} />
          </span>

          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
              Room Controls
            </span>
            <span className="mt-1 block truncate text-sm text-[var(--ink-dim)]">
              {activeFilterLabel} · {viewMode === "list" ? "List" : "Grid"}
            </span>
          </span>
        </span>

        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-[var(--ink-dim)]" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-[var(--ink-dim)]" />
        )}
      </button>

      {/* SKIPPED: no phone-specific filter-panel shape exists in
          RESTYLE-RULES.md ("Filter panels" OPEN item) — this drawer's own
          rounded-2xl/border/bg chrome is left untouched; only legacy
          bridge variable names were substituted for real tokens. */}
      {open ? (
        <div className="mt-3 space-y-4 rounded-2xl border border-white/10 bg-black/45 p-4">
          <div className="flex min-h-[var(--control-md)] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)]">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={query}
              onChange={(event) => onQueryChange?.(event.target.value)}
              placeholder={mobileSearchPlaceholder}
              className="w-full bg-transparent text-[length:var(--text-body)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
          </div>

          {ViewModeToggleComponent ? (
            <ViewModeToggleComponent
              value={viewMode}
              onChange={onViewModeChange}
              label="View"
            />
          ) : null}

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <PillButton
                key={filter.id}
                active={filter.id === activeFilter}
                onClick={() => onActiveFilterChange?.(filter.id)}
              >
                {filter.label}
              </PillButton>
            ))}
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              disabled
              className="inline-flex h-[var(--control-md)] items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--ink-dim)] opacity-60"
            >
              <Plus size={14} />
              Start Room Soon
            </button>

            <InternalLinkComponent
              href={createTemplateHref}
              className="inline-flex h-[var(--control-md)] items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:shadow-[var(--glow-hover)]"
            >
              <BookOpen size={14} />
              New Template
            </InternalLinkComponent>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RoomList({
  rooms,
  manageMode,
  onToggleSelect,
  InternalLinkComponent,
}) {
  return (
    <div className="mt-[var(--space-5)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)]">
      {rooms.map((room, index) => (
        <RoomListRow
          key={room.id}
          room={room}
          isLast={index === rooms.length - 1}
          manageMode={manageMode}
          onToggleSelect={onToggleSelect}
          InternalLinkComponent={InternalLinkComponent}
        />
      ))}
    </div>
  );
}

function RoomListRow({
  room,
  isLast,
  manageMode,
  onToggleSelect,
  InternalLinkComponent,
}) {
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
        {/* SKIPPED: the manage-mode selection checkmark below keeps its raw
            red-300/black fill — this is the solid-fill treatment Ruling 2
            explicitly reserves for the not-yet-applied danger button
            variant ("not applied anywhere in this pass"), so it is left
            untouched rather than mapped to --status-danger. */}
        {manageMode ? (
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
              room.selected
                ? "border-red-300 bg-red-300 text-black"
                : "border-red-300/70 bg-black/20"
            }`}
          >
            {room.selected ? "✓" : ""}
          </span>
        ) : (
          <MessageSquare size={19} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] font-medium tabular-nums text-[var(--ink)]">
            {room.title}
          </h2>

          {room.status === "ACTIVE" ? (
            <span className="hidden h-[var(--space-6)] shrink-0 items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] font-medium text-[var(--ink-dim)] sm:inline-flex">
              Active
            </span>
          ) : null}
        </div>

        <p className="mt-0.5 truncate text-xs uppercase tracking-[0.14em] text-[var(--gold-ornament)]/80">
          {room.subtitle}
        </p>

        <p className="mt-1 line-clamp-1 text-sm leading-5 text-[var(--ink-dim)]">
          {room.lastMessage}
        </p>

        <div className="mt-1.5 flex min-w-0 items-center gap-3 text-[11px] text-[var(--ink-dim)]">
          <span className="shrink-0">{room.lastActive}</span>

          <span className="inline-flex shrink-0 items-center gap-1">
            <MessageSquare size={12} />
            {room.messages}
          </span>

          <span className="hidden min-w-0 truncate sm:inline">
            {room.type}
          </span>
        </div>
      </div>
    </>
  );

  const className = `group flex items-center gap-3 px-3 py-3 transition hover:bg-[var(--gold-ornament)]/10 sm:gap-4 sm:px-4 ${
    isLast ? "" : "border-b border-[var(--line-whisper)]"
  } ${room.selected ? "bg-red-400/10" : ""}`;

  if (manageMode) {
    return (
      <button
        type="button"
        onClick={() => onToggleSelect?.(room.id)}
        className={`${className} w-full text-left`}
      >
        {content}
      </button>
    );
  }

  return (
    <InternalLinkComponent href={room.href} className={className}>
      {content}
    </InternalLinkComponent>
  );
}

function RoomCard({
  room,
  manageMode,
  onToggleSelect,
  InternalLinkComponent,
}) {
  const content = (
    <article className="grid gap-0 md:grid-cols-[180px_1fr]">
      <div className="aspect-[4/5] bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10 md:aspect-auto">
        <div className="flex h-full min-h-[220px] w-full items-center justify-center">
          <div className="text-center">
            {/* SKIPPED: the manage-mode selection checkmark below keeps its
                raw red-300/black fill — see the SKIPPED note in RoomListRow;
                this is the not-yet-applied danger-button solid-fill
                treatment (Ruling 2), left untouched. */}
            {manageMode ? (
              <span
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border ${
                  room.selected
                    ? "border-red-300 bg-red-300 text-black"
                    : "border-red-300/70 bg-black/20 text-red-200"
                }`}
              >
                {room.selected ? "✓" : ""}
              </span>
            ) : (
              <MessageSquare
                className="mx-auto text-[var(--gold-ornament)]"
                size={34}
              />
            )}
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              {manageMode ? "Select Room" : room.type}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={room.visibility} />
          <StatusBadge label={room.contentRating} />
          <StatusBadge label={room.status} />
        </div>

        <h2 className="mt-4 font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] font-medium tabular-nums">
          {room.title}
        </h2>

        <p className="mt-1 text-sm uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          {room.subtitle}
        </p>

        <p className="mt-4 line-clamp-2 leading-7 text-[var(--ink-dim)]">
          {room.lastMessage}
        </p>

        <div className="mt-5 grid gap-2 text-xs text-[var(--ink-dim)]">
          <p className="inline-flex items-center gap-2">
            <BookOpen size={14} />
            {room.scenario}
          </p>

          <p className="inline-flex items-center gap-2">
            <Sparkles size={14} />
            {room.narrator}
          </p>

          <p className="inline-flex items-center gap-2">
            <MapPin size={14} />
            {room.location}
          </p>

          <p className="inline-flex items-center gap-2">
            <Users size={14} />
            {room.cast.join(", ")}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[var(--ink-dim)]">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} />
            {room.lastActive}
          </span>

          <span className="inline-flex items-center gap-1">
            <MessageSquare size={14} />
            {room.messages} messages
          </span>
        </div>
      </div>
    </article>
  );

  // SKIPPED: room.selected's red bed below keeps raw Tailwind red — tied
  // to the same manage/delete affordance as the buttons above, left
  // untouched per Ruling 2 rather than mapped to --status-danger.
  const className = `group overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] transition hover:-translate-y-1 ${
    room.selected
      ? "border-red-300/45 bg-red-400/10"
      : "border-[var(--line)] hover:border-[var(--gold-action)]"
  }`;

  if (manageMode) {
    return (
      <button
        type="button"
        onClick={() => onToggleSelect?.(room.id)}
        className={`${className} text-left`}
      >
        {content}
      </button>
    );
  }

  return (
    <InternalLinkComponent href={room.href} className={className}>
      {content}
    </InternalLinkComponent>
  );
}

function StatusBadge({ label }) {
  return (
    <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] font-medium text-[var(--ink-dim)]">
      {label}
    </span>
  );
}

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
        active
          ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyRoomsState({ title, message }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] p-[var(--space-8)] text-center xl:col-span-2">
      <Archive className="mx-auto text-[var(--gold-ornament)]" size={32} />
      <p className="mt-4 font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] tabular-nums">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {message}
      </p>
    </div>
  );
}
