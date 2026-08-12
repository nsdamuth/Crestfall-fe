"use client";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

export default function MechanicsCompatibilityBaselineView({
  contractVersion,
  status,
  identities,
  fixtures = [],
  selectedFixture = null,
  selectedFixtureId = "",
  onSelectFixture = () => {},
  externalRepositories = [],
  deferredDiagnostics = [],
}) {
  return (
    <section className="grid gap-6">
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/30 p-6">
        <p className={EYEBROW_CLASS}>Mechanics M0</p>
        <h2 className="mt-2 font-display text-4xl">Compatibility Baseline</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--ink-dim)]">
          Development-only inventory of the document shapes and atomic replacement boundaries frozen before domain extraction. It does not edit or persist a Mechanics Module.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[["Contract", contractVersion], ["Status", status], ["Module", identities?.moduleId], ["Instance Contract", identities?.contractVersion]].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">{label}</p>
              <p className="mt-1 break-words font-mono text-xs text-[var(--ink)]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.34fr_0.66fr]">
        <aside className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <p className={EYEBROW_CLASS}>Frozen fixtures</p>
          <div className="mt-4 grid gap-2">
            {fixtures.map((fixture) => (
              <button key={fixture.id} type="button" onClick={() => onSelectFixture(fixture.id)} className={`rounded-xl border px-4 py-3 text-left transition ${selectedFixtureId === fixture.id ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/10" : "border-white/10 bg-black/20 hover:border-white/20"}`}>
                <p className="text-sm text-[var(--ink)]">{fixture.label}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">{fixture.classification}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={EYEBROW_CLASS}>Selected fixture</p>
              <h3 className="mt-2 font-display text-3xl">{selectedFixture?.label || "None"}</h3>
              <p className="mt-2 text-xs text-[var(--ink-dim)]">{selectedFixture?.id}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">{selectedFixture?.classification || "UNAVAILABLE"}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(selectedFixture?.domains || []).map((domain) => <span key={domain} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-[var(--ink-dim)]">{domain}</span>)}
          </div>
          <pre className="mt-5 max-h-[36rem] overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs leading-6 text-white/75">{JSON.stringify(selectedFixture?.moduleData || selectedFixture?.preset || null, null, 2)}</pre>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <p className={EYEBROW_CLASS}>External repositories</p>
          <div className="mt-4 grid gap-3">{externalRepositories.map((repo) => <div key={repo.id} className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-[var(--ink)]">{repo.id}</p><p className="mt-1 font-mono text-xs text-[var(--ink-dim)]">{repo.environmentVariable}</p><p className="mt-2 text-xs text-[var(--ink-dim)]">{repo.statusWhenUnavailable}</p></div>)}</div>
        </div>
        <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
          <p className={EYEBROW_CLASS}>Deferred cross-tier gates</p>
          <div className="mt-4 grid gap-3">{deferredDiagnostics.map((item) => <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-sm text-[var(--ink)]">{item.id}</p><p className="mt-2 text-xs text-[var(--ink-dim)]">Requires: {item.requires.join(", ")}</p></div>)}</div>
        </div>
      </div>
    </section>
  );
}
