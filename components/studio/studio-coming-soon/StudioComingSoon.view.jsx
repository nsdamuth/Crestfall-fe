export default function StudioComingSoonView({
  eyebrow = "In Development",
  title = "Coming Soon",
  children = null,
  items = [],
}) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="mt-8 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/15 bg-black/35 p-8">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-3 font-display text-3xl">{title}</h2>

      {children ? (
        <div className="mt-4 max-w-3xl leading-8 text-[var(--ink-dim)]">
          {children}
        </div>
      ) : null}

      {safeItems.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {safeItems.map((item, index) => (
            <div
              key={`${String(item)}-${index}`}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--ink-dim)]"
            >
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
