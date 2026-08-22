"use client";

import { Search, Sparkles, X } from "lucide-react";

export default function CharacterTemplateModalView({
  eyebrow = "Character Templates",
  modalTitle = "Use Template",
  modalDescription = "",
  tabs = [],
  activeTabId = "",
  searchQuery = "",
  searchPlaceholder = "Search templates...",
  showTemplateGrid = true,
  templates = [],
  emptyStateTitle = "Templates Soon",
  emptyStateDescription = "",
  onClose = null,
  onChooseTab = null,
  onChangeSearchQuery = null,
  onChooseTemplate = null,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] backdrop-blur-[2px] p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)]">
          <div>
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              {eyebrow}
            </p>
            <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] font-medium tracking-[var(--track-tight)] tabular-nums">{modalTitle}</h2>
            <p className="mt-[var(--space-2)] max-w-[44rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {modalDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close template picker"
          >
            <X size={18} />
          </button>
        </div>

        <div
          aria-hidden="true"
          className="h-px bg-[image:var(--line-fade)] my-[var(--space-5)]"
        />

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab?.id || tab?.label}
                type="button"
                onClick={() => onChooseTab?.(tab?.id || "")}
                className={`inline-flex min-h-[var(--control-sm)] items-center rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                  activeTabId === tab?.id
                    ? "border-[var(--gold-action)] bg-[var(--surface-1)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                    : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                }`}
              >
                {tab?.label || "Template group"}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={searchQuery}
              onChange={(event) => onChangeSearchQuery?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
            />
          </div>

          {showTemplateGrid ? (
            <div className="mt-5 grid max-h-[58vh] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
              {templates.map((template) => (
                <article
                  key={template?.id || template?.title}
                  className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]"
                >
                  <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                    {template?.sourceLabel || "Template"} ·{" "}
                    {template?.categoryLabel || "Uncategorized"}
                  </p>

                  <h3 className="mt-[var(--space-2)] font-display text-[length:var(--text-subhead)] leading-[var(--lh-subhead)] font-medium tabular-nums">
                    {template?.title || "Untitled Template"}
                  </h3>

                  <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                    {template?.description || ""}
                  </p>

                  <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)]">
                    <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                      {template?.prefillLabel || "Prefills"}
                    </p>
                    <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                      {template?.prefillSummary || ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onChooseTemplate?.(template?.id || "")}
                    className="cf-btn cf-btn--primary mt-[var(--space-4)] w-full"
                  >
                    {template?.actionLabel || "Apply template"}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-[var(--space-5)] rounded-[var(--radius-lg)] border border-dashed border-[var(--line-strong)] p-[var(--space-8)] text-center">
              <Sparkles
                className="mx-auto text-[var(--gold-ornament)]"
                size={28}
              />
              <p className="mt-[var(--space-4)] font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)] tabular-nums">{emptyStateTitle}</p>
              <p className="mx-auto mt-[var(--space-3)] max-w-2xl text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                {emptyStateDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
