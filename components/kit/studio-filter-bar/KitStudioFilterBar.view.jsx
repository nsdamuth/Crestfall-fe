"use client";

// One-line filter law (9 Aug 2026, docs/BUILD-BLUEPRINT.md 2.16):
// search, every filter, and sort share one sticky line; filters and
// multi-selects are branded dropdowns (KitDropdown) with selection
// counts; loose chip rows are retired from filter surfaces. Bar shell
// traces to the legacy control bar (docs/MOCKUP-DECISIONS.md, control
// bar entry): canvas-tinted translucency with chrome frost, full-bleed
// margin trick, controls-with-their-own-states inside a REST-only bar.
//
// Sticky stack, RULED 10 Aug 2026 (kit polish 3 pass): this bar docks
// directly beneath the sticky StudioTopBar, not at the viewport top.
// `top: var(--topbar-h)` (the top bar's own measured height, minted
// this pass) closes the gap and clears the overlap that `top: 0`
// produced once both surfaces were pinned at the same offset. z-10
// keeps it under the top bar's z-40 so the top bar always wins the
// stacking order while both are pinned.
//
// Mobile (390): search takes its own full-width row above the control
// line (ruled this pass; the always-visible field beats a two-tap
// icon-expand for the page's highest-frequency control), and the
// control line scrolls horizontally without clipping.
//
// Filter line balance, RULED 10 Aug 2026 (kit polish 3 pass, amends
// BUILD-BLUEPRINT.md 2.1): search anchors left; Type, Rating, Sort,
// and the view toggle group together anchored right, on
// `ml-auto` rather than splitting growth with search (the prior
// `flex-1` on both sides made them compete for space instead of
// leaving one flexible gap between two anchored ends). Inside the
// right group, `--space-2` holds the dropdown/sort cluster together
// as before; `--space-4`, the system's standing control-group
// separator (sidebar dividers, grid gutters), opens a wider, ruled
// gap before the view toggle so it reads as its own control, not a
// fourth dropdown. Same law at every width; below 700px the group
// stays the existing horizontally scrolling control line, search
// keeps its own full-width row above it.
//
// Sticky bar width, RULED 10 Aug 2026 (kit polish 3 pass): the bar
// must span the full width of StudioShell's content column, exactly
// as StudioTopBar does, whether the sidebar is collapsed or expanded
// (the leftover inset was most visible collapsed, since the same
// fixed gap reads as a much larger fraction of a narrow sidebar's
// width). Two padding layers used to stack between this bar and the
// true edge: StudioShell's own `<section>` padding and the consuming
// page's own content padding, and the old negative margin here only
// cancelled a single, non-responsive value. The consuming page
// (CommunityV2Mockup) now carries its own padding on its inner
// sections instead of its outer wrapper, so this bar's negative
// margin only has one layer left to cancel: StudioShell's section,
// matched breakpoint for breakpoint (`sm`/`lg`, StudioShell's own
// keywords) and token for token so the two can never drift out of
// sync silently.
//
// Content width law, RULED 10 Aug 2026 (R1, kit polish 3 pass,
// docs/BUILD-BLUEPRINT.md 2.16(l)): this bar's own inner padding now
// mirrors StudioShell's section padding token for token, breakpoint
// keyword for keyword (`px-[var(--space-5)] sm:px-[var(--space-8)]
// lg:px-[var(--space-10)]`), replacing the prior
// `min-[700px]`/`min-[1100px]` breakpoints and different token
// steps. Page content no longer carries its own padded column (the
// `studio-page` kit package owns the one content width); this bar is
// simply the first consumer of the shared padding.
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import KitDropdownView from "../dropdown/KitDropdown.view";

// Search debounce, RULED (Scale Review H, finding D1): every
// consuming page's filter chain re-runs over its full dataset on
// each keystroke (B2). One short keystroke buffer here serves every
// consumer at once rather than fanning the fix out per page. The
// field itself stays responsive (local state updates immediately);
// only the upstream onChange call, and the expensive re-filter it
// triggers, is buffered.
const SEARCH_DEBOUNCE_MS = 200;

function SearchField({ value, placeholder, onChange }) {
  // Focus law, RULED 22 Aug 2026 (Fable law review, A3,
  // docs/BUILD-BLUEPRINT.md 2.16(e) struck): the wrapper's own
  // JS-driven border-brightening treatment is retired. The single
  // global --focus-ring rule (app/design-system.css, ":focus-visible"
  // section) already applies to the input itself; that is the only
  // focus treatment this field shows, no doubled rendering.
  //
  // Clear control, RULED 10 Aug 2026 (kit polish 3 pass): the native
  // type=search cancel button renders in the browser's own blue/gray,
  // outside token law. It is hidden (`.kit-search-input`'s
  // ::-webkit-search-cancel-button rule) and replaced with a
  // component-owned icon in the same muted token that colors the
  // placeholder, `--ink-faint`.
  const [localValue, setLocalValue] = useState(value);
  const lastEmittedRef = useRef(value);
  const debounceRef = useRef(null);
  const hasValue = Boolean(localValue);

  // Sync from the caller only on a genuine external change (a filter
  // reset, a cleared query from elsewhere), not the echo of our own
  // debounced emit landing back through the controlled `value` prop.
  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      setLocalValue(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function emitChange(next) {
    lastEmittedRef.current = next;
    onChange?.(next);
  }

  function handleInputChange(next) {
    setLocalValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => emitChange(next), SEARCH_DEBOUNCE_MS);
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLocalValue("");
    emitChange("");
  }

  return (
    <div
      className="flex min-h-[var(--control-filter)] w-full items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] transition-colors hover:border-[var(--line)] [@media(pointer:coarse)]:min-h-[var(--control-md)] min-[700px]:min-w-[9rem] min-[700px]:max-w-[20rem] min-[700px]:flex-1"
    >
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name="kit-studio-filter-bar-search"
        value={localValue}
        onChange={(event) => handleInputChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="kit-search-input w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none [@media(pointer:coarse)]:text-[length:var(--text-body)]"
      />
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="kit-focus flex flex-none items-center justify-center text-[var(--ink-faint)] transition-colors hover:text-[var(--ink-dim)]"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
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
    <div className="sticky top-[var(--topbar-h)] z-10 mx-[calc(var(--space-5)*-1)] flex flex-col gap-[var(--space-2)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-[var(--space-5)] py-[var(--space-3)] backdrop-blur-[var(--blur-chrome)] sm:mx-[calc(var(--space-8)*-1)] lg:mx-[calc(var(--space-10)*-1)] min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:items-center min-[700px]:gap-[var(--space-2)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]">
      <SearchField
        value={searchValue}
        placeholder={searchPlaceholder}
        onChange={onSearchChange}
      />

      <div className="scrollbar-none flex items-center gap-[var(--space-4)] overflow-x-auto min-[700px]:ml-auto min-[700px]:flex-none min-[700px]:flex-wrap min-[700px]:overflow-visible">
        <div className="flex items-center gap-[var(--space-2)] min-[700px]:flex-wrap">
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
        </div>

        <div className="flex flex-none items-center">{viewModeSlot}</div>
      </div>
    </div>
  );
}
