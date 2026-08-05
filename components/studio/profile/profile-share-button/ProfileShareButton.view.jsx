"use client";

import { Share2 } from "lucide-react";

export default function ProfileShareButtonView({
  buttonLabel = "Share",
  onShare = null,
}) {
  return (
    <button
      type="button"
      onClick={() => onShare?.()}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
    >
      <Share2 size={14} />
      {buttonLabel}
    </button>
  );
}
