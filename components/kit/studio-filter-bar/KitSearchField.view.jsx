"use client";

// The shared kit search field, RULED 6 Sep 2026 (FE/FILTERS refine,
// Brian): one field, used by the sticky bar and by the Filter panel's
// search-within, so the focus treatment is fixed once. The ring sits
// OUTSIDE the field on the `kit-search-field` wrapper via
// :focus-within (app/design-system.css, "SEARCH FIELD FOCUS"); any
// input inside the wrapper drops its own ring and outline.
//
// Clear control, RULED 10 Aug 2026 (kit polish 3 pass): the native
// type=search cancel button renders in the browser's own color,
// outside token law. It is hidden (`.kit-search-input`'s
// ::-webkit-search-cancel-button rule) and replaced with a
// component-owned icon in the same muted token as the placeholder.
//
// Debounce, RULED (Scale Review H, finding D1): the bar's consumers
// re-run a full-dataset filter chain per keystroke, so the upstream
// onChange is buffered (default 200ms) while the field itself stays
// responsive. The panel's search-within filters a few dozen chip
// labels synchronously and passes debounceMs 0.
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export const SEARCH_DEBOUNCE_MS = 200;

export default function KitSearchFieldView({
  value = "",
  placeholder = "Search",
  onChange = null,
  debounceMs = SEARCH_DEBOUNCE_MS,
  name = "kit-search-field",
  clearLabel = "Clear search",
  className = "",
}) {
  const [localValue, setLocalValue] = useState(value);
  const lastEmittedRef = useRef(value);
  const debounceRef = useRef(null);
  const hasValue = Boolean(localValue);

  // Sync from the caller only on a genuine external change (a filter
  // reset, a cleared query from elsewhere), not the echo of our own
  // debounced emit landing back through the controlled `value` prop.
  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      setLocalValue(value);
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function emitChange(next) {
    lastEmittedRef.current = next;
    onChange?.(next);
  }

  function handleInputChange(next) {
    setLocalValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (debounceMs > 0) {
      debounceRef.current = setTimeout(() => emitChange(next), debounceMs);
    } else {
      emitChange(next);
    }
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLocalValue("");
    emitChange("");
  }

  return (
    <div
      className={`kit-search-field flex min-h-[var(--control-filter)] w-full items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] transition-colors hover:border-[var(--line)] [@media(pointer:coarse)]:min-h-[var(--control-md)] ${className}`}
    >
      <Search size={16} className="flex-none text-[var(--ink-faint)]" aria-hidden="true" />
      <input
        type="search"
        name={name}
        value={localValue}
        onChange={(event) => handleInputChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="kit-search-input w-full min-w-0 bg-transparent text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none [@media(pointer:coarse)]:text-[length:var(--text-body)]"
      />
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={clearLabel}
          className="flex flex-none items-center justify-center text-[var(--ink-faint)] transition-colors hover:text-[var(--ink-dim)]"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
