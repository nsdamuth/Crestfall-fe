
export default function StudioActionCardView({
  eyebrow = "",
  title = "",
  children = null,
  href = "",
  actionLabel = "Open",
  disabled = false,
  LinkComponent = "a",
}) {
  const card = (
    <article className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/15 bg-black/35 p-6 transition hover:border-[var(--gold-ornament)]/35">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 font-display text-2xl">{title}</h2>

      {children && (
        <div className="mt-3 leading-7 text-[var(--ink-dim)]">{children}</div>
      )}

      <div className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {disabled ? "Coming Soon" : actionLabel}
      </div>
    </article>
  );

  if (disabled || !href) {
    return <div className="opacity-80">{card}</div>;
  }

  return (
    <LinkComponent href={href} className="block">
      {card}
    </LinkComponent>
  );
}
