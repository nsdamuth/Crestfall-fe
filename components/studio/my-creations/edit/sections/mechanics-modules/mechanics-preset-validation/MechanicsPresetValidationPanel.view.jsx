import {
  Beaker,
  CheckCircle2,
  Clipboard,
  Route,
  X,
} from "lucide-react";

export default function MechanicsPresetValidationPanelView({
  eyebrow = "Preset Applied",
  title = "Live Validation Guide",
  description = "",
  statusLabel = "Live Validation Ready",
  testCommand = "",
  expectedOutcomeLabel = "",
  domainLaneLabels = [],
  checks = [],
  steps = [],
  notes = [],
  copyStatus = "",
  onCopyTestCommand = null,
  onDismiss = null,
}) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-md)] border border-emerald-300/20 bg-emerald-500/[0.045]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-5">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-emerald-100">
            <Beaker size={15} />
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-3xl text-[var(--foreground)]">
            {title}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss?.()}
          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-white/20 hover:text-[var(--foreground)]"
          aria-label="Dismiss live validation guide"
        >
          <X size={17} />
        </button>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.55fr)]">
        <div className="grid content-start gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-100">
              {statusLabel}
            </span>
            {expectedOutcomeLabel ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                Expected: {expectedOutcomeLabel}
              </span>
            ) : null}
            {domainLaneLabels.map((lane) => (
              <span
                key={lane}
                className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]"
              >
                {lane}
              </span>
            ))}
          </div>

          {testCommand ? (
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                    Reference Test Command
                  </p>
                  <code className="mt-2 block break-all text-sm text-[var(--foreground)]">
                    {testCommand}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyTestCommand?.()}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
                >
                  <Clipboard size={13} />
                  Copy
                </button>
              </div>
              {copyStatus ? (
                <p className="mt-2 text-xs text-[var(--muted)]">{copyStatus}</p>
              ) : null}
            </div>
          ) : null}

          {steps.length ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                <Route size={14} />
                Live Validation Steps
              </p>
              <ol className="mt-3 grid gap-2">
                {steps.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className="flex gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-[var(--muted)]"
                  >
                    <span className="shrink-0 text-[var(--muted-gold)]">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>

        <aside className="grid content-start gap-4">
          {checks.length ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                <CheckCircle2 size={14} />
                Expected Checks
              </p>
              <div className="mt-3 grid gap-2">
                {checks.map((check, index) => (
                  <p
                    key={`${index}-${check}`}
                    className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-[var(--muted)]"
                  >
                    {check}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {notes.map((note, index) => (
            <p
              key={`${index}-${note}`}
              className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-[var(--muted)]"
            >
              {note}
            </p>
          ))}
        </aside>
      </div>
    </section>
  );
}
