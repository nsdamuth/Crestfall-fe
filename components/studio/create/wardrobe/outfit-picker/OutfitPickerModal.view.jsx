import { Search, X } from "lucide-react";

export default function OutfitPickerModalView({
  title = "Select Outfit",
  eyebrow = "Wardrobe",
  description = "Choose an existing Outfit creation.",
  searchPlaceholder = "Search outfits...",
  searchQuery = "",
  items = [],
  isLoading = false,
  loadingMessage = "Loading outfits...",
  errorMessage = "",
  emptyMessage = "No outfits found.",
  onSearchQueryChange = null,
  onClose = null,
  onChooseItem = null,
}) {
  const showEmptyState = !isLoading && !errorMessage && items.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChange?.(event.target.value)
              }
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </label>

          {isLoading ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
              {loadingMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {errorMessage}
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
              {emptyMessage}
            </p>
          ) : null}

          {items.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <button
                  key={item?.id || index}
                  type="button"
                  onClick={() => onChooseItem?.(item?.id)}
                  aria-pressed={Boolean(item?.isSelected)}
                  className={`overflow-hidden rounded-[var(--radius-md)] border bg-black/35 text-left transition hover:border-[var(--muted-gold)]/45 ${
                    item?.isSelected
                      ? "border-[var(--muted-gold)]/60"
                      : "border-white/10"
                  }`}
                >
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item?.displayImageUrl || ""})`,
                    }}
                    role="img"
                    aria-label={item?.imageAltText || "Clothing creation image"}
                  />

                  <div className="p-4">
                    <p className="font-display text-2xl">
                      {item?.title || "Untitled Outfit"}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                      {item?.subtitle || "Outfit"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        {item?.typeLabel || "Outfit"}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                        {item?.ratingLabel || "SFW"}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
