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
import { useRef, useState } from "react";
import { Search, X } from "lucide-react";

import KitDropdownView from "../dropdown/KitDropdown.view";

function SearchField({ value, placeholder, onChange }) {
  // Focus law, RULED final 10 Aug 2026 (kit polish 3 pass, amends
  // BUILD-BLUEPRINT.md 2.16(e)): no gold treatment in any state.
  // Pointer interaction shows nothing; keyboard focus-visible keeps
  // one subtle indicator (a slight border brightening to
  // --line-strong), never a gold box.
  //
  // This is tracked in local state, not CSS :focus-visible: Chromium
  // treats a text input as eligible for :focus-visible on ANY focus,
  // pointer or keyboard, since a text field always needs to show
  // where typing lands (measured this pass; the prior comment here
  // claiming the has-* variant alone kept pointer clicks silent was
  // wrong). A pointerdown on the wrapper is recorded before the
  // resulting focus event fires, so the handler can tell a pointer-
  // caused focus from a keyboard-caused one and only light the
  // border for the latter. `.kit-search-input` (app/design-system.css)
  // still suppresses the app-wide gold ring on the input itself so
  // nothing doubles up inside the wrapper's own border regardless.
  //
  // Clear control, RULED 10 Aug 2026 (kit polish 3 pass): the native
  // type=search cancel button renders in the browser's own blue/gray,
  // outside token law. It is hidden (`.kit-search-input`'s
  // ::-webkit-search-cancel-button rule) and replaced with a
  // component-owned icon in the same muted token that colors the
  // placeholder, `--ink-faint`.
  const hasValue = Boolean(value);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const pointerDownRef = useRef(false);

  function handlePointerDown() {
    pointerDownRef.current = true;
  }
  function handleFocus() {
    if (!pointerDownRef.current) setKeyboardFocused(true);
  }
  function handleBlur() {
    setKeyboardFocused(false);
    pointerDownRef.current = false;
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`flex min-h-[var(--control-filter)] w-full items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] transition-colors hover:border-[var(--line)] [@media(pointer:coarse)]:min-h-[var(--control-md)] min-[700px]:min-w-[9rem] min-[700px]:max-w-[20rem] min-[700px]:flex-1 ${
        keyboardFocused ? "border-[var(--line-strong)]" : "border-[var(--line-whisper)]"
      }`}
    >
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name="kit-studio-filter-bar-search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-label={placeholder}
        className="kit-search-input w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none [@media(pointer:coarse)]:text-[length:var(--text-body)]"
      />
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange?.("")}
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
    <div className="sticky top-[var(--topbar-h)] z-10 mx-[calc(var(--space-5)*-1)] flex flex-col gap-[var(--space-2)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-[var(--space-5)] py-[var(--space-3)] backdrop-blur-[var(--blur-chrome)] min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:items-center min-[700px]:gap-[var(--space-2)]">
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
