import {
  Braces,
  Check,
  Clipboard,
  Code2,
  Download,
  RotateCcw,
  WandSparkles,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

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
            className="rounded-lg border border-white/10 bg-[var(--surface-2)] px-3 py-2"
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

export default function LoreEngineUseJsonEditorModalView({
  title = "Engine Use JSON",
  description = "",
  jsonText = "",
  errors = [],
  warnings = [],
  statusMessage = "",
  copyStatus = "idle",
  downloadStatus = "idle",
  canApply = true,
  hasDraftChanges = false,
  characterCount = 0,
  lineCount = 0,
  onClose = null,
  onChangeJson = null,
  onCopy = null,
  onDownload = null,
  onFormat = null,
  onReset = null,
  onValidateAndApply = null,
}) {
  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabel={title}
      hasUnsavedChanges={hasDraftChanges}
      panelClassName="max-w-5xl"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line-fade)] p-5">
        <div>
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            <Braces size={15} />
            Engine Use Authoring Tool
          </p>
          <h2 className="mt-2 font-display text-4xl">{title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--ink-dim)]">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                <Code2 size={14} />
                Engine Use Configuration
              </p>
              <p className="mt-1 text-xs text-[var(--ink-dim)]">
                {lineCount} lines · {characterCount} characters
                {hasDraftChanges ? " · unapplied modal edits" : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <ToolbarButton icon={Clipboard} onClick={onCopy}>
                {copyStatus === "copied" ? "Copied" : "Copy JSON"}
              </ToolbarButton>
              <ToolbarButton icon={Download} onClick={onDownload}>
                {downloadStatus === "downloaded"
                  ? "Downloaded"
                  : downloadStatus === "error"
                    ? "Retry download"
                    : "Download JSON"}
              </ToolbarButton>
              <ToolbarButton icon={WandSparkles} onClick={onFormat}>
                Format JSON
              </ToolbarButton>
              <ToolbarButton icon={RotateCcw} onClick={onReset}>
                Reset from form
              </ToolbarButton>
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={(event) => onChangeJson?.(event.target.value)}
            spellCheck={false}
            aria-label="Engine Use Authoring JSON"
            className="mt-4 min-h-[58vh] w-full resize-y rounded-xl border border-white/10 bg-[var(--surface-1)] px-4 py-4 font-mono text-xs leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/55"
          />
        </section>

        <aside className="grid content-start gap-4">
          <section className="rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Apply behavior
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Import is atomic. The packet is parsed and checked against the active public revision, tagged Characters and Locations, Lore scope, block ids, knowledge windows, and available Story context before the open form changes.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Contract
            </p>
            <code className="mt-2 block break-all text-[11px] text-[var(--ink)]">
              lore_engine_use_authoring_v1
            </code>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              publicReleaseId is intentionally omitted. Submit resolves the currently active immutable public release, so an imported packet cannot silently target an older revision.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Safety boundary
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Validate & Apply does not publish, submit, index, verify, activate, cancel, or withdraw anything. Review the populated form, then use the normal Submit for Engine Use action.
            </p>
          </section>

          {statusMessage ? (
            <section className="rounded-xl border border-white/10 bg-[var(--surface-1)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                Status
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                {statusMessage}
              </p>
            </section>
          ) : null}

          <IssueList
            title={`${errors.length} Compliance ${errors.length === 1 ? "Error" : "Errors"}`}
            issues={errors}
            tone="error"
          />
          <IssueList
            title={`${warnings.length} Normalization ${warnings.length === 1 ? "Notice" : "Notices"}`}
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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line-fade)] p-5">
        <p className="text-xs leading-5 text-[var(--ink-dim)]">
          Applying replaces only the current unsent Engine Use authoring form.
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => onClose?.()} className="cf-btn cf-btn--secondary">
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
    </KitModalFrame>
  );
}
