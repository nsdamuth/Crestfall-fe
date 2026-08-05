export default function RegistryStubPanel({
  registryType,
  title,
  description,
  plannedTabs = [],
  focusAreas = [],
  futureUse,
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Registry Builder Planned
        </p>

        <h2 className="mt-2 font-display text-4xl">{title}</h2>

        <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
          {description}
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {plannedTabs.map((tab) => (
            <article
              key={tab.title}
              className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                {tab.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl">{tab.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {tab.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5 xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Registry Summary
        </p>

        <h2 className="mt-2 font-display text-3xl">{registryType}</h2>

        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {futureUse}
        </p>

        <div className="mt-5 grid gap-3">
          {focusAreas.map((item) => (
            <SummaryPill
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>

        <button
          type="button"
          disabled
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] opacity-75"
        >
          Builder Coming Soon
        </button>
      </aside>
    </section>
  );
}

function SummaryPill({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--foreground)]">{value}</p>
    </div>
  );
}