import {
  Bookmark,
  Camera,
  Coins,
  Film,
  Heart,
  Image as ImageIcon,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Search,
  X,
} from "lucide-react";

import StoryStartOpeningLocationPickerView from "@/components/studio/story-rooms/story-start-opening-location/StoryStartOpeningLocationPicker.view";

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
  openingLocationPicker = null,
  libraryPassPanel = null,
  libraryPassModal = null,
  libraryPassMessage = "",
  libraryPassMessageTone = "",
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
  onOpenLibraryPassPurchase = null,
  onCloseLibraryPassPurchase = null,
  onConfirmLibraryPassPurchase = null,
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
            {chatError && !openingLocationPicker?.open ? (
              <p className="max-w-[14rem] text-xs leading-5 text-red-200">
                {chatError}
              </p>
            ) : null}
          </div>
        </div>

        {openingLocationPicker ? (
          <div className="mt-5">
            <StoryStartOpeningLocationPickerView
              {...openingLocationPicker}
            />
          </div>
        ) : null}
      </header>

      <div className="mt-8 border-t border-[var(--gold-ornament)]/15 pt-5">
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
          <Search size={16} className="text-[var(--gold-ornament)]" />
          <input
            value={query}
            onChange={(event) => onQueryChange?.(event.target.value)}
            placeholder="Search this creation's media..."
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
          />
        </div>

        {libraryPassPanel?.shouldShow ? (
          <LibraryPassPanel
            panel={libraryPassPanel}
            onOpenPurchase={onOpenLibraryPassPurchase}
          />
        ) : null}

        {libraryPassMessage ? (
          <p
            className={`mt-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
              libraryPassMessageTone === "SUCCESS"
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                : "border-red-400/25 bg-red-400/10 text-red-100"
            }`}
          >
            {libraryPassMessage}
          </p>
        ) : null}

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
      </div>

      {libraryPassModal?.isOpen ? (
        <LibraryPassPurchaseDialog
          modal={libraryPassModal}
          onClose={onCloseLibraryPassPurchase}
          onConfirm={onConfirmLibraryPassPurchase}
        />
      ) : null}

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


function LibraryPassPanel({ panel, onOpenPurchase }) {
  if (panel.loading) {
    return (
      <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/[0.06] p-5">
        <div className="flex items-center gap-3 text-sm text-[var(--ink-dim)]">
          <Loader2 size={16} className="animate-spin text-[var(--gold-ornament)]" />
          Checking Library Pass access...
        </div>
      </div>
    );
  }

  if (panel.loadError) {
    return (
      <div className="mt-5 rounded-[var(--radius-md)] border border-red-400/25 bg-red-400/10 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-red-200">
          Library Pass Unavailable
        </p>
        <p className="mt-2 text-sm leading-6 text-red-100">
          {panel.loadError} Extended media is temporarily limited to the public previews.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/[0.06] p-5">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Extended Image Library
            </p>
            <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
              {panel.statusLabel}
            </span>
          </div>

          <h2 className="mt-2 font-display text-3xl">
            {panel.hasFullAccess
              ? "Complete library access is active"
              : `${panel.lockedMediaCount} extended ${
                  panel.lockedMediaCount === 1 ? "image" : "images"
                } available`}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            The {panel.publicPreviewCount} most recent eligible results remain visible to everyone.
            A Library Pass unlocks the complete eligible library
            {panel.includesFutureAdditions ? " and future additions" : ""}.
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--ink-dim)]">
            <span>{panel.eligibleImageCount} eligible images</span>
            <span>{panel.publicPreviewCount} public previews</span>
            {!panel.hasFullAccess ? <span>{panel.priceLabel}</span> : null}
          </div>
        </div>

        {panel.showAction ? (
          <button
            type="button"
            onClick={() => onOpenPurchase?.()}
            disabled={panel.actionDisabled}
            className="cf-btn cf-btn--secondary"
          >
            <Coins size={15} />
            {panel.actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function LibraryPassPurchaseDialog({ modal, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={modal.title}
        className="w-full max-w-lg rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[#0b0a08] p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Library Pass
            </p>
            <h3 className="mt-1 font-display text-3xl">{modal.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              Unlock all {modal.eligibleImageCount} currently eligible images
              {modal.includesFutureAdditions
                ? " and every eligible image added later"
                : ""}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={modal.isBusy}
            aria-label="Close Library Pass dialog"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-white/10 bg-black/40 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-60"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              Pass Price
            </p>
            <p className="mt-2 font-display text-2xl text-[var(--gold-ornament)]">
              {modal.priceLabel}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              Your Balance
            </p>
            <p className="mt-2 font-display text-2xl">{modal.balanceLabel}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--ink-dim)]">
          <p>{modal.publicPreviewCount} recent results remain publicly visible.</p>
          <p className="mt-2">This is a one-time purchase for this creation.</p>
          {modal.includesFutureAdditions ? (
            <p className="mt-2">
              Future eligible additions are included automatically.
            </p>
          ) : null}
        </div>

        {modal.unavailableMessage ? (
          <p className="mt-4 rounded-[var(--radius-md)] border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {modal.unavailableMessage}
          </p>
        ) : null}

        {modal.statusMessage ? (
          <p
            className={`mt-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
              modal.statusTone === "SUCCESS"
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                : "border-red-400/25 bg-red-400/10 text-red-100"
            }`}
          >
            {modal.statusMessage}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={modal.isBusy}
            className="cf-btn cf-btn--secondary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm?.()}
            disabled={!modal.canConfirm}
            className="cf-btn cf-btn--primary"
          >
            {modal.isBusy ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Coins size={14} />
            )}
            {modal.confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

function MediaTile({ item, actionsSlot, onOpen }) {
  const hasImage = Boolean(item.imageUrl);

  if (item.locked) {
    return (
      <article className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 text-left">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{
              filter:
                "blur(14px) brightness(0.62) contrast(0.85) saturate(0.75)",
              transform: "scale(1.08)",
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-black via-black/85 to-[var(--gold-ornament)]/10" />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-[var(--gold-ornament)]/5"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        />

        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-black/20 p-5 text-center"
          aria-label="Unlock this extended library image"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold-ornament)]/35 bg-black/65 text-[var(--gold-ornament)] transition group-hover:scale-105 group-hover:bg-black/80">
            <LockKeyhole size={21} />
          </span>
          <span className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Library Pass
          </span>
          <span className="mt-2 text-sm text-[var(--ink)]">
            Unlock extended media
          </span>
        </button>
      </article>
    );
  }

  if (!hasImage) {
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
