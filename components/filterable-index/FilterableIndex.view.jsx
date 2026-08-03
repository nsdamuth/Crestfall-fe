"use client";

import { useRef } from "react";

export default function FilterableIndexView({
  search = "",
  filterOptions = [],
  tags = [],
  allTagsActive = true,
  cards = [],
  emptyText = "No matching records found.",
  onSearchChange,
  onClearSearch,
  onFilterChange,
  onClearFilters,
  onSelectAllTags,
  onToggleTag,
  renderCard,
}) {
  const tagRailRef = useRef(null);

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 border-y border-[var(--border)] py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <input
              value={search}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search the archive..."
              className="w-full rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.08)] px-5 pr-12 py-3 font-serif text-base text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]"
            />

            {search ? (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map((filter) => (
              <select
                key={filter.key}
                value={filter.value}
                onChange={(event) =>
                  onFilterChange?.(filter.key, event.target.value)
                }
                className="rounded-full border border-[var(--border)] bg-[rgba(20,18,16,0.95)] px-4 py-3 font-display text-xs uppercase tracking-[0.2em] text-[#f2ead9] outline-none focus:border-[var(--muted-gold)]"
              >
                <option value="all">{filter.label}</option>

                {filter.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ))}

            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.06)] px-4 py-3 font-display text-xs uppercase tracking-[0.2em] text-[var(--muted)] transition hover:border-[var(--muted-gold)] hover:text-[var(--foreground)]"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="relative pt-2">
          <button
            type="button"
            onClick={() =>
              tagRailRef.current?.scrollBy({ left: -240, behavior: "smooth" })
            }
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[var(--border)] bg-[rgba(10,10,10,0.92)] px-3 py-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            ←
          </button>

          <div
            ref={tagRailRef}
            className="scrollbar-none flex gap-3 overflow-x-auto px-12"
          >
            <button
              type="button"
              onClick={onSelectAllTags}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-display text-xs uppercase tracking-[0.2em] ${
                allTagsActive
                  ? "bg-[var(--muted-gold)] text-black"
                  : "bg-[rgba(255,255,255,0.08)] text-[var(--muted)]"
              }`}
            >
              All
            </button>

            {tags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => onToggleTag?.(tag.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-display text-xs uppercase tracking-[0.2em] ${
                  tag.isActive
                    ? "bg-[var(--muted-gold)] text-black"
                    : "bg-[rgba(255,255,255,0.08)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tag.value}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              tagRailRef.current?.scrollBy({ left: 240, behavior: "smooth" })
            }
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-[var(--border)] bg-[rgba(10,10,10,0.92)] px-3 py-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {cards.length > 0 ? (
          cards.map((card) => renderCard?.(card))
        ) : (
          <p className="font-serif text-xl text-[var(--muted)]">{emptyText}</p>
        )}
      </div>
    </>
  );
}
