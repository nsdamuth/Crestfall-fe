import { Search } from "lucide-react";
import KitModalFrame from "@/components/kit/KitModalFrame";

// Ruling 3 (ED1G): hand-rolled fixed-inset overlay retired onto
// KitModalFrame (A4 mobile bottom-anchor law, B1 fade dividers).
// LARGE width tier (section 8): a media grid of location cards is the
// documented "featured image picker" exception. B1 header divider
// fixed off edge-to-edge border-b; B4 selected recipe (--fill-whisper
// fill, no border-only gold ring); tier scale corrected on the title
// and entry titles.
export default function LocationParentPickerModalView({
  eyebrow = "Location Hierarchy",
  title = "Select Parent Location",
  description = "Choose the broader location this place belongs under. The parent location provides inherited runtime context such as weather, time, knowledge, and travel rules.",
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
    <KitModalFrame onClose={onClose} panelClassName="max-w-4xl" ariaLabel={title}>
      <div className="flex max-h-[92dvh] flex-col">
        <div className="border-b border-[var(--line-fade)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading-m)] leading-[var(--lh-heading-m)] min-[700px]:text-[length:var(--text-heading)] min-[700px]:leading-[var(--lh-heading)]">
            {title}
          </h2>
          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-[var(--space-5)] pb-[var(--space-6)]">
          <label className="flex min-h-[var(--control-md)] items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)]">
            <Search size={16} className="text-[var(--ink-faint)]" />
            <input
              value={searchQuery}
              onChange={(event) => onSearchQueryChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            />
          </label>

          {isLoading ? (
            <p className="mt-[var(--space-5)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
              {loadingMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--status-danger)]">
              {errorMessage}
            </p>
          ) : null}

          {showEmptyState ? (
            <p className="mt-[var(--space-5)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] p-[var(--space-3)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
              {emptyMessage}
            </p>
          ) : null}

          {items.length ? (
            <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <button
                  key={item?.id || index}
                  type="button"
                  onClick={() => onChooseLocation?.(item?.id)}
                  aria-pressed={Boolean(item?.isSelected)}
                  className={`overflow-hidden rounded-[var(--radius-md)] border text-left transition ${
                    item?.isSelected
                      ? "border-[var(--gold-action)] bg-[var(--fill-whisper)]"
                      : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] hover:border-[var(--state-hover-line)]"
                  }`}
                >
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item?.displayImageUrl || ""})` }}
                    role="img"
                    aria-label={item?.imageAltText || "Location image"}
                  />

                  <div className="p-[var(--space-4)]">
                    <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
                      {item?.title || "Untitled Location"}
                    </p>

                    <p className="mt-[var(--space-2)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                      {item?.subtitle || "Location"}
                    </p>

                    <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-2)]">
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
                      <p className="mt-[var(--space-3)] break-all text-[length:var(--text-label)] font-medium uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-faint)]">
                        {item.referenceText}
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </KitModalFrame>
  );
}
