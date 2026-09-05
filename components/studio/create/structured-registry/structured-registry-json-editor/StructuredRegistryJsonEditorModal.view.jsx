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

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

function IssueList({ title, issues = [], tone = "error" }) {
  if (!issues.length) return null;
  const toneClassName =
    tone === "warning"
      ? "border-[var(--status-warning-border)] bg-[var(--status-warning-bed)] text-[var(--status-warning-text)]"
      : "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger-text)]";

  return (
    <section className={`rounded-xl border p-4 ${toneClassName}`} role={tone === "error" ? "alert" : undefined}>
      <p className="text-xs uppercase tracking-[0.18em]">{title}</p>
      <div className="mt-3 grid gap-2">
        {issues.map((item, index) => (
          <div key={`${item?.path || "issue"}-${index}`}>
            <code className="break-all text-[11px] text-[var(--gold-ornament)]">{item?.path || "$"}</code>
            <p className="mt-1 text-xs leading-5">{item?.message || "Unknown validation issue."}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolbarButton({ icon: Icon, children, onClick, disabled = false }) {
  return (
    <button type="button" onClick={() => onClick?.()} disabled={disabled} className="cf-btn cf-btn--secondary cf-btn--sm">
      <Icon size={13} />
      {children}
    </button>
  );
}

export default function StructuredRegistryJsonEditorModalView({
  title,
  description,
  dataLabel,
  jsonAriaLabel,
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
    <KitModalFrame
      onClose={onClose}
      ariaLabel={title}
      hasUnsavedChanges={hasDraftChanges}
      panelClassName="max-w-4xl"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line-fade)] p-5">
        <div>
          <p className={EYEBROW_CLASS}>
            <Braces size={15} />
            Loom Authoring Tool
          </p>
          <h2 className="mt-2 font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)]">{title}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--ink-dim)]">{description}</p>
        </div>
      </div>

      <div className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={EYEBROW_CLASS}>
                <Code2 size={14} />
                {dataLabel}
              </p>
              <p className="mt-1 text-xs text-[var(--ink-dim)]">
                {lineCount} lines · {characterCount} characters{hasDraftChanges ? " · unsaved modal edits" : ""}
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
              <ToolbarButton icon={WandSparkles} onClick={onFormat}>Format JSON</ToolbarButton>
              <ToolbarButton icon={RotateCcw} onClick={onReset}>Reset from builder</ToolbarButton>
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={(event) => onChangeJson?.(event.target.value)}
            spellCheck={false}
            aria-label={jsonAriaLabel}
            className="mt-4 min-h-[58vh] w-full resize-y rounded-xl border border-white/10 bg-black/55 px-4 py-4 font-mono text-xs leading-6 text-[var(--ink)] transition placeholder:text-[var(--ink-dim)]"
          />
        </section>

        <aside className="grid content-start gap-4">
          <section className="rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 p-4">
            <p className={EYEBROW_CLASS}>Apply Behavior</p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              The complete object is parsed, registry-kind checked, contract-checked, normalized, and then applied as one replacement of the current registry data. Invalid JSON never partially updates the builder.
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className={EYEBROW_CLASS}>AI / Link Safety</p>
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Existing linked Creation IDs may be preserved. New Creation IDs cannot be introduced through JSON; use the visual link picker after applying bulk-authored content.
            </p>
          </section>

          {statusMessage ? (
            <section className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className={EYEBROW_CLASS}>Status</p>
              <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">{statusMessage}</p>
            </section>
          ) : null}

          <IssueList title={`${errors.length} Compliance ${errors.length === 1 ? "Error" : "Errors"}`} issues={errors} tone="error" />
          <IssueList title={`${warnings.length} Normalization ${warnings.length === 1 ? "Notice" : "Notices"}`} issues={warnings} tone="warning" />

          {!errors.length && !warnings.length ? (
            <section className="rounded-xl border border-[var(--status-success-border)] bg-[var(--status-success-bed)] p-4 text-[var(--status-success-text)]">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em]"><Check size={14} /> Ready to Validate</p>
              <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">Validation runs when you choose Validate & Apply.</p>
            </section>
          ) : null}
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line-fade)] p-5">
        <p className="text-xs leading-5 text-[var(--ink-dim)]">
          Applying updates the open builder. The normal page Save action still controls persistence.
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => onClose?.()} className="cf-btn cf-btn--secondary">Cancel</button>
          <button type="button" onClick={() => onValidateAndApply?.()} disabled={!canApply} className="cf-btn cf-btn--primary">
            <Check size={14} /> Validate & apply
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}
