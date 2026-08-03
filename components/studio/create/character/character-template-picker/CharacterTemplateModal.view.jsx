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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl">{modalTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {modalDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close template picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab?.id || tab?.label}
                type="button"
                onClick={() => onChooseTab?.(tab?.id || "")}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                  activeTabId === tab?.id
                    ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
                }`}
              >
                {tab?.label || "Template group"}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={searchQuery}
              onChange={(event) => onChangeSearchQuery?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          {showTemplateGrid ? (
            <div className="mt-5 grid max-h-[58vh] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
              {templates.map((template) => (
                <article
                  key={template?.id || template?.title}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                    {template?.sourceLabel || "Template"} ·{" "}
                    {template?.categoryLabel || "Uncategorized"}
                  </p>

                  <h3 className="mt-2 font-display text-3xl">
                    {template?.title || "Untitled Template"}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {template?.description || ""}
                  </p>

                  <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                      {template?.prefillLabel || "Prefills"}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                      {template?.prefillSummary || ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onChooseTemplate?.(template?.id || "")}
                    className="mt-4 w-full rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
                  >
                    {template?.actionLabel || "Apply Template"}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/25 p-8 text-center">
              <Sparkles
                className="mx-auto text-[var(--muted-gold)]"
                size={28}
              />
              <p className="mt-4 font-display text-3xl">{emptyStateTitle}</p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                {emptyStateDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
