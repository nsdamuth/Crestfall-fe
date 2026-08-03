"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock3,
  Crown,
  Gamepad2,
  MessageSquare,
  Play,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

function PreviewViewModeToggle({ value = "grid", onChange, label = "View" }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 p-1">
      <span className="px-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </span>
      {["grid", "list"].map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange?.(mode)}
          className={`rounded-lg px-3 py-2 text-[10px] uppercase tracking-[0.14em] ${
            value === mode
              ? "bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
              : "text-[var(--muted)]"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}

export default function GamesHubView({
  mobileToolsOpen = false,
  activeFilter = "ALL",
  query = "",
  viewMode = "grid",
  startingGameId = null,
  playError = "",
  loading = false,
  loadError = "",
  filters = [],
  filteredGames = [],
  continueGames = [],
  featuredGames = [],
  onToggleMobileTools,
  onQueryChange,
  onActiveFilterChange,
  onViewModeChange,
  onGameAction,
  ViewModeToggleComponent = PreviewViewModeToggle,
}) {
  return (
    <section className="mt-4 md:mt-8">
      <MobileGamesDrawer
        open={mobileToolsOpen}
        onToggle={onToggleMobileTools}
        query={query}
        setQuery={onQueryChange}
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={onActiveFilterChange}
        viewMode={viewMode}
        setViewMode={onViewModeChange}
        continueGames={continueGames}
        featuredGames={featuredGames}
        onGameAction={onGameAction}
        startingGameId={startingGameId}
        ViewModeToggleComponent={ViewModeToggleComponent}
      />

      <div className="hidden md:block">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              Start Playing
            </p>

            <h2 className="mt-2 font-display text-4xl">
              Official stories and playable rooms
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-[var(--muted)]">
              Games are curated playable experiences. Some are official canon,
              some are canon-compatible community rooms, and some are pure
              community sandbox play.
            </p>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
              <Search size={16} className="text-[var(--muted-gold)]" />
              <input
                value={query}
                onChange={(event) => onQueryChange?.(event.target.value)}
                placeholder="Search games, scenarios, narrators, cast..."
                className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
              />
            </div>

            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
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

              <ViewModeToggleComponent
                value={viewMode}
                onChange={onViewModeChange}
                label="View"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              Continue
            </p>

            <h2 className="mt-2 font-display text-3xl">Active Chronicle</h2>

            {continueGames.length ? (
              <div className="mt-5 space-y-3">
                {continueGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => onGameAction?.(game)}
                    disabled={startingGameId === game.id}
                    className="block w-full rounded-xl border border-white/10 bg-black/25 p-3 text-left disabled:cursor-wait disabled:opacity-60"
                  >
                    <p className="font-display text-2xl">{game.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]">
                      {game.scenario}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                      {game.description}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
                Active official sessions will appear here once play state
                exists.
              </p>
            )}
          </div>
        </div>

        <CanonLegend />

        {activeFilter === "ALL" && !query.trim() ? (
          <FeaturedRail
            games={featuredGames}
            onPlay={onGameAction}
            startingGameId={startingGameId}
          />
        ) : null}
      </div>

      {loadError ? (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm leading-6 text-red-100 md:mt-6">
          {loadError}
        </div>
      ) : null}

      {playError ? (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm leading-6 text-red-100 md:mt-6">
          {playError}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-8 text-center md:mt-6">
          <Sparkles className="mx-auto text-[var(--muted-gold)]" size={28} />
          <p className="mt-4 font-display text-3xl">Loading Games</p>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--muted)]">
            Crestfall is loading playable Story Templates.
          </p>
        </div>
      ) : filteredGames.length ? (
        viewMode === "grid" ? (
          <div className="mt-4 grid gap-5 xl:grid-cols-2 md:mt-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={onGameAction}
                starting={startingGameId === game.id}
              />
            ))}
          </div>
        ) : (
          <GameList
            games={filteredGames}
            onPlay={onGameAction}
            startingGameId={startingGameId}
          />
        )
      ) : (
        <div className="mt-4 md:mt-6">
          <EmptyGamesState />
        </div>
      )}
    </section>
  );
}


function MobileGamesDrawer({
  open,
  onToggle,
  query,
  setQuery,
  filters,
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
  continueGames,
  featuredGames,
  onGameAction,
  startingGameId,
  ViewModeToggleComponent = PreviewViewModeToggle,
}) {
  const activeFilterLabel =
    filters.find((filter) => filter.id === activeFilter)?.label || "All";

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--muted-gold)]/25 bg-black/45 px-4 py-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]">
            <SlidersHorizontal size={18} />
          </span>

          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Browse Controls
            </span>
            <span className="mt-1 block truncate text-sm text-[var(--muted)]">
              {activeFilterLabel} · {viewMode === "list" ? "List" : "Grid"}
            </span>
          </span>
        </span>

        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-[var(--muted)]" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-[var(--muted)]" />
        )}
      </button>

      {open ? (
        <div className="mt-3 space-y-4 rounded-2xl border border-white/10 bg-black/45 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search games..."
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          <ViewModeToggleComponent value={viewMode} onChange={setViewMode} label="View" />

          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <PillButton
                key={filter.id}
                active={filter.id === activeFilter}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </PillButton>
            ))}
          </div>

          {continueGames.length ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                Continue
              </p>

              <div className="mt-3 space-y-2">
                {continueGames.slice(0, 2).map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => onGameAction?.(game)}
                    className="block w-full rounded-xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-[var(--muted-gold)]/35"
                  >
                    <p className="truncate font-display text-xl">
                      {game.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--muted)]">
                      {game.lastActive} · {game.messages} messages
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {featuredGames.length ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                Featured Starts
              </p>

              <div className="mt-3 space-y-2">
                {featuredGames.slice(0, 3).map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => onGameAction?.(game)}
                  disabled={startingGameId === game.id}
                  className="block w-full rounded-xl border border-white/10 bg-black/25 p-3 text-left disabled:cursor-wait disabled:opacity-60"
                >
                    <p className="truncate font-display text-xl">
                      {game.title}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-[var(--muted)]">
                      {game.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function GameList({ games, onPlay, startingGameId }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/30 md:mt-6">
      {games.map((game, index) => (
        <GameListRow
          key={game.id}
          game={game}
          isLast={index === games.length - 1}
          onPlay={onPlay}
          starting={startingGameId === game.id}
        />
      ))}
    </div>
  );
}

function GameListRow({ game, isLast, onPlay, starting }) {
  return (
    <article
      className={`group flex items-center gap-3 px-3 py-3 transition hover:bg-[var(--muted-gold)]/10 sm:gap-4 sm:px-4 ${
        isLast ? "" : "border-b border-white/10"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]">
        <Gamepad2 size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate font-display text-xl text-[var(--foreground)] sm:text-2xl">
            {game.title}
          </h2>

          {game.playState === "CONTINUE" ? (
            <span className="hidden shrink-0 rounded-full border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--muted-gold)] sm:inline-flex">
              Continue
            </span>
          ) : null}
        </div>

        <p className="mt-0.5 truncate text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)]/80">
          {game.subtitle}
        </p>

        <p className="mt-1 line-clamp-1 text-sm leading-5 text-[var(--muted)]">
          {game.description}
        </p>

        <div className="mt-1.5 flex min-w-0 items-center gap-3 text-[11px] text-[var(--muted)]">
          <span className="shrink-0">{game.lastActive}</span>

          <span className="inline-flex shrink-0 items-center gap-1">
            <MessageSquare size={12} />
            {game.messages}
          </span>

          <span className="hidden min-w-0 truncate sm:inline">
            {game.badge}
          </span>
        </div>
      </div>

      <div className="shrink-0">
        <button
          type="button"
          onClick={() => onPlay?.(game)}
          disabled={starting}
          className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--muted-gold)]/25 bg-black/30 px-3 text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/15 hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
        >
          <Play size={14} />
          <span className="ml-2 hidden text-[10px] uppercase tracking-[0.14em] sm:inline">
            {starting
              ? "Starting..."
              : game.playState === "CONTINUE"
                ? "Continue"
                : "Play"}
          </span>
        </button>
      </div>
    </article>
  );
}

function GameCard({ game, onPlay, starting }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-black/35 transition hover:-translate-y-1 hover:border-[var(--muted-gold)]/35">
      <div className="grid gap-0 md:grid-cols-[190px_1fr]">
        <div className="aspect-[4/5] bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10 md:aspect-auto">
          <div className="flex h-full min-h-[240px] w-full items-center justify-center">
            <div className="text-center">
              <Gamepad2
                className="mx-auto text-[var(--muted-gold)]"
                size={36}
              />
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {game.badge}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            <CanonBadge value={game.canonRelationship} />
            <StatusBadge label={game.contentRating} />
            {game.featured ? <FeaturedBadge /> : null}
            {game.playState === "CONTINUE" ? (
              <StatusBadge label="Continue" />
            ) : null}
          </div>

          <h2 className="mt-4 font-display text-3xl">{game.title}</h2>

          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-[var(--muted-gold)]">
            {game.subtitle}
          </p>

          <p className="mt-4 line-clamp-3 leading-7 text-[var(--muted)]">
            {game.description}
          </p>

          <div className="mt-5 grid gap-2 text-xs text-[var(--muted)]">
            <p className="inline-flex items-center gap-2">
              <BookOpen size={14} />
              {game.scenario}
            </p>

            <p className="inline-flex items-center gap-2">
              <Sparkles size={14} />
              {game.narrator}
            </p>

            <p className="inline-flex items-center gap-2">
              <Users size={14} />
              {game.cast.join(", ")}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)]">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={14} />
                {game.lastActive}
              </span>

              <span className="inline-flex items-center gap-1">
                <MessageSquare size={14} />
                {game.messages} messages
              </span>
            </div>

            <button
              type="button"
              onClick={() => onPlay?.(game)}
              disabled={starting}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
            >
              <Play size={14} />
              {starting
                ? "Starting..."
                : game.playState === "CONTINUE"
                  ? "Continue"
                  : "Play"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function FeaturedRail({ games, onPlay, startingGameId }) {
  if (!games.length) return null;

  return (
    <section className="mt-6 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Featured
          </p>
          <h2 className="mt-2 font-display text-3xl">Curated Starts</h2>
        </div>

        <Star className="text-[var(--muted-gold)]" size={22} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {games.slice(0, 3).map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => onPlay?.(game)}
            disabled={startingGameId === game.id}
            className="rounded-xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-[var(--muted-gold)]/35 disabled:cursor-wait disabled:opacity-60"
          >
            <CanonBadge value={game.canonRelationship} />
            <p className="mt-3 font-display text-2xl">{game.title}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
              {game.description}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function CanonLegend() {
  return (
    <div className="mt-5 grid gap-3 lg:grid-cols-3">
      <LegendCard
        title="Official Canon"
        body="Created or canon-sanctioned by Crestfall. These are official continuity experiences."
        icon={Crown}
      />

      <LegendCard
        title="Canon-Compatible"
        body="Uses canon characters, locations, or lore, but does not define official continuity."
        icon={ShieldCheck}
      />

      <LegendCard
        title="Community Sandbox"
        body="Public community rooms not tied to official canon. Useful for original, alternate, or experimental play."
        icon={Sparkles}
      />
    </div>
  );
}

function LegendCard({ title, body, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        <Icon size={14} />
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

function CanonBadge({ value }) {
  const labels = {
    OFFICIAL_CANON: "Official Canon",
    CANON_COMPATIBLE: "Canon-Compatible",
    COMMUNITY_SANDBOX: "Community Sandbox",
  };

  const styles = {
    OFFICIAL_CANON:
      "border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]",
    CANON_COMPATIBLE:
      "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    COMMUNITY_SANDBOX:
      "border-sky-400/25 bg-sky-400/10 text-sky-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em] ${
        styles[value] || "border-white/10 bg-black/35 text-[var(--muted)]"
      }`}
    >
      {labels[value] || value}
    </span>
  );
}

function FeaturedBadge() {
  return (
    <span className="rounded-full border border-pink-400/25 bg-pink-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-pink-200">
      Featured
    </span>
  );
}

function StatusBadge({ label }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
      {label}
    </span>
  );
}

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
        active
          ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
          : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyGamesState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center xl:col-span-2">
      <Gamepad2 className="mx-auto text-[var(--muted-gold)]" size={32} />

      <p className="mt-4 font-display text-3xl">No games found</p>

      <p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--muted)]">
        Games will populate with official, canon-compatible, and community
        sandbox experiences after the backend and review systems exist.
      </p>
    </div>
  );
}
