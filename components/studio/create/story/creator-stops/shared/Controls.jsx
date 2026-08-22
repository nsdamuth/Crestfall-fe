"use client";

import { useEffect, useRef, useState } from "react";

import GlobalEyebrow from "@/components/ui/Eyebrow";

// Local to the Stories quick create, mirroring the Looks quick
// create's own package-local shared/Controls.jsx (itself mirroring
// World's, itself mirroring Character's): the field list differs, so
// this package carries its own copy of the handful of primitives it
// needs rather than importing another package's, keeping every
// package independently editable. Same recipes, same classes, same
// law.

// Standard gold eyebrow recipe, RULED 11 Aug 2026 (Sprint H render
// review, item 2): the same component the nine v2 page headers, the
// Character quick create, the World quick create, and the Look quick
// create use.
export const Eyebrow = GlobalEyebrow;

const FIELD_LABEL_CLASS =
  "mb-[var(--space-1)] flex items-baseline justify-between gap-[var(--space-3)] text-[10px] font-medium uppercase leading-[0.9rem] tracking-[0.14em] text-[var(--gold-ornament)]";

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

export function TextField({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div>
      <FieldLabel count={(value || "").length} max={maxLength}>
        {label}
      </FieldLabel>
      <input
        type="text"
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
      />
    </div>
  );
}

// Sensible ceiling for auto-grow: past this height a field scrolls
// internally instead of pushing the footer off screen, same recipe
// the Character quick create's TextAreaField uses.
const TEXTAREA_MAX_HEIGHT_PX = 200;

// Folding text inputs, RULED: collapsed by default (a single
// input-height row), expand on focus, visible character limit at
// every state. Once a field has been focused it stays expanded for
// the rest of the session, so a filled-in answer never disappears out
// from under the person who wrote it.
export function FoldingTextField({ label, value, onChange, placeholder, maxLength }) {
  const [hasExpanded, setHasExpanded] = useState(false);
  const textareaRef = useRef(null);
  const isExpanded = hasExpanded || Boolean((value || "").trim());

  useEffect(() => {
    const node = textareaRef.current;
    if (!node || !isExpanded) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, TEXTAREA_MAX_HEIGHT_PX)}px`;
  }, [value, isExpanded]);

  return (
    <div>
      <FieldLabel count={(value || "").length} max={maxLength}>
        {label}
      </FieldLabel>
      <textarea
        ref={textareaRef}
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={() => setHasExpanded(true)}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)]"
        style={{
          height: isExpanded ? undefined : "var(--control-md)",
          maxHeight: `${TEXTAREA_MAX_HEIGHT_PX}px`,
        }}
      />
    </div>
  );
}
