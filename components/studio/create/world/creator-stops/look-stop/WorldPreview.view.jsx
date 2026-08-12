"use client";

import { useState } from "react";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";

// Mirrors CharacterPreviewView (components/studio/create/character/
// character-preview/CharacterPreview.view.jsx): empty art slots render
// the shared camellia mark, never a blank box; preview generation
// never fires without a tap, exact CTA pattern "Generate preview, X
// tokens".
export default function WorldPreviewView({
  displayInitial = "W",
  worldName = "Unnamed World",
  essenceLabel = "Premise not written yet.",
  settingLabel = "Setting not chosen yet.",
  toneLabel = "Tone not set yet.",
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
              <div className="absolute inset-x-0 bottom-0 p-3">
                <button
                  type="button"
                  onClick={() => setHasGenerated(true)}
                  className="cf-btn cf-btn--primary w-full text-sm"
                >
                  {`Generate preview, ${previewCostLabel} tokens`}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-4xl">{worldName}</h2>

          <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Private Draft
          </p>

          <div className="mt-5 space-y-2 text-sm leading-6 text-[var(--ink-dim)]">
            <p>{essenceLabel}</p>
            <p>{settingLabel}</p>
            <p>{toneLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
