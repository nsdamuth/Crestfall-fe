export default function StudioPageHeaderView({
  eyebrow = "",
  title = "",
  description = "",
  children = null,
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-[var(--muted-gold)]/15 pb-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-4 font-display text-5xl tracking-[0.04em]">
          {title}
        </h1>

        {description ? (
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>

      {children ? <div className="shrink-0">{children}</div> : null}
    </header>
  );
}
