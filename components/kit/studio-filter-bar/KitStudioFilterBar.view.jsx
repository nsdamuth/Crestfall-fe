"use client";

import { ChevronDown, Search } from "lucide-react";

import KitFilterChipView from "../filter-chip/KitFilterChip.view";

function SearchField({ value, placeholder, onChange }) {
  return (
    <div className="flex min-h-[var(--control-md)] flex-1 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)]">
      <Search size={16} className="text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name="kit-studio-filter-bar-search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none"
      />
    </div>
  );
}

function SortSelect({ options, value, onChange }) {
  if (!options.length) return null;

  return (
    <div className="relative inline-flex flex-none">
      <select
        name="kit-studio-filter-bar-sort"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-label="Sort by"
        className="min-h-[var(--control-sm)] appearance-none rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] py-0 pl-[var(--space-4)] pr-[var(--space-8)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] transition-colors hover:border-[var(--line)] hover:text-[var(--ink)] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        aria-hidden="true"
        className="pointer-events-none absolute right-[var(--space-2)] top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
      />
    </div>
  );
}

function FilterGroupRow({ group, selectedValues, isLoadingCounts, onFilterToggle }) {
  if (!group.options.length) return null;

  const selected = selectedValues?.[group.id] || [];

  return (
    <div className="flex min-w-0 flex-col gap-[var(--space-1)]">
      {group.label && (
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          {group.label}
        </p>
      )}
      <div className="scrollbar-none flex gap-[var(--space-2)] overflow-x-auto">
        {group.options.map((option) => (
          <KitFilterChipView
            key={option.value}
            label={option.label}
            count={isLoadingCounts ? null : option.count}
            isSelected={selected.includes(option.value)}
            variant="default"
            onToggle={() => onFilterToggle?.(group.id, option.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default function KitStudioFilterBarView({
  searchValue = "",
  searchPlaceholder = "Search",
  onSearchChange = null,
  filterGroups = [],
  selectedValues = {},
  onFilterToggle = null,
  sortOptions = [],
  selectedSort = "",
  onSortChange = null,
  isLoadingCounts = false,
  viewModeSlot = null,
}) {
  return (
    <div className="sticky top-0 z-10 mx-[calc(var(--space-5)*-1)] flex flex-col gap-[var(--space-3)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-[var(--space-5)] py-[var(--space-3)] backdrop-blur-[var(--blur-chrome)]">
      <div className="flex flex-wrap items-center gap-[var(--space-3)]">
        <SearchField
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={onSearchChange}
        />
        <SortSelect
          options={sortOptions}
          value={selectedSort}
          onChange={onSortChange}
        />
        {viewModeSlot}
      </div>

      {filterGroups.length > 0 && (
        <div className="flex flex-wrap gap-[var(--space-4)]">
          {filterGroups.map((group) => (
            <FilterGroupRow
              key={group.id}
              group={group}
              selectedValues={selectedValues}
              isLoadingCounts={isLoadingCounts}
              onFilterToggle={onFilterToggle}
            />
          ))}
        </div>
      )}

      {isLoadingCounts && (
        <p className="text-[length:var(--text-label)] text-[var(--ink-faint)]">
          Updating counts...
        </p>
      )}
    </div>
  );
}
