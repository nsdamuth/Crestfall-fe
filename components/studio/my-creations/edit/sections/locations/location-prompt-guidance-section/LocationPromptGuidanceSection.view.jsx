import {
  SectionTitle,
  TextAreaField,
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
  imagePromptMaxLength = 2000,
  negativePromptLabel = "Negative Prompt",
  negativePromptValue = "",
  negativePromptPlaceholder = "",
  negativePromptMaxLength = 2000,
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

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label={promptGuidanceLabel}
          value={promptGuidanceValue}
          onChange={(value) => onChangePromptGuidance?.(value)}
          placeholder={promptGuidancePlaceholder}
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
        />

        <TextAreaField
          label={usageNotesLabel}
          value={usageNotesValue}
          onChange={(value) => onChangeUsageNotes?.(value)}
          placeholder={usageNotesPlaceholder}
        />

        <TextAreaField
          label={compatibilityNotesLabel}
          value={compatibilityNotesValue}
          onChange={(value) => onChangeCompatibilityNotes?.(value)}
          placeholder={compatibilityNotesPlaceholder}
        />

        <TextAreaField
          label={registryNotesLabel}
          value={registryNotesValue}
          onChange={(value) => onChangeRegistryNotes?.(value)}
          placeholder={registryNotesPlaceholder}
        />
      </div>
    </div>
  );
}
