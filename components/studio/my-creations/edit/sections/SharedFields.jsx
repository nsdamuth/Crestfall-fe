import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import KitFormField from "@/components/kit/KitFormField";

// Version, added E1 (wave E1, docs/plans/FABLE-GATE-PLAN.md). Bump on
// any prop-shape change to an existing export; additions to the file
// (new primitives, new optional props) do not require a bump.
//
// 1.1.0 (ED1C, docs/plans/ED1B-EDITOR-PAGE-SPEC.md sections 3.6 and
// 3.7). No prop-shape change to any export; two behavior changes:
// - EditorSectionChromeContext (new export): the v2 editor shell
//   provides { suppressSectionTitle: true } around every mounted
//   section, and SectionTitle renders nothing under it (the shell's
//   section box carries the one header). Without a provider every
//   consumer renders exactly as 1.0.0.
// - SelectField now renders the branded kit dropdown grammar
//   (delegating to KitFormField variant="select", which composes
//   KitDropdown) instead of a native <select>. Same props, same
//   onChange(value) intent; the native select is illegal on the v2
//   editor page per the ED1C dropdown law.
//
// 1.2.0 (ED1G, ED1E section 4 propagation, SW1): TextField and
// NumberField swap their label-to-bed/bed-to-helper spacing onto the
// ruled --space-1/--space-2 pair (was inverted); TextField overflow
// fades to an ellipsis instead of a mid-letter hard clip (4.2);
// NumberField right-aligns with tabular-nums (4.2); TextAreaField's
// folding now actually collapses to one ellipsized preview line at
// rest, expands to a real textarea on any focus path, and carries a
// fold glyph (4.3); ReadOnlyField drops its field bed entirely (4.6);
// ActionPanel drops its own bordered/icon/display-header chrome for
// the inset-hairline seated-action-row pattern (section 5). No prop
// shape changed on any export.
export const SHARED_FIELDS_VERSION = "1.2.0";

// ED1C section chrome context: the v2 editor page shell renders one
// header per section box and suppresses the sections' own internal
// eyebrow + title + description stacks through this context. Default
// is suppress nothing, so every consumer outside that shell (the
// legacy edit route included) is untouched.
export const EditorSectionChromeContext = createContext({
  suppressSectionTitle: false,
});

// Long-form field character limits, RULED (a1 advanced-creator pass,
// docs/CONTRACT-REQUESTS.md "Long-form field character limits"): two
// size classes, applied to every long-form field in the advanced
// editor via TextAreaField's existing maxLength prop. SHORT for
// fields that describe in a line or a short paragraph (appearance,
// tone, premise, summary, and their kin); DEEP for fields that hold
// extended writing (personality, backstory, history, lore body,
// scenario detail, and their kin). Display-layer ruling, pending
// Nick's confirmation against the backend data model; not a backend
// change, not blocking.
export const SHORT_LONGFORM_MAX_LENGTH = 600;
export const DEEP_LONGFORM_MAX_LENGTH = 2000;

const LABEL_CLASS =
  "text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]";

// Focus law, RULED 22 Aug 2026 (A3, Fable law review): the border-
// brightening mark this comment used to describe as current is
// retired; the single global --focus-ring rule
// (app/design-system.css, ":focus-visible" section) is the only
// focus treatment on every focusable element app-wide, this field
// bed included. The `kit-focus`/`cf-field` class strings below are
// dead (harmless no-op selectors now) and are swept in the dedicated
// ED1G dead-class pass across every file that still carries them, not
// removed piecemeal here.
const FIELD_BED_CLASS =
  "kit-focus cf-field w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)] overflow-hidden text-ellipsis whitespace-nowrap";

const HELPER_CLASS =
  "text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]";

// Counter, RULED (Fable Gate O4, option A): renders only on focus and
// whenever the value is past 80% of the limit; silent otherwise. At
// the limit it takes --status-danger-text plus the word, matching the
// ruled form-field anatomy (docs/BUILD-BLUEPRINT.md 2.8). Brian
// ruling 1, 22 Aug 2026: running text at normal size uses the
// brighter -text tier, not the base --status-danger chip/badge color.
function Counter({ length, maxLength, isFocused }) {
  if (!maxLength) return null;
  const atLimit = length >= maxLength;
  const pastThreshold = length >= maxLength * 0.8;
  if (!isFocused && !pastThreshold) return null;

  return (
    <span
      className={`flex-none tabular-nums text-[length:var(--text-label)] ${
        atLimit ? "text-[var(--status-danger-text)]" : "text-[var(--ink-faint)]"
      }`}
    >
      {length}/{maxLength}
      {atLimit ? " limit" : ""}
    </span>
  );
}

function LabelRow({ label, length, maxLength, isFocused }) {
  return (
    <span className="flex items-baseline justify-between gap-[var(--space-2)]">
      <span className={LABEL_CLASS}>{label}</span>
      <Counter length={length} maxLength={maxLength} isFocused={isFocused} />
    </span>
  );
}

// Section label recipe, RULED (a1 advanced-creator pass): the
// standard gold eyebrow with the trailing gold rule, matching
// components/studio/studio-page-header/StudioPageHeader.view.jsx's
// canonical recipe verbatim (token eyebrow scale, `--grad-rule`
// trailing line). Heading moved onto the `--text-heading`/-m scale
// step E1 (wave E1): the raw `text-4xl` this file previously
// hand-rolled resolves down to the same locked heading step the rest
// of the kit uses, with the mobile pair for 390.
export function SectionTitle({ eyebrow, title, body }) {
  const { suppressSectionTitle } = useContext(EditorSectionChromeContext);
  if (suppressSectionTitle) return null;

  return (
    <div>
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-[length:var(--text-heading-m)] leading-[var(--lh-heading-m)] min-[700px]:text-[length:var(--text-heading)] min-[700px]:leading-[var(--lh-heading)]">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-dim)]">{body}</p>
    </div>
  );
}

// TextField, E1 (wave E1): rebuilt onto the KitFormField grammar
// (components/kit/form-field/KitFormField.view.jsx) so the kit and
// editor trees read identically. Fixes the defect the gate found at
// CharacterIdentitySection.view.jsx:85,135: a caller-supplied
// maxLength was silently dropped (no DOM limit, no counter) though
// the contract and fixtures declared one; maxLength is now wired
// through to the input and its counter.
export function TextField({
  label,
  value = "",
  onChange = () => {},
  placeholder,
  maxLength,
  helperText,
  disabled = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <label className="block">
      <LabelRow
        label={label}
        length={value.length}
        maxLength={maxLength}
        isFocused={isFocused}
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        maxLength={maxLength || undefined}
        disabled={disabled}
        className={`mt-[var(--space-1)] ${FIELD_BED_CLASS}`}
      />
      {helperText ? (
        <span className={`mt-[var(--space-2)] block ${HELPER_CLASS}`}>{helperText}</span>
      ) : null}
    </label>
  );
}

// SelectField, new E1 (wave E1): same grammar as TextField, on the
// same field bed and label anatomy, for the ~66 hand-rolled selects
// the gate found across the editor-reachable tree (finding B3).
// `options` accepts either plain strings or `{ value, label }` pairs.
// ED1C (1.1.0): the native <select> is replaced by the branded kit
// dropdown grammar via KitFormField variant="select" (which composes
// KitDropdown: popover at 700px and up, KitModalFrame sheet under
// it). Props and the onChange(value) intent are unchanged.
export function SelectField({
  label,
  value = "",
  onChange = () => {},
  options = [],
  placeholder,
  helperText,
  disabled = false,
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === "object" && option !== null
      ? option
      : { value: option, label: option }
  );

  return (
    <KitFormField
      variant="select"
      label={label}
      value={value}
      options={normalizedOptions}
      onSelect={(nextValue) => onChange(nextValue)}
      placeholder={placeholder}
      helper={helperText}
      isDisabled={disabled}
    />
  );
}

// NumberField, new E1 (wave E1): same grammar as TextField, for the
// raw `type="number"` inputs the gate found hand-rolled across the
// editor-reachable tree (finding B3). No character counter (numeric
// values do not carry a length budget); `min`/`max`/`step` are
// additive and optional.
export function NumberField({
  label,
  value = "",
  onChange = () => {},
  placeholder,
  min,
  max,
  step,
  helperText,
  disabled = false,
}) {
  return (
    <label className="block">
      <span className={LABEL_CLASS}>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`mt-[var(--space-1)] text-right tabular-nums ${FIELD_BED_CLASS}`}
      />
      {helperText ? (
        <span className={`mt-[var(--space-2)] block ${HELPER_CLASS}`}>{helperText}</span>
      ) : null}
    </label>
  );
}

// Sensible ceiling for the expanded textarea: past this height a
// field scrolls internally instead of pushing the footer off screen,
// the same recipe the World/Look/Story quick creates already prove
// (components/studio/create/world/creator-stops/shared/Controls.jsx
// FoldingTextField).
const TEXTAREA_MAX_HEIGHT_PX = 320;

// Folding long-form field, RULED (Fable Gate O1, option A, wave E1),
// REBUILT 22 Aug 2026 (ED1G SW1, ED1E section 4.3): rest, filled
// shows exactly ONE ellipsized line of preview at --control-md
// height with a fold glyph at the bed's right edge, never a partial
// second line; rest, empty is the same height with a placeholder.
// Expansion happens on focus from ANY path (pointer, keyboard,
// programmatic), never merely because the value is non-empty at
// mount, and grows to fit content up to 320px before scrolling
// internally. Once expanded it stays expanded for the rest of the
// session so a filled-in answer never disappears out from under the
// person who wrote it. Counter follows O4 (same Counter component as
// TextField/SelectField). `disabled` and `mono` (RULED, sf1 pass):
// both additive and optional, default false, no change to any
// existing consumer.
export function TextAreaField({
  label,
  value = "",
  onChange = () => {},
  placeholder,
  maxLength,
  helperText,
  disabled = false,
  mono = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    if (isExpanded) {
      textareaRef.current?.focus();
    }
  }, [isExpanded]);

  function expand() {
    setIsExpanded(true);
    setIsFocused(true);
  }

  function collapse() {
    setIsFocused(false);
  }

  const bedClass = `kit-focus cf-field w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)]${
    mono ? " font-mono" : ""
  }`;

  return (
    <label className="block">
      <LabelRow
        label={label}
        length={value.length}
        maxLength={maxLength}
        isFocused={isFocused}
      />
      {isExpanded ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={collapse}
          placeholder={placeholder}
          maxLength={maxLength || undefined}
          disabled={disabled}
          className={`mt-[var(--space-1)] resize-none overflow-y-auto py-[var(--space-2)] ${bedClass}`}
          style={{
            minHeight: "var(--control-md)",
            maxHeight: `${TEXTAREA_MAX_HEIGHT_PX}px`,
          }}
        />
      ) : (
        <button
          type="button"
          disabled={disabled}
          onFocus={expand}
          onClick={expand}
          className={`mt-[var(--space-1)] flex min-h-[var(--control-md)] items-center gap-[var(--space-2)] py-[var(--space-2)] text-left ${bedClass}`}
        >
          <span
            className={`min-w-0 flex-1 truncate ${value ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"}`}
          >
            {value || placeholder || " "}
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="flex-none text-[var(--ink-faint)]"
          />
        </button>
      )}
      {helperText ? (
        <span className={`mt-[var(--space-2)] block ${HELPER_CLASS}`}>{helperText}</span>
      ) : null}
    </label>
  );
}

// 4.6: no bed. A bed always means editable; read-only fields carry no
// border, no background, no box, only the label row plus the value
// as plain text.
export function ReadOnlyField({ label, value = "" }) {
  return (
    <div className="block">
      <span className={LABEL_CLASS}>{label}</span>
      <p className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
        {value || "Not set"}
      </p>
    </div>
  );
}

// CheckboxField, RULED 22 Aug 2026 (Ruling 2, checkbox and multi-select
// grammar). Checked state is a gold check mark on a light gold wash
// (--fill-whisper) with a --gold-action border; rest state is a quiet
// bordered square (--line) at the control-size floor
// (--control-editor-sm). Row label sits beside the box, --ink-dim at
// rest, --ink checked. The native checkbox stays the input of record
// (keyboard/AT behavior); its default box is painted transparent and
// a Check glyph is layered on top, driven by the peer-checked state.
// Applies app-wide, not only to this file's own consumers.
export function CheckboxField({ label, checked = false, onChange = () => {}, disabled = false }) {
  return (
    <label
      className={`flex items-center gap-[var(--space-3)] ${
        disabled ? "pointer-events-none opacity-[var(--state-disabled-opacity)]" : "cursor-pointer"
      }`}
    >
      <span className="relative inline-flex h-[var(--control-editor-sm)] w-[var(--control-editor-sm)] flex-none items-center justify-center">
        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[var(--radius-sm)] border border-[var(--line)] bg-transparent outline-none transition-colors checked:border-[var(--gold-action)] checked:bg-[var(--fill-whisper)]"
        />
        <Check
          size={14}
          strokeWidth={2.5}
          aria-hidden="true"
          className="pointer-events-none relative text-[var(--gold-action)] opacity-0 transition-opacity peer-checked:opacity-100"
        />
      </span>
      <span
        className={`text-[length:var(--text-body)] leading-[var(--lh-body)] ${
          checked ? "text-[var(--ink)]" : "text-[var(--ink-dim)]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

// Section 5: no second bordered depth inside a box. ActionPanel is
// the inset-hairline sub-group pattern (the same conversion section 5
// prescribes for Personality Frameworks and Template Operations): an
// inset hairline, a tier 4 label, one tier 7 helper line, then a
// seated action row. No border, no background, no icon, no display
// header.
export function ActionPanel({
  title,
  body,
  button,
  onClick,
  disabled = true,
}) {
  return (
    <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {title}
      </p>
      <p className={`mt-[var(--space-2)] ${HELPER_CLASS}`}>{body}</p>
      <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-3)]">
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className="cf-btn cf-btn--secondary"
        >
          {button}
        </button>
      </div>
    </div>
  );
}
