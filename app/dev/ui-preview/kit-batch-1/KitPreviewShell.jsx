"use client";

export default function KitPreviewShell({
  title,
  description,
  states = [],
  activeKey,
  onSelectState,
  children,
  note,
}) {
  return (
    <main className="min-h-screen bg-[var(--canvas)] px-[var(--space-4)] py-[var(--space-10)] text-[var(--ink)] sm:px-[var(--space-6)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-[var(--space-6)]">
        <header className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-6)]">
          <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Development-only kit preview
          </p>
          <h1 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {title}
          </h1>
          {description && (
            <p className="mt-[var(--space-3)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {description}
            </p>
          )}
        </header>

        {states.length > 0 && (
          <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-5)]">
            <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              Fixture states
            </p>
            <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-2)]">
              {states.map((state) => (
                <button
                  key={state.key}
                  type="button"
                  onClick={() => onSelectState?.(state.key)}
                  className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition-colors ${
                    activeKey === state.key
                      ? "border-[var(--gold-action)] bg-[var(--fill)] text-[var(--gold-bright)]"
                      : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-1)] p-[var(--space-6)]">
          {children}
        </section>

        {note && (
          <section className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--fill-whisper)] p-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {note}
          </section>
        )}
      </div>
    </main>
  );
}
