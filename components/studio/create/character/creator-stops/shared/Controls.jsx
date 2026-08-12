"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import InfoTip from "../InfoTip";
import GlobalEyebrow from "@/components/ui/Eyebrow";
import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";

// One shared style for every field label across all seven stops, sized
// below its field's value in the type hierarchy. Change it here, never
// per field.
const FIELD_LABEL_CLASS =
  "mb-[var(--space-1)] flex items-baseline justify-between gap-[var(--space-3)] text-[10px] font-medium uppercase leading-[0.9rem] tracking-[0.14em] text-[var(--gold-ornament)]";

// RULED 11 Aug 2026 (Sprint H render review, item 2): every section
// label in quick-create adopts the standard v2 eyebrow recipe (gold
// uppercase, trailing --grad-rule mark), the same component the nine
// v2 page headers use, in place of the old plain-text FIELD_LABEL_CLASS
// treatment.
export function SectionLabel({ children }) {
  return (
    <div className="mb-[var(--space-1)]">
      <GlobalEyebrow>{children}</GlobalEyebrow>
    </div>
  );
}

export function FieldLabel({ children, count, max }) {
  return (
    <label className={FIELD_LABEL_CLASS}>
      <span>{children}</span>
      {typeof max === "number" ? (
        <span className="font-normal tabular-nums text-[var(--ink-faint)]">
          {count}/{max}
        </span>
      ) : null}
    </label>
  );
}

// Promoted to a global LOOM package, 7 Aug 2026: components/ui/Eyebrow.
// Re-exported here so all seven stops keep this import path unchanged.
export const Eyebrow = GlobalEyebrow;

// Two short controls side by side on desktop where the pair reads
// cleanly, stacking at 390 where they'd be too narrow. A child that
// needs to span the full row below the pair (a custom-value field, an
// empty-state card) takes `sm:col-span-2` at its own call site.
export function FieldPair({ children }) {
  return (
    <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 sm:items-start">
      {children}
    </div>
  );
}

export function SwatchGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-[var(--space-2)] sm:grid-cols-4 lg:grid-cols-6">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(active ? "" : option.value)}
            title={option.label}
            className={`rounded-[var(--radius-md)] border p-[var(--space-2)] transition ${
              active
                ? "border-[var(--gold-action)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
            }`}
          >
            <div
              className="h-10 rounded-[var(--radius-sm)] border border-[var(--line-whisper)]"
              style={{
                background: option.color || "var(--fill)",
              }}
            />
            <p className="mt-[var(--space-2)] break-words text-center text-[10px] uppercase leading-tight tracking-[0.12em] text-[var(--ink-dim)]">
              {option.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

// "top": pins art to the top of the frame so a face stays visible rather
// than being cropped through the middle (character/species tiles).
// "contain": keeps the whole figure in frame, never cropped, since the
// silhouette itself is what's being chosen (body identity tiles).
export function TileGrid({ options, value, onChange, imagePosition = "top" }) {
  const isContain = imagePosition === "contain";

  return (
    <div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <div
            key={option.value}
            className={`relative rounded-[var(--radius-md)] border p-[var(--space-2)] transition ${
              active
                ? "border-[var(--gold-action)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
            }`}
          >
            <button
              type="button"
              aria-pressed={active}
              onClick={() => onChange?.(active ? "" : option.value)}
              className="block w-full text-left"
            >
              {option.imageUrl ? (
                <div
                  className={`h-16 w-full rounded-[var(--radius-sm)] border border-[var(--line-whisper)] bg-no-repeat ${
                    isContain ? "bg-contain bg-center" : "bg-cover bg-top"
                  }`}
                  style={{ backgroundImage: `url(${option.imageUrl})` }}
                />
              ) : (
                <div className="h-16 w-full overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line-whisper)]">
                  <KitArtPlaceholderView size="sm" />
                </div>
              )}
              <p className="mt-[var(--space-2)] pr-[var(--space-5)] text-xs text-[var(--ink)]">
                {option.label}
              </p>
            </button>

            {option.description ? (
              <span className="absolute right-[var(--space-2)] top-[var(--space-2)]">
                <InfoTip
                  label={`About ${option.label}`}
                  text={option.description}
                  flip
                />
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ChipRow({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-[var(--space-2)]">
      {options.map((option) => {
        const active = option === value;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(active ? "" : option)}
            className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-2)] text-sm transition ${
              active
                ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function MultiChipRow({ options, values = [], onChange }) {
  function toggle(option) {
    if (option.exclusive) {
      onChange?.(values.includes(option.value) ? [] : [option.value]);
      return;
    }

    const withoutExclusive = values.filter((value) => {
      const matched = options.find((o) => o.value === value);
      return !matched?.exclusive;
    });

    const next = withoutExclusive.includes(option.value)
      ? withoutExclusive.filter((value) => value !== option.value)
      : [...withoutExclusive, option.value];

    onChange?.(next);
  }

  return (
    <div className="flex flex-wrap gap-[var(--space-2)]">
      {options
        .filter((option) => option.value !== "")
        .map((option) => {
          const active = values.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(option)}
              title={option.description}
              className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-2)] text-sm transition ${
                active
                  ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                  : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
    </div>
  );
}

export function EmptyStateCard({ message, actions = [] }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-[var(--space-4)]">
      <p className="text-sm text-[var(--ink-dim)]">{message}</p>
      {actions.length ? (
        <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-3)]">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="cf-btn cf-btn--secondary cf-btn--sm"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Fold({ title, sub, open, onToggle, filled = false, children }) {
  return (
    <div className="mt-[var(--space-4)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onToggle?.()}
        className="flex w-full items-center justify-between gap-[var(--space-3)] text-left"
      >
        <span>
          <span className="flex items-center gap-[var(--space-2)] font-display text-lg text-[var(--ink)]">
            {title}
            {filled ? (
              <span className="rounded-[var(--radius-full)] bg-[var(--gold-ornament)]/15 px-[var(--space-2)] py-0 text-[10px] uppercase tracking-[0.12em] text-[var(--gold-ornament)]">
                Filled
              </span>
            ) : null}
          </span>
          {sub ? (
            <span className="block text-xs text-[var(--ink-dim)]">{sub}</span>
          ) : null}
        </span>
        <span className="text-lg text-[var(--gold-ornament)]">
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div className="mt-[var(--space-4)] space-y-[var(--space-4)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/* Rule 1: long select lists become inline dropdowns anchored to their own
   field, contained by the frame, scrolling internally, closing on choose,
   Escape, or click away. At 390 they expand in flow rather than
   overlaying, which this already does since the option list is a normal
   child of the field, not a positioned overlay. */
export function InlineDropdown({ label, options, value, onChange, placeholder = "Unspecified" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    // Capture phase, so an open dropdown consumes Escape before the modal's
    // own Escape-to-close listener (registered on mount, always earlier)
    // ever sees it.
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      {label ? <SectionLabel>{label}</SectionLabel> : null}

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-left text-sm transition ${
          open
            ? "border-[var(--gold-action)]"
            : "border-[var(--line-whisper)] hover:border-[var(--line)]"
        }`}
      >
        <span className="text-[var(--ink)]">
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[var(--ink-dim)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="mt-[var(--space-2)] max-h-64 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-1)]">
          {options.map((option) => (
            <div
              key={option.value || "unspecified"}
              className={`flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] transition ${
                option.value === value
                  ? "bg-[var(--gold-ornament)]/15 text-[var(--gold-bright)]"
                  : "text-[var(--ink-dim)] hover:bg-[var(--fill-whisper)] hover:text-[var(--ink)]"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className="flex-1 text-left text-sm"
              >
                {option.label}
              </button>
              {option.description ? (
                <InfoTip
                  label={`About ${option.label}`}
                  text={option.description}
                  flip
                />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CustomValueField({ label, value, onChange, placeholder, maxLength = 80 }) {
  return (
    <div className="mt-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/20 p-[var(--space-3)]">
      <FieldLabel count={(value || "").length} max={maxLength}>
        {label}
      </FieldLabel>
      <input
        type="text"
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="cf-field w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
      />
    </div>
  );
}

// Sensible ceiling for auto-grow: past this height a field scrolls
// internally instead of pushing the footer off screen. Comfortably covers
// the 800-character fields this creator holds.
const TEXTAREA_MAX_HEIGHT_PX = 200;

export function TextAreaField({ label, value, onChange, placeholder, maxLength }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, TEXTAREA_MAX_HEIGHT_PX)}px`;
  }, [value]);

  return (
    <div>
      <FieldLabel count={(value || "").length} max={maxLength}>
        {label}
      </FieldLabel>
      <textarea
        ref={textareaRef}
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={1}
        className="cf-field w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
        style={{ maxHeight: `${TEXTAREA_MAX_HEIGHT_PX}px` }}
      />
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="cf-field w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
      />
    </div>
  );
}
