const BASE_CLASSES =
  "inline-flex items-center gap-[var(--space-1)] min-h-[var(--control-sm)] [@media(pointer:coarse)]:min-h-[var(--control-md)] rounded-[var(--radius-md)] px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] disabled:pointer-events-none disabled:opacity-[.45]";

function getVariantClasses(variant, isSelected) {
  if (variant === "toggle") {
    return isSelected
      ? "border border-transparent bg-[image:var(--grad-gold)] text-[var(--tag-fill-ink)]"
      : "border border-dashed border-[var(--line)] bg-transparent text-[var(--ink-dim)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]";
  }

  const bed = variant === "sort" ? "bg-[var(--surface-2)]" : "bg-[var(--surface-1)]";

  if (isSelected) {
    return `${bed} border border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]`;
  }

  return `${bed} border border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]`;
}

export default function KitFilterChipView({
  label = "",
  count = null,
  isSelected = false,
  variant = "default",
  isDisabled = false,
  onToggle = null,
}) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-pressed={isSelected}
      onClick={() => onToggle?.()}
      className={`${BASE_CLASSES} ${getVariantClasses(variant, isSelected)}`}
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
