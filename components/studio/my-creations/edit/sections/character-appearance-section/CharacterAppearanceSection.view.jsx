import { Shirt, Sparkles, X } from "lucide-react";

import {
  SectionTitle,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

function SelectedClothingCard({
  clothingLabel = "Default Clothing",
  selectedClothing = {},
  emptyClothingDescription = "",
  noDescriptionLabel = "No description.",
  selectedClothingFallbackTitle = "Selected Clothing Source",
  onPickOutfit = null,
  onPickWardrobe = null,
  onClearDefaultClothing = null,
}) {
  return (
    <div className="min-w-0 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
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
              <p className="mt-[var(--space-1)] break-words text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
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

function SelectedImagePresetCard({
  imagePresetLabel = "Default Image Preset",
  selectedImagePreset = {},
  emptyImagePresetDescription = "",
  imagePresetHelpText = "",
  noDescriptionLabel = "No description.",
  selectedImagePresetFallbackTitle = "Selected Image Preset",
  onPickImagePreset = null,
  onClearDefaultImagePreset = null,
}) {
  return (
    <div className="min-w-0 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {imagePresetLabel}
      </p>

      <div className="mt-[var(--space-3)]">
        {selectedImagePreset.hasSelection ? (
          <div className="flex flex-wrap items-start gap-[var(--space-4)]">
            <div
              className="h-24 w-24 shrink-0 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-cover bg-center"
              style={{
                backgroundImage: `url(${selectedImagePreset.imageUrl})`,
              }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                Image Preset
              </p>
              <p className="mt-[var(--space-1)] break-words text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                {selectedImagePreset.title || selectedImagePresetFallbackTitle}
              </p>
              <p className="mt-[var(--space-2)] line-clamp-2 text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                {selectedImagePreset.description || noDescriptionLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onClearDefaultImagePreset?.()}
              className="cf-btn cf-btn--danger"
              aria-label="Clear default image preset"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        ) : (
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {emptyImagePresetDescription}
          </p>
        )}

        <div className="mt-[var(--space-4)] flex flex-wrap gap-[var(--space-3)]">
          <button
            type="button"
            onClick={() => onPickImagePreset?.()}
            className="cf-btn cf-btn--primary"
          >
            <Sparkles size={14} />
            {selectedImagePreset.buttonLabel || "Select Preset"}
          </button>
        </div>

        {imagePresetHelpText ? (
          <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {imagePresetHelpText}
          </p>
        ) : null}
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
  clothingLabel = "Default Clothing",
  selectedClothing = {},
  emptyClothingDescription = "",
  imagePresetLabel = "Default Image Preset",
  selectedImagePreset = {},
  emptyImagePresetDescription = "",
  imagePresetHelpText = "",
  noDescriptionLabel = "No description.",
  selectedClothingFallbackTitle = "Selected Clothing Source",
  selectedImagePresetFallbackTitle = "Selected Image Preset",
  imageGenerationGuidanceLabel = "Image Generation Guidance",
  negativePromptLabel = "Negative Prompt",
  negativePromptValue = "",
  negativePromptPlaceholder = "",
  negativePromptHelpText = "",
  negativePromptMaxLength = 300,
  onPickOutfit = null,
  onPickWardrobe = null,
  onClearDefaultClothing = null,
  onPickImagePreset = null,
  onClearDefaultImagePreset = null,
  onChangeNegativePrompt = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid min-w-0 gap-4 md:grid-cols-2 [&>*]:min-w-0">
        {skinToneControl}
        {eyeColorControl}
        {hairControl}
        {visualHeritageControl}

        <div className="md:col-span-2 grid min-w-0 gap-[var(--space-5)] xl:grid-cols-2 [&>*]:min-w-0">
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

          <SelectedImagePresetCard
            imagePresetLabel={imagePresetLabel}
            selectedImagePreset={selectedImagePreset}
            emptyImagePresetDescription={emptyImagePresetDescription}
            imagePresetHelpText={imagePresetHelpText}
            noDescriptionLabel={noDescriptionLabel}
            selectedImagePresetFallbackTitle={selectedImagePresetFallbackTitle}
            onPickImagePreset={onPickImagePreset}
            onClearDefaultImagePreset={onClearDefaultImagePreset}
          />
        </div>

        <div className="md:col-span-2 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {imageGenerationGuidanceLabel}
          </p>
          <div className="mt-[var(--space-3)]">
            <TextAreaField
              label={negativePromptLabel}
              value={negativePromptValue}
              onChange={(value) => onChangeNegativePrompt?.(value)}
              placeholder={negativePromptPlaceholder}
              maxLength={negativePromptMaxLength}
              helperText={negativePromptHelpText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
