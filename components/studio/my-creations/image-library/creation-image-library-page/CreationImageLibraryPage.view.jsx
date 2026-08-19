"use client";

import {
  ArrowLeft,
  Coins,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";

export default function CreationImageLibraryPageView({
  title = "Image Library",
  backHref = "/studio/my-creations",
  showBackLink = true,
  loadStatus = "idle",
  loadMessage = "",
  isLoading = false,
  reactionMessage = "",
  deleteMessage = "",
  reassignmentMessage = "",
  libraryPassPanel = null,
  featuredSlotCards = [],
  visibleImages = [],
  hiddenImages = [],
  hasImages = false,
  noMatchingImages = false,
  visibleSummary = "Showing 0 of 0 / 0 hidden",
  eligibilityFilter = "all",
  eligibilityFilterOptions = [],
  sortMode = "newest",
  sortOptions = [],
  hasMoreVisibleImages = false,
  lightboxProps = null,
  eagerImageCount = 4,
  onRefresh,
  onToggleLibraryPassSales,
  onSetEligibilityFilter,
  onSetSortMode,
  onLoadMoreVisibleImages,
  onOpenPreview,
  onToggleLike,
  onToggleBookmark,
  onAssignFeaturedSlot,
  onHideImage,
  onShowImage,
  onDeleteImage,
  BackLinkComponent,
  renderQuickActions,
  renderLightbox,
}) {
  const BackLink = BackLinkComponent;

  return (
    <section className="mt-8 pb-24">
      <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Character Library
            </p>
            <h2 className="mt-2 font-display text-4xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              Images here are associated with this creation. Featured slots must
              come from this library. The Primary slot becomes the default visual
              identity reference later.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="cf-btn cf-btn--secondary"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            {BackLink && showBackLink ? (
              <BackLink
                href={backHref}
                className="cf-btn cf-btn--secondary"
              >
                <ArrowLeft size={14} />
                Back to editor
              </BackLink>
            ) : null}
          </div>
        </div>

        {loadStatus === "error" ? (
          <p className="mt-4 rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
            {loadMessage || "Image library could not be loaded."}
          </p>
        ) : null}

        {reactionMessage ? (
          <p className="mt-4 rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
            {reactionMessage}
          </p>
        ) : null}

        {deleteMessage ? (
          <p className="mt-4 rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-4 py-3 text-sm text-[var(--gold-ornament)]">
            {deleteMessage}
          </p>
        ) : null}

        {reassignmentMessage ? (
          <p className="mt-4 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {reassignmentMessage}
          </p>
        ) : null}
      </div>

      {libraryPassPanel ? (
        <LibraryPassOwnerPanel
          panel={libraryPassPanel}
          onToggleSales={onToggleLibraryPassSales}
        />
      ) : null}

      <section className="mt-6 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
        <div className="flex items-center gap-3">
          <Star size={18} className="text-[var(--gold-ornament)]" />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Featured Images
            </p>
            <h3 className="mt-1 font-display text-3xl">Primary Slots</h3>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {featuredSlotCards.map((slot) => (
            <FeaturedSlotCard
              key={slot.slotKey}
              slot={slot}
              onOpenPreview={onOpenPreview}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
              renderQuickActions={renderQuickActions}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Visible Library
            </p>
            <h3 className="mt-1 font-display text-3xl">Character Images</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              These images are available to the character library. Only eligible
              visible images can be assigned to the featured slots.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)]">
            {visibleSummary}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {eligibilityFilterOptions.map((option) => {
            const active = eligibilityFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSetEligibilityFilter?.(option.value)}
                className={`inline-flex min-h-[var(--control-sm)] items-center rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                  active
                    ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                    : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}

          <select
            value={sortMode}
            onChange={(event) => onSetSortMode?.(event.target.value)}
            className="min-h-[var(--control-sm)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-ornament)] outline-none transition hover:border-[var(--gold-action)]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-[var(--ink-dim)]">Loading images...</p>
        ) : null}

        {!isLoading && !hasImages ? <EmptyLibraryState /> : null}

        {!isLoading && noMatchingImages ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
            <ImageIcon size={28} className="mx-auto text-[var(--gold-ornament)]" />
            <p className="mt-4 font-display text-3xl">No matching images</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
              Try changing the filter or sort selection.
            </p>
          </div>
        ) : null}

        {visibleImages.length ? (
          <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 2xl:columns-4">
            {visibleImages.map((image, index) => (
              <LibraryImageCard
                key={image.id}
                image={image}
                priority={index < eagerImageCount}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onOpenPreview={onOpenPreview}
                onAssignFeaturedSlot={onAssignFeaturedSlot}
                onHideImage={onHideImage}
                onDeleteImage={onDeleteImage}
                renderQuickActions={renderQuickActions}
              />
            ))}
          </div>
        ) : null}

        {hasMoreVisibleImages ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onLoadMoreVisibleImages}
              className="cf-btn cf-btn--secondary"
            >
              Load more
            </button>
          </div>
        ) : null}
      </section>

      {hiddenImages.length ? (
        <section className="mt-6 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Hidden
            </p>
            <h3 className="mt-1 font-display text-3xl">
              Hidden From Character Library
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
              Hidden images remain available to their image owner in Image
              Studio, but are not shown in this character library.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {hiddenImages.map((image) => (
              <HiddenImageCard
                key={image.id}
                image={image}
                onToggleLike={onToggleLike}
                onToggleBookmark={onToggleBookmark}
                onOpenPreview={onOpenPreview}
                onShowImage={onShowImage}
                onDeleteImage={onDeleteImage}
                renderQuickActions={renderQuickActions}
              />
            ))}
          </div>
        </section>
      ) : null}

      {lightboxProps && renderLightbox ? renderLightbox(lightboxProps) : null}
    </section>
  );
}


function LibraryPassOwnerPanel({ panel, onToggleSales }) {
  const ActionIcon =
    panel.actionIntent === "PAUSE_NEW_SALES"
      ? PauseCircle
      : PlayCircle;

  return (
    <section className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--surface-2)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              {panel.eyebrow}
            </p>

            {panel.loadStatus === "ready" ? (
              <span
                className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${
                  panel.salesEnabled
                    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
                    : "border-amber-400/25 bg-amber-400/10 text-amber-100"
                }`}
              >
                {panel.statusLabel}
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 font-display text-3xl">
            {panel.heading}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {panel.helper}
          </p>
        </div>

        {panel.loadStatus === "ready" ? (
          <button
            type="button"
            onClick={() => onToggleSales?.()}
            disabled={panel.actionDisabled}
            className={
              panel.actionTone === "CAUTION"
                ? "cf-btn cf-btn--secondary"
                : "cf-btn cf-btn--primary"
            }
          >
            {panel.isBusy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ActionIcon size={15} />
            )}
            {panel.actionLabel}
          </button>
        ) : null}
      </div>

      {panel.loadingMessage ? (
        <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--ink-dim)]">
          <Loader2
            size={15}
            className="animate-spin text-[var(--gold-ornament)]"
          />
          {panel.loadingMessage}
        </div>
      ) : null}

      {panel.message ? (
        <p
          className={`mt-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
            panel.messageTone === "success"
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
              : panel.messageTone === "error"
                ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
                : "border-white/10 bg-black/25 text-[var(--ink-dim)]"
          }`}
        >
          {panel.message}
        </p>
      ) : null}

      {panel.metrics?.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {panel.metrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4"
            >
              <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                {metric.label}
              </p>
              <p className="mt-2 font-display text-2xl">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {panel.tierSummary ? (
        <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-md)] border border-white/10 bg-black/25 px-4 py-3">
          <Coins
            size={15}
            className="mt-0.5 shrink-0 text-[var(--gold-ornament)]"
          />
          <p className="text-sm leading-6 text-[var(--ink-dim)]">
            {panel.tierSummary}
          </p>
        </div>
      ) : null}

      {panel.expandedTierMessage ? (
        <p className="mt-3 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-4 py-3 text-sm text-[var(--gold-ornament)]">
          {panel.expandedTierMessage}
        </p>
      ) : null}

      {panel.salesPausedMessage ? (
        <p className="mt-3 rounded-[var(--radius-md)] border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {panel.salesPausedMessage}
        </p>
      ) : null}

      {panel.publicLiveWarning ? (
        <p className="mt-3 rounded-[var(--radius-md)] border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {panel.publicLiveWarning}
        </p>
      ) : null}
    </section>
  );
}

function FeaturedSlotCard({
  slot,
  onOpenPreview,
  onToggleLike,
  onToggleBookmark,
  renderQuickActions,
}) {
  const image = slot.image;
  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
      <div className="aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-black/40">
        {image?.thumbnailUrl ? (
          <div className="group relative h-full w-full">
            <button
              type="button"
              onClick={() => onOpenPreview?.(image.id)}
              className="h-full w-full text-left"
            >
              <img
                src={image.thumbnailUrl}
                alt={slot.label}
                loading={slot.isPrimary ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={slot.isPrimary ? "high" : "low"}
                className="h-full w-full object-cover"
              />
            </button>
            {renderQuickActions?.({
              liked: image.liked,
              bookmarked: image.bookmarked,
              onToggleLike: () => onToggleLike?.(image.id),
              onToggleBookmark: () => onToggleBookmark?.(image.id),
              onExpand: () => onOpenPreview?.(image.id),
            })}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center">
            <div>
              <ImageIcon size={24} className="mx-auto text-[var(--gold-ornament)]" />
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                No image selected
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {slot.label}
      </p>
      {slot.isPrimary ? (
        <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
          Default identity reference image.
        </p>
      ) : null}
    </article>
  );
}

function LibraryImageCard({
  image,
  priority,
  onToggleLike,
  onToggleBookmark,
  onOpenPreview,
  onAssignFeaturedSlot,
  onHideImage,
  onDeleteImage,
  renderQuickActions,
}) {
  return (
    <article className="mb-4 inline-block w-full break-inside-avoid rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-3 align-top">
      <ImagePreview
        image={image}
        priority={priority}
        alt="Character library image"
        onOpen={() => onOpenPreview?.(image.id)}
        renderQuickActions={renderQuickActions}
        quickActionProps={{
          liked: image.liked,
          bookmarked: image.bookmarked,
          onToggleLike: () => onToggleLike?.(image.id),
          onToggleBookmark: () => onToggleBookmark?.(image.id),
          onExpand: () => onOpenPreview?.(image.id),
        }}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusPill label={image.moderationStatus} />
        <StatusPill label={image.contentRating} muted />
      </div>

      {!image.canUseAsFeatured ? (
        <p className="mt-3 rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs leading-5 text-[var(--status-danger)]">
          This image cannot be used as a featured image until it is cleared or
          approved.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {image.slotActions.map((action) => (
            <button
              key={action.slotKey}
              type="button"
              disabled={action.busy || action.disabled}
              onClick={() =>
                onAssignFeaturedSlot?.(action.slotKey, image.id)
              }
              className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] transition disabled:cursor-not-allowed disabled:opacity-45 ${
                action.active
                  ? "border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
                  : "border-dashed border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--gold-action)] hover:text-[var(--ink)]"
              }`}
            >
              {action.busy
                ? "Saving..."
                : action.active
                  ? "Selected"
                  : action.label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onHideImage?.(image.id)}
        disabled={!image.id || image.hideBusy}
        className="cf-btn cf-btn--secondary cf-btn--sm mt-3 w-full"
      >
        <EyeOff size={13} />
        {image.hideBusy ? "Hiding..." : "Hide"}
      </button>

      <DeleteButton image={image} onDeleteImage={onDeleteImage} />
    </article>
  );
}

function HiddenImageCard({
  image,
  onToggleLike,
  onToggleBookmark,
  onOpenPreview,
  onShowImage,
  onDeleteImage,
  renderQuickActions,
}) {
  return (
    <article className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-3 opacity-80">
      <ImagePreview
        image={image}
        grayscale
        alt="Hidden character library image"
        onOpen={() => onOpenPreview?.(image.id)}
        renderQuickActions={renderQuickActions}
        quickActionProps={{
          liked: image.liked,
          bookmarked: image.bookmarked,
          onToggleLike: () => onToggleLike?.(image.id),
          onToggleBookmark: () => onToggleBookmark?.(image.id),
          onExpand: () => onOpenPreview?.(image.id),
        }}
      />

      <button
        type="button"
        onClick={() => onShowImage?.(image.id)}
        disabled={!image.id || image.showBusy}
        className="cf-btn cf-btn--secondary cf-btn--sm mt-3 w-full"
      >
        <Eye size={13} />
        {image.showBusy ? "Restoring..." : "Show"}
      </button>

      <DeleteButton image={image} onDeleteImage={onDeleteImage} />
    </article>
  );
}

function ImagePreview({
  image,
  priority = false,
  grayscale = false,
  alt,
  onOpen,
  renderQuickActions,
  quickActionProps,
}) {
  const imageUrl = grayscale ? image.displayUrl : image.thumbnailUrl;

  return (
    <div
      style={{ aspectRatio: image.aspectRatio }}
      className={`group relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 text-left ${
        imageUrl
          ? "transition hover:border-[var(--gold-ornament)]/35"
          : "cursor-default"
      }`}
    >
      {imageUrl ? (
        <>
          <button type="button" onClick={onOpen} className="h-full w-full text-left">
            <img
              src={imageUrl}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "low"}
              className={`h-full w-full object-cover ${grayscale ? "grayscale" : ""}`}
            />
          </button>
          {renderQuickActions?.(quickActionProps)}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4 text-center">
          <div>
            <ImageIcon size={24} className="mx-auto text-[var(--gold-ornament)]" />
            <p className="mt-3 break-all text-xs leading-5 text-[var(--ink-dim)]">
              {image.label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteButton({ image, onDeleteImage }) {
  return (
    <button
      type="button"
      onClick={() => onDeleteImage?.(image.id)}
      disabled={!image.id || image.deleting}
      className="cf-btn cf-btn--danger cf-btn--sm mt-2 w-full"
    >
      <Trash2 size={13} />
      {image.deleting ? "Deleting..." : "Delete image"}
    </button>
  );
}

function StatusPill({ label, muted = false }) {
  return (
    <span
      className={`inline-flex h-[var(--space-6)] items-center gap-[var(--space-1)] rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] font-medium ${
        muted ? "text-[var(--ink-dim)]" : "text-[var(--gold-bright)]"
      }`}
    >
      <ShieldCheck size={11} />
      {label}
    </span>
  );
}

function EmptyLibraryState() {
  return (
    <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center">
      <ImageIcon size={28} className="mx-auto text-[var(--gold-ornament)]" />
      <p className="mt-4 font-display text-3xl">No images yet</p>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
        Generated images associated with this creation will appear here once
        Image Studio produces them.
      </p>
    </div>
  );
}
