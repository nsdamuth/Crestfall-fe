"use client";

// Field anatomy, docs/BUILD-BLUEPRINT.md 2.8. Four slots plus the
// input: label, input bed, helper line, error line, plus an optional
// counter and an optional folding disclosure wrapping a field group
// (the creator's Advanced Creator Guidance and Advanced Prompting
// pattern). Fold open/closed is sanctioned presentation-only local
// state; value, error, success, and count are always caller-owned.
import { useState } from "react";
import { ChevronDown } from "lucide-react";

function CounterSlot({ maxLength, count }) {
  if (maxLength === null || maxLength === undefined) return null;
  const atLimit = count !== null && count !== undefined && count >= maxLength;

  return (
    <span
      className={`flex-none tabular-nums text-[length:var(--text-label)] ${
        atLimit ? "text-[var(--status-danger)]" : "text-[var(--ink-faint)]"
      }`}
    >
      {count ?? 0}/{maxLength}
      {atLimit && " limit"}
    </span>
  );
}

export default function KitFormFieldView({
  label = "",
  value = "",
  placeholder = "",
  helper = "",
  error = "",
  success = "",
  maxLength = null,
  count = null,
  isFolded = null,
  onToggleFold = null,
  children = null,
  isDisabled = false,
  type = "text",
  onChange = null,
}) {
  const isFoldable = isFolded !== null && isFolded !== undefined;
  // Fold open/closed is sanctioned presentation-only local state (2.0
  // ground rules); isFolded only seeds the initial disclosure state,
  // it does not control it on every render.
  const [isOpen, setIsOpen] = useState(() => !isFolded);
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const fieldId = `kit-form-field-${label.replace(/\s+/g, "-").toLowerCase() || "input"}`;

  function toggleFold() {
    setIsOpen((current) => !current);
    onToggleFold?.();
  }

  const labelRow = (
    <div className="flex items-center justify-between gap-[var(--space-2)]">
      <label
        htmlFor={isFoldable ? undefined : fieldId}
        className={`text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] ${
          isDisabled ? "text-[var(--ink-faint)]" : "text-[var(--ink-faint)]"
        }`}
      >
        {label}
      </label>
      <CounterSlot maxLength={maxLength} count={count} />
    </div>
  );

  if (isFoldable) {
    const foldOpen = isOpen;

    return (
      <div className="flex flex-col gap-[var(--space-2)]">
        <button
          type="button"
          disabled={isDisabled}
          aria-expanded={foldOpen}
          onClick={toggleFold}
          className="kit-focus flex w-full items-center justify-between gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)] text-left transition-colors hover:border-[var(--line)] active:bg-[var(--state-pressed-fill)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)]"
        >
          <span className="flex min-w-0 flex-1 items-center justify-between gap-[var(--space-2)]">
            <span className="truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
              {label}
            </span>
            <CounterSlot maxLength={maxLength} count={count} />
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`flex-none text-[var(--ink-faint)] transition-transform duration-[var(--dur-fast)] ${
              foldOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {foldOpen && <div className="flex flex-col gap-[var(--space-3)]">{children}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-1)]">
      {labelRow}

      <input
        id={fieldId}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={(event) => onChange?.(event.target.value)}
        aria-invalid={hasError}
        className={`kit-focus cf-field min-h-[var(--control-md)] rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] ${
          hasError
            ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)]"
            : hasSuccess
              ? "border-[var(--status-success-border)] bg-[var(--status-success-bed)]"
              : "border-[var(--line-whisper)] hover:border-[var(--state-hover-line)]"
        }`}
      />

      {hasError && (
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
          {error}
        </p>
      )}
      {hasSuccess && (
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-success)]">
          {success}
        </p>
      )}
      {!hasError && !hasSuccess && helper && (
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {helper}
        </p>
      )}
    </div>
  );
}
