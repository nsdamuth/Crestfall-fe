// Compact continue row, RULED 11 Aug 2026 (Stories continue group
// density): the companion to KitPromoBannerView's continue banner for
// every in-progress item beyond the most recent one. Small art
// thumbnail left, title, "Last played" line, Continue button right,
// full content width, list-density height. Lives beside the continue
// banner it accompanies so any page composing that banner can reuse
// this row; first consumer is Stories, Home may reuse it later.
// Presentation only: the caller supplies display-ready copy and
// reports intent through onContinue.
export default function KitContinueRowView({
  title = "",
  lastPlayedLabel = "",
  imageSrc = null,
  onContinue = null,
}) {
  return (
    <div className="flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
      <span className="h-[var(--space-12)] w-[var(--space-12)] flex-none overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-3)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-[center_18%]"
          />
        ) : null}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] font-[var(--weight-bold)] text-[var(--ink)]">
          {title || "Untitled"}
        </p>
        {lastPlayedLabel && (
          <p className="truncate text-[length:var(--text-label)] text-[var(--ink-faint)]">
            {lastPlayedLabel}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onContinue?.()}
        className="kit-focus cf-btn cf-btn--secondary flex-none"
      >
        Continue
      </button>
    </div>
  );
}
