import {
  SectionTitle,
  TextAreaField,
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

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label={promptGuidanceLabel}
          value={promptGuidanceValue}
          onChange={(value) => onChangePromptGuidance?.(value)}
          placeholder={promptGuidancePlaceholder}
        />

        <TextAreaField
          label={stylePromptLabel}
          value={stylePromptValue}
          onChange={(value) => onChangeStylePrompt?.(value)}
          placeholder={stylePromptPlaceholder}
        />

        <TextAreaField
          label={qualityNotesLabel}
          value={qualityNotesValue}
          onChange={(value) => onChangeQualityNotes?.(value)}
          placeholder={qualityNotesPlaceholder}
        />

        <TextAreaField
          label={imagePromptLabel}
          value={imagePromptValue}
          onChange={(value) => onChangeImagePrompt?.(value)}
          placeholder={imagePromptPlaceholder}
        />

        <TextAreaField
          label={negativePromptLabel}
          value={negativePromptValue}
          onChange={(value) => onChangeNegativePrompt?.(value)}
          placeholder={negativePromptPlaceholder}
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
      </div>
    </div>
  );
}
