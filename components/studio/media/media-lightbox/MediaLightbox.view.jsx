import {
  Bookmark,
  Download,
  Flag,
  Heart,
  Image as ImageIcon,
  Info,
  Loader2,
  RefreshCw,
  Share2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

// B7 viewer final (22 Aug 2026, Fable law review, ED1F propagation
// plan group G3), superseding the prior sidebar-plus-actions-panel
// layout. This surface does not compose KitModalFrame (it predates
// that package and keeps its own full-screen shell), so the veil,
// close control, and glass header/bottom-bar chrome are all owned
// here directly; no cross-boundary touch was needed to deliver B7 for
// this package, unlike KitImageOverlay. Matches the B7 action set:
// six-icon header row (delete, report, details, download, bookmark,
// like) and a three-action gold-ink bottom bar (Generate Variant,
// Reassign Asset, Share). Reassign Asset always renders disabled: an
// honest stub, CR-055, filed by this build since no backend operation
// exists yet. Delete routes through the B5 danger-confirm panel
// (`deleteConfirmOpen`, owned by the ViewModel per this package's
// existing "deletion confirmation" ownership line) instead of
// the browser's native confirm() dialog.
export default function MediaLightboxView({
  mediaItems = [],
  activeMedia = null,
  activeId = "",
  modeLabel = "Media",
  imageStudioHref = "/studio/image-studio",
  allowDownload = false,
  showStudioActions = true,
  showDeleteAction = false,
  isLiked = false,
  isBookmarked = false,
  shareMessage = "",
  reportReasonOptions = [],
  detailsDialog = {},
  reportDialog = {},
  deleteConfirmOpen = false,
  onSelectMedia = null,
  onClose = null,
  onLike = null,
  onBookmark = null,
  onShare = null,
  onRequestDelete = null,
  onCancelDelete = null,
  onConfirmDelete = null,
  onOpenDetails = null,
  onCloseDetails = null,
  onOpenReport = null,
  onCloseReport = null,
  onReportReasonKeyChange = null,
  onReportReasonTextChange = null,
  onSubmitReport = null,
  LinkComponent = "a",
}) {
  if (!activeMedia) return null;

  const title = activeMedia.title || "Untitled";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={modeLabel ? `${modeLabel}: ${title}` : title}
      className="fixed inset-0 z-[90] flex flex-col items-center bg-[var(--chrome-wash)] backdrop-blur-[var(--blur-panel)]"
    >
      {/* B7 close control: outside top-right on desktop, floating
          44px glass control bottom-right at 390. Two controls, one
          hidden per breakpoint, rather than one repositioned control:
          Tailwind's default-scale utilities do not reliably override
          each other by source order in this build (see the modal
          frame's own R4 veil-padding precedent). */}
      <button
        type="button"
        onClick={() => onClose?.()}
        aria-label="Close media viewer"
        className="fixed right-[var(--space-4)] top-[var(--space-4)] z-[100] hidden h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] text-[var(--ink-dim)] backdrop-blur-[var(--blur-panel)] transition-colors hover:text-[var(--ink)] min-[700px]:flex"
      >
        <X size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onClose?.()}
        aria-label="Close media viewer"
        className="fixed bottom-[var(--space-4)] right-[var(--space-4)] z-[100] flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] text-[var(--ink-dim)] backdrop-blur-[var(--blur-panel)] transition-colors hover:text-[var(--ink)] min-[700px]:hidden"
      >
        <X size={18} aria-hidden="true" />
      </button>

      <div className="flex h-full w-full min-h-0 flex-col items-center gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-3)] min-[700px]:px-[var(--space-6)] min-[700px]:py-[var(--space-4)]">
        {deleteConfirmOpen ? (
          <div className="flex flex-1 items-center justify-center">
            <DeleteConfirmPanel
              onCancelDelete={() => onCancelDelete?.()}
              onConfirmDelete={() => onConfirmDelete?.()}
            />
          </div>
        ) : (
          <>
            <ViewerHeader
              title={title}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLike={() => onLike?.()}
              onBookmark={() => onBookmark?.()}
              allowDownload={allowDownload}
              downloadUrl={activeMedia.imageUrl}
              showDeleteAction={showDeleteAction}
              onRequestDelete={() => onRequestDelete?.()}
              onOpenReport={() => onOpenReport?.()}
              onOpenDetails={() => onOpenDetails?.()}
            />

            {shareMessage ? (
              <p className="rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--fill)] px-[var(--space-4)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[0.16em] text-[var(--gold-bright)]">
                {shareMessage}
              </p>
            ) : null}

            <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
              {activeMedia.imageUrl ? (
                <img
                  src={activeMedia.imageUrl}
                  alt={title}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full max-h-full w-full max-w-full object-contain"
                />
              ) : (
                <div className="p-[var(--space-8)] text-center">
                  <ImageIcon
                    size={48}
                    aria-hidden="true"
                    className="mx-auto text-[var(--gold-ornament)]"
                  />
                  <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
                    No preview available.
                  </p>
                </div>
              )}
            </div>

            <ViewerBottomBar
              showStudioActions={showStudioActions}
              imageStudioHref={imageStudioHref}
              LinkComponent={LinkComponent}
              onShare={() => onShare?.()}
            />

            {mediaItems.length > 1 ? (
              <div className="flex w-full max-w-[min(92vw,64rem)] flex-none gap-[var(--space-2)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {mediaItems.map((item) => (
                  <ThumbnailButton
                    key={item.id}
                    item={item}
                    active={item.id === activeId}
                    onClick={() => onSelectMedia?.(item)}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      {detailsDialog.open ? (
        <DetailsDialog {...detailsDialog} onClose={() => onCloseDetails?.()} />
      ) : null}

      {reportDialog.open ? (
        <ReportDialog
          {...reportDialog}
          reasonOptions={reportReasonOptions}
          onReasonKeyChange={onReportReasonKeyChange}
          onReasonTextChange={onReportReasonTextChange}
          onSubmit={onSubmitReport}
          onClose={() => onCloseReport?.()}
        />
      ) : null}
    </div>
  );
}

// Quiet-ink icon button, the header's six-icon row (B7). Active
// (bookmark, like) reuses the same recipe KitImageOverlay's viewer
// header uses, so the two G3 viewer packages read as one family.
function ViewerIconButton({
  label,
  active = false,
  danger = false,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border transition-colors ${
        active
          ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
          : danger
            ? "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--status-danger)] hover:border-[var(--status-danger)]"
            : "border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

// B7: two-line glass header, --panel-glass paired with --blur-panel
// (2px). Line one is the centered title; line two is the six-icon row
// in quiet ink (delete, report, details, download, bookmark, like).
// Delete and download stay conditional on showDeleteAction/
// allowDownload, the same permission gating this surface already
// carried; the law's six-action set is honored whenever the caller
// grants both.
function ViewerHeader({
  title,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  allowDownload,
  downloadUrl,
  showDeleteAction,
  onRequestDelete,
  onOpenReport,
  onOpenDetails,
}) {
  return (
    <div className="pointer-events-auto flex w-full max-w-[min(92vw,64rem)] flex-none flex-col gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] px-[var(--space-4)] py-[var(--space-3)] backdrop-blur-[var(--blur-panel)]">
      <h2 className="line-clamp-1 text-center font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
        {title}
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-[var(--space-2)]">
        {showDeleteAction ? (
          <ViewerIconButton label="Delete" danger onClick={onRequestDelete}>
            <Trash2 size={17} aria-hidden="true" />
          </ViewerIconButton>
        ) : null}
        <ViewerIconButton label="Report" onClick={onOpenReport}>
          <Flag size={17} aria-hidden="true" />
        </ViewerIconButton>
        <ViewerIconButton label="Details" onClick={onOpenDetails}>
          <Info size={17} aria-hidden="true" />
        </ViewerIconButton>
        {allowDownload ? (
          <a
            href={downloadUrl || "#"}
            download
            title="Download"
            aria-label="Download"
            className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors hover:border-[var(--gold-ornament)] hover:text-[var(--ink)]"
          >
            <Download size={17} aria-hidden="true" />
          </a>
        ) : null}
        <ViewerIconButton
          label={isBookmarked ? "Remove bookmark" : "Bookmark"}
          active={isBookmarked}
          onClick={onBookmark}
        >
          <Bookmark size={17} fill={isBookmarked ? "currentColor" : "none"} aria-hidden="true" />
        </ViewerIconButton>
        <ViewerIconButton label={isLiked ? "Unlike" : "Like"} active={isLiked} onClick={onLike}>
          <Heart size={17} fill={isLiked ? "currentColor" : "none"} aria-hidden="true" />
        </ViewerIconButton>
      </div>
    </div>
  );
}

// B7: gold-ink bottom bar, Generate Variant / Reassign Asset / Share,
// --gold-action ink with --gold-bright hover, width-matched to the
// header (same max-width and self-centering).
function ViewerBarLink({ href, LinkComponent: Component, icon, label }) {
  return (
    <Component
      href={href}
      className="inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--gold-action)] transition-colors hover:text-[var(--gold-bright)]"
    >
      {icon}
      {label}
    </Component>
  );
}

function ViewerBarButton({ onClick, icon, label, disabled = false, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      className="inline-flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--gold-action)] transition-colors disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:text-[var(--gold-bright)]"
    >
      {icon}
      {label}
    </button>
  );
}

function ViewerBottomBar({ showStudioActions, imageStudioHref, LinkComponent, onShare }) {
  return (
    <div className="pointer-events-auto flex w-full max-w-[min(92vw,64rem)] flex-none items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] px-[var(--space-2)] py-[var(--space-1)] backdrop-blur-[var(--blur-panel)]">
      {showStudioActions ? (
        <ViewerBarLink
          href={imageStudioHref}
          LinkComponent={LinkComponent}
          icon={<Sparkles size={16} aria-hidden="true" />}
          label="Generate Variant"
        />
      ) : null}
      {/* Honest stub, CR-055 (filed by this build, ED1F propagation
          plan section B item 9): no backend operation exists yet. */}
      <ViewerBarButton
        label="Reassign Asset"
        icon={<RefreshCw size={16} aria-hidden="true" />}
        disabled
        title="Reassign Asset is not wired yet (CR-055)"
      />
      <ViewerBarButton
        label="Share"
        icon={<Share2 size={16} aria-hidden="true" />}
        onClick={onShare}
      />
    </div>
  );
}

// B5 danger-confirm recipe, CR-054 placeholder copy: the recovery
// window is not yet ruled to a single number, so the copy carries the
// literal "[X] days" placeholder rather than a guessed figure.
// Replaces the browser's native confirm() dialog (docs/plans/ED1F-PROPAGATION-PLAN.md
// manifest item 3).
function DeleteConfirmPanel({ onCancelDelete, onConfirmDelete }) {
  return (
    <div className="pointer-events-auto w-full max-w-[26rem] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--panel-glass)] p-[var(--space-6)] backdrop-blur-[var(--blur-panel)]">
      <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
        Delete this image?
      </h2>
      <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        It moves to a recovery window for [X] days before it is gone for
        good. This also removes it from any character libraries and
        featured slots.
      </p>
      <div aria-hidden="true" className="my-[var(--space-5)] h-px bg-[image:var(--line-fade)]" />
      <div className="flex items-center justify-between gap-[var(--space-3)]">
        <button type="button" onClick={onCancelDelete} className="cf-btn cf-btn--secondary">
          Keep image
        </button>
        <button type="button" onClick={onConfirmDelete} className="cf-btn cf-btn--danger-filled">
          Delete
        </button>
      </div>
    </div>
  );
}

function ThumbnailButton({ item, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] border transition-colors ${
        active
          ? "border-[var(--gold-bright)] bg-[var(--fill)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-2)] hover:border-[var(--gold-ornament)]"
      }`}
    >
      {item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon size={16} aria-hidden="true" className="text-[var(--gold-ornament)]" />
        </div>
      )}
    </button>
  );
}

function DetailsDialog({
  status = "idle",
  message = "",
  publicRows = [],
  privateRows = [],
  canViewPrivate = false,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[var(--scrim-strong)] p-[var(--space-4)] backdrop-blur-[var(--blur-panel)]">
      <section className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[image:var(--grad-panel-lift)] p-[var(--space-5)] shadow-[var(--shadow-modal)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-start justify-between gap-[var(--space-4)]">
          <div>
            <p className="text-[length:var(--text-label)] uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Image Details
            </p>
            <h3 className="mt-[var(--space-1)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
              Generation information
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close image details"
            className="flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        {status === "loading" ? (
          <div className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-5)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
            <Loader2 className="mr-[var(--space-2)] inline animate-spin" size={16} aria-hidden="true" />
            Loading image details...
          </div>
        ) : null}

        {status === "error" ? (
          <p className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-[var(--status-danger)] bg-[var(--status-danger-fill)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--status-danger)]">
            {message || "Image details could not be loaded."}
          </p>
        ) : null}

        {status === "success" ? (
          <div className="mt-[var(--space-5)] space-y-[var(--space-5)]">
            <DetailRows rows={publicRows} />

            {canViewPrivate ? (
              <div>
                <p className="mb-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                  Private generation data
                </p>
                {privateRows.length ? (
                  <DetailRows rows={privateRows} />
                ) : (
                  <p className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
                    No prompt/settings metadata was found for this image.
                  </p>
                )}
              </div>
            ) : (
              <p className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-6 text-[var(--ink-dim)]">
                Prompt and generation settings are visible only to the image
                creator or the owner of the linked creation.
              </p>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function DetailRows({ rows = [] }) {
  return (
    <div className="grid gap-[var(--space-3)]">
      {rows.map((row) => (
        <div
          key={`${row.label}:${row.value}`}
          className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)]"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
            {row.label}
          </p>
          <p className="mt-[var(--space-1)] whitespace-pre-wrap break-words text-[length:var(--text-ui)] leading-6 text-[var(--ink)]">
            {row.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ReportDialog({
  title = "Image",
  reasonKey = "sexual_content",
  reasonText = "",
  status = "idle",
  message = "",
  reasonOptions = [],
  onReasonKeyChange,
  onReasonTextChange,
  onSubmit,
  onClose,
}) {
  const isSubmitting = status === "loading";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[var(--scrim-strong)] p-[var(--space-4)] backdrop-blur-[var(--blur-panel)]">
      <section className="w-full max-w-xl rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[image:var(--grad-panel-lift)] p-[var(--space-5)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-[var(--space-4)]">
          <div>
            <p className="text-[length:var(--text-label)] uppercase tracking-[0.22em] text-[var(--status-danger)]">
              Report Image
            </p>
            <h3 className="mt-[var(--space-1)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
              {title || "Image"}
            </h3>
            <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-6 text-[var(--ink-dim)]">
              This creates a moderation report record. It does not
              automatically hide or delete the image.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close report dialog"
            className="flex h-[var(--control-sm)] w-[var(--control-sm)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-[var(--space-5)] space-y-[var(--space-4)]">
          <label className="block">
            <span className="text-[length:var(--text-label)] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Reason
            </span>
            <select
              value={reasonKey}
              onChange={(event) => onReasonKeyChange?.(event.target.value)}
              className="mt-[var(--space-2)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink)] outline-none transition-colors hover:border-[var(--gold-ornament)]"
            >
              {reasonOptions.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[length:var(--text-label)] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Optional note
            </span>
            <textarea
              value={reasonText}
              onChange={(event) => onReasonTextChange?.(event.target.value)}
              rows={4}
              maxLength={2000}
              className="mt-[var(--space-2)] w-full resize-none rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-6 text-[var(--ink)] outline-none transition-colors hover:border-[var(--gold-ornament)]"
              placeholder="Add context for review..."
            />
          </label>

          {message ? (
            <p
              className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] ${
                status === "success"
                  ? "border-[var(--gold-ornament)] bg-[var(--fill)] text-[var(--gold-ornament)]"
                  : "border-[var(--status-danger)] bg-[var(--status-danger-fill)] text-[var(--status-danger)]"
              }`}
            >
              {message}
            </p>
          ) : null}

          <div className="flex justify-end gap-[var(--space-2)]">
            {status === "success" ? (
              <button type="button" onClick={onClose} className="cf-btn cf-btn--primary">
                Close
              </button>
            ) : (
              <>
                <button type="button" onClick={onClose} className="cf-btn cf-btn--secondary">
                  Close
                </button>

                <button type="submit" disabled={isSubmitting} className="cf-btn cf-btn--danger-filled">
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Flag size={14} aria-hidden="true" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit report"}
                </button>
              </>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
