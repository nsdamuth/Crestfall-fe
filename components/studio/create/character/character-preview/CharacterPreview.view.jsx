"use client";

import KitArtPlaceholderView from "@/components/kit/art-placeholder/KitArtPlaceholder.view";

export default function CharacterPreviewView({
  displayInitial = "C",
  characterName = "Unnamed Character",
  characterSubtitle = "Private Draft",
  speciesLabel = "Species not chosen yet.",
  genderPresentationLabel = "Gender presentation not chosen yet.",
  clothingStyleLabel = "Default clothing not chosen yet.",
  previewCostLabel = "5",
  previewImageUrl = "",
  previewStatus = "idle",
  previewError = "",
  previewDisabled = false,
  onGeneratePreview = null,
} = {}) {
  const isPreparing = previewStatus === "preparing";
  const isGenerating = previewStatus === "generating";
  const buttonLabel = isPreparing
    ? "Saving draft..."
    : isGenerating
      ? "Generating preview..."
      : previewImageUrl
        ? "Generate another"
        : "Generate preview";

  return (
    <aside className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-6">
      <div className="flex flex-col gap-[var(--space-6)] sm:flex-row">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] sm:w-48 sm:flex-none">
          {previewImageUrl ? (
            <img
              src={previewImageUrl}
              alt={`${characterName} generated preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <KitArtPlaceholderView size="lg" />
          )}

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[var(--space-1)] bg-gradient-to-t from-black/85 via-black/55 to-transparent p-3 pt-10">
            <button
              type="button"
              onClick={() => onGeneratePreview?.()}
              disabled={previewDisabled || typeof onGeneratePreview !== "function"}
              className="cf-btn cf-btn--primary w-full text-sm"
            >
              {buttonLabel}
            </button>
            <p className="text-center text-[length:var(--text-label)] text-[var(--ink-dim)]">
              {`${previewCostLabel} coins`}
            </p>
            {previewError ? (
              <p className="text-center text-xs leading-4 text-red-200">
                {previewError}
              </p>
            ) : null}
          </div>
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
