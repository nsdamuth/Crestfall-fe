import { useState } from "react";
import { Sparkles } from "lucide-react";

// Long-form field character limits, RULED (this pass, docs/CONTRACT-
// REQUESTS.md "Long-form field character limits"): two size classes,
// applied to every long-form field in the advanced editor via
// TextAreaField's existing maxLength prop. SHORT for fields that
// describe in a line or a short paragraph (appearance, tone, premise,
// summary, and their kin); DEEP for fields that hold extended writing
// (personality, backstory, history, lore body, scenario detail, and
// their kin). Display-layer ruling, pending Nick's confirmation
// against the backend data model; not a backend change, not blocking.
export const SHORT_LONGFORM_MAX_LENGTH = 600;
export const DEEP_LONGFORM_MAX_LENGTH = 2000;

// Section label recipe, RULED (a1 advanced-creator pass): the
// standard gold eyebrow with the trailing gold rule, matching
// components/studio/studio-page-header/StudioPageHeader.view.jsx's
// canonical recipe verbatim (token eyebrow scale, `--grad-rule`
// trailing line), replacing the raw `text-xs`/literal-tracking eyebrow
// this file previously hand-rolled.
export function SectionTitle({ eyebrow, title, body }) {
  return (
    <div>
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-dim)]">{body}</p>
    </div>
  );
}

export function TextField({ label, value = "", onChange = () => {} }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

const TEXTAREA_ROWS_COLLAPSED = 3;
const TEXTAREA_ROWS_EXPANDED = 8;

// Folding long-form field, RULED (a1 advanced-creator pass): collapsed
// by default (3 rows), expands on focus (8 rows), folds back on blur
// so the page does not stay tall once the field is left. A maxLength
// prop is optional and additive: when a caller supplies a real limit,
// a tabular-nums "used / limit" counter renders per the standing
// tabular-numerals law; when omitted (most callers today, since no
// ruled per-field limit exists in the data model yet), no counter
// renders rather than inventing a number.
export function TextAreaField({
  label,
  value = "",
  onChange = () => {},
  placeholder,
  maxLength,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const rows = isFocused ? TEXTAREA_ROWS_EXPANDED : TEXTAREA_ROWS_COLLAPSED;

  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-[var(--space-2)]">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
          {label}
        </span>
        {maxLength ? (
          <span className="text-[length:var(--text-label)] tabular-nums text-[var(--ink-faint)]">
            {value.length} / {maxLength}
          </span>
        ) : null}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength || undefined}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition-[height,border-color] placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

export function ReadOnlyField({ label, value = "" }) {
  return (
    <div className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <div className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
        {value || "Not set"}
      </div>
    </div>
  );
}

export function ActionPanel({
  title,
  body,
  button,
  onClick,
  disabled = true,
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <Sparkles className="text-[var(--gold-ornament)]" size={20} />
      <h3 className="mt-3 font-display text-3xl">{title}</h3>
      <p className="mt-2 leading-7 text-[var(--ink-dim)]">{body}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="cf-btn cf-btn--secondary mt-5"
      >
        {button}
      </button>
    </div>
  );
}