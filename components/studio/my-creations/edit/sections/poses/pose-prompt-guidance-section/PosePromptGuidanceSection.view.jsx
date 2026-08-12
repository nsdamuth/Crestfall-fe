import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function PosePromptGuidanceSectionView({
  sectionEyebrow = "Pose Editor",
  sectionTitle = "Prompt Guidance",
  sectionDescription = "",
  promptGuidanceLabel = "Prompt Guidance",
  promptGuidanceValue = "",
  promptGuidancePlaceholder = "",
  usageNotesLabel = "Usage Notes",
  usageNotesValue = "",
  usageNotesPlaceholder = "",
  compatibilityNotesLabel = "Compatibility Notes",
  compatibilityNotesValue = "",
  compatibilityNotesPlaceholder = "",
  onChangePromptGuidance = null,
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
