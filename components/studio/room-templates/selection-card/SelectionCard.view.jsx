export default function SelectionCardView({
  label = "",
  icon: Icon = null,
  value = null,
  placeholder = "Select",
  onOpen,
}) {
  const title = value?.title || placeholder;
  const subtitle = value?.subtitle || "";

  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5 text-left transition hover:border-[var(--muted-gold)]/35"
    >
      {Icon ? (
        <Icon className="text-[var(--muted-gold)]" size={20} />
      ) : (
        <span
          aria-hidden="true"
          className="block h-5 w-5 rounded-full border border-[var(--muted-gold)]/45"
        />
      )}

      {label ? (
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          {label}
        </p>
      ) : null}

      <p className="mt-2 text-sm text-[var(--foreground)]">{title}</p>

      {subtitle ? (
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
          {subtitle}
        </p>
      ) : null}
    </button>
  );
}
