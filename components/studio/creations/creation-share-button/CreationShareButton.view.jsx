"use client";

import { Share2 } from "lucide-react";

export default function CreationShareButtonView({
  buttonLabel = "Share",
  disabled = false,
  compact = false,
  ariaLabel = "Share",
  onShare = null,
}) {
  return (
    <button
      type="button"
      onClick={() => onShare?.()}
      disabled={disabled}
      aria-label={ariaLabel}
      className={
        compact
          ? "inline-flex items-center gap-1.5 rounded-full border border-[#7b5525]/25 bg-[#7b5525]/5 px-3 py-1.5 font-display text-[9px] uppercase tracking-[0.18em] text-[#6a481f] transition hover:border-[#7b5525]/45 hover:bg-[#7b5525]/10 disabled:cursor-not-allowed disabled:opacity-60"
          : "inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      <Share2 size={compact ? 12 : 14} />
      {buttonLabel}
    </button>
  );
}
