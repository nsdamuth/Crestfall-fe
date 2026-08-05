import {
  SectionTitle,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function OutfitPromptGuidanceSectionView({
  sectionEyebrow = "Outfit Editor",
  sectionTitle = "Prompt Guidance",
  sectionDescription = "",
  clothingModeLabel = "Clothing Mode",
  clothingMode = "NORMAL",
  clothingModeOptions = [],
  normalPromptLabel = "Normal Clothing Prompt",
  normalClothingPrompt = "",
  normalPromptPlaceholder = "",
  signatureClothingLabel = "Signature / Always-Include Clothing",
  signatureClothing = "",
  signatureClothingPlaceholder = "",
  advancedSectionsTitle = "Advanced Clothing Sections",
  advancedSectionsDescription = "",
  clothingSections = [],
  standalonePromptLabel = "Standalone Image Prompt",
  standaloneImagePrompt = "",
  standalonePromptPlaceholder = "",
  negativePromptLabel = "Negative Prompt",
  negativePrompt = "",
  negativePromptPlaceholder = "",
  usageNotesLabel = "Usage Notes",
  usageNotes = "",
  usageNotesPlaceholder = "",
  compatibilityNotesLabel = "Compatibility Notes",
  compatibilityNotes = "",
  compatibilityNotesPlaceholder = "",
  onClothingModeChange = null,
  onNormalClothingPromptChange = null,
  onSignatureClothingChange = null,
  onClothingSectionChange = null,
  onStandaloneImagePromptChange = null,
  onNegativePromptChange = null,
  onUsageNotesChange = null,
  onCompatibilityNotesChange = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            {clothingModeLabel}
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {clothingModeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onClothingModeChange?.(option.value)}
                className={`rounded-[var(--radius-md)] border p-4 text-left transition ${
                  option.active
                    ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                  {option.label}
                </p>
                <p className="mt-2 text-sm leading-6">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {clothingMode === "NORMAL" ? (
          <TextAreaField
            label={normalPromptLabel}
            value={normalClothingPrompt}
            onChange={(value) => onNormalClothingPromptChange?.(value)}
            placeholder={normalPromptPlaceholder}
            rows={8}
          />
        ) : null}

        {clothingMode === "ADVANCED" ? (
          <div className="grid gap-5">
            <TextAreaField
              label={signatureClothingLabel}
              value={signatureClothing}
              onChange={(value) => onSignatureClothingChange?.(value)}
              placeholder={signatureClothingPlaceholder}
              rows={4}
            />

            <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                {advancedSectionsTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {advancedSectionsDescription}
              </p>
            </div>

            {clothingSections.map((field) => (
              <TextAreaField
                key={field.id}
                label={field.label}
                value={field.value}
                onChange={(value) =>
                  onClothingSectionChange?.(field.id, value)
                }
                placeholder={field.placeholder}
                rows={4}
              />
            ))}
          </div>
        ) : null}

        <TextAreaField
          label={standalonePromptLabel}
          value={standaloneImagePrompt}
          onChange={(value) => onStandaloneImagePromptChange?.(value)}
          placeholder={standalonePromptPlaceholder}
          rows={5}
        />

        <TextAreaField
          label={negativePromptLabel}
          value={negativePrompt}
          onChange={(value) => onNegativePromptChange?.(value)}
          placeholder={negativePromptPlaceholder}
          rows={5}
        />

        <TextAreaField
          label={usageNotesLabel}
          value={usageNotes}
          onChange={(value) => onUsageNotesChange?.(value)}
          placeholder={usageNotesPlaceholder}
        />

        <TextAreaField
          label={compatibilityNotesLabel}
          value={compatibilityNotes}
          onChange={(value) => onCompatibilityNotesChange?.(value)}
          placeholder={compatibilityNotesPlaceholder}
        />
      </div>
    </div>
  );
}
