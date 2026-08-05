export default function StudioPageHeaderView({
  eyebrow = "",
  title = "",
  description = "",
  children = null,
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-[var(--gold-ornament)]/15 pb-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        {eyebrow ? (
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-[var(--space-2)] mb-[var(--space-2)] font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--lh-title)] font-medium tracking-[var(--track-tight)]">
          {title}
        </h1>

        {description ? (
          <p className="max-w-[44rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {description}
          </p>
        ) : null}
      </div>

      {children ? <div className="shrink-0">{children}</div> : null}
    </header>
  );
}
