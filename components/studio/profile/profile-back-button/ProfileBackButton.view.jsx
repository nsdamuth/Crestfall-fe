"use client";

import { ArrowLeft } from "lucide-react";

export default function ProfileBackButtonView({
  ariaLabel = "Go back",
  onGoBack = null,
}) {
  return (
    <button
      type="button"
      onClick={() => onGoBack?.()}
      aria-label={ariaLabel}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold-ornament)]/25 bg-black/45 text-[var(--gold-ornament)] transition hover:border-[var(--gold-ornament)]/55 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
    >
      <ArrowLeft size={18} />
    </button>
  );
}
