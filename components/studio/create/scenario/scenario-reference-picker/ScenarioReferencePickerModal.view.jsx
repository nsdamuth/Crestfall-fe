import { CheckCircle2, Search, X } from "lucide-react";

export default function ScenarioReferencePickerModalView({
  eyebrow = "Select Scenario Reference",
  title = "Select Reference",
  body = "Choose a Scenario reference.",
  searchQuery = "",
  searchPlaceholder = "Search references...",
  items = [],
  selectedCount = 0,
  showSelectedCount = false,
  showDoneAction = false,
  emptyMessage = "No matching creations found.",
  onSearchQueryChange = null,
  onChooseItem = null,
  onClose = null,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              {eyebrow}
            </p>

            <h2 className="mt-2 font-display text-4xl">{title}</h2>

            {body ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                {body}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={searchQuery}
              onChange={(event) => onSearchQueryChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </div>

          {showSelectedCount ? (
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              {selectedCount} selected
            </p>
          ) : null}

          <div className="mt-5 grid max-h-[58vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.length ? (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChooseItem?.(item.id)}
                  className={`overflow-hidden rounded-xl border text-left transition hover:-translate-y-0.5 ${
                    item.isSelected
                      ? "border-[var(--muted-gold)]/65 bg-[var(--muted-gold)]/15"
                      : "border-white/10 bg-black/35 hover:border-[var(--muted-gold)]/35"
                  }`}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.imageAltText}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center">
                          <p className="font-display text-3xl text-[var(--muted-gold)]">
                            {item.title.slice(0, 1).toUpperCase()}
                          </p>
                          <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
                            {item.typeLabel}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 font-display text-xl leading-none text-[var(--foreground)]">
                        {item.title}
                      </p>

                      {item.isSelected ? (
                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-[var(--muted-gold)]"
                        />
                      ) : null}
                    </div>

                    <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[var(--muted)]">
                      {item.subtitle}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
                        {item.typeLabel}
                      </span>

                      <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
                        {item.ratingLabel}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/25 p-8 text-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="font-display text-3xl">No matches</p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                  {emptyMessage}
                </p>
              </div>
            )}
          </div>

          {showDoneAction ? (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
              >
                Done
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
