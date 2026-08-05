import { BookOpen, Search, X } from "lucide-react";

export default function StorylineReferencePickerModalView({
  eyebrow = "Storyline Sequence",
  title = "Add a Story or Scenario",
  description = "",
  dialogTitleId = "storyline-reference-picker-title",
  closeLabel = "Close Storyline reference picker",
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
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-[var(--scrim-strong)] p-2 backdrop-blur-[var(--blur-panel)] sm:p-4"
      style={{
        zIndex: 2147483647,
        isolation: "isolate",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogTitleId}
    >
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/30 bg-[#0b0908] shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
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

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-xl border border-white/10 p-2 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
            aria-label={closeLabel}
          >
            <X size={18} />
          </button>
        </header>

        <div className="border-b border-white/10 p-5">
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
    </div>
  );
}
