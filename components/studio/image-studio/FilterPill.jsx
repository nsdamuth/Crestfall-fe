"use client";

export default function FilterPill({ active = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={typeof onClick !== "function"}
      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition disabled:cursor-default ${
        active
          ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
          : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}