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
    <div className="md:col-span-2 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {clothingLabel}
      </p>

      <div className="mt-[var(--space-3)]">
        {selectedClothing.hasSelection ? (
          <div className="flex flex-wrap items-start gap-[var(--space-4)]">
            <div
              className="h-24 w-24 shrink-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-cover bg-center"
              style={{
                backgroundImage: `url(${selectedClothing.imageUrl})`,
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                {selectedClothing.label}
              </p>
              {/* Tier 6 (ED1E section 3): an entry value never renders
                  at display size or family. */}
              <p className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                {selectedClothing.title || selectedClothingFallbackTitle}
              </p>
              <p className="mt-[var(--space-2)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                {selectedClothing.description || noDescriptionLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onClearDefaultClothing?.()}
              className="cf-btn cf-btn--danger"
              aria-label="Clear default clothing"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        ) : (
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {emptyClothingDescription}
          </p>
        )}

        <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
          <button
            type="button"
            onClick={() => onPickOutfit?.()}
            className="cf-btn cf-btn--primary"
          >
            <Shirt size={14} />
            {selectedClothing.outfitButtonLabel || "Select outfit"}
          </button>

          <button
            type="button"
            onClick={() => onPickWardrobe?.()}
            className="cf-btn cf-btn--secondary"
          >
            <Shirt size={14} />
            {selectedClothing.wardrobeButtonLabel || "Select wardrobe"}
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

      <div className="grid gap-4 md:grid-cols-2">
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
