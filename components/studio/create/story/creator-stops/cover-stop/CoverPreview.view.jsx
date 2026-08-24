"use client";

import { useState } from "react";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";

// Mirrors LookPreviewView (components/studio/create/look/
// creator-stops/look-stop/LookPreview.view.jsx), itself mirroring
// WorldPreviewView and CharacterPreviewView (components/studio/
// create/character/character-preview/CharacterPreview.view.jsx):
// empty art slots render the shared camellia mark, never a blank box;
// preview generation never fires without a tap. Generate CTA cost
// note law, RULED 23 Aug 2026 (build-0823 pass 6): the button reads
// the action only; the cost renders as a quiet note beneath it.
export default function CoverPreviewView({
  displayInitial = "S",
  storyName = "Unnamed Story",
  premiseLabel = "Premise not written yet.",
  castLabel = "No cast chosen yet.",
  settingLabel = "Setting not chosen yet.",
  previewCostLabel = "40",
} = {}) {
  const [hasGenerated, setHasGenerated] = useState(false);

  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-6">
      <div className="flex flex-col gap-[var(--space-6)] sm:flex-row">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border border-white/10 sm:w-48 sm:flex-none">
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
          <h2 className="font-display text-4xl">{storyName}</h2>

          <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Private Draft
          </p>

          <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--ink-dim)]">
            <p>{premiseLabel}</p>
            <p>{castLabel}</p>
            <p>{settingLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
