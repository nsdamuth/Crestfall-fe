"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import InfoTip from "../InfoTip";

export function SectionLabel({ children }) {
  return (
    <p className="mb-[var(--space-2)] text-[var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)] text-[var(--gold-ornament)]">
      {children}
    </p>
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
            onClick={() => onChange?.(option.value)}
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
            <p className="mt-[var(--space-2)] text-center text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
              {option.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export function TileGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange?.(option.value)}
            className={`rounded-[var(--radius-md)] border p-[var(--space-2)] text-left transition ${
              active
                ? "border-[var(--gold-action)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
            }`}
          >
            {option.imageUrl ? (
              <div
                className="h-16 w-full rounded-[var(--radius-sm)] border border-[var(--line-whisper)] bg-cover bg-center"
                style={{ backgroundImage: `url(${option.imageUrl})` }}
              />
            ) : (
              <div className="h-16 w-full rounded-[var(--radius-sm)] border border-[var(--line-whisper)] bg-[var(--fill)]" />
            )}
            <p className="mt-[var(--space-2)] text-xs text-[var(--ink)]">
              {option.label}
            </p>
            {option.description ? (
              <p className="mt-[var(--space-1)] text-[10px] leading-4 text-[var(--ink-faint)]">
                {option.description}
              </p>
            ) : null}
          </button>
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
            onClick={() => onChange?.(option)}
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
      <label className="mb-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-3)] text-[var(--text-label)] uppercase text-[var(--gold-ornament)]">
        <span>{label}</span>
        <span className="font-normal tabular-nums text-[var(--ink-faint)]">
          {(value || "").length}/{maxLength}
        </span>
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus-visible:border-[var(--gold-action)]"
      />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div>
      <label className="mb-[var(--space-2)] flex items-baseline justify-between gap-[var(--space-3)] text-[var(--text-label)] uppercase text-[var(--gold-ornament)]">
        <span>{label}</span>
        {maxLength ? (
          <span className="font-normal tabular-nums text-[var(--ink-faint)]">
            {(value || "").length}/{maxLength}
          </span>
        ) : null}
      </label>
      <textarea
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus-visible:border-[var(--gold-action)]"
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
        className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus-visible:border-[var(--gold-action)]"
      />
    </div>
  );
}
