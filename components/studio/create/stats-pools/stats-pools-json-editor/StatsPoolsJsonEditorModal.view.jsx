import {
  Braces,
  Check,
  Clipboard,
  Code2,
  Download,
  RotateCcw,
  WandSparkles,
  X,
} from "lucide-react";

import ModalShell from "@/components/ui/ModalShell";

function IssueList({ title, issues = [], tone = "error" }) {
  if (!issues.length) return null;

  const toneClassName =
    tone === "warning"
      ? "border-amber-300/20 bg-amber-500/10 text-amber-100"
      : "border-red-300/20 bg-red-500/10 text-red-100";

  return (
    <section
      className={`rounded-xl border p-4 ${toneClassName}`}
      role={tone === "error" ? "alert" : undefined}
    >
      <p className="text-xs uppercase tracking-[0.18em]">{title}</p>

      <div className="mt-3 grid gap-2">
        {issues.map((issue, index) => (
          <div
            key={`${issue?.path || "issue"}-${index}`}
            className="rounded-lg border border-white/10 bg-black/25 px-3 py-2"
          >
            <code className="break-all text-[11px] text-[var(--gold-ornament)]">
              {issue?.path || "$"}
            </code>
            <p className="mt-1 text-xs leading-5">
              {issue?.message || "Unknown validation issue."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolbarButton({ icon: Icon, children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      disabled={disabled}
      className="cf-btn cf-btn--secondary cf-btn--sm"
    >
      <Icon size={13} />
      {children}
    </button>
  );
}

export default function StatsPoolsJsonEditorModalView({
  title = "Stats & Pools Profile JSON Editor",
  description = "",
  jsonText = "",
  errors = [],
  warnings = [],
  statusMessage = "",
  copyStatus = "idle",
  guideDownloadStatus = "idle",
  canApply = true,
  hasDraftChanges = false,
  characterCount = 0,
  lineCount = 0,
  onClose = null,
  onChangeJson = null,
  onCopy = null,
  onDownloadAiGuide = null,
  onFormat = null,
  onReset = null,
  onValidateAndApply = null,
}) {
  return (
    <ModalShell
      onClose={onClose}
      closeOnBackdrop={false}
      panelClassName="max-h-[94vh] w-full max-w-7xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/25 bg-[#080706] shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            <Braces size={15} />
            Loom Authoring Tool
          </p>

          <h2 className="mt-2 font-display text-4xl">{title}</h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onClose?.()}
          className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
          aria-label="Close Stats & Pools Profile JSON Editor"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid max-h-[calc(94vh-10rem)] gap-4 overflow-y-auto p-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                <Code2 size={14} />
                Authored Stats & Pools Profile
              </p>
              <p className="mt-1 text-xs text-[var(--ink-dim)]">
                {lineCount} lines · {characterCount} characters
                {hasDraftChanges ? " · unsaved modal edits" : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ToolbarButton icon={Clipboard} onClick={onCopy}>
                {copyStatus === "copied" ? "Copied" : "Copy JSON"}
              </ToolbarButton>

              <ToolbarButton icon={Download} onClick={onDownloadAiGuide}>
                {guideDownloadStatus === "downloaded"
                  ? "Guide downloaded"
                  : guideDownloadStatus === "error"
                    ? "Retry AI guide"
                    : "Download AI guide"}
              </ToolbarButton>

              <ToolbarButton icon={WandSparkles} onClick={onFormat}>
                Format JSON
              </ToolbarButton>

              <ToolbarButton icon={RotateCcw} onClick={onReset}>
                Reset from builder
              </ToolbarButton>
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={(event) => onChangeJson?.(event.target.value)}
            spellCheck={false}
            aria-label="Stats & Pools Profile JSON"
            className="mt-4 min-h-[58vh] w-full resize-y rounded-xl border border-white/10 bg-black/55 px-4 py-4 font-mono text-xs leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/55"
          />
        </section>

        <aside className="grid content-start gap-4">
          <section className="rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Apply Behavior
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              The complete Stats & Pools Profile is parsed, contract-checked,
              normalized, and then applied as one replacement of the current
              visual editor data. Invalid JSON never partially updates the
              builder.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              AI Guide
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              The download contains the current Stats & Pools Profile JSON,
              definition contracts, formula rules, limits, actor-state
              boundaries, and instructions for an AI to return one complete replacement object.
            </p>
          </section>

          {statusMessage ? (
            <section className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                Status
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                {statusMessage}
              </p>
            </section>
          ) : null}

          <IssueList
            title={`${errors.length} Compliance ${
              errors.length === 1 ? "Error" : "Errors"
            }`}
            issues={errors}
            tone="error"
          />

          <IssueList
            title={`${warnings.length} Normalization ${
              warnings.length === 1 ? "Notice" : "Notices"
            }`}
            issues={warnings}
            tone="warning"
          />

          {!errors.length && !warnings.length ? (
            <section className="rounded-xl border border-emerald-300/15 bg-emerald-500/5 p-4 text-emerald-100">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                <Check size={14} />
                Ready to Validate
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                Validation runs when you choose Validate & Apply.
              </p>
            </section>
          ) : null}
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-5">
        <p className="text-xs leading-5 text-[var(--ink-dim)]">
          Applying updates the open Stats & Pools Profile editor. The normal page
          Save action still controls persistence.
        </p>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="cf-btn cf-btn--secondary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onValidateAndApply?.()}
            disabled={!canApply}
            className="cf-btn cf-btn--primary"
          >
            <Check size={14} />
            Validate & apply
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
