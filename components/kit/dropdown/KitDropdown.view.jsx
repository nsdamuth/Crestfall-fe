"use client";

// Branded dropdown, docs/BUILD-BLUEPRINT.md 2.9 menu-popover recipe
// plus the 2.16 filter-line law (9 Aug 2026). Desktop: popover below
// the trigger. Under 700px: bottom-docked sheet, now KitModalFrame
// variant="sheet" (docs/SPRINT-A-PLAN.md section 5, kit polish
// Sprint A Phase 4), behind a presentation-only matchMedia flag; the
// 700px-and-up popover is byte-for-byte unchanged. Open/closed is
// sanctioned presentation-only local state; selection lives with the
// caller.
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import KitModalFrame from "../KitModalFrame";

const PHONE_WIDTH_QUERY = "(max-width: 699.98px)";

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
      className={`kit-focus flex w-full items-start gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-transparent px-[var(--space-3)] py-[var(--space-2)] text-left transition-colors min-h-[var(--control-sm)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPhoneWidth, setIsPhoneWidth] = useState(
    () => typeof window !== "undefined" && window.matchMedia(PHONE_WIDTH_QUERY).matches
  );
  const rootRef = useRef(null);

  // Presentation-only dismissal wiring for the POPOVER only: outside
  // click and Escape close the panel. No data access; the LOOM
  // no-useEffect check targets fetching, and this effect touches only
  // the open flag. Scoped to !isPhoneWidth: the phone sheet
  // (KitModalFrame variant="sheet") is portaled to document.body, so
  // it sits outside rootRef's DOM subtree by design, and the frame
  // already answers its own Escape and backdrop click; without this
  // scope, this listener would misread every click inside the
  // portaled sheet as an "outside" click and close it immediately.
  useEffect(() => {
    if (!isOpen || isPhoneWidth) return undefined;

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isPhoneWidth]);

  // Presentation-only chassis-select flag (Sprint A Phase 4,
  // docs/SPRINT-A-PLAN.md section 5.2): while open, phone width mounts
  // the frame sheet, 700px and up renders the popover unchanged. Same
  // sanctioned local-state class as the open flag; scoped to the open
  // window like the dismissal effect above.
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return undefined;

    const query = window.matchMedia(PHONE_WIDTH_QUERY);

    function onChange(event) {
      setIsPhoneWidth(event.matches);
    }

    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
    };
  }, [isOpen]);

  const selectionCount = selectedValues?.length || 0;
  const selectedLabel = deriveSelectedLabel(options, selectedValues, isMultiSelect);
  const isMarked = selectionCount > 0 || isOpen;

  function activateOption(value) {
    onToggleOption?.(value);
    if (!isMultiSelect) setIsOpen(false);
  }

  function toggleOpen() {
    const next = !isOpen;
    // Refresh the chassis-select flag at the moment of opening (not
    // just at mount): a viewport resize while closed would otherwise
    // leave it stale until the next matchMedia "change" event, which
    // this effect only listens for while open.
    if (next && typeof window !== "undefined") {
      setIsPhoneWidth(window.matchMedia(PHONE_WIDTH_QUERY).matches);
    }
    setIsOpen(next);
  }

  return (
    <div ref={rootRef} className="relative inline-flex flex-none">
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleOpen}
        className={`kit-focus inline-flex min-h-[var(--control-filter)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
          isMarked
            ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
            : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
        }`}
      >
        <span className="truncate">{label}</span>
        {selectedLabel && (
          <span className="truncate text-[var(--gold-bright)]">{selectedLabel}</span>
        )}
        {isMultiSelect && selectionCount > 0 && (
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
        // Popover, 700px and up: anchored below the trigger, byte-for-
        // byte unchanged from before the frame conversion.
        <div
          role="listbox"
          aria-label={label}
          aria-multiselectable={isMultiSelect}
          className="absolute left-0 top-[calc(100%+var(--space-1))] z-50 w-max max-h-[19rem] min-w-[13rem] max-w-[19rem] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-2)] shadow-[var(--shadow-popover)]"
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
          ariaLabel={label}
          onClose={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)]">
            <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              {label}
            </span>
          </div>
          <div
            role="listbox"
            aria-label={label}
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
