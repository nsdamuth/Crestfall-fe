export default function PublicProfileTabsView({
  eyebrow = "Public Profile",
  title = "Characters & Canon Work",
  tabs = [],
  contentSlot = null,
  onSelectTab = () => {},
} = {}) {
  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl">{title}</h2>
        </div>

        <div className="flex flex-wrap gap-2 rounded-[var(--radius-md)] border border-white/10 bg-[var(--surface-1)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              aria-pressed={tab.isActive}
              className={`inline-flex min-h-[var(--control-md)] flex-1 items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                tab.isActive
                  ? "bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                  : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {contentSlot}
    </section>
  );
}
