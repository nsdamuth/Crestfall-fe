import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function LocationPromptGuidanceSectionView({
  sectionEyebrow = "Location Editor",
  sectionTitle = "Prompt Guidance",
  sectionDescription = "",
  promptGuidanceLabel = "Prompt Guidance",
  promptGuidanceValue = "",
  promptGuidancePlaceholder = "",
  imagePromptLabel = "Standalone Image Prompt",
  imagePromptValue = "",
  imagePromptPlaceholder = "",
  imagePromptMaxLength = DEEP_LONGFORM_MAX_LENGTH,
  negativePromptLabel = "Negative Prompt",
  negativePromptValue = "",
  negativePromptPlaceholder = "",
  negativePromptMaxLength = 300,
  interiorPromptLabel = "Interior Prompt",
  interiorPromptValue = "",
  interiorPromptPlaceholder = "",
  interiorPromptMaxLength = DEEP_LONGFORM_MAX_LENGTH,
  interiorNegativePromptLabel = "Interior Negative Prompt",
  interiorNegativePromptValue = "",
  interiorNegativePromptPlaceholder = "",
  interiorNegativePromptMaxLength = 300,
  exteriorPromptLabel = "Exterior Prompt",
  exteriorPromptValue = "",
  exteriorPromptPlaceholder = "",
  exteriorPromptMaxLength = DEEP_LONGFORM_MAX_LENGTH,
  exteriorNegativePromptLabel = "Exterior Negative Prompt",
  exteriorNegativePromptValue = "",
  exteriorNegativePromptPlaceholder = "",
  exteriorNegativePromptMaxLength = 300,
  usageNotesLabel = "Usage Notes",
  usageNotesValue = "",
  usageNotesPlaceholder = "",
  compatibilityNotesLabel = "Compatibility Notes",
  compatibilityNotesValue = "",
  compatibilityNotesPlaceholder = "",
  registryNotesLabel = "Future Registry Notes",
  registryNotesValue = "",
  registryNotesPlaceholder = "",
  onChangePromptGuidance = null,
  onChangeImagePrompt = null,
  onChangeNegativePrompt = null,
  onChangeInteriorPrompt = null,
  onChangeInteriorNegativePrompt = null,
  onChangeExteriorPrompt = null,
  onChangeExteriorNegativePrompt = null,
  onChangeUsageNotes = null,
  onChangeCompatibilityNotes = null,
  onChangeRegistryNotes = null,
} = {}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)]">
        <TextAreaField
          label={promptGuidanceLabel}
          value={promptGuidanceValue}
          onChange={(value) => onChangePromptGuidance?.(value)}
          placeholder={promptGuidancePlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={imagePromptLabel}
          value={imagePromptValue}
          onChange={(value) => onChangeImagePrompt?.(value)}
          placeholder={imagePromptPlaceholder}
          maxLength={imagePromptMaxLength}
        />

        <TextAreaField
          label={negativePromptLabel}
          value={negativePromptValue}
          onChange={(value) => onChangeNegativePrompt?.(value)}
          placeholder={negativePromptPlaceholder}
          maxLength={negativePromptMaxLength}
          helperText="Persistent image-generation guidance. Added automatically whenever this location is selected. Max 300 characters."
        />

        <div className="grid gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Interior
          </p>
          <TextAreaField
            label={interiorPromptLabel}
            value={interiorPromptValue}
            onChange={(value) => onChangeInteriorPrompt?.(value)}
            placeholder={interiorPromptPlaceholder}
            maxLength={interiorPromptMaxLength}
          />
          <TextAreaField
            label={interiorNegativePromptLabel}
            value={interiorNegativePromptValue}
            onChange={(value) => onChangeInteriorNegativePrompt?.(value)}
            placeholder={interiorNegativePromptPlaceholder}
            maxLength={interiorNegativePromptMaxLength}
          />
        </div>

        <div className="grid gap-[var(--space-4)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Exterior
          </p>
          <TextAreaField
            label={exteriorPromptLabel}
            value={exteriorPromptValue}
            onChange={(value) => onChangeExteriorPrompt?.(value)}
            placeholder={exteriorPromptPlaceholder}
            maxLength={exteriorPromptMaxLength}
          />
          <TextAreaField
            label={exteriorNegativePromptLabel}
            value={exteriorNegativePromptValue}
            onChange={(value) => onChangeExteriorNegativePrompt?.(value)}
            placeholder={exteriorNegativePromptPlaceholder}
            maxLength={exteriorNegativePromptMaxLength}
          />
        </div>

        <TextAreaField
          label={usageNotesLabel}
          value={usageNotesValue}
          onChange={(value) => onChangeUsageNotes?.(value)}
          placeholder={usageNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={compatibilityNotesLabel}
          value={compatibilityNotesValue}
          onChange={(value) => onChangeCompatibilityNotes?.(value)}
          placeholder={compatibilityNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={registryNotesLabel}
          value={registryNotesValue}
          onChange={(value) => onChangeRegistryNotes?.(value)}
          placeholder={registryNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>
    </div>
  );
}
