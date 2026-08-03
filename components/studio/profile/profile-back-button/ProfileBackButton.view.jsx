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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--muted-gold)]/25 bg-black/45 text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/55 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
    >
      <ArrowLeft size={18} />
    </button>
  );
}
