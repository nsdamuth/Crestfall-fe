import {
  Bookmark,
  Camera,
  Film,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Search,
} from "lucide-react";

const TAB_ICONS = {
  IMAGE: ImageIcon,
  VIDEO: Film,
  HEART: Heart,
  BOOKMARK: Bookmark,
};

export default function CreationProfilePageView({
  shouldRender = false,
  loadErrorMessage = "",
  creation = null,
  description = null,
  mediaTabs = [],
  query = "",
  visibleMedia = [],
  hasMoreMedia = false,
  startingChat = false,
  chatError = "",
  statusBadgesSlot = null,
  statsSlot = null,
  creatorLinkSlot = null,
  generateLinkSlot = null,
  shareButtonSlot = null,
  sortControlSlot = null,
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

  return (
    <section className="pb-12">
      <header className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-start">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 font-display text-4xl text-[var(--muted-gold)]">
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
              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                {creation.subtitle}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
              {creation.creatorHandle ? (
                <span>
                  by {creatorLinkSlot || (
                    <span className="text-[var(--foreground)]">
                      {creation.creatorHandle}
                    </span>
                  )}
                </span>
              ) : null}
              {statsSlot}
            </div>

            <p className="mt-5 max-w-4xl whitespace-pre-line break-words leading-7 text-[var(--muted)]">
              {description?.visibleText}
              {description?.hasLongDescription ? (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={() => onToggleDescription?.()}
                    className="inline text-[var(--muted-gold)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
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
                    className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]"
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
              >
                <MessageCircle size={14} />
                {startingChat ? "Starting..." : "Chat"}
              </button>
            ) : null}

            {generateLinkSlot || (
              <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
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

      <div className="mt-8 border-t border-[var(--muted-gold)]/15 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
          <div className="w-full sm:w-56">{sortControlSlot}</div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
          <Search size={16} className="text-[var(--muted-gold)]" />
          <input
            value={query}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder="Search this creation's media..."
            className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
          />
        </div>


        {!visibleMedia.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
            <ImageIcon size={30} className="mx-auto text-[var(--muted-gold)]" />
            <p className="mt-4 font-display text-3xl">No public media yet</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
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
              className="rounded-xl border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
            >
              Load More
            </button>
          </div>
        ) : null}
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
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
        active
          ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
          : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function MediaTile({ item, actionsSlot, onOpen }) {
  if (!item.imageUrl) {
    return (
      <article className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/35 text-left">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
          <div className="text-center">
            {item.type === "VIDEO" ? (
              <Film className="mx-auto text-[var(--muted-gold)]" size={30} />
            ) : (
              <ImageIcon className="mx-auto text-[var(--muted-gold)]" size={30} />
            )}
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              {item.type}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.title}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/35 text-left transition hover:-translate-y-1 hover:border-[var(--muted-gold)]/35">
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
