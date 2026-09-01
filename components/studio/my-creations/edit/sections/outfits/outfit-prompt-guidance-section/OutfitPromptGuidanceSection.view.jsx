import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
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
  negativePromptMaxLength = 300,
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

      <div className="mt-[var(--space-6)] grid gap-[var(--space-5)]">
        <div>
          {/* Tier 4 group label, matching the ActionPanel/SectionTitle
              recipe. */}
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {clothingModeLabel}
          </p>

          <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] md:grid-cols-2">
            {clothingModeOptions.map((option) => (
              // B4 token pair: selected --fill-whisper fill plus
              // --gold-action border and --gold-bright caption; rest
              // is the plain option-rest bed. No gold at rest.
              <button
                key={option.value}
                type="button"
                onClick={() => onClothingModeChange?.(option.value)}
                className={`rounded-[var(--radius-md)] border p-[var(--space-4)] text-left transition ${
                  option.active
                    ? "border-[var(--gold-action)] bg-[var(--fill-whisper)] text-[var(--ink)]"
                    : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] text-[var(--ink-dim)] hover:border-[var(--state-hover-line)] hover:text-[var(--ink)]"
                }`}
              >
                <p
                  className={`text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] ${
                    option.active ? "text-[var(--gold-bright)]" : "text-[var(--ink-faint)]"
                  }`}
                >
                  {option.label}
                </p>
                <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)]">
                  {option.description}
                </p>
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
            maxLength={DEEP_LONGFORM_MAX_LENGTH}
          />
        ) : null}

        {clothingMode === "ADVANCED" ? (
          <div className="grid gap-[var(--space-5)]">
            <TextAreaField
              label={signatureClothingLabel}
              value={signatureClothing}
              onChange={(value) => onSignatureClothingChange?.(value)}
              placeholder={signatureClothingPlaceholder}
              maxLength={SHORT_LONGFORM_MAX_LENGTH}
            />

            {/* Section 5 de-nesting: inset hairline, tier 4 label,
                no bordered/backgrounded box. */}
            <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
              <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                {advancedSectionsTitle}
              </p>
              <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
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
                maxLength={DEEP_LONGFORM_MAX_LENGTH}
              />
            ))}
          </div>
        ) : null}

        <TextAreaField
          label={standalonePromptLabel}
          value={standaloneImagePrompt}
          onChange={(value) => onStandaloneImagePromptChange?.(value)}
          placeholder={standalonePromptPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={negativePromptLabel}
          value={negativePrompt}
          onChange={(value) => onNegativePromptChange?.(value)}
          placeholder={negativePromptPlaceholder}
          maxLength={negativePromptMaxLength}
          helperText="Persistent image-generation guidance. Added automatically whenever this outfit is selected. Max 300 characters."
        />

        <TextAreaField
          label={usageNotesLabel}
          value={usageNotes}
          onChange={(value) => onUsageNotesChange?.(value)}
          placeholder={usageNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={compatibilityNotesLabel}
          value={compatibilityNotes}
          onChange={(value) => onCompatibilityNotesChange?.(value)}
          placeholder={compatibilityNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>
    </div>
  );
}
