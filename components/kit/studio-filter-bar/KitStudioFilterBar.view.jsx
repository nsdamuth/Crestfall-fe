"use client";

// One-line filter law (9 Aug 2026, docs/BUILD-BLUEPRINT.md 2.16):
// search, every filter, and sort share one sticky line; filters and
// multi-selects are branded dropdowns (KitDropdown) with selection
// counts; loose chip rows are retired from filter surfaces. Bar shell
// traces to the legacy control bar (docs/MOCKUP-DECISIONS.md, control
// bar entry): canvas-tinted translucency with chrome frost, full-bleed
// margin trick, controls-with-their-own-states inside a REST-only bar.
//
// Mobile (390): search takes its own full-width row above the control
// line (ruled this pass; the always-visible field beats a two-tap
// icon-expand for the page's highest-frequency control), and the
// control line scrolls horizontally without clipping.
import { Search } from "lucide-react";

import KitDropdownView from "../dropdown/KitDropdown.view";

function SearchField({ value, placeholder, onChange }) {
  // Focus law (9 Aug 2026): the ring outlines the full control border,
  // never the inner field. The wrapper carries the ring via
  // focus-within; the input suppresses the global per-element ring.
  return (
    <div className="flex min-h-[var(--control-md)] w-full items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] transition-colors focus-within:[box-shadow:var(--focus-ring)] hover:border-[var(--line)] min-[700px]:min-w-[9rem] min-[700px]:max-w-[20rem] min-[700px]:flex-1">
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name="kit-studio-filter-bar-search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus-visible:[box-shadow:none] [@media(pointer:coarse)]:text-[length:var(--text-body)]"
      />
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
    <div className="sticky top-0 z-10 mx-[calc(var(--space-5)*-1)] flex flex-col gap-[var(--space-2)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-[var(--space-5)] py-[var(--space-3)] backdrop-blur-[var(--blur-chrome)] min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:items-center min-[700px]:gap-[var(--space-2)]">
      <SearchField
        value={searchValue}
        placeholder={searchPlaceholder}
        onChange={onSearchChange}
      />

      <div className="scrollbar-none flex items-center gap-[var(--space-2)] overflow-x-auto min-[700px]:flex-1 min-[700px]:flex-wrap min-[700px]:overflow-visible">
        {filterGroups.map((group) => (
          <KitDropdownView
            key={group.id}
            label={group.label}
            options={(group.options || []).map((option) => ({
              ...option,
              count: isLoadingCounts ? null : option.count,
            }))}
            selectedValues={selectedValues?.[group.id] || []}
            isMultiSelect={group.isMultiSelect !== false}
            onToggleOption={(value) => onFilterToggle?.(group.id, value)}
          />
        ))}

        {sortOptions.length > 0 && (
          <KitDropdownView
            label="Sort"
            options={sortOptions}
            selectedValues={selectedSort ? [selectedSort] : []}
            isMultiSelect={false}
            onToggleOption={(value) => onSortChange?.(value)}
          />
        )}

        <div className="ml-auto flex flex-none items-center pl-[var(--space-2)]">
          {viewModeSlot}
        </div>
      </div>
    </div>
  );
}
