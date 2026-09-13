"use client";

// KitShareSheet.view: stateless presentation of one share intent
// (contract 2.0.0, fe/share-og brief 1, follow-ups 1 and 2). Theme
// values only. A control you tap rises one step above the panel
// (cf-btn recipes); the link bed, a control you read and select, sinks
// one step below on --bed-deep. Gold only on the primary action and
// the status chip. One share action: Copy link, the gold primary, full
// width (follow-up 2: no native share). Layout (follow-up 2, item 3):
// an inside margin of one panel step on every side so nothing sits
// flush to the panel edge, the header inset past the frame's close
// control, one consistent step between header, preview, link field,
// and buttons; every button is the recipe's small variant, which the
// touch floor already lifts to 44px on coarse pointers, hugging its
// label with the recipe's padding.
import { Link as LinkIcon } from "lucide-react";

export const KIT_SHARE_SHEET_TITLE_ID = "kit-share-sheet-title";

// The inside margin: one panel step on every side, the top one step
// more so the grabber and the frame's close control sit in clear
// space; one consistent step between every block.
const SHEET_RECIPE =
  "flex min-w-0 flex-col gap-[var(--space-4)] p-[var(--space-6)] pt-[var(--space-8)]";
// The header stops short of the frame's close control (44px at
// space-3 from the right edge), so a long title never runs under it.
const HEADER_RECIPE = "flex min-w-0 flex-col gap-[var(--space-1)] pr-[var(--space-14)]";
const TITLE_RECIPE =
  "break-words font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] text-[var(--ink)]";

function Eyebrow() {
  return (
    <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
      Share
    </p>
  );
}

// The card and the panel share the lift gradient, so the preview's
// edge is its only boundary: the strong line (the sole-identifier
// step, 3:1) rather than the quiet one, ruled at Brian's browser
// review, 13 Sep 2026.
function CardPreview({ src = "", title = "" }) {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--line-strong)] bg-[var(--surface-1)]">
      <img
        src={src}
        alt={title ? `Share card for ${title}` : "Share card"}
        width={1200}
        height={630}
        className="block aspect-[1200/630] h-auto w-full max-w-full object-cover"
      />
    </div>
  );
}

function LinkPreview({ src = "", title = "", byline = "" }) {
  return (
    <div className="flex min-w-0 items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]">
      <div className="h-[90px] w-[72px] shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover object-[center_18%]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--ink-faint)]" aria-hidden="true">
            <LinkIcon size={20} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
          {title || "Untitled"}
        </p>
        {byline ? (
          <p className="truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {byline}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function KitShareSheetView({
  hasCard = false,
  cardImageSrc = null,
  previewImageSrc = "",
  title = "",
  byline = "",
  shareUrl = "",
  statusMessage = "",
  blockedMessage = null,
  reviewButtonLabel = "Submit for public review",
  reviewButtonDisabled = false,
  reviewMessage = "",
  onCopyLink = null,
  onSubmitForReview = null,
  onClose = null,
}) {
  if (blockedMessage) {
    return (
      <div className={SHEET_RECIPE}>
        <div className={HEADER_RECIPE}>
          <Eyebrow />
          <h2 id={KIT_SHARE_SHEET_TITLE_ID} className={TITLE_RECIPE}>
            {title || "Untitled"}
          </h2>
        </div>
        <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
          {blockedMessage}
        </p>
        <div className="flex gap-[var(--space-3)] min-[700px]:justify-end">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="cf-btn cf-btn--secondary cf-btn--sm flex-1 min-[700px]:flex-none"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onSubmitForReview?.()}
            disabled={reviewButtonDisabled}
            aria-disabled={reviewButtonDisabled}
            className="goldring cf-btn cf-btn--primary cf-btn--sm flex-1 items-center justify-center min-[700px]:flex-none"
          >
            {reviewButtonLabel}
          </button>
        </div>
        {reviewMessage ? (
          <p role="status" className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {reviewMessage}
          </p>
        ) : null}
      </div>
    );
  }

  const showCard = Boolean(hasCard && cardImageSrc);

  return (
    <div className={SHEET_RECIPE}>
      <div className={HEADER_RECIPE}>
        <Eyebrow />
        <h2 id={KIT_SHARE_SHEET_TITLE_ID} className={TITLE_RECIPE}>
          {title || "Untitled"}
        </h2>
        {byline ? (
          <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">{byline}</p>
        ) : null}
      </div>

      {showCard ? (
        <CardPreview src={cardImageSrc} title={title} />
      ) : (
        <LinkPreview src={previewImageSrc} title={title} byline={byline} />
      )}

      <label className="flex min-w-0 flex-col gap-[var(--space-1)]">
        <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
          Link
        </span>
        <input
          type="text"
          readOnly
          value={shareUrl}
          onFocus={(event) => event.currentTarget.select()}
          className="min-h-[var(--control-md)] w-full min-w-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--bed-deep)] px-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink)] shadow-[var(--shadow-bed)]"
        />
      </label>

      <button
        type="button"
        onClick={() => onCopyLink?.()}
        className="goldring cf-btn cf-btn--primary cf-btn--sm w-full items-center justify-center gap-[var(--space-1)]"
      >
        <LinkIcon size={16} aria-hidden="true" />
        Copy link
      </button>

      {statusMessage ? (
        <p
          role="status"
          className="self-start rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--fill)] px-[var(--space-4)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]"
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
