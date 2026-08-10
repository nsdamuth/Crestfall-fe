"use client";

// Branded dropdown, docs/BUILD-BLUEPRINT.md 2.9 menu-popover recipe
// plus the 2.16 filter-line law (9 Aug 2026). Desktop: popover below
// the trigger. Under 700px: bottom-docked sheet per the modal law
// (RESTYLE-RULES Ruling 7). Open/closed is sanctioned presentation-
// only local state; selection lives with the caller.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";

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
      onClick={() => onActivate?.(option?.value)}
      className={`flex w-full items-start gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-left transition-colors min-h-[var(--control-sm)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
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
  const rootRef = useRef(null);
  const sheetRef = useRef(null);

  // Presentation-only dismissal wiring: outside click and Escape close
  // the panel. No data access; the LOOM no-useEffect check targets
  // fetching, and this effect touches only the open flag. The phone
  // sheet lives in a body portal (below), so both containers count as
  // inside.
  useEffect(() => {
    if (!isOpen) return undefined;

    function onPointerDown(event) {
      if (
        !rootRef.current?.contains(event.target) &&
        !sheetRef.current?.contains(event.target)
      ) {
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
  }, [isOpen]);

  const selectionCount = selectedValues?.length || 0;
  const selectedLabel = deriveSelectedLabel(options, selectedValues, isMultiSelect);
  const isMarked = selectionCount > 0 || isOpen;

  function activateOption(value) {
    onToggleOption?.(value);
    if (!isMultiSelect) setIsOpen(false);
  }

  return (
    <div ref={rootRef} className="relative inline-flex flex-none">
      <button
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex min-h-[var(--control-sm)] items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition-colors duration-[var(--dur-hover)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${
          isMarked
            ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
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

      {isOpen && (
        <>
          {/* Popover, 700px and up: anchored below the trigger. */}
          <div
            role="listbox"
            aria-label={label}
            aria-multiselectable={isMultiSelect}
            className="absolute left-0 top-[calc(100%+var(--space-1))] z-50 hidden w-max max-h-[19rem] min-w-[13rem] max-w-[19rem] overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-2)] shadow-[var(--shadow-popover)] min-[700px]:block"
          >
            <PanelRows
              options={options}
              selectedValues={selectedValues}
              isMultiSelect={isMultiSelect}
              onActivate={activateOption}
            />
          </div>

          {/* Bottom-docked sheet under 700px, portaled to the body:
              the sticky bar's backdrop-filter makes it the containing
              block for fixed descendants, so the sheet must escape it
              (the legacy menus did the same, docs/MOCKUP-DECISIONS.md
              dropdown entries). Veil pairs --scrim-strong with
              --blur-panel per the floating-panel law. */}
          {typeof document !== "undefined" &&
            createPortal(
              <div ref={sheetRef} className="min-[700px]:hidden">
                <div
                  aria-hidden="true"
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-40 bg-[var(--scrim-strong)] backdrop-blur-[var(--blur-panel)]"
                />
                <div
                  role="listbox"
                  aria-label={label}
                  aria-multiselectable={isMultiSelect}
                  className="fixed inset-x-0 bottom-0 z-50 max-h-[70dvh] overflow-y-auto rounded-t-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] p-[var(--space-2)] pb-[calc(var(--space-4)+env(safe-area-inset-bottom))] shadow-[var(--shadow-modal)]"
                >
                  <div className="flex items-center justify-between gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)]">
                    <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                      {label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label={`Close ${label || "options"}`}
                      className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition-colors hover:text-[var(--ink)] active:bg-[var(--state-pressed-fill)]"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <PanelRows
                    options={options}
                    selectedValues={selectedValues}
                    isMultiSelect={isMultiSelect}
                    onActivate={activateOption}
                  />
                </div>
              </div>,
              document.body
            )}
        </>
      )}
    </div>
  );
}
