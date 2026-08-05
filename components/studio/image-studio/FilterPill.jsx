"use client";

export default function FilterPill({ active = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={typeof onClick !== "function"}
      className={`rounded-[var(--radius-md)] border px-4 py-2 text-xs uppercase tracking-[0.16em] transition disabled:cursor-default ${
        active
          ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
          : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}