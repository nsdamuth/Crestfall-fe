"use client";

import { useRouter } from "next/navigation";

export default function FloatingBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="cf-btn cf-btn--secondary fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 shadow-2xl md:flex"
      aria-label="Go back"
    >
      ← Back
    </button>
  );
}