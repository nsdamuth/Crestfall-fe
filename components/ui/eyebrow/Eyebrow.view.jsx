"use client";

export default function EyebrowView({ children = null, showRuleMark = true }) {
  return (
    <p className="flex items-center gap-[var(--space-3)] text-[var(--text-eyebrow)] font-medium uppercase leading-[var(--lh-eyebrow)] tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
      <span>{children}</span>
      {showRuleMark ? (
        <span
          aria-hidden="true"
          className="h-px w-[var(--space-8)] flex-none"
          style={{ background: "var(--grad-rule)" }}
        />
      ) : null}
    </p>
  );
}
