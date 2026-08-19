import {
  ArrowRightLeft,
  Bookmark,
  Coins,
  Download,
  Flag,
  Heart,
  Image as ImageIcon,
  Info,
  Loader2,
  MoreHorizontal,
  Share2,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";

export default function MediaLightboxView({
  mediaItems = [],
  activeMedia = null,
  activeId = "",
  modeLabel = "Media",
  imageStudioHref = "/studio/image-studio",
  allowDownload = false,
  showStudioActions = true,
  showDeleteAction = false,
  showReassignAction = false,
  isLiked = false,
  isBookmarked = false,
  shareMessage = "",
  reportReasonOptions = [],
  detailsDialog = {},
  reassignDialog = {},
  reassignmentPresentation = {},
  reportDialog = {},
  onSelectMedia = null,
  onClose = null,
  onLike = null,
  onBookmark = null,
  onShare = null,
  onDelete = null,
  onOpenReassign = null,
  onCloseReassign = null,
  onReassignDestinationChange = null,
  onSubmitReassign = null,
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

  return (
    <div className="fixed inset-0 z-[90] flex bg-black/70 backdrop-blur-[var(--blur-panel)]">
      <aside className="hidden w-20 shrink-0 overflow-y-auto border-r border-white/10 bg-black/80 p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:block">
        <button
          type="button"
          onClick={onClose}
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/40 hover:text-[var(--ink)]"
          aria-label="Close media viewer"
        >
          <X size={18} />
        </button>

        <div className="space-y-2">
          {mediaItems.map((item) => (
            <ThumbnailButton
              key={item.id}
              item={item}
              active={item.id === activeId}
              onClick={() => onSelectMedia?.(item)}
            />
          ))}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              {modeLabel}
            </p>
            <h2 className="mt-1 line-clamp-1 font-display text-3xl">
              {activeMedia.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <IconActionButton
              active={isLiked}
              label={isLiked ? "Unlike" : "Like"}
              onClick={onLike}
            >
              <Heart size={17} fill={isLiked ? "currentColor" : "none"} />
            </IconActionButton>

            <IconActionButton
              active={isBookmarked}
              label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              onClick={onBookmark}
            >
              <Bookmark
                size={17}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </IconActionButton>

            <IconActionButton label="Share" onClick={onShare}>
              <Share2 size={17} />
            </IconActionButton>

            {allowDownload ? (
              <a
                href={activeMedia.imageUrl || "#"}
                download
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/35 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                title="Download"
              >
                <Download size={17} />
              </a>
            ) : null}

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/35 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)] md:hidden"
              aria-label="Close media viewer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {shareMessage ? (
          <p className="border-b border-white/10 bg-[var(--gold-ornament)]/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            {shareMessage}
          </p>
        ) : null}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_280px]">
          <div className="flex min-h-0 items-center justify-center overflow-hidden bg-black">
            {activeMedia.imageUrl ? (
              <img
                src={activeMedia.imageUrl}
                alt={activeMedia.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-full max-h-full w-full max-w-full object-contain"
              />
            ) : (
              <div className="p-8 text-center">
                <ImageIcon
                  size={48}
                  className="mx-auto text-[var(--gold-ornament)]"
                />
                <p className="mt-4 text-sm text-[var(--ink-dim)]">
                  No preview available.
                </p>
              </div>
            )}
          </div>

          <aside className="border-t border-white/10 bg-black/75 p-4 lg:border-l lg:border-t-0">
            <div className="rounded-[var(--radius-md)] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                Actions
              </p>

              <div className="mt-4 grid gap-2">
                {showStudioActions ? (
                  <LinkComponent
                    href={imageStudioHref}
                    className="cf-btn cf-btn--primary"
                  >
                    <Sparkles size={14} />
                    Generate variant
                  </LinkComponent>
                ) : null}

                <LightboxActionButton onClick={onOpenDetails}>
                  <Info size={14} />
                  Details
                </LightboxActionButton>

                {showReassignAction ? (
                  <LightboxActionButton onClick={onOpenReassign}>
                    <ArrowRightLeft size={14} />
                    {reassignmentPresentation.actionLabel ||
                      "Reassign Asset"}
                  </LightboxActionButton>
                ) : null}

                <LightboxActionButton onClick={onOpenReport} danger>
                  <Flag size={14} />
                  Report
                </LightboxActionButton>

                <StubToolbarButton>
                  <Wand2 size={14} />
                  Remix soon
                </StubToolbarButton>

                <StubToolbarButton>
                  <ImageIcon size={14} />
                  Use as reference soon
                </StubToolbarButton>

                <StubToolbarButton>
                  <MoreHorizontal size={14} />
                  More soon
                </StubToolbarButton>

                {showDeleteAction ? (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="cf-btn cf-btn--danger"
                  >
                    <Trash2 size={14} />
                    Delete image
                  </button>
                ) : null}
              </div>

              {!allowDownload ? (
                <p className="mt-4 text-xs leading-5 text-[var(--ink-dim)]">
                  Public catalogue images can be liked, bookmarked, shared, or
                  used to start a new generation flow. Direct download is not
                  available here.
                </p>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-black/80 p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
          {mediaItems.map((item) => (
            <ThumbnailButton
              key={item.id}
              item={item}
              active={item.id === activeId}
              onClick={() => onSelectMedia?.(item)}
              mobile
            />
          ))}
        </div>
      </main>

      {detailsDialog.open ? (
        <DetailsDialog {...detailsDialog} onClose={onCloseDetails} />
      ) : null}

      {reassignDialog.open ? (
        <ReassignDialog
          {...reassignDialog}
          presentation={reassignmentPresentation}
          onDestinationChange={onReassignDestinationChange}
          onSubmit={onSubmitReassign}
          onClose={onCloseReassign}
        />
      ) : null}

      {reportDialog.open ? (
        <ReportDialog
          {...reportDialog}
          reasonOptions={reportReasonOptions}
          onReasonKeyChange={onReportReasonKeyChange}
          onReasonTextChange={onReportReasonTextChange}
          onSubmit={onSubmitReport}
          onClose={onCloseReport}
        />
      ) : null}
    </div>
  );
}

function ThumbnailButton({ item, active = false, onClick, mobile = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        mobile ? "h-16 w-16 shrink-0" : "aspect-square w-full"
      } overflow-hidden rounded-lg border transition ${
        active
          ? "border-pink-400 bg-pink-400/15"
          : "border-white/10 bg-black/45 hover:border-[var(--gold-ornament)]/40"
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
          <ImageIcon size={16} className="text-[var(--gold-ornament)]" />
        </div>
      )}
    </button>
  );
}

function IconActionButton({ active = false, label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
        active
          ? "border-pink-400/50 bg-pink-400/15 text-pink-300"
          : "border-white/10 bg-black/35 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
      }`}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}

function LightboxActionButton({ danger = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cf-btn ${danger ? "cf-btn--danger" : "cf-btn--secondary"}`}
    >
      {children}
    </button>
  );
}

function StubToolbarButton({ children }) {
  return (
    <button
      type="button"
      disabled
      className="cf-btn cf-btn--secondary"
    >
      {children}
    </button>
  );
}


function ReassignDialog({
  status = "idle",
  message = "",
  coinCost = 1,
  sourceCreation = null,
  targets = [],
  destinationCreationId = "",
  presentation = {},
  onDestinationChange,
  onSubmit,
  onClose,
}) {
  const isLoading =
    presentation.isLoading ??
    status === "loading";
  const isSubmitting =
    presentation.isSubmitting ??
    status === "submitting";
  const isSuccess =
    presentation.isSuccess ??
    status === "success";
  const canSubmit =
    presentation.canSubmit ??
    (
      !isLoading &&
      !isSubmitting &&
      !isSuccess &&
      Boolean(destinationCreationId) &&
      targets.length > 0
    );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[var(--blur-panel)]">
      <section className="w-full max-w-xl rounded-[var(--radius-md)] border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Reassign Image
            </p>
            <h3 className="mt-1 font-display text-3xl">
              Move to another asset
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              {presentation.ownershipMessage ||
                "Only images you created can be moved, and both the current and destination assets must belong to you."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-white/10 bg-black/40 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)] disabled:cursor-wait disabled:opacity-60"
            aria-label="Close image reassignment"
          >
            <X size={17} />
          </button>
        </div>

        {isLoading ? (
          <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-5 text-sm text-[var(--ink-dim)]">
            <Loader2
              className="mr-2 inline animate-spin"
              size={16}
            />
            {presentation.statusLabel ||
              "Loading your eligible assets..."}
          </div>
        ) : null}

        {!isLoading && sourceCreation ? (
          <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              Current asset
            </p>
            <p className="mt-1 text-sm text-[var(--ink)]">
              {sourceCreation.title}
              {sourceCreation.type ? (
                <span className="ml-2 text-xs text-[var(--ink-dim)]">
                  {sourceCreation.type}
                </span>
              ) : null}
            </p>
          </div>
        ) : null}

        {!isLoading && !isSuccess ? (
          <form
            onSubmit={onSubmit}
            className="mt-4 space-y-4"
          >
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                Destination asset
              </span>
              <select
                value={destinationCreationId}
                onChange={(event) =>
                  onDestinationChange?.(
                    event.target.value
                  )
                }
                disabled={
                  isSubmitting ||
                  !targets.length
                }
                className="mt-2 w-full rounded-[var(--radius-md)] border border-white/10 bg-black/50 px-4 py-3 text-sm text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {!targets.length ? (
                  <option value="">
                    {presentation.emptyTargetLabel ||
                      "No other owned assets available"}
                  </option>
                ) : null}
                {targets.map((target) => (
                  <option
                    key={target.id}
                    value={target.id}
                  >
                    {target.title} — {target.type}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-4 py-3 text-sm text-[var(--gold-ornament)]">
              <Coins size={16} />
              {presentation.costLabel ||
                `Cost: ${coinCost} ${
                  coinCost === 1
                    ? "Coin"
                    : "Coins"
                }`}
            </div>

            <p className="text-xs leading-5 text-[var(--ink-dim)]">
              {presentation.moveSemanticsMessage ||
                "Reassignment moves the same image. It does not duplicate the file. If this image is featured or selected as a visual reference on the current asset, those source references are cleared automatically."}
            </p>

            {message ? (
              <p
                className={`rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
                  presentation.statusTone === "ERROR"
                    ? "border-red-500/30 bg-red-500/10 text-red-200"
                    : "border-white/10 bg-black/35 text-[var(--ink-dim)]"
                }`}
              >
                {message}
              </p>
            ) : null}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="cf-btn cf-btn--secondary"
              >
                {presentation.closeLabel ||
                  "Cancel"}
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="cf-btn cf-btn--primary"
              >
                {isSubmitting ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <ArrowRightLeft size={14} />
                )}
                {presentation.submitLabel ||
                  `Reassign for ${coinCost} ${
                    coinCost === 1
                      ? "Coin"
                      : "Coins"
                  }`}
              </button>
            </div>
          </form>
        ) : null}

        {isSuccess ? (
          <div className="mt-5">
            <p className="rounded-[var(--radius-md)] border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {message ||
                presentation.statusLabel ||
                "Image reassigned."}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="cf-btn cf-btn--primary"
              >
                {presentation.closeLabel ||
                  "Close"}
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[var(--blur-panel)]">
      <section className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-md)] border border-white/10 bg-zinc-950 p-5 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              Image Details
            </p>
            <h3 className="mt-1 font-display text-3xl">
              Generation information
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
            aria-label="Close image details"
          >
            <X size={17} />
          </button>
        </div>

        {status === "loading" ? (
          <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-5 text-sm text-[var(--ink-dim)]">
            <Loader2 className="mr-2 inline animate-spin" size={16} />
            Loading image details...
          </div>
        ) : null}

        {status === "error" ? (
          <p className="mt-5 rounded-[var(--radius-md)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {message || "Image details could not be loaded."}
          </p>
        ) : null}

        {status === "success" ? (
          <div className="mt-5 space-y-5">
            <DetailRows rows={publicRows} />

            {canViewPrivate ? (
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                  Private generation data
                </p>
                {privateRows.length ? (
                  <DetailRows rows={privateRows} />
                ) : (
                  <p className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
                    No prompt/settings metadata was found for this image.
                  </p>
                )}
              </div>
            ) : (
              <p className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">
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
    <div className="grid gap-3">
      {rows.map((row) => (
        <div
          key={`${row.label}:${row.value}`}
          className="rounded-[var(--radius-md)] border border-white/10 bg-white/[0.04] px-4 py-3"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
            {row.label}
          </p>
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--ink)]">
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[var(--blur-panel)]">
      <section className="w-full max-w-xl rounded-[var(--radius-md)] border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-red-200">
              Report Image
            </p>
            <h3 className="mt-1 font-display text-3xl">{title || "Image"}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              This creates a moderation report record. It does not automatically
              hide or delete the image.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
            aria-label="Close report dialog"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Reason
            </span>
            <select
              value={reasonKey}
              onChange={(event) => onReasonKeyChange?.(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35"
            >
              {reasonOptions.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Optional note
            </span>
            <textarea
              value={reasonText}
              onChange={(event) => onReasonTextChange?.(event.target.value)}
              rows={4}
              maxLength={2000}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition hover:border-[var(--gold-ornament)]/35"
              placeholder="Add context for review..."
            />
          </label>

          {message ? (
            <p
              className={`rounded-xl border px-4 py-3 text-sm ${
                status === "success"
                  ? "border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]"
                  : "border-red-500/30 bg-red-500/10 text-red-200"
              }`}
            >
              {message}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            {status === "success" ? (
              <button
                type="button"
                onClick={onClose}
                className="cf-btn cf-btn--primary"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="cf-btn cf-btn--secondary"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cf-btn cf-btn--danger"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Flag size={14} />
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
