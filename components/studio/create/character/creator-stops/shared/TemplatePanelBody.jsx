"use client";

import { Search, Sparkles } from "lucide-react";

export default function TemplatePanelBody({
  tabs = [],
  activeTabId = "",
  searchQuery = "",
  searchPlaceholder = "Search templates...",
  showTemplateGrid = true,
  templates = [],
  emptyStateTitle = "",
  emptyStateDescription = "",
  onChooseTab = null,
  onChangeSearchQuery = null,
  onChooseTemplate = null,
}) {
  const hasTemplates = showTemplateGrid && templates.length > 0;

  return (
    <div>
      <div className="flex flex-wrap gap-[var(--space-2)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChooseTab?.(tab.id)}
            className={`inline-flex min-h-[var(--control-sm)] items-center rounded-[var(--radius-md)] border px-[var(--space-4)] text-sm transition ${
              activeTabId === tab.id
                ? "border-[var(--gold-action)] bg-[var(--surface-1)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-[var(--space-4)] flex items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
        <Search size={16} className="text-[var(--gold-ornament)]" />
        <input
          value={searchQuery}
          onChange={(event) => onChangeSearchQuery?.(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
        />
      </div>

      {hasTemplates ? (
        <div className="mt-[var(--space-4)] grid gap-[var(--space-3)] sm:grid-cols-2">
          {templates.map((template) => (
            <article
              key={template.id}
              className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]"
            >
              <p className="text-[10px] font-medium uppercase leading-[0.9rem] tracking-[0.14em] text-[var(--gold-ornament)]">
                {template.sourceLabel} &middot; {template.categoryLabel}
              </p>
              <h3 className="mt-[var(--space-2)] font-display text-lg text-[var(--ink)]">
                {template.title}
              </h3>
              <p className="mt-[var(--space-2)] text-sm leading-6 text-[var(--ink-dim)]">
                {template.description}
              </p>
              <button
                type="button"
                onClick={() => onChooseTemplate?.(template.id)}
                className="cf-btn cf-btn--secondary cf-btn--sm mt-[var(--space-3)] w-full"
              >
                {template.actionLabel}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] p-[var(--space-6)] text-center">
          <Sparkles className="mx-auto text-[var(--gold-ornament)]" size={24} />
          <p className="mt-[var(--space-3)] font-display text-lg text-[var(--ink)]">
            {emptyStateTitle}
          </p>
          <p className="mx-auto mt-[var(--space-2)] max-w-md text-sm leading-6 text-[var(--ink-dim)]">
            {emptyStateDescription}
          </p>
        </div>
      )}
    </div>
  );
}
