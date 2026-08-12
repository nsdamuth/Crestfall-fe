"use client";

// Field anatomy, docs/BUILD-BLUEPRINT.md 2.8. Four slots plus the
// input: label, input bed, helper line, error line, plus an optional
// counter and an optional folding disclosure wrapping a field group
// (the creator's Advanced Creator Guidance and Advanced Prompting
// pattern). Fold open/closed is sanctioned presentation-only local
// state; value, error, success, and count are always caller-owned.
//
// 1.1.0 (K1): `variant` adds textarea (O1 collapsed-preview resting
// state), select (composes KitDropdown's grammar and sheet behavior
// under 700px), and number, plus `mono`. The counter's visibility
// follows O4: hidden at rest, shown on focus or past 80% of
// maxLength, danger tone plus the word "limit" at or over maxLength.
// The fold-header group budget counter stays always visible per 2.8.
import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import KitDropdownView from "../dropdown/KitDropdown.view";

function CounterSlot({ maxLength, count, isFocused = false, alwaysVisible = false }) {
  if (maxLength === null || maxLength === undefined) return null;
  const safeCount = count ?? 0;
  const atLimit = safeCount >= maxLength;
  const pastThreshold = maxLength > 0 && safeCount / maxLength >= 0.8;
  const isVisible = alwaysVisible || isFocused || pastThreshold;
  if (!isVisible) return null;

  return (
    <span
      className={`flex-none tabular-nums text-[length:var(--text-label)] ${
        atLimit ? "text-[var(--status-danger)]" : "text-[var(--ink-faint)]"
      }`}
    >
      {safeCount}/{maxLength}
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
  variant = "text",
  mono = false,
  startExpanded = false,
  options = [],
  onSelect = null,
  onChange = null,
}) {
  const isFoldable = isFolded !== null && isFolded !== undefined;
  // Fold open/closed is sanctioned presentation-only local state (2.0
  // ground rules); isFolded only seeds the initial disclosure state,
  // it does not control it on every render.
  const [isOpen, setIsOpen] = useState(() => !isFolded);
  // Focus flag drives the O4 counter visibility rule; textarea also
  // drives the O1 collapsed/expanded resting state off the same flag.
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(() => Boolean(startExpanded));
  const textareaRef = useRef(null);
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const fieldId = `kit-form-field-${label.replace(/\s+/g, "-").toLowerCase() || "input"}`;
  const monoClass = mono ? "font-mono" : "";

  // Moves keyboard focus onto the real textarea the moment it mounts
  // (tab-focusing or tapping the collapsed preview button expands
  // first, then this hands focus to the now-mounted field), so typing
  // works immediately without a second interaction.
  useLayoutEffect(() => {
    if (variant === "textarea" && isExpanded) {
      textareaRef.current?.focus();
    }
  }, [variant, isExpanded]);

  function toggleFold() {
    setIsOpen((current) => !current);
    onToggleFold?.();
  }

  function expandTextarea() {
    setIsExpanded(true);
    setIsFocused(true);
  }

  function collapseTextarea() {
    setIsExpanded(false);
    setIsFocused(false);
  }

  const hasLabelTarget = !isFoldable && variant !== "select";
  const labelRow = (
    <div className="flex items-center justify-between gap-[var(--space-2)]">
      <label
        htmlFor={hasLabelTarget ? fieldId : undefined}
        className={`text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] ${
          isDisabled ? "text-[var(--ink-faint)]" : "text-[var(--ink-faint)]"
        }`}
      >
        {label}
      </label>
      <CounterSlot maxLength={maxLength} count={count} isFocused={isFocused} />
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
            {/* Group budget line, 2.8: unlike a plain field's counter,
                this stays always visible, unaffected by O4. */}
            <CounterSlot maxLength={maxLength} count={count} alwaysVisible />
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

  const inputBedClass = `kit-focus cf-field min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border bg-[var(--surface-1)] px-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] ${monoClass} ${
    hasError
      ? "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)]"
      : hasSuccess
        ? "border-[var(--status-success-border)] bg-[var(--status-success-bed)]"
        : "border-[var(--line-whisper)] hover:border-[var(--state-hover-line)]"
  }`;

  let control;

  if (variant === "select") {
    const selectedOption = options.find((option) => option?.value === value);
    control = (
      <div className="w-full [&>div]:w-full [&>div>button]:w-full [&_svg]:ml-auto">
        <KitDropdownView
          label={selectedOption ? "" : placeholder || "Select"}
          options={options}
          selectedValues={value ? [value] : []}
          isMultiSelect={false}
          isDisabled={isDisabled}
          onToggleOption={(nextValue) => onSelect?.(nextValue)}
          ariaLabel={label}
        />
      </div>
    );
  } else if (variant === "textarea") {
    if (isExpanded) {
      control = (
        <textarea
          ref={textareaRef}
          id={fieldId}
          rows={4}
          value={value}
          placeholder={placeholder}
          disabled={isDisabled}
          onChange={(event) => onChange?.(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={collapseTextarea}
          aria-invalid={hasError}
          className={`${inputBedClass} min-h-[calc(var(--control-md)*2)] resize-none py-[var(--space-2)]`}
        />
      );
    } else {
      // O1 resting state: collapsed to one control-height line
      // showing a preview of the entered value, always visible
      // whether filled, expanding on focus or tap.
      const previewText = value || placeholder;
      control = (
        <button
          type="button"
          id={fieldId}
          disabled={isDisabled}
          onFocus={expandTextarea}
          onClick={expandTextarea}
          className={`${inputBedClass} flex items-center text-left`}
        >
          <span
            className={`truncate ${value ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"}`}
          >
            {previewText || " "}
          </span>
        </button>
      );
    }
  } else {
    control = (
      <input
        id={fieldId}
        type={variant === "number" ? "number" : type}
        value={value}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={hasError}
        className={inputBedClass}
      />
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-1)]">
      {labelRow}

      {control}

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
