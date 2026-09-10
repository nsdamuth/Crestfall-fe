"use client";

// One-line filter law (9 Aug 2026, docs/BUILD-BLUEPRINT.md 2.16):
// search, every filter, and sort share one sticky line; filters and
// multi-selects are branded dropdowns (KitDropdown) with selection
// counts; loose chip rows are retired from filter surfaces. Bar shell
// traces to the legacy control bar (docs/MOCKUP-DECISIONS.md, control
// bar entry): canvas-tinted translucency with chrome frost, full-bleed
// margin trick, controls-with-their-own-states inside a REST-only bar.
//
// FILTER PANEL, RULED 6 Sep 2026 (FE/FILTERS, Brian, supersedes the
// per-category dropdown row above; docs/BUILD-BLUEPRINT.md 2.16(b)
// amended the same day): filter categories live in one Filter panel
// (KitFilterPanel: one trigger with an active-count badge, chip-group
// sections, search-within, Clear); dedicated dropdowns are the
// fallback, kept behind `filterPresentation="dropdowns"` so the
// consumer flips one prop to roll back. Optional quick tabs sit
// between search and the Filter button where a page has one dominant
// split (Images). The Sort trigger reads "Sort: <value>", matching
// Home's rail sort. Semantic callbacks are unchanged from 2.0.0.
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
import KitDropdownView from "../dropdown/KitDropdown.view";
import KitFilterPanelView from "../filter-panel/KitFilterPanel.view";
import KitSearchFieldView from "./KitSearchField.view";

function QuickTabs({ tabs, selected, onChange, ariaLabel }) {
  if (!tabs.length) return null;

  return (
    <div role="tablist" aria-label={ariaLabel} className="flex flex-none items-center gap-[var(--space-1)]">
      {tabs.map((tab) => {
        const isSelected = tab.value === selected;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange?.(tab.value)}
            className={`inline-flex min-h-[var(--control-filter)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
              isSelected
                ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
                : "border-transparent text-[var(--ink-dim)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
            }`}
          >
            <span className="truncate">{tab.label}</span>
            {tab.count !== null && tab.count !== undefined && (
              <span
                className={`tabular-nums text-[length:var(--text-label)] ${
                  isSelected ? "text-[var(--gold-ornament)]" : "text-[var(--ink-faint)]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
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
  quickTabs = [],
  selectedQuickTab = "",
  onQuickTabChange = null,
  onClearFilters = null,
  filterPresentation = "panel",
  filterButtonLabel = "Filter",
}) {
  const hasGroups = filterGroups.length > 0;
  const usePanel = filterPresentation !== "dropdowns";

  return (
    // Tucked one border width under the top bar, RULED 6 Sep 2026
    // (Brian, screenshots on Adventures and Stories): at browser zooms
    // other than 100% the header's rendered height and this bar's
    // sticky offset snap to different sub-pixel fractions (measured
    // 0.1px to 0.4px at 90%, 110%, 125%), which reads as a visible
    // seam between two frosted bars. The header (z-40) paints above
    // this bar (z-10), so a 1px overlap is invisible at 100% and covers
    // the seam at every other zoom. The 1px is the same border width
    // --topbar-h already carries in its own definition.
    <div className="sticky top-[calc(var(--topbar-h)-1px)] z-10 mx-[calc(var(--space-5)*-1)] flex flex-col gap-[var(--space-2)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] px-[var(--space-5)] py-[var(--space-3)] backdrop-blur-[var(--blur-chrome)] sm:mx-[calc(var(--space-8)*-1)] lg:mx-[calc(var(--space-10)*-1)] min-[700px]:flex-row min-[700px]:flex-wrap min-[700px]:items-center min-[700px]:gap-[var(--space-2)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]">
      <KitSearchFieldView
        value={searchValue}
        placeholder={searchPlaceholder}
        onChange={onSearchChange}
        name="kit-studio-filter-bar-search"
        className="min-[700px]:min-w-[9rem] min-[700px]:max-w-[20rem] min-[700px]:flex-1"
      />

      <div className="scrollbar-none flex items-center gap-[var(--space-4)] overflow-x-auto min-[700px]:ml-auto min-[700px]:flex-none min-[700px]:flex-wrap min-[700px]:overflow-visible">
        <div className="flex items-center gap-[var(--space-2)] min-[700px]:flex-wrap">
          <QuickTabs
            tabs={quickTabs}
            selected={selectedQuickTab}
            onChange={onQuickTabChange}
            ariaLabel={searchPlaceholder}
          />

          {hasGroups && usePanel && (
            <KitFilterPanelView
              sections={filterGroups}
              selectedValues={selectedValues}
              onToggleOption={onFilterToggle}
              onClearAll={onClearFilters}
              isLoadingCounts={isLoadingCounts}
              triggerLabel={filterButtonLabel}
            />
          )}

          {hasGroups &&
            !usePanel &&
            filterGroups.map((group) => (
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
              label="Sort:"
              options={sortOptions}
              selectedValues={selectedSort ? [selectedSort] : []}
              isMultiSelect={false}
              onToggleOption={(value) => onSortChange?.(value)}
            />
          )}
        </div>

        {/* Right edge at every width (browser review 9 Sep 2026,
            item 10): under 700px the row is a horizontal scroller, so
            ml-auto pushes the toggle to the far edge and balances the
            bar; at 700 and up the parent already sits at the right. */}
        <div className="ml-auto flex flex-none items-center">{viewModeSlot}</div>
      </div>
    </div>
  );
}
