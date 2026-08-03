"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckSquare2,
  ChevronDown,
  ChevronUp,
  Film,
  Grid2X2,
  Image as ImageIcon,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

function getNumericDimension(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getSafeAspectRatio({ width, height }) {
  if (!width || !height) return 1;

  const ratio = width / height;
  if (!Number.isFinite(ratio) || ratio <= 0) return 1;

  return Math.min(Math.max(ratio, 0.45), 2.25);
}

function getMasonrySpan({
  cardWidth,
  aspectRatio,
  masonryRowHeight,
  masonryGap,
}) {
  const safeWidth = getNumericDimension(cardWidth) || 220;
  const safeRatio =
    Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1;
  const targetHeight = safeWidth / safeRatio;
  const span = Math.ceil(
    (targetHeight + masonryGap) / (masonryRowHeight + masonryGap)
  );

  return Math.min(Math.max(span, 8), 80);
}

function useMasonryCardLayout(item, masonryRowHeight, masonryGap) {
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [naturalDimensions, setNaturalDimensions] = useState(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return undefined;

    function updateWidth() {
      setCardWidth(element.getBoundingClientRect().width);
    }

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const storedDimensions = {
    width: item.storedWidth,
    height: item.storedHeight,
  };
  const dimensions =
    storedDimensions.width && storedDimensions.height
      ? storedDimensions
      : naturalDimensions || storedDimensions;
  const aspectRatio = getSafeAspectRatio(dimensions);
  const gridSpan = getMasonrySpan({
    cardWidth,
    aspectRatio,
    masonryRowHeight,
    masonryGap,
  });

  function handleImageLoad(event) {
    const image = event?.currentTarget;
    if (!image) return;

    const width = getNumericDimension(image.naturalWidth);
    const height = getNumericDimension(image.naturalHeight);
    if (!width || !height) return;

    setNaturalDimensions({ width, height });
  }

  return { cardRef, gridSpan, handleImageLoad };
}

export default function MediaHistoryGridView({
  filterOptions = [],
  activeFilter = "ALL",
  filtersOpen = false,
  compactMobileGrid = true,
  mobileGridClass = "grid-cols-2",
  mediaItems = [],
  visibleMediaItems = [],
  historyStatus = "idle",
  historyError = "",
  hasMoreHistory = false,
  isLoadingMoreHistory = false,
  reactionMessage = "",
  deleteMessage = "",
  selectionMode = false,
  selectedCount = 0,
  isBulkDeleting = false,
  hasSelectableMedia = false,
  hasVisibleSelectableMedia = false,
  allVisibleSelectableItemsSelected = false,
  summaryText = "No library items yet",
  lightboxProps = null,
  eagerImageCount = 4,
  masonryRowHeight = 8,
  masonryGap = 12,
  onSetFilter,
  onToggleFilters,
  onToggleMobileGrid,
  onToggleSelectionMode,
  onToggleMediaSelection,
  onToggleLike,
  onToggleBookmark,
  onOpenMedia,
  onToggleSelectAllVisible,
  onClearSelection,
  onBulkDeleteSelected,
  onLoadMoreHistory,
  FilterPillComponent,
  renderQuickActions,
  renderLightbox,
}) {
  const FilterPill = FilterPillComponent;

  return (
    <div className="space-y-4">
      {reactionMessage ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {reactionMessage}
        </div>
      ) : null}

      {deleteMessage ? (
        <div className="rounded-2xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-4 py-3 text-sm text-[var(--muted-gold)]">
          {deleteMessage}
        </div>
      ) : null}

      <section className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--muted-gold)]/15 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Image Library
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">{summaryText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasSelectableMedia ? (
            <button
              type="button"
              onClick={onToggleSelectionMode}
              disabled={isBulkDeleting}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                selectionMode
                  ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/20 text-[var(--foreground)]"
                  : "border-white/10 bg-black/30 text-[var(--muted-gold)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
              }`}
            >
              {selectionMode ? <X size={14} /> : <CheckSquare2 size={14} />}
              {selectionMode ? "Done" : "Select"}
            </button>
          ) : null}

          <div className="hidden flex-wrap gap-2 md:flex">
            {filterOptions.map((option) => (
              <FilterPill
                key={option.value}
                active={activeFilter === option.value}
                onClick={() => onSetFilter?.(option.value)}
              >
                {option.label}
              </FilterPill>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleMobileGrid}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] md:hidden"
          >
            <Grid2X2 size={14} />
            {compactMobileGrid ? "Large" : "Grid"}
          </button>

          <button
            type="button"
            onClick={onToggleFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] md:hidden"
          >
            {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Filters
          </button>
        </div>

        {filtersOpen ? (
          <div className="flex w-full flex-wrap gap-2 md:hidden">
            {filterOptions.map((option) => (
              <FilterPill
                key={option.value}
                active={activeFilter === option.value}
                onClick={() => onSetFilter?.(option.value)}
              >
                {option.label}
              </FilterPill>
            ))}
          </div>
        ) : null}
      </section>

      {selectionMode ? (
        <section className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--muted-gold)]/30 bg-black/95 px-4 py-3 shadow-2xl backdrop-blur-md lg:top-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              {selectedCount} selected
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Tap images to add or remove them from this deletion batch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleSelectAllVisible}
              disabled={isBulkDeleting || !hasVisibleSelectableMedia}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {allVisibleSelectableItemsSelected
                ? "Clear Visible"
                : "Select All Visible"}
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              disabled={isBulkDeleting || !selectedCount}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onBulkDeleteSelected}
              disabled={isBulkDeleting || !selectedCount}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/35 bg-red-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBulkDeleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {isBulkDeleting
                ? "Deleting..."
                : `Delete Selected (${selectedCount})`}
            </button>
          </div>
        </section>
      ) : null}

      {historyStatus === "loading" ? (
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-6 text-sm text-[var(--muted)]">
          Loading image library...
        </div>
      ) : null}

      {historyError ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {historyError}
        </div>
      ) : null}

      {historyStatus !== "loading" && !mediaItems.length ? (
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-10 text-center">
          <ImageIcon className="mx-auto text-[var(--muted-gold)]" size={30} />
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            No generated media yet
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Select a character and generate an image to start your library.
          </p>
        </div>
      ) : null}

      {visibleMediaItems.length ? (
        <section
          className={`grid ${mobileGridClass} sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`}
          style={{
            gridAutoRows: `${masonryRowHeight}px`,
            gap: `${masonryGap}px`,
          }}
        >
          {visibleMediaItems.map((item, index) => (
            <MediaHistoryCard
              key={item.id}
              item={item}
              compactMobileGrid={compactMobileGrid}
              priority={index < eagerImageCount}
              selectionMode={selectionMode}
              selectionDisabled={isBulkDeleting}
              masonryRowHeight={masonryRowHeight}
              masonryGap={masonryGap}
              onToggleSelection={() => onToggleMediaSelection?.(item)}
              onOpen={() => onOpenMedia?.(item)}
              quickActions={
                renderQuickActions && !selectionMode
                  ? renderQuickActions({
                      liked: Boolean(item.liked),
                      bookmarked: Boolean(item.bookmarked),
                      onToggleLike: () => onToggleLike?.(item),
                      onToggleBookmark: () => onToggleBookmark?.(item),
                      onExpand: () => onOpenMedia?.(item),
                    })
                  : null
              }
            />
          ))}
        </section>
      ) : null}

      {hasMoreHistory ? (
        <div className="flex justify-center pt-3">
          <button
            type="button"
            onClick={onLoadMoreHistory}
            disabled={isLoadingMoreHistory}
            className="rounded-xl border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-5 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMoreHistory ? "Loading..." : "Load More"}
          </button>
        </div>
      ) : null}

      {lightboxProps && renderLightbox
        ? renderLightbox(lightboxProps)
        : null}
    </div>
  );
}

function MediaHistoryCard({
  item,
  compactMobileGrid,
  priority = false,
  selectionMode = false,
  selectionDisabled = false,
  masonryRowHeight,
  masonryGap,
  onToggleSelection,
  onOpen,
  quickActions,
}) {
  const isPending = item.status === "pending";
  const isError = item.status === "error";
  const canOpen = Boolean(item.imageUrl) && !isPending && !isError;
  const { cardRef, gridSpan, handleImageLoad } = useMasonryCardLayout(
    item,
    masonryRowHeight,
    masonryGap
  );

  return (
    <article
      ref={cardRef}
      aria-busy={isPending}
      style={{ gridRowEnd: `span ${gridSpan}` }}
      className={`group relative overflow-hidden rounded-2xl bg-black/35 text-left transition ${
        item.selected
          ? "border border-[var(--muted-gold)] ring-2 ring-[var(--muted-gold)]/35"
          : "border border-white/10"
      } ${
        selectionMode && item.selectable
          ? "cursor-pointer hover:-translate-y-1 hover:border-[var(--muted-gold)]/55"
          : canOpen
            ? "hover:-translate-y-1 hover:border-[var(--muted-gold)]/35"
            : "cursor-default"
      }`}
    >
      {selectionMode && item.selectable ? (
        <button
          type="button"
          onClick={onToggleSelection}
          disabled={selectionDisabled}
          className="h-full w-full text-left disabled:cursor-wait"
          aria-pressed={item.selected}
          aria-label={`${item.selected ? "Deselect" : "Select"} ${
            item.title || "generated image"
          }`}
        >
          <MediaPreviewContent
            item={item}
            compact={compactMobileGrid}
            priority={priority}
            onImageLoad={handleImageLoad}
          />
        </button>
      ) : canOpen && !selectionMode ? (
        <>
          <button
            type="button"
            onClick={onOpen}
            className="h-full w-full text-left"
            aria-label={`Open ${item.title || "generated media"}`}
          >
            <MediaPreviewContent
              item={item}
              compact={compactMobileGrid}
              priority={priority}
              onImageLoad={handleImageLoad}
            />
          </button>
          {quickActions}
        </>
      ) : (
        <MediaPreviewContent
          item={item}
          compact={compactMobileGrid}
          priority={priority}
          onImageLoad={handleImageLoad}
        />
      )}

      {selectionMode && item.selectable ? (
        <span
          className={`pointer-events-none absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg backdrop-blur-md ${
            item.selected
              ? "border-[var(--muted-gold)] bg-[var(--muted-gold)] text-black"
              : "border-white/30 bg-black/70 text-transparent"
          }`}
          aria-hidden="true"
        >
          <Check size={17} strokeWidth={3} />
        </span>
      ) : null}
    </article>
  );
}

function MediaPreviewContent({
  item,
  compact = false,
  fullscreen = false,
  priority = false,
  onImageLoad,
}) {
  const Icon = item.type === "VIDEO" ? Film : ImageIcon;
  const iconSize = fullscreen ? 56 : compact ? 22 : 30;
  const previewImageUrl = !fullscreen ? item.thumbnailUrl : item.imageUrl;

  if (item.status === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/85 to-[var(--muted-gold)]/10">
        <div className="px-5 text-center">
          <Loader2
            className="mx-auto animate-spin text-[var(--muted-gold)]"
            size={iconSize}
          />
          <p
            className={`mt-4 uppercase tracking-[0.2em] text-[var(--muted-gold)] ${
              compact ? "text-[10px]" : "text-xs"
            }`}
          >
            Generating
          </p>
          <p
            className={`mt-2 text-[var(--muted)] ${
              compact ? "text-xs leading-4" : "text-sm leading-6"
            }`}
          >
            Your image is being created.
          </p>
        </div>
      </div>
    );
  }

  if (item.status === "error") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-red-950/20 to-black">
        <div className="px-5 text-center">
          <AlertTriangle className="mx-auto text-red-200" size={iconSize} />
          <p
            className={`mt-4 uppercase tracking-[0.2em] text-red-200 ${
              compact ? "text-[10px]" : "text-xs"
            }`}
          >
            Failed
          </p>
          <p
            className={`mt-2 text-[var(--muted)] ${
              compact ? "text-xs leading-4" : "text-sm leading-6"
            }`}
          >
            {item.errorMessage}
          </p>
        </div>
      </div>
    );
  }

  if (previewImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={previewImageUrl}
        alt={item.title || "Generated media"}
        loading={priority || fullscreen ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority || fullscreen ? "high" : "low"}
        onLoad={onImageLoad}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
      <div className="text-center">
        <Icon className="mx-auto text-[var(--muted-gold)]" size={iconSize} />
        <p
          className={`mt-4 uppercase tracking-[0.2em] text-[var(--muted-gold)] ${
            compact ? "text-[10px]" : "text-xs"
          }`}
        >
          {item.type}
        </p>
        <p
          className={`mt-2 px-4 text-[var(--muted)] ${
            compact ? "text-xs leading-4" : "text-sm"
          }`}
        >
          {item.title}
        </p>
      </div>
    </div>
  );
}
