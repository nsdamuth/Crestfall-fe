import {
  Bookmark,
  Camera,
  Film,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Search,
  ScrollText,
} from "lucide-react";

const TAB_ICONS = {
  IMAGE: ImageIcon,
  VIDEO: Film,
  HEART: Heart,
  BOOKMARK: Bookmark,
  CREDITS: ScrollText,
};

export default function CreationProfilePageView({
  shouldRender = false,
  loadErrorMessage = "",
  creation = null,
  description = null,
  mediaTabs = [],
  query = "",
  creditsSlot = null,
  visibleMedia = [],
  hasMoreMedia = false,
  startingChat = false,
  chatError = "",
  statusBadgesSlot = null,
  statsSlot = null,
  creatorLinkSlot = null,
  generateLinkSlot = null,
  shareButtonSlot = null,
  mediaActionSlots = {},
  lightboxSlot = null,
  onSelectTab = null,
  onQueryChange = null,
  onLoadMore = null,
  onOpenMedia = null,
  onToggleDescription = null,
  onStartChat = null,
}) {
  if (!shouldRender) return null;

  if (loadErrorMessage) {
    return (
      <section className="pb-12">
        <div className="rounded-2xl border border-red-400/25 bg-red-400/10 p-5 text-sm leading-6 text-red-100">
          {loadErrorMessage}
        </div>
      </section>
    );
  }

  if (!creation) return null;

  const activeTabId = mediaTabs.find((tab) => tab.active)?.id || "IMAGES";
  const showingCredits = activeTabId === "CREDITS";

  return (
    <section className="pb-12">
      <header className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-start">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 font-display text-4xl text-[var(--gold-ornament)]">
            {creation.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={creation.imageUrl}
                alt={creation.title || "Creation"}
                className="h-full w-full object-cover"
              />
            ) : (
              creation.titleInitial
            )}
          </div>

          <div>
            {statusBadgesSlot}
            <h1 className="mt-4 font-display text-5xl">{creation.title}</h1>

            {creation.subtitle ? (
              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                {creation.subtitle}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--ink-dim)]">
              {creation.creatorHandle ? (
                <span>
                  by {creatorLinkSlot || (
                    <span className="text-[var(--ink)]">
                      {creation.creatorHandle}
                    </span>
                  )}
                </span>
              ) : null}
              {statsSlot}
            </div>

            <p className="mt-5 max-w-4xl whitespace-pre-line break-words leading-7 text-[var(--ink-dim)]">
              {description?.visibleText}
              {description?.hasLongDescription ? (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={() => onToggleDescription?.()}
                    className="cf-btn cf-btn--tertiary inline h-auto p-0"
                  >
                    {description.toggleLabel}
                  </button>
                </>
              ) : null}
            </p>

            {creation.tags.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {creation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3 lg:flex-col">
            {creation.supportsChat ? (
              <button
                type="button"
                onClick={() => onStartChat?.()}
                disabled={startingChat}
                className="cf-btn cf-btn--primary"
              >
                <MessageCircle size={14} />
                {startingChat ? "Starting..." : "Chat"}
              </button>
            ) : null}

            {generateLinkSlot || (
              <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                <Camera size={14} />
                Generate
              </span>
            )}
            {shareButtonSlot}
            {chatError ? (
              <p className="max-w-[14rem] text-xs leading-5 text-red-200">
                {chatError}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mt-8 border-t border-[var(--gold-ornament)]/15 pt-5">
        <div className="flex flex-wrap gap-2">
          {mediaTabs.map((tab) => {
            const Icon = TAB_ICONS[tab.icon];
            return (
              <FilterButton
                key={tab.id}
                active={tab.active}
                onClick={() => onSelectTab?.(tab.id)}
              >
                {Icon ? <Icon size={14} /> : null}
                {tab.label}
              </FilterButton>
            );
          })}
        </div>

        {showingCredits ? (
          <div className="mt-5">{creditsSlot}</div>
        ) : (
          <>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
              <Search size={16} className="text-[var(--gold-ornament)]" />
              <input
                value={query}
                onChange={(event) => onQueryChange?.(event.target.value)}
                placeholder="Search this creation's media..."
                className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
              />
            </div>

            {!visibleMedia.length ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
            <ImageIcon size={30} className="mx-auto text-[var(--gold-ornament)]" />
            <p className="mt-4 font-display text-3xl">No public media yet</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
              Public images for this creation will appear here once approved and
              visible in the character catalogue.
            </p>
          </div>
        ) : null}

        {visibleMedia.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visibleMedia.map((item) => (
              <MediaTile
                key={item.id}
                item={item}
                actionsSlot={mediaActionSlots[item.id] || null}
                onOpen={() => onOpenMedia?.(item.id)}
              />
            ))}
          </div>
        ) : null}

            {hasMoreMedia ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => onLoadMore?.()}
                  className="cf-btn cf-btn--secondary"
                >
                  Load more
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>

      {lightboxSlot}
    </section>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
        active
          ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
          : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function MediaTile({ item, actionsSlot, onOpen }) {
  if (!item.imageUrl) {
    return (
      <article className="aspect-square overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/35 text-left">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
          <div className="text-center">
            {item.type === "VIDEO" ? (
              <Film className="mx-auto text-[var(--gold-ornament)]" size={30} />
            ) : (
              <ImageIcon className="mx-auto text-[var(--gold-ornament)]" size={30} />
            )}
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
              {item.type}
            </p>
            <p className="mt-2 text-sm text-[var(--ink-dim)]">{item.title}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/35 text-left transition hover:-translate-y-1 hover:border-[var(--gold-ornament)]/35">
      <button
        type="button"
        onClick={onOpen}
        className="h-full w-full text-left"
        aria-label={`Open ${item.title || "media"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title || "Creation media"}
          loading={item.priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={item.priority ? "high" : "low"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </button>
      {actionsSlot}
    </article>
  );
}
