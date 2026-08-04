import { Search, X } from "lucide-react";

export default function LocationParentPickerModalView({
  eyebrow = "Location Hierarchy",
  title = "Select Parent Location",
  description =
    "Choose the broader location this place belongs under. The parent location provides inherited runtime context such as weather, time, knowledge, and travel rules.",
  searchPlaceholder = "Search locations...",
  searchQuery = "",
  items = [],
  isLoading = false,
  loadingMessage = "Loading locations...",
  errorMessage = "",
  emptyMessage = "No parent locations found.",
  onSearchQueryChange = null,
  onClose = null,
  onChooseLocation = null,
}) {
  const showEmptyState = !isLoading && !errorMessage && items.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] backdrop-blur-[2px] p-4">
      <section className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line-whisper)] py-3 px-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">
          <label className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChange?.(event.target.value)
              }
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
            />
          </label>

          {isLoading ? (
            <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm text-[var(--ink-dim)]">
              {loadingMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-3 text-sm text-[var(--status-danger)]">
              {errorMessage}
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="mt-5 rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm text-[var(--ink-dim)]">
              {emptyMessage}
            </p>
          ) : null}

          {items.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <button
                  key={item?.id || index}
                  type="button"
                  onClick={() => onChooseLocation?.(item?.id)}
                  aria-pressed={Boolean(item?.isSelected)}
                  className={`overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] text-left transition hover:border-[var(--gold-ornament)]/45 ${
                    item?.isSelected
                      ? "border-[var(--gold-ornament)]/60"
                      : "border-[var(--line)]"
                  }`}
                >
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item?.displayImageUrl || ""})`,
                    }}
                    role="img"
                    aria-label={item?.imageAltText || "Location image"}
                  />

                  <div className="p-4">
                    <p className="font-display text-2xl">
                      {item?.title || "Untitled Location"}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
                      {item?.subtitle || "Location"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(item?.badges || []).map((badge, badgeIndex) => (
                        <span
                          key={`${item?.id || index}-badge-${badgeIndex}`}
                          className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-bright)]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {item?.referenceText ? (
                      <p className="mt-3 break-all text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-dim)]">
                        {item.referenceText}
                      </p>
                    ) : null}
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
