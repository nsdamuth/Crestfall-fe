import KitBreadcrumbs from "@/components/kit/KitBreadcrumbs";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitStudioFilterBarView from "@/components/kit/studio-filter-bar/KitStudioFilterBar.view";
import {
  BUY_COINS_INFO_BODY,
  UtilityModal,
} from "@/components/studio/studio-economy-widget/StudioEconomyWidget.view";
import {
  Camera,
  Coins,
  Film,
  Image as ImageIcon,
  LockKeyhole,
  MessageCircle,
} from "lucide-react";

// The media filter is the one single-select group in the standard
// sticky bar (RULED 12 Sep 2026, Brian's browser review): All is the
// resting value, so the trigger reads "Filter" until another option is
// picked. No sort on a single creation's catalogue (per-asset ordering
// ruling, 24 Aug 2026).
const MEDIA_FILTER_GROUP_ID = "media";
const MEDIA_FILTER_RESTING_VALUE = "ALL";

export default function CreationProfilePageView({
  shouldRender = false,
  loadErrorMessage = "",
  creation = null,
  breadcrumbs = [],
  description = null,
  mediaTabs = [],
  query = "",
  libraryPassPanel = null,
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
  onPurchaseLibraryPass = null,
  unlockDialog = null,
  onOpenUnlockDialog = null,
  onCloseUnlockDialog = null,
  isBuyCoinsInfoOpen = false,
  onOpenBuyCoinsInfo = null,
  onCloseBuyCoinsInfo = null,
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

  const activeTabId = mediaTabs.find((tab) => tab.active)?.id || MEDIA_FILTER_RESTING_VALUE;
  const showingCredits = activeTabId === "CREDITS";
  const mediaFilterGroups = [
    {
      id: MEDIA_FILTER_GROUP_ID,
      label: "Filter",
      isMultiSelect: false,
      restingValue: MEDIA_FILTER_RESTING_VALUE,
      options: mediaTabs.map((tab) => ({ value: tab.id, label: tab.label, count: null })),
    },
  ];

  return (
    <section className="pb-12">
      {/* Breadcrumbs (eight-fix package FIX 4, 12 Sep 2026): this page
          carries its own header card rather than StudioPageHeader, so
          the row sits directly above it. */}
      {breadcrumbs?.length ? (
        <div className="mb-[var(--space-2)]">
          <KitBreadcrumbs items={breadcrumbs} />
        </div>
      ) : null}
      <header className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--surface-2)] p-6">
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

            {/* Description clamp, RULED 12 Sep 2026 (eight-fix package
                FIX 8) and tightened to two lines 13 Sep 2026 (fe/updates
                follow-up 1, FIX 3): a line clamp, never a character
                count, measured by the view model through measureRef.
                Collapsed, the block is capped at two body lines and a
                one-line float pushes the gold Show more control to the
                right end of the second line, so the copy wraps around
                it, stops on a whole word, and the control carries the
                ellipsis; expanded, the block runs free and Show less
                follows the last word. The control keeps the line's
                height in the flow and extends its hit area above and
                below through a pseudo-element to --control-md (44px). */}
            <div
              ref={description?.measureRef}
              className={`relative mt-5 max-w-4xl whitespace-pre-line break-words text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)] ${
                description?.isExpanded
                  ? ""
                  : "max-h-[calc(var(--lh-body)*2)] overflow-hidden before:float-right before:h-[var(--lh-body)] before:w-0 before:content-['']"
              }`}
            >
              {description?.showToggle && !description?.isExpanded ? (
                <button
                  type="button"
                  onClick={() => onToggleDescription?.()}
                  aria-expanded={false}
                  className="relative float-right clear-right touch-manipulation pl-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--gold-action)] after:absolute after:inset-x-0 after:-inset-y-[calc((var(--control-md)-var(--lh-body))/2)] after:content-['']"
                >
                  {`… ${description.toggleLabel}`}
                </button>
              ) : null}
              <span>{description?.text}</span>
              {description?.showToggle && description?.isExpanded ? (
                <button
                  type="button"
                  onClick={() => onToggleDescription?.()}
                  aria-expanded
                  className="relative ml-[var(--space-1)] touch-manipulation text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--gold-action)] after:absolute after:inset-x-0 after:-inset-y-[calc((var(--control-md)-var(--lh-body))/2)] after:content-['']"
                >
                  {description.toggleLabel}
                </button>
              ) : null}
            </div>

            {creation.tags.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {creation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-[var(--tag-bed-canvas)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Chat, Generate, Share anchor to the bottom right of the
              header at lg and up (RULED 12 Sep 2026, browser review).
              One equal width (fe/updates follow-up 1, FIX 4, 13 Sep
              2026): the column is the header grid's auto column at lg,
              so it takes the widest label's width, and every direct
              child fills it through the one *:w-full rule; below lg the
              column is the full single column, so each button is full
              width. Recipes unchanged: primary gold on Chat, secondary
              on Generate and Share. */}
          <div className="flex flex-col gap-3 *:w-full lg:self-end">
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

      {libraryPassPanel ? (
        <LibraryPassViewerPanel
          panel={libraryPassPanel}
          onUnlock={onOpenUnlockDialog}
        />
      ) : null}

      <div className="mt-8 border-t border-[var(--gold-ornament)]/15 pt-5">
        {/* Standard sticky search and filter bar (RULED 12 Sep 2026,
            browser review): search left, the one media Filter dropdown
            right (All resting, Images, Videos, Liked, Saved, plus
            Credits when attribution exists). No sort on this page. */}
        <KitStudioFilterBarView
          searchValue={query}
          searchPlaceholder="Search this creation's media..."
          onSearchChange={onQueryChange}
          filterGroups={mediaFilterGroups}
          selectedValues={{ [MEDIA_FILTER_GROUP_ID]: [activeTabId] }}
          onFilterToggle={(groupId, value) => onSelectTab?.(value)}
          filterPresentation="dropdowns"
          sortOptions={[]}
        />

        {showingCredits ? (
          <div className="mt-5">{creditsSlot}</div>
        ) : (
          <>
            {!visibleMedia.length ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-white/10 bg-[var(--surface-1)] p-8 text-center">
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
                onOpenUnlock={onOpenUnlockDialog}
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

      {unlockDialog?.isOpen ? (
        <UnlockFullLibraryDialog
          dialog={unlockDialog}
          onConfirm={onPurchaseLibraryPass}
          onCancel={onCloseUnlockDialog}
          onOpenBuyCoins={onOpenBuyCoinsInfo}
        />
      ) : null}

      {isBuyCoinsInfoOpen ? (
        <UtilityModal title="Buy Coins" body={BUY_COINS_INFO_BODY} onClose={onCloseBuyCoinsInfo} />
      ) : null}

      {lightboxSlot}
    </section>
  );
}

// Unlock confirmation, RULED 12 Sep 2026 (eight-fix package FIX 6),
// built on the coins info dialog recipe (UtilityModal: KitModalFrame,
// max-w-sm panel, --space-6 content box, eyebrow, display title, body,
// full-width buttons). Single column at every width, every button
// --control-md tall through .cf-btn, and the frame keeps the panel
// inside the viewport (bottom-anchored under 700px, capped at 92dvh).
// The charge runs only from the primary's handler; a balance below the
// cost disables the primary and shows the existing Buy Coins path.
function UnlockFullLibraryDialog({ dialog, onConfirm, onCancel, onOpenBuyCoins }) {
  const showBuyCoins = dialog.isBalanceKnown && !dialog.canAfford;

  return (
    <KitModalFrame
      onClose={onCancel}
      ariaLabelledBy="creation-profile-unlock-title"
      panelClassName="w-full max-w-sm"
    >
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)]">
        <div>
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Library Pass
          </p>
          <h2
            id="creation-profile-unlock-title"
            className="mt-[var(--space-2)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] text-[var(--ink)]"
          >
            {dialog.title}
          </h2>
        </div>

        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {dialog.summary}
        </p>

        <dl className="flex flex-col gap-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)]">
          <div className="flex items-center justify-between gap-[var(--space-3)]">
            <dt className="text-[var(--ink-dim)]">Cost</dt>
            <dd className="tabular-nums text-[var(--ink)]">{dialog.costLabel}</dd>
          </div>
          <div className="flex items-center justify-between gap-[var(--space-3)]">
            <dt className="text-[var(--ink-dim)]">Your balance</dt>
            <dd className="tabular-nums text-[var(--ink)]">{dialog.balanceLabel}</dd>
          </div>
        </dl>

        {showBuyCoins ? (
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            Your balance is below the cost of this pass.
          </p>
        ) : null}

        {dialog.errorMessage ? (
          <p className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
            {dialog.errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-[var(--space-2)]">
          <button type="button" onClick={() => onCancel?.()} className="cf-btn cf-btn--secondary w-full">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.()}
            disabled={!dialog.canAfford || dialog.isBusy}
            className="cf-btn cf-btn--primary w-full disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
          >
            <Coins size={15} aria-hidden="true" />
            {dialog.isBusy ? "Unlocking..." : dialog.confirmLabel}
          </button>
          {showBuyCoins ? (
            <button type="button" onClick={() => onOpenBuyCoins?.()} className="cf-btn cf-btn--secondary w-full">
              Buy Coins
            </button>
          ) : null}
        </div>
      </div>
    </KitModalFrame>
  );
}

function LibraryPassViewerPanel({ panel, onUnlock }) {
  const messageIsError = panel.purchaseStatus === "error";

  return (
    <section className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-2)] p-5">
      {/* The Unlock CTA sits on the right at lg and up (RULED 12 Sep
          2026, browser review): the copy block takes the remaining
          width and the row no longer wraps the CTA underneath it. */}
      <div className="flex flex-wrap items-start justify-between gap-4 lg:flex-nowrap lg:items-end">
        <div className="min-w-0 max-w-3xl lg:flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]">
              <LockKeyhole size={16} />
            </span>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Library Pass
            </p>
            <span className="rounded-full border border-white/10 bg-[var(--tag-bed-canvas)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
              {panel.statusLabel}
            </span>
          </div>

          <h2 className="mt-3 font-display text-3xl">Extended Image Library</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {panel.publicPreviewCount} images are public previews. {panel.protectedImageCount} additional {panel.protectedImageCount === 1 ? "image is" : "images are"} protected.
            {panel.includesFutureAdditions
              ? " One Library Pass also unlocks future eligible additions to this creation."
              : ""}
          </p>
        </div>

        {!panel.isOwner && !panel.hasActiveEntitlement ? (
          panel.canPurchase ? (
            // The CTA opens the confirmation (FIX 6, 12 Sep 2026); it
            // never charges on tap.
            <button
              type="button"
              onClick={() => onUnlock?.()}
              disabled={panel.purchaseBusy}
              className="cf-btn cf-btn--primary"
            >
              <Coins size={15} />
              {panel.actionLabel}
            </button>
          ) : (
            <span className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--surface-1)] px-4 py-3 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
              New purchases unavailable
            </span>
          )
        ) : null}
      </div>

      {panel.purchaseMessage ? (
        <p className={`mt-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
          messageIsError
            ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
            : "border-[var(--line)] bg-[var(--fill)] text-[var(--gold-ornament)]"
        }`}>
          {panel.purchaseMessage}
        </p>
      ) : null}
    </section>
  );
}

// Locked Library Pass tiles, RULED 12 Sep 2026 (eight-fix package
// FIX 7): the whole tile is the tap target and tapping it opens the
// same "Unlock full library?" confirmation the CTA opens (FIX 6).
// Unlocked tiles are unchanged.
function MediaTile({ item, actionsSlot, onOpen, onOpenUnlock = null }) {
  if (item.isLocked) {
    return (
      <article className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-2)] text-left">
        <button
          type="button"
          onClick={() => onOpenUnlock?.()}
          className="relative h-full w-full text-left"
          aria-label={`Library Pass required for ${item.title || "media"}`}
        >
          {item.lockedPreviewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.lockedPreviewUrl}
              alt="Protected Library Pass preview"
              loading={item.priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={item.priority ? "high" : "low"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10" />
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-[var(--scrim)]">
            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--tag-bed-art)] px-5 py-4 text-center shadow-[var(--shadow-popover)]">
              <LockKeyhole className="mx-auto text-[var(--gold-ornament)]" size={24} />
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                Library Pass
              </p>
              <p className="mt-1 text-xs text-[var(--ink-dim)]">
                Unlock full image
              </p>
            </div>
          </div>
        </button>
      </article>
    );
  }

  if (!item.imageUrl) {
    return (
      <article className="aspect-square overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-[var(--surface-2)] text-left">
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
    <article className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-[var(--surface-2)] text-left transition hover:-translate-y-1 hover:border-[var(--gold-ornament)]/35">
      <button
        type="button"
        onClick={onOpen}
        className="h-full w-full text-left"
        aria-label={`Open ${item.title || "media"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.cardUrl || item.thumbnailUrl || item.imageUrl}
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
