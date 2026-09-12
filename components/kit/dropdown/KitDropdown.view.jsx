"use client";

// Branded dropdown, docs/BUILD-BLUEPRINT.md 2.9 menu-popover recipe
// plus the 2.16 filter-line law (9 Aug 2026). Desktop: popover below
// the trigger. Under 700px: bottom-docked sheet, now KitModalFrame
// variant="sheet" (docs/SPRINT-A-PLAN.md section 5, kit polish
// Sprint A Phase 4), behind a presentation-only matchMedia flag; the
// 700px-and-up popover is byte-for-byte unchanged. Open/closed is
// sanctioned presentation-only local state; selection lives with the
// caller.
import { Check, ChevronDown } from "lucide-react";

import KitModalFrame from "../KitModalFrame";
import { useAnchoredPanel } from "./useAnchoredPanel";

// DROPDOWN OVERFLOW (10 Aug 2026 defect ruling): the popover was
// always left-anchored to its trigger (`left-0`), so the last
// dropdown in a filter row (Lore's Recency, and any other row where a
// trigger sits close to the right edge) renders its panel past the
// viewport's right edge. Measured after mount (viewport width is
// layout, not fetched data, so this stays inside the LOOM's
// no-fetch-in-effects rule): flip to right-anchored when the
// left-anchored panel would overflow, and reserve a same-size guard
// on the far side (--space-4) so a flip never just moves the overflow
// to the opposite edge on a narrow viewport. Since 6 Sep 2026
// (FE/FILTERS) the open flag, the chassis-select flag, the measured
// flip, and the popover-only dismissal live in useAnchoredPanel,
// shared with KitFilterPanel so the two can never drift; behavior
// here is unchanged.

// Trigger grammar adopted from the legacy control bar (library.css
// .cbdrop, docs/MOCKUP-DECISIONS.md): category label, then the gold
// value (single-select) or the gold selection count (multi-select).
function deriveSelectedLabel(options, selectedValues, isMultiSelect) {
  if (isMultiSelect || !selectedValues?.length) return null;
  const selected = options?.find((option) => option?.value === selectedValues[0]);
  return selected?.label || null;
}

function OptionRow({ option, isSelected, isMultiSelect, onActivate }) {
  const disabled = Boolean(option?.isDisabled);

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      title={option?.tooltip || undefined}
      onClick={() => onActivate?.(option?.value)}
      className={`flex w-full items-start gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-transparent px-[var(--space-3)] py-[var(--space-2)] text-left transition-colors min-h-[var(--control-sm)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
        disabled
          ? "opacity-[var(--state-disabled-opacity)]"
          : isSelected
            ? "text-[var(--gold-bright)] hover:bg-[var(--state-hover-fill)] active:bg-[var(--state-pressed-fill)]"
            : "text-[var(--ink-dim)] hover:bg-[var(--state-hover-fill)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-[var(--space-1)] flex-none ${isSelected ? "" : "invisible"}`}
      >
        <Check size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)]">
          {option?.label}
        </span>
        {option?.description && (
          <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
            {option.description}
          </span>
        )}
      </span>
      {disabled ? (
        <span className="flex-none text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          Soon
        </span>
      ) : (
        option?.count !== null &&
        option?.count !== undefined && (
          <span className="flex-none tabular-nums text-[length:var(--text-label)] text-[var(--ink-faint)]">
            {option.count}
          </span>
        )
      )}
      {isMultiSelect && !disabled && (
        <span className="sr-only">{isSelected ? "Selected" : "Not selected"}</span>
      )}
    </button>
  );
}

function PanelRows({ options, selectedValues, isMultiSelect, onActivate }) {
  return (
    <>
      {options.map((option) => (
        <OptionRow
          key={option?.value}
          option={option}
          isSelected={selectedValues?.includes(option?.value)}
          isMultiSelect={isMultiSelect}
          onActivate={onActivate}
        />
      ))}
      {!options.length && (
        <p className="px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-ui)] text-[var(--ink-dim)]">
          No options
        </p>
      )}
    </>
  );
}

export default function KitDropdownView({
  label = "",
  options = [],
  selectedValues = [],
  isMultiSelect = false,
  isDisabled = false,
  onToggleOption = null,
  ariaLabel = null,
  restingValue = null,
  align = "left",
}) {
  // Open flag, chassis-select flag (Sprint A Phase 4, docs/SPRINT-A-
  // PLAN.md section 5.2), measured flip, and popover-only dismissal:
  // all presentation-only local state, shared through
  // useAnchoredPanel (see the note above). `align` (1.3.0) sets the
  // baseline the popover measures from; "right" for a trigger pinned
  // to the right edge of a bounded surface.
  const { isOpen, isPhoneWidth, panelAlign, rootRef, panelRef, toggleOpen, close } =
    useAnchoredPanel({ preferredAlign: align });

  const selectionCount = selectedValues?.length || 0;
  // Resting value (1.2.0, RULED 10 Sep 2026, Media Studio round 5): a
  // caller may name the one value that means "no filter". While it is
  // the only selection the trigger reads as untouched (no count, dim
  // ink) even though its row still shows the check, because a default
  // is not a choice the user made. Omitted on every other consumer,
  // pixel-stable. 1.2.1 (session 2 review, 10 Sep 2026): a resting
  // single-select hides its value word too, so the trigger reads
  // plain "Filter" rather than "Filter All".
  const isResting =
    restingValue !== null && selectionCount === 1 && selectedValues[0] === restingValue;
  const selectedLabel = isResting
    ? null
    : deriveSelectedLabel(options, selectedValues, isMultiSelect);
  const isMarked = (selectionCount > 0 && !isResting) || isOpen;

  function activateOption(value) {
    onToggleOption?.(value);
    if (!isMultiSelect) close();
  }

  return (
    <div ref={rootRef} className="relative inline-flex flex-none">
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel ? `${ariaLabel}: ${label}` : undefined}
        onClick={toggleOpen}
        className={`inline-flex min-h-[var(--control-filter)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
          isMarked
            ? "text-[var(--gold-bright)]"
            : "text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
        }`}
      >
        <span className="truncate">{label}</span>
        {selectedLabel && (
          <span className="truncate text-[var(--gold-bright)]">{selectedLabel}</span>
        )}
        {isMultiSelect && selectionCount > 0 && !isResting && (
          <span className="tabular-nums text-[length:var(--text-label)] text-[var(--gold-bright)]">
            {selectionCount}
          </span>
        )}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`flex-none transition-transform duration-[var(--dur-fast)] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !isPhoneWidth && (
        // Popover, 700px and up: anchored below the trigger, left by
        // default, flipped to right-anchored (measured, see the
        // useLayoutEffect above) when left-anchoring would overflow
        // the viewport's right edge (DROPDOWN OVERFLOW, 10 Aug 2026
        // defect ruling). GLASS SCOPE, RULED 22 Aug 2026 (Fable law
        // review, GATE-LOG.md "FINAL RULING RENDER" item 2, GO 2B):
        // UI popovers use --panel-ui-glass at --blur-panel so the
        // surface follows Eggshell while over-art glass stays dark.
        <div
          ref={panelRef}
          role="listbox"
          aria-label={ariaLabel || label}
          aria-multiselectable={isMultiSelect}
          className={`absolute top-[calc(100%+var(--space-1))] z-50 w-max max-h-[19rem] min-w-[13rem] max-w-[19rem] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--panel-ui-glass)] p-[var(--space-2)] backdrop-blur-[var(--blur-panel)] ${
            panelAlign === "right" ? "right-0" : "left-0"
          }`}
        >
          <PanelRows
            options={options}
            selectedValues={selectedValues}
            isMultiSelect={isMultiSelect}
            onActivate={activateOption}
          />
        </div>
      )}

      {isOpen && isPhoneWidth && (
        <KitModalFrame
          variant="sheet"
          ariaLabel={ariaLabel || label}
          onClose={close}
        >
          <div className="flex items-center justify-between gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)]">
            <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              {label}
            </span>
          </div>
          <div
            role="listbox"
            aria-label={ariaLabel || label}
            aria-multiselectable={isMultiSelect}
            className="p-[var(--space-2)]"
          >
            <PanelRows
              options={options}
              selectedValues={selectedValues}
              isMultiSelect={isMultiSelect}
              onActivate={activateOption}
            />
          </div>
        </KitModalFrame>
      )}
    </div>
  );
}
