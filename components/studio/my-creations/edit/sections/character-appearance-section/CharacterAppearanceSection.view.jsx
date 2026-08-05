import { Shirt, X } from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

function SelectedClothingCard({
  clothingLabel = "Clothing Style",
  selectedClothing = {},
  emptyClothingDescription = "",
  noDescriptionLabel = "No description.",
  selectedClothingFallbackTitle = "Selected Clothing Source",
  onPickOutfit = null,
  onPickWardrobe = null,
  onClearDefaultClothing = null,
}) {
  return (
    <div className="md:col-span-2">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {clothingLabel}
      </p>

      <div className="mt-2 rounded-2xl border border-white/10 bg-black/35 p-4">
        {selectedClothing.hasSelection ? (
          <div className="flex flex-wrap items-start gap-4">
            <div
              className="h-24 w-24 shrink-0 rounded-xl border border-white/10 bg-cover bg-center"
              style={{
                backgroundImage: `url(${selectedClothing.imageUrl})`,
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                {selectedClothing.label}
              </p>
              <h4 className="mt-1 font-display text-3xl">
                {selectedClothing.title || selectedClothingFallbackTitle}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                {selectedClothing.description || noDescriptionLabel}
              </p>
              {selectedClothing.id ? (
                <p className="mt-2 break-all text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
                  {selectedClothing.id}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onClearDefaultClothing?.()}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-3 py-2 text-[var(--status-danger)] transition hover:bg-white/5"
              aria-label="Clear default clothing"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        ) : (
          <p className="text-sm leading-6 text-[var(--muted)]">
            {emptyClothingDescription}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onPickOutfit?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            <Shirt size={14} />
            {selectedClothing.outfitButtonLabel || "Select Outfit"}
          </button>

          <button
            type="button"
            onClick={() => onPickWardrobe?.()}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
          >
            <Shirt size={14} />
            {selectedClothing.wardrobeButtonLabel || "Select Wardrobe"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CharacterAppearanceSectionView({
  sectionEyebrow = "Character Editor",
  sectionTitle = "Appearance",
  sectionDescription = "",
  skinToneControl = null,
  eyeColorControl = null,
  hairControl = null,
  visualHeritageControl = null,
  clothingLabel = "Clothing Style",
  selectedClothing = {},
  emptyClothingDescription = "",
  noDescriptionLabel = "No description.",
  selectedClothingFallbackTitle = "Selected Clothing Source",
  onPickOutfit = null,
  onPickWardrobe = null,
  onClearDefaultClothing = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {skinToneControl}
        {eyeColorControl}
        {hairControl}
        {visualHeritageControl}

        <SelectedClothingCard
          clothingLabel={clothingLabel}
          selectedClothing={selectedClothing}
          emptyClothingDescription={emptyClothingDescription}
          noDescriptionLabel={noDescriptionLabel}
          selectedClothingFallbackTitle={selectedClothingFallbackTitle}
          onPickOutfit={onPickOutfit}
          onPickWardrobe={onPickWardrobe}
          onClearDefaultClothing={onClearDefaultClothing}
        />
      </div>
    </div>
  );
}
