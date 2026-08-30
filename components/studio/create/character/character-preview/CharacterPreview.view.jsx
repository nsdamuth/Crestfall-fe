"use client";

import { useState } from "react";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";

export default function CharacterPreviewView({
  displayInitial = "C",
  characterName = "Unnamed Character",
  characterSubtitle = "Private Draft",
  speciesLabel = "Species not chosen yet.",
  genderPresentationLabel = "Gender presentation not chosen yet.",
  clothingStyleLabel = "Clothing style not chosen yet.",
  previewCostLabel = "40",
} = {}) {
  // RULED 11 Aug 2026 (Sprint H render review, item 3): no generation
  // fires without a tap. Package-local state, not lifted to the
  // ViewModel: this is a fixture-only stand-in with no backend call
  // to await, so there is no async status to normalize upstream.
  const [hasGenerated, setHasGenerated] = useState(false);

  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-6">
      <div className="flex flex-col gap-[var(--space-6)] sm:flex-row">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] sm:w-48 sm:flex-none">
          {hasGenerated ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black via-black/70 to-[var(--gold-ornament)]/10">
              <div className="text-center">
                <p className="font-display text-5xl text-[var(--gold-ornament)]">
                  {displayInitial}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[var(--ink-dim)]">
                  Preview Generated
                </p>
              </div>
            </div>
          ) : (
            <>
              <KitArtPlaceholderView size="lg" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[var(--space-1)] p-3">
                <button
                  type="button"
                  onClick={() => setHasGenerated(true)}
                  className="cf-btn cf-btn--primary w-full text-sm"
                >
                  Generate preview
                </button>
                <p className="text-center text-[length:var(--text-label)] text-[var(--ink-dim)]">
                  {`${previewCostLabel} tokens`}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-4xl">{characterName}</h2>

          <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            {characterSubtitle}
          </p>

          <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--ink-dim)]">
            <p>{speciesLabel}</p>
            <p>{genderPresentationLabel}</p>
            <p>{clothingStyleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
