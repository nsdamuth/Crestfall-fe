"use client";

import { ArrowLeft } from "lucide-react";

// Portable Skin (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape). No
// Creation client, no Next.js import, no
// components/studio/my-creations/** import: `libraryPanel` arrives
// pre-composed from the Binding Shell (../ImageLibrary.jsx).
export default function ImageLibraryView({
  creationId = "",
  backLabel = "Back to editor",
  onBack,
  libraryPanel = null,
}) {
  return (
    <section className="mx-auto w-full max-w-[var(--container)] px-[var(--space-4)] pb-[var(--space-24)] pt-[var(--space-4)] sm:px-[var(--space-6)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-3)] p-[var(--space-4)] sm:p-[var(--space-6)]">
        <div className="min-w-0">
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            Image Library
          </p>
        </div>

        <button type="button" onClick={() => onBack?.()} className="cf-btn cf-btn--secondary">
          <ArrowLeft size={14} aria-hidden="true" />
          {backLabel}
        </button>
      </div>

      {libraryPanel}
    </section>
  );
}
