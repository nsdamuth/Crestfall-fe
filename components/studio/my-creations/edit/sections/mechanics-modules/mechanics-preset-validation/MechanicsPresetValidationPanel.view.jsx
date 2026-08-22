import {
  Beaker,
  CheckCircle2,
  Clipboard,
  Route,
  X,
} from "lucide-react";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";
const EYEBROW_CLASS_INLINE =
  "inline-flex items-center gap-2 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

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
    <section className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--status-success-border)] bg-[var(--status-success-bed)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line-whisper)] p-5">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--status-success-text)]">
            <Beaker size={15} />
            {eyebrow}
          </p>
          <h3 className="mt-2 font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
            {title}
          </h3>
          <p className="mt-2 max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss?.()}
          className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:border-white/20 hover:text-[var(--ink)]"
          aria-label="Dismiss live validation guide"
        >
          <X size={17} />
        </button>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.55fr)]">
        <div className="grid content-start gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--status-success-border)] bg-[var(--status-success-bed)] px-3 py-1 text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--status-success-text)]">
              {statusLabel}
            </span>
            {expectedOutcomeLabel ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                Expected: {expectedOutcomeLabel}
              </span>
            ) : null}
            {domainLaneLabels.map((lane) => (
              <span
                key={lane}
                className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]"
              >
                {lane}
              </span>
            ))}
          </div>

          {testCommand ? (
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={EYEBROW_CLASS}>
                    Reference Test Command
                  </p>
                  <code className="mt-2 block break-all text-sm text-[var(--ink)]">
                    {testCommand}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyTestCommand?.()}
                  className="cf-btn cf-btn--primary cf-btn--sm"
                >
                  <Clipboard size={13} />
                  Copy
                </button>
              </div>
              {copyStatus ? (
                <p className="mt-2 text-xs text-[var(--ink-dim)]">{copyStatus}</p>
              ) : null}
            </div>
          ) : null}

          {steps.length ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className={EYEBROW_CLASS_INLINE}>
                <Route size={14} />
                Live Validation Steps
              </p>
              <ol className="mt-3 grid gap-2">
                {steps.map((step, index) => (
                  <li
                    key={`${index}-${step}`}
                    className="flex gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-[var(--ink-dim)]"
                  >
                    <span className="shrink-0 text-[var(--gold-ornament)]">
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
              <p className={EYEBROW_CLASS_INLINE}>
                <CheckCircle2 size={14} />
                Expected Checks
              </p>
              <div className="mt-3 grid gap-2">
                {checks.map((check, index) => (
                  <p
                    key={`${index}-${check}`}
                    className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-[var(--ink-dim)]"
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
              className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-[var(--ink-dim)]"
            >
              {note}
            </p>
          ))}
        </aside>
      </div>
    </section>
  );
}
