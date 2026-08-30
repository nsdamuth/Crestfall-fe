import {
  Check,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

export default function CreationFeaturedImagePickerModalView({
  slotLabel = "Featured Slot",
  sourceOptions = [],
  activeSource = "library",
  images = [],
  isLoading = false,
  loadErrorMessage = "",
  saveMessage = "",
  saveMessageTone = "notice",
  activeImageId = null,
  hasMoreImages = false,
  refreshDisabled = false,
  searchValue = "",
  searchPlaceholder = "",
  filterOptions = [],
  activeFilter = "all",
  resultsLabel = "",
  showClearFilters = false,
  emptyTitle = "No eligible images",
  emptyMessage = "No images are available for this slot.",
  helperText = "Choose an eligible image for this featured slot.",
  onClose = null,
  onRefresh = null,
  onSourceChange = null,
  onSearchChange = null,
  onFilterChange = null,
  onClearFilters = null,
  onLoadMore = null,
  onChooseImage = null,
}) {
  const showBrowseTools = Boolean(searchPlaceholder || filterOptions.length);

  return (
    <KitModalFrame
      onClose={onClose}
      ariaLabel="Select featured image"
      panelClassName="w-full max-w-5xl"
    >
      <div className="flex max-h-[100dvh] w-full flex-col min-[700px]:max-h-[92dvh]">
        <div className="flex items-start justify-between gap-4 p-5 pr-16">
          <div>
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              Select Featured Image
            </p>
            <h2 className="mt-2 font-display text-4xl">{slotLabel}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-dim)]">
              {helperText}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRefresh?.()}
            disabled={refreshDisabled}
            className="cf-btn cf-btn--secondary cf-btn--sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div aria-hidden="true" className="mx-5 h-px bg-[image:var(--line-fade)]" />

        {sourceOptions.length ? (
          <div className="flex flex-wrap gap-2 px-5 pt-4">
            {sourceOptions.map((source) => {
              const active = source?.id === activeSource;

              return (
                <button
                  key={source?.id}
                  type="button"
                  onClick={() => onSourceChange?.(source?.id)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[var(--track-eyebrow)] transition ${
                    active
                      ? "border-[var(--gold-ornament)] bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]"
                      : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                  }`}
                >
                  {source?.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {showBrowseTools ? (
          <div className="px-5 pt-4">
            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-3">
              {searchPlaceholder ? (
                <label className="relative block">
                  <Search
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-dim)]"
                  />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label="Search Crestfall Stock"
                    className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] pl-9 pr-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/45"
                  />
                </label>
              ) : null}

              {filterOptions.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {filterOptions.map((filter) => {
                    const active = filter?.id === activeFilter;

                    return (
                      <button
                        key={filter?.id}
                        type="button"
                        onClick={() => onFilterChange?.(filter?.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs transition ${
                          active
                            ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)]"
                            : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
                        }`}
                      >
                        {filter?.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {resultsLabel || showClearFilters ? (
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--ink-dim)]">
                  <span>{resultsLabel}</span>
                  {showClearFilters ? (
                    <button
                      type="button"
                      onClick={() => onClearFilters?.()}
                      className="text-[var(--gold-ornament)] transition hover:text-[var(--ink)]"
                    >
                      Clear filters
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loadErrorMessage ? (
            <p className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-4 py-3 text-sm text-[var(--status-danger)]">
              {loadErrorMessage}
            </p>
          ) : null}

          {saveMessage ? (
            <p
              className={`mb-4 rounded-[var(--radius-md)] border px-4 py-3 text-sm ${
                saveMessageTone === "error"
                  ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]"
                  : "border-[var(--line)] bg-[var(--fill)] text-[var(--gold-ornament)]"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}

          {isLoading ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-10 text-center">
              <Loader2
                size={28}
                className="mx-auto animate-spin text-[var(--gold-ornament)]"
              />
              <p className="mt-4 text-sm text-[var(--ink-dim)]">
                Loading image sources...
              </p>
            </div>
          ) : null}

          {!isLoading && !images.length ? (
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] bg-[var(--surface-1)] p-8 text-center">
              <ImageIcon size={30} className="mx-auto text-[var(--gold-ornament)]" />
              <p className="mt-4 font-display text-3xl">{emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--ink-dim)]">
                {emptyMessage}
              </p>
            </div>
          ) : null}

          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image, index) => {
                const busy = activeImageId === image?.id;
                const selected = Boolean(image?.isSelected);

                return (
                  <button
                    key={image?.id || image?.displayImageUrl || index}
                    type="button"
                    onClick={() => onChooseImage?.(image?.id)}
                    disabled={busy}
                    aria-pressed={selected}
                    className={`group overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-1)] p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected
                        ? "border-[var(--gold-ornament)]/70 ring-1 ring-[var(--gold-ornament)]/30"
                        : "border-[var(--line)] hover:-translate-y-1 hover:border-[var(--gold-ornament)]/35"
                    }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)]">
                      {selected ? (
                        <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border border-[var(--gold-ornament)]/55 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--gold-ornament)] shadow-lg backdrop-blur-sm">
                          <Check size={11} aria-hidden="true" />
                          Selected
                        </span>
                      ) : null}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image?.displayImageUrl || ""}
                        alt={image?.altText || "Featured image option"}
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index < 4 ? "high" : "low"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    {image?.title ? (
                      <p className="mt-3 line-clamp-1 font-display text-lg text-[var(--ink)]">
                        {image.title}
                      </p>
                    ) : null}

                    {image?.description ? (
                      <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-[var(--ink-dim)]">
                        {image.description}
                      </p>
                    ) : null}

                    <p className={`${image?.title ? "mt-2" : "mt-3"} text-xs uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]`}>
                      {busy
                        ? "Saving..."
                        : selected
                          ? "Currently selected"
                          : `Use as ${slotLabel}`}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-[var(--ink-dim)]">
                      {image?.metadataLabel || "SFW · CLEAR"}
                    </p>

                    {image?.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Stock image tags">
                        {image.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-2 py-1 text-[10px] uppercase tracking-wide text-[var(--ink-dim)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          {hasMoreImages ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => onLoadMore?.()}
                className="cf-btn cf-btn--secondary"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </KitModalFrame>
  );
}
