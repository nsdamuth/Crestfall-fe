// NESTED MODAL LAW (docs/BUILD-BLUEPRINT.md, the R1 credits pattern,
// generalized 10 Aug 2026 defect ruling): a modal opened from inside
// another modal opens in the same space, on the same KitModalFrame
// branding as the primary, scrollable, with an explicit back path
// back to the surface beneath. Previously a bespoke fixed-position
// overlay with its own portal, escape handler, scroll lock, and
// z-index override, all now redundant with what KitModalFrame (via
// ModalShell) already provides; removed in favor of composing it
// directly.
import { ArrowLeft, BookOpen, Search } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

export default function StorylineReferencePickerModalView({
  eyebrow = "Storyline Sequence",
  title = "Add a Story or Scenario",
  description = "",
  dialogTitleId = "storyline-reference-picker-title",
  backLabel = "Back to Storyline",
  tabs = [],
  searchQuery = "",
  searchPlaceholder = "Search references",
  items = [],
  emptyMessage = "No matching references were found.",
  onTabChange = null,
  onSearchQueryChange = null,
  onSelectItem = null,
  onClose = null,
}) {
  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-4xl"
      onClose={onClose}
      ariaLabelledBy={dialogTitleId}
    >
      <div className="flex max-h-[100dvh] flex-col min-[700px]:max-h-[92dvh]">
        <header className="flex flex-col gap-3 border-b border-[var(--line-whisper)] p-5">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="kit-focus flex w-fit items-center gap-2 rounded-[var(--radius-md)] text-[length:var(--text-label)] uppercase tracking-[0.16em] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {backLabel}
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              {eyebrow}
            </p>
            <h2 id={dialogTitleId} className="mt-2 font-display text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                {description}
              </p>
            ) : null}
          </div>
        </header>

        <div className="border-b border-[var(--line-whisper)] p-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={`rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                  tab.isActive
                    ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                    : "border-white/10 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={17} className="text-[var(--gold-ornament)]" />
            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChange?.(event.target.value)
              }
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--ink-dim)]/60"
            />
          </label>
        </div>

        <div className="overflow-y-auto p-5">
          {items.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.isSelected}
                  onClick={() => onSelectItem?.(item.id)}
                  className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4 text-left transition hover:border-[var(--gold-ornament)]/40 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen
                      size={19}
                      className="mt-1 shrink-0 text-[var(--gold-ornament)]"
                    />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                        {item.kindLabel}
                      </p>
                      <h3 className="mt-1 font-display text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--ink-dim)]">
                        {item.subtitle}
                      </p>
                      {item.isSelected ? (
                        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-emerald-200">
                          Already in this Storyline
                        </p>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-md)] border border-dashed border-white/15 p-8 text-center text-sm text-[var(--ink-dim)]">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </KitModalFrame>
  );
}
