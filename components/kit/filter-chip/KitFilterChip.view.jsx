const BASE_CLASSES =
  "inline-flex items-center gap-[var(--space-1)] min-h-[var(--control-sm)] [@media(pointer:coarse)]:min-h-[var(--control-md)] rounded-[var(--radius-md)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)]";

// Selected state, RULED 6 Sep 2026 (FE/FILTERS refine): the gold
// family only. Bed --fill (the gold wash), text --gold-bright
// (selected-state text), count --gold-ornament. Never a status color.
// Zero-count chips (same ruling) render muted with --ink-faint, legal
// on the chip's --surface-1 bed, and stay selectable.
function getVariantClasses(variant, isSelected, isMuted) {
  if (variant === "toggle") {
    return isSelected
      ? "goldring border border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
      : "border border-dashed border-[var(--line)] bg-transparent text-[var(--ink-dim)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]";
  }

  if (isSelected) {
    return "border border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]";
  }

  const bed = variant === "sort" ? "bg-[var(--surface-2)]" : "bg-[var(--surface-1)]";
  const ink = isMuted ? "text-[var(--ink-faint)]" : "text-[var(--ink-dim)]";

  return `${bed} border border-[var(--line-whisper)] ${ink} hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]`;
}

export default function KitFilterChipView({
  label = "",
  count = null,
  isSelected = false,
  variant = "default",
  isDisabled = false,
  onToggle = null,
  tooltip = null,
}) {
  const isMuted = count === 0 && !isSelected;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-pressed={isSelected}
      title={tooltip || undefined}
      onClick={() => onToggle?.()}
      className={`${BASE_CLASSES} ${getVariantClasses(variant, isSelected, isMuted)}`}
    >
      <span className="truncate">{label}</span>
      {count !== null && count !== undefined && (
        <span
          className={`tabular-nums text-[length:var(--text-label)] ${
            isSelected ? "text-[var(--gold-ornament)]" : "text-[var(--ink-faint)]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
