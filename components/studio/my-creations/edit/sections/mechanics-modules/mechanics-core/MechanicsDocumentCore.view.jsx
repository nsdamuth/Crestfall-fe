"use client";

function JsonPanel({ label, value }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </p>
      <pre className="mt-4 max-h-[32rem] overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs leading-6 text-white/75">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

export default function MechanicsDocumentCoreView({
  contractVersion,
  phase,
  status,
  fixtures = [],
  selectedFixture = null,
  selectedFixtureId = "",
  onSelectFixture = () => {},
  domainCounts = null,
}) {
  return (
    <section className="grid gap-6">
      <div className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/25 bg-black/30 p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          Mechanics {phase}
        </p>
        <h2 className="mt-2 font-display text-4xl">
          Shared Document Compatibility
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)]">
          Development-only proof of canonical root normalization, legacy alias
          recovery, malformed-input recovery, unknown-field preservation, and
          domain replacement. Nothing here persists a Mechanics Module.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Contract", contractVersion],
            ["Phase", phase],
            ["Status", status],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-black/25 px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {label}
              </p>
              <p className="mt-1 break-words font-mono text-xs text-[var(--foreground)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.3fr_0.7fr]">
        <aside className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            M0 compatibility fixtures
          </p>
          <div className="mt-4 grid gap-2">
            {fixtures.map((fixture) => (
              <button
                key={fixture.id}
                type="button"
                onClick={() => onSelectFixture(fixture.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  selectedFixtureId === fixture.id
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/10"
                    : "border-white/10 bg-black/20 hover:border-white/20"
                }`}
              >
                <p className="text-sm text-[var(--foreground)]">
                  {fixture.label}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  {fixture.classification}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <div className="grid gap-5">
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                  Selected document
                </p>
                <h3 className="mt-2 font-display text-3xl">
                  {selectedFixture?.label || "None"}
                </h3>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                {selectedFixture?.classification || "UNAVAILABLE"}
              </span>
            </div>
            {domainCounts ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {Object.entries(domainCounts).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                      {label}
                    </p>
                    <p className="mt-1 text-lg text-[var(--foreground)]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-5 2xl:grid-cols-3">
            <JsonPanel label="Input" value={selectedFixture?.input || null} />
            <JsonPanel
              label="Canonical normalized document"
              value={selectedFixture?.normalized || null}
            />
            <JsonPanel
              label="Tracker replacement probe"
              value={selectedFixture?.replacementProbe || null}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
