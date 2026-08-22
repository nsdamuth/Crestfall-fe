import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ImagePresetPromptStackSectionView({
  sectionEyebrow = "Image Preset Editor",
  sectionTitle = "Prompt Stack",
  sectionDescription = "",
  promptGuidanceLabel = "Prompt Guidance",
  promptGuidanceValue = "",
  promptGuidancePlaceholder = "",
  stylePromptLabel = "Style Prompt",
  stylePromptValue = "",
  stylePromptPlaceholder = "",
  qualityNotesLabel = "Quality / Polish Notes",
  qualityNotesValue = "",
  qualityNotesPlaceholder = "",
  imagePromptLabel = "Standalone Image Prompt",
  imagePromptValue = "",
  imagePromptPlaceholder = "",
  negativePromptLabel = "Negative Prompt",
  negativePromptValue = "",
  negativePromptPlaceholder = "",
  usageNotesLabel = "Usage Notes",
  usageNotesValue = "",
  usageNotesPlaceholder = "",
  compatibilityNotesLabel = "Compatibility Notes",
  compatibilityNotesValue = "",
  compatibilityNotesPlaceholder = "",
  onChangePromptGuidance = null,
  onChangeStylePrompt = null,
  onChangeQualityNotes = null,
  onChangeImagePrompt = null,
  onChangeNegativePrompt = null,
  onChangeUsageNotes = null,
  onChangeCompatibilityNotes = null,
}) {
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
          label={stylePromptLabel}
          value={stylePromptValue}
          onChange={(value) => onChangeStylePrompt?.(value)}
          placeholder={stylePromptPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={qualityNotesLabel}
          value={qualityNotesValue}
          onChange={(value) => onChangeQualityNotes?.(value)}
          placeholder={qualityNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={imagePromptLabel}
          value={imagePromptValue}
          onChange={(value) => onChangeImagePrompt?.(value)}
          placeholder={imagePromptPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={negativePromptLabel}
          value={negativePromptValue}
          onChange={(value) => onChangeNegativePrompt?.(value)}
          placeholder={negativePromptPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

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
      </div>
    </div>
  );
}
