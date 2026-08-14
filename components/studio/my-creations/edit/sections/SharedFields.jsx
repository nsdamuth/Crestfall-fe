import { createContext, useContext, useState } from "react";
import { Sparkles } from "lucide-react";

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
export const SHARED_FIELDS_VERSION = "1.1.0";

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

const FIELD_BED_CLASS =
  "cf-field w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)]";

const HELPER_CLASS =
  "text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]";

// Counter, RULED (Fable Gate O4, option A): renders only on focus and
// whenever the value is past 80% of the limit; silent otherwise. At
// the limit it takes --status-danger plus the word, matching the
// ruled form-field anatomy (docs/BUILD-BLUEPRINT.md 2.8).
function Counter({ length, maxLength, isFocused }) {
  if (!maxLength) return null;
  const atLimit = length >= maxLength;
  const pastThreshold = length >= maxLength * 0.8;
  if (!isFocused && !pastThreshold) return null;

  return (
    <span
      className={`flex-none tabular-nums text-[length:var(--text-label)] ${
        atLimit ? "text-[var(--status-danger)]" : "text-[var(--ink-faint)]"
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
        className={`mt-2 ${FIELD_BED_CLASS}`}
      />
      {helperText ? <span className={`mt-1 block ${HELPER_CLASS}`}>{helperText}</span> : null}
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
        className={`mt-2 ${FIELD_BED_CLASS}`}
      />
      {helperText ? <span className={`mt-1 block ${HELPER_CLASS}`}>{helperText}</span> : null}
    </label>
  );
}

// Sensible ceiling for the expanded textarea: past this height a
// field scrolls internally instead of pushing the footer off screen,
// the same recipe the World/Look/Story quick creates already prove
// (components/studio/create/world/creator-stops/shared/Controls.jsx
// FoldingTextField).
const TEXTAREA_MAX_HEIGHT_PX = 320;

// Folding long-form field, RULED (Fable Gate O1, option A, wave E1):
// resting collapsed at one control height (--control-md) showing a
// preview of the entered value on its own line rather than hiding
// whether the field is filled (the Baymard never-hide-what-is-filled
// caveat); expands on focus. Once focused it stays expanded for the
// rest of the session so a filled-in answer never disappears out from
// under the person who wrote it, mirroring the W/L/S FoldingTextField
// interaction so the editor and kit trees read identically. Counter
// follows O4 (same Counter component as TextField/SelectField).
// `disabled` and `mono` (RULED, sf1 pass): both additive and
// optional, default false, no change to any existing consumer.
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
  const [hasExpanded, setHasExpanded] = useState(false);
  const isExpanded = hasExpanded || Boolean(value.trim());

  return (
    <label className="block">
      <LabelRow
        label={label}
        length={value.length}
        maxLength={maxLength}
        isFocused={isFocused}
      />
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => {
          setIsFocused(true);
          setHasExpanded(true);
        }}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={1}
        maxLength={maxLength || undefined}
        disabled={disabled}
        className={`mt-2 w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-[height,border-color] placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)] focus-visible:outline-none focus-visible:border-[var(--gold-action)] disabled:pointer-events-none disabled:opacity-[var(--state-disabled-opacity)]${
          mono ? " font-mono" : ""
        }`}
        style={{
          height: isExpanded ? undefined : "var(--control-md)",
          maxHeight: `${TEXTAREA_MAX_HEIGHT_PX}px`,
        }}
      />
      {helperText ? <span className={`mt-1 block ${HELPER_CLASS}`}>{helperText}</span> : null}
    </label>
  );
}

export function ReadOnlyField({ label, value = "" }) {
  return (
    <div className="block">
      <span className={LABEL_CLASS}>{label}</span>
      <div className="mt-2 min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)] flex items-center">
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
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-5">
      <Sparkles className="text-[var(--gold-ornament)]" size={20} />
      <h3 className="mt-3 font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)]">
        {title}
      </h3>
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
