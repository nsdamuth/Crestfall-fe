"use client";

// Picker modal anatomy, docs/BUILD-BLUEPRINT.md 2.9. Composed on the
// unified modal frame (2.5): search field, optional filter chip row,
// rich rows or a tile grid, single and multi select, sticky footer
// with the count in words plus Confirm and Cancel, a load-more slot
// where the source is paged. Fixture-fed; search, filtering, and
// paging live with the caller.
import { Check, Loader2, Search } from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import KitFilterChip from "../KitFilterChip";
import KitLoadMore from "../KitLoadMore";
import KitArtPlaceholderView from "../art-placeholder/KitArtPlaceholder.view";

const COUNT_WORDS = [
  "no",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

function describeSelection(count) {
  if (count === 0) return "No items selected";
  const word = count < COUNT_WORDS.length ? COUNT_WORDS[count] : count;
  return `${word} item${count === 1 ? "" : "s"} selected`;
}

function SearchField({ value, placeholder, onChange }) {
  return (
    <div className="flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)]">
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name="picker-modal-search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="kit-search-input w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none"
      />
    </div>
  );
}

function FilterRow({ filters, onToggleFilter }) {
  if (!filters?.length) return null;

  return (
    <div className="flex flex-wrap gap-[var(--space-2)]">
      {filters.map((filter) => (
        <KitFilterChip
          key={filter.value}
          label={filter.label}
          isSelected={Boolean(filter.isSelected)}
          onToggle={() => onToggleFilter?.(filter.value)}
        />
      ))}
    </div>
  );
}

function Thumbnail({ item }) {
  if (item?.imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.imageSrc}
        alt=""
        className="aspect-square w-full flex-none rounded-[var(--radius-sm)] object-cover"
      />
    );
  }

  return (
    <div className="aspect-square w-full flex-none overflow-hidden rounded-[var(--radius-sm)]">
      <KitArtPlaceholderView size="sm" />
    </div>
  );
}

function RowItem({ item, isSelected, isMultiSelect, onActivate }) {
  return (
    <button
      type="button"
      role={isMultiSelect ? "checkbox" : "option"}
      aria-checked={isMultiSelect ? isSelected : undefined}
      aria-selected={!isMultiSelect ? isSelected : undefined}
      onClick={() => onActivate?.(item.id)}
      className={`kit-focus flex w-full items-center gap-[var(--space-3)] rounded-[var(--radius-md)] border px-[var(--space-3)] py-[var(--space-2)] text-left transition-colors ${
        isSelected
          ? "border-[var(--gold-action)] bg-[var(--fill)]"
          : "border-transparent hover:bg-[var(--state-hover-fill)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      <div className="h-10 w-10 flex-none">
        <Thumbnail item={item} />
      </div>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
            isSelected ? "text-[var(--gold-bright)]" : "text-[var(--ink)]"
          }`}
        >
          {item.title}
        </span>
        {item.subtitle && (
          <span className="block truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {item.subtitle}
          </span>
        )}
      </span>
      {item.badgeLabel && (
        <span className="flex-none rounded-[var(--radius-full)] px-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
          {item.badgeLabel}
        </span>
      )}
      <span aria-hidden="true" className={`flex-none ${isSelected ? "" : "invisible"}`}>
        <Check size={16} className="text-[var(--gold-bright)]" />
      </span>
    </button>
  );
}

function TileItem({ item, isSelected, isMultiSelect, onActivate }) {
  return (
    <button
      type="button"
      role={isMultiSelect ? "checkbox" : "option"}
      aria-checked={isMultiSelect ? isSelected : undefined}
      aria-selected={!isMultiSelect ? isSelected : undefined}
      onClick={() => onActivate?.(item.id)}
      className={`kit-focus overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-2)] text-left transition-colors ${
        isSelected ? "border-[var(--gold-action)] bg-[var(--fill)]" : "border-[var(--line)] hover:border-[var(--line-strong)]"
      }`}
    >
      <div className="relative">
        <Thumbnail item={item} />
        <span
          aria-hidden="true"
          className={`absolute right-[var(--space-2)] top-[var(--space-2)] flex h-6 w-6 items-center justify-center rounded-[var(--radius-full)] bg-[var(--surface-4)] ${
            isSelected ? "" : "invisible"
          }`}
        >
          <Check size={14} className="text-[var(--gold-bright)]" />
        </span>
      </div>
      <div className="p-[var(--space-2)]">
        <p
          className={`truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
            isSelected ? "text-[var(--gold-bright)]" : "text-[var(--ink)]"
          }`}
        >
          {item.title}
        </p>
        {item.subtitle && (
          <p className="truncate text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
            {item.subtitle}
          </p>
        )}
      </div>
    </button>
  );
}

export default function KitPickerModalView({
  title = "",
  layout = "rows",
  isMultiSelect = false,
  items = [],
  selectedIds = [],
  searchValue = "",
  searchPlaceholder = "Search...",
  filters = [],
  isLoading = false,
  hasMore = false,
  isSearching = false,
  emptyMessage = "No results found.",
  errorMessage = "",
  onSearchChange = null,
  onToggleFilter = null,
  onToggleItem = null,
  onLoadMore = null,
  onConfirm = null,
  onClose = null,
}) {
  function activateItem(id) {
    onToggleItem?.(id);
    if (!isMultiSelect) onConfirm?.();
  }

  const ItemComponent = layout === "grid" ? TileItem : RowItem;

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="w-full max-w-2xl"
      onClose={onClose}
      ariaLabel={title}
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex flex-col gap-[var(--space-3)] p-[var(--space-6)] pb-[var(--space-4)] pt-[var(--space-8)]">
          <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            {title}
          </h2>
          <SearchField value={searchValue} placeholder={searchPlaceholder} onChange={onSearchChange} />
          <FilterRow filters={filters} onToggleFilter={onToggleFilter} />
        </div>

        <div className="flex-1 overflow-y-auto px-[var(--space-6)]">
          {errorMessage ? (
            <p className="rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
              {errorMessage}
            </p>
          ) : isSearching ? (
            <div className="flex items-center justify-center gap-[var(--space-2)] py-[var(--space-8)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Searching
            </div>
          ) : items.length === 0 ? (
            <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-[var(--space-6)] text-center text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {emptyMessage}
            </p>
          ) : (
            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-2 gap-[var(--space-3)] pb-[var(--space-4)] min-[700px]:grid-cols-3"
                  : "flex flex-col gap-[var(--space-1)] pb-[var(--space-4)]"
              }
            >
              {items.map((item) => (
                <ItemComponent
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.includes(item.id)}
                  isMultiSelect={isMultiSelect}
                  onActivate={activateItem}
                />
              ))}
            </div>
          )}

          {!errorMessage && !isSearching && items.length > 0 && (hasMore || isLoading) && (
            <div className="pb-[var(--space-4)]">
              <KitLoadMore isLoading={isLoading} hasMore={hasMore} remainingCount={null} onLoadMore={onLoadMore} />
            </div>
          )}
        </div>

        <div className="px-[var(--space-6)] pt-[var(--space-4)]">
          {/* B1 fade divider, never edge-to-edge; B8 footer alignment
              to the fade line's own ends. */}
          <div aria-hidden="true" className="h-px bg-[image:var(--line-fade)]" />
        </div>
        <div className="flex items-center justify-between gap-[var(--space-3)] px-[var(--space-6)] pb-[var(--space-4)] pt-[var(--space-4)]">
          <span className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {isMultiSelect ? describeSelection(selectedIds.length) : ""}
          </span>
          <div className="flex items-center gap-[var(--space-2)]">
            <button type="button" onClick={() => onClose?.()} className="kit-focus cf-btn cf-btn--secondary">
              Cancel
            </button>
            {isMultiSelect && (
              <button type="button" onClick={() => onConfirm?.()} className="kit-focus cf-btn cf-btn--primary">
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </KitModalFrame>
  );
}
