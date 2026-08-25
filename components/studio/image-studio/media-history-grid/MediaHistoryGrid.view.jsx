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

import KitModalFrame from "@/components/kit/KitModalFrame";

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
  bulkDeleteConfirmOpen = false,
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
  mobilePrimaryActionLabel = "",
  onMobilePrimaryAction,
  onToggleSelectionMode,
  onToggleMediaSelection,
  onToggleLike,
  onToggleBookmark,
  onOpenMedia,
  onToggleSelectAllVisible,
  onClearSelection,
  onBulkDeleteSelected,
  onCancelBulkDelete,
  onConfirmBulkDelete,
  onLoadMoreHistory,
  FilterPillComponent,
  renderQuickActions,
  renderLightbox,
}) {
  const FilterPill = FilterPillComponent;

  return (
    <div className="space-y-3 sm:space-y-4">
      {reactionMessage ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
          {reactionMessage}
        </div>
      ) : null}

      {deleteMessage ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-4 py-3 text-sm text-[var(--gold-ornament)]">
          {deleteMessage}
        </div>
      ) : null}

      <section className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--gold-ornament)]/15 pb-3 sm:pb-4">
        <div>
          <p className="text-[var(--text-eyebrow)] font-medium uppercase leading-[var(--lh-eyebrow)] tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            Image Library
          </p>
          <p className="mt-1 text-xs text-[var(--ink-dim)]">{summaryText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mobilePrimaryActionLabel && onMobilePrimaryAction ? (
            <button
              type="button"
              onClick={onMobilePrimaryAction}
              className="cf-btn cf-btn--primary cf-btn--sm min-[1100px]:hidden"
            >
              <ImageIcon size={14} />
              {mobilePrimaryActionLabel}
            </button>
          ) : null}

          {hasSelectableMedia ? (
            <button
              type="button"
              onClick={onToggleSelectionMode}
              disabled={isBulkDeleting}
              className="cf-btn cf-btn--secondary cf-btn--sm"
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
            className="cf-btn cf-btn--secondary cf-btn--sm md:hidden"
          >
            <Grid2X2 size={14} />
            {compactMobileGrid ? "Large" : "Grid"}
          </button>

          <button
            type="button"
            onClick={onToggleFilters}
            className="cf-btn cf-btn--secondary cf-btn--sm md:hidden"
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
        <section className="sticky top-20 z-30 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-4 py-3 shadow-2xl backdrop-blur-md lg:top-4">
          <div>
            <p className="text-[var(--text-eyebrow)] font-medium uppercase leading-[var(--lh-eyebrow)] tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              {selectedCount} selected
            </p>
            <p className="mt-1 text-xs text-[var(--ink-dim)]">
              Tap images to add or remove them from this deletion batch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-[var(--space-2)]">
            <button
              type="button"
              onClick={onToggleSelectAllVisible}
              disabled={isBulkDeleting || !hasVisibleSelectableMedia}
              className="cf-btn cf-btn--secondary cf-btn--sm"
            >
              {allVisibleSelectableItemsSelected
                ? "Clear visible"
                : "Select all visible"}
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              disabled={isBulkDeleting || !selectedCount}
              className="cf-btn cf-btn--secondary cf-btn--sm"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={onBulkDeleteSelected}
              disabled={isBulkDeleting || !selectedCount}
              className="cf-btn cf-btn--danger cf-btn--sm"
            >
              {isBulkDeleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              {isBulkDeleting
                ? "Deleting..."
                : `Delete selected (${selectedCount})`}
            </button>
          </div>
        </section>
      ) : null}

      {historyStatus === "loading" ? (
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 px-4 py-6 text-sm text-[var(--ink-dim)]">
          Loading image library...
        </div>
      ) : null}

      {historyError ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
          {historyError}
        </div>
      ) : null}

      {historyStatus !== "loading" && !mediaItems.length ? (
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 px-4 py-10 text-center">
          <ImageIcon className="mx-auto text-[var(--gold-ornament)]" size={30} />
          <p className="mt-4 text-[var(--text-eyebrow)] font-medium uppercase leading-[var(--lh-eyebrow)] tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            No generated media yet
          </p>
          <p className="mt-2 text-sm text-[var(--ink-dim)]">
            Choose your ingredients and generate an image to start your library.
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
            className="cf-btn cf-btn--secondary"
          >
            {isLoadingMoreHistory ? "Loading..." : "Load more"}
          </button>
        </div>
      ) : null}

      {lightboxProps && renderLightbox
        ? renderLightbox(lightboxProps)
        : null}

      {bulkDeleteConfirmOpen ? (
        <BulkDeleteConfirmModal
          selectedCount={selectedCount}
          isDeleting={isBulkDeleting}
          onCancel={onCancelBulkDelete}
          onConfirm={onConfirmBulkDelete}
        />
      ) : null}
    </div>
  );
}

function BulkDeleteConfirmModal({
  selectedCount = 0,
  isDeleting = false,
  onCancel = null,
  onConfirm = null,
}) {
  const noun = selectedCount === 1 ? "image" : "images";

  return (
    <KitModalFrame
      onClose={isDeleting ? null : onCancel}
      ariaLabel={`Delete ${selectedCount} selected ${noun}?`}
      panelClassName="w-full max-w-[28rem]"
    >
      <div className="p-[var(--space-6)] pt-[var(--space-8)]">
        <div className="flex items-start gap-[var(--space-3)]">
          <AlertTriangle
            size={22}
            className="mt-1 flex-none text-[var(--status-danger)]"
          />
          <div>
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--status-danger)]">
              Permanent deletion
            </p>
            <h2 className="mt-[var(--space-2)] font-display text-3xl text-[var(--ink)]">
              Delete {selectedCount} selected {noun}?
            </h2>
            <p className="mt-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
              This removes the selected {noun} from Image Studio, connected
              creation libraries, and featured image slots. This action cannot
              be undone.
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="my-[var(--space-5)] h-px bg-[image:var(--line-fade)]" />

        <div className="flex flex-wrap justify-end gap-[var(--space-3)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="cf-btn cf-btn--secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting || !selectedCount}
            className="cf-btn cf-btn--danger"
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Delete permanently
              </>
            )}
          </button>
        </div>
      </div>
    </KitModalFrame>
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
      className={`group relative overflow-hidden rounded-[var(--radius-md)] bg-black/35 text-left transition ${
        item.selected
          ? "border border-[var(--gold-action)] ring-2 ring-[var(--gold-action)]/35"
          : "border border-[var(--line)]"
      } ${
        selectionMode && item.selectable
          ? "cursor-pointer hover:-translate-y-[2px] hover:border-[var(--gold-action)]/55 hover:shadow-[var(--glow-hover)]"
          : canOpen
            ? "hover:-translate-y-[2px] hover:border-[var(--gold-action)]/35 hover:shadow-[var(--glow-hover)]"
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
              ? "border-[var(--gold-action)] bg-[var(--gold-action)] text-[var(--tag-fill-ink)]"
              : "border-[var(--line)] bg-[var(--tag-bed-art)] text-transparent"
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
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/85 to-[var(--gold-ornament)]/10">
        <div className="px-5 text-center">
          <Loader2
            className="mx-auto animate-spin text-[var(--gold-ornament)]"
            size={iconSize}
          />
          <p
            className={`mt-4 font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] ${
              compact ? "text-[10px]" : "text-xs"
            }`}
          >
            Generating
          </p>
          <p
            className={`mt-2 text-[var(--ink-dim)] ${
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
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-[var(--status-danger-bed)] to-black">
        <div className="px-5 text-center">
          <AlertTriangle
            className="mx-auto text-[var(--status-danger)]"
            size={iconSize}
          />
          <p
            className={`mt-4 font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--status-danger)] ${
              compact ? "text-[10px]" : "text-xs"
            }`}
          >
            Failed
          </p>
          <p
            className={`mt-2 text-[var(--ink-dim)] ${
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
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/80 to-[var(--gold-ornament)]/10">
      <div className="text-center">
        <Icon className="mx-auto text-[var(--gold-ornament)]" size={iconSize} />
        <p
          className={`mt-4 font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] ${
            compact ? "text-[10px]" : "text-xs"
          }`}
        >
          {item.type}
        </p>
        <p
          className={`mt-2 px-4 text-[var(--ink-dim)] ${
            compact ? "text-xs leading-4" : "text-sm"
          }`}
        >
          {item.title}
        </p>
      </div>
    </div>
  );
}
