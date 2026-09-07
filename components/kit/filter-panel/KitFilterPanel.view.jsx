"use client";

// Filter panel, RULED 6 Sep 2026 (FE/FILTERS, Brian, OurDream reference
// matched for structure only; every value resolves through
// app/theme.css). One "Filter" trigger with a live active-count badge
// opens a panel: search-within-filters at the top, a "Filter by"
// heading with Clear at its right end (shown only while a filter is
// selected), every section as a labelled chip group in caller order.
// Popover at 700px and up, bottom sheet under
// 700px, through the same useAnchoredPanel mechanics KitDropdown uses
// (open flag, chassis select, measured left/right flip, popover-only
// outside-click and Escape). Chips inside a panel are lawful under the
// 9 Aug 2026 filter-line law (loose chip ROWS on the bar stay
// retired); each chip is the existing KitFilterChip recipe.
//
// Contrast law (docs/DESIGN-TOKENS.md): the popover surface is the
// menu/popover glass, so no normal-size meaningful text here uses
// --ink-faint; section labels and helper lines use --ink-dim. Chip
// counts keep their own --ink-faint on the chip's --surface-1 bed,
// where it is legal.
import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import KitFilterChipView from "../filter-chip/KitFilterChip.view";
import KitModalFrame from "../KitModalFrame";
import KitSearchFieldView from "../studio-filter-bar/KitSearchField.view";
import { useAnchoredPanel } from "../dropdown/useAnchoredPanel";

function countActive(sections, selectedValues) {
  return sections.reduce((total, section) => total + (selectedValues?.[section.id]?.length || 0), 0);
}

function matchesQuery(option, query) {
  if (!query) return true;
  return String(option?.label || "").toLowerCase().includes(query);
}

// Clear, RULED 6 Sep 2026 (Brian, panel header): one text button at the
// top right of the panel header, shown only while at least one filter
// is selected; one press reports through onClearAll. Same behavior at
// 390 (beside the sheet's close control, through KitModalFrame's
// headerSlot) and at 1440 (the right end of the popover's header row).
// It replaces the former bottom "Clear all".
function ClearButton({ activeCount, onClear }) {
  if (activeCount === 0) return null;
  return (
    <button
      type="button"
      onClick={onClear}
      className="min-h-[var(--control-sm)] rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-bright)] transition-colors hover:bg-[var(--state-hover-fill)] active:bg-[var(--state-pressed-fill)] [@media(pointer:coarse)]:min-h-[var(--control-md)]"
    >
      Clear
    </button>
  );
}

function PanelBody({
  sections,
  selectedValues,
  onToggleOption,
  isLoadingCounts,
  searchPlaceholder,
  query,
  onQueryChange,
  headerAction = null,
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const visibleSections = sections
    .map((section) => ({
      ...section,
      options: section.options.filter((option) => matchesQuery(option, normalizedQuery)),
    }))
    .filter((section) => section.options.length > 0);

  return (
    // Spacing, RULED 6 Sep 2026 (FE/FILTERS refine): one step up the
    // theme spacing scale from the first build. Section margins
    // --space-5 (was 4), chip gaps --space-3 (was 2), divider padding
    // --space-3 (was 2).
    <div className="flex flex-col gap-[var(--space-5)]">
      <KitSearchFieldView
        value={query}
        placeholder={searchPlaceholder}
        onChange={onQueryChange}
        debounceMs={0}
        name="kit-filter-panel-search"
        clearLabel="Clear filter search"
      />

      <div className="flex flex-col gap-[var(--space-5)]">
        <div className="flex min-h-[var(--control-sm)] items-center justify-between gap-[var(--space-2)]">
          <p className="text-[length:var(--text-ui)] font-[var(--weight-medium)] leading-[var(--lh-ui)] text-[var(--ink)]">
            Filter by
          </p>
          {headerAction}
        </div>

        {visibleSections.map((section, index) => {
          const selected = selectedValues?.[section.id] || [];
          return (
            <div key={section.id} className="flex flex-col gap-[var(--space-3)]">
              {index > 0 && (
                <div aria-hidden="true" className="py-[var(--space-3)]">
                  <div className="h-px bg-[image:var(--line-fade)]" />
                </div>
              )}
              <p
                id={`kit-filter-panel-section-${section.id}`}
                className="text-[length:var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--ink-dim)]"
              >
                {section.label}
              </p>
              <div
                role="group"
                aria-labelledby={`kit-filter-panel-section-${section.id}`}
                className="flex flex-wrap gap-[var(--space-3)]"
              >
                {section.options.map((option) => (
                  <KitFilterChipView
                    key={option.value}
                    label={option.label}
                    count={isLoadingCounts ? null : option.count}
                    tooltip={option.tooltip}
                    isSelected={selected.includes(option.value)}
                    isDisabled={option.isDisabled}
                    onToggle={() => onToggleOption?.(section.id, option.value)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {!visibleSections.length && (
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {normalizedQuery ? "No matching filters" : "No filters"}
          </p>
        )}
      </div>

    </div>
  );
}

export default function KitFilterPanelView({
  sections = [],
  selectedValues = {},
  onToggleOption = null,
  onClearAll = null,
  isLoadingCounts = false,
  triggerLabel = "Filter",
  searchPlaceholder = "Search filters",
  ariaLabel = "Filters",
  isDisabled = false,
}) {
  const { isOpen, isPhoneWidth, panelAlign, rootRef, panelRef, toggleOpen, close } =
    useAnchoredPanel();
  // Search-within-filters text is presentation-only local state; it
  // resets whenever the panel closes so a stale query never hides
  // sections on the next open.
  const [query, setQuery] = useState("");

  const renderableSections = sections.filter((section) => section.options?.length > 0);
  const activeCount = countActive(renderableSections, selectedValues);
  const isMarked = activeCount > 0 || isOpen;

  function handleToggleOpen() {
    if (isOpen) setQuery("");
    toggleOpen();
  }

  function handleClose() {
    setQuery("");
    close();
  }

  function clearAll() {
    if (onClearAll) {
      onClearAll();
      return;
    }
    // Compatibility path (contract 1.0.0): a consumer that has not
    // adopted onClearAll still clears correctly, one toggle per
    // currently selected value.
    renderableSections.forEach((section) => {
      (selectedValues?.[section.id] || []).forEach((value) => onToggleOption?.(section.id, value));
    });
  }

  const clearButton = <ClearButton activeCount={activeCount} onClear={clearAll} />;

  function renderBody(headerAction) {
    return (
      <PanelBody
        sections={renderableSections}
        selectedValues={selectedValues}
        onToggleOption={onToggleOption}
        isLoadingCounts={isLoadingCounts}
        searchPlaceholder={searchPlaceholder}
        query={query}
        onQueryChange={setQuery}
        headerAction={headerAction}
      />
    );
  }

  return (
    <div ref={rootRef} className="relative inline-flex flex-none">
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={activeCount > 0 ? `${ariaLabel}, ${activeCount} active` : ariaLabel}
        onClick={handleToggleOpen}
        className={`inline-flex min-h-[var(--control-filter)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
          isMarked
            ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
            : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
        }`}
      >
        <SlidersHorizontal size={14} aria-hidden="true" className="flex-none" />
        <span className="truncate">{triggerLabel}</span>
        {activeCount > 0 && (
          <span className="tabular-nums text-[length:var(--text-label)] text-[var(--gold-bright)]">
            {activeCount}
          </span>
        )}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`flex-none transition-transform duration-[var(--dur-fast)] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !isPhoneWidth && (
        // Popover, 700px and up: anchored below the trigger, flipped to
        // right-anchored when left-anchoring would overflow (measured
        // in useAnchoredPanel). Floating surface: --radius-lg, the
        // ratified UI glass at --blur-panel (GO 2B, 22 Aug 2026).
        <div
          ref={panelRef}
          role="group"
          aria-label={ariaLabel}
          className={`absolute top-[calc(100%+var(--space-1))] z-50 w-[min(28rem,calc(100vw-var(--space-8)))] max-h-[min(32rem,calc(100dvh-var(--topbar-h)-var(--space-16)))] overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel-ui-glass)] p-[var(--space-5)] backdrop-blur-[var(--blur-panel)] ${
            panelAlign === "right" ? "right-0" : "left-0"
          }`}
        >
          {renderBody(clearButton)}
        </div>
      )}

      {isOpen && isPhoneWidth && (
        <KitModalFrame
          variant="sheet"
          ariaLabel={ariaLabel}
          sheetGrabber
          headerSlot={clearButton}
          onClose={handleClose}
        >
          <div className="max-h-[70dvh] overflow-y-auto p-[var(--space-5)]">{renderBody(null)}</div>
        </KitModalFrame>
      )}
    </div>
  );
}
