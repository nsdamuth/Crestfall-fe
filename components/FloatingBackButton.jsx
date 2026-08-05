"use client";

import { useRouter } from "next/navigation";

export default function FloatingBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="
        fixed left-4 top-1/2 z-40
        hidden -translate-y-1/2
        rounded-[var(--radius-md)] border border-[var(--muted-gold)]/30
        bg-black/70 px-4 py-3
        text-sm uppercase tracking-[0.18em]
        text-[var(--muted-gold)]
        shadow-2xl
        transition
        hover:border-[var(--muted-gold)]/70
        hover:bg-[var(--muted-gold)]/15
        hover:text-[var(--foreground)]
        md:block
      "
      aria-label="Go back"
    >
      ← Back
    </button>
  );
}