import {
  SectionTitle,
  TextAreaField,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function NarratorGuidanceSectionView({
  sectionEyebrow = "Narrator Editor",
  sectionTitle = "Narrator Guidance",
  sectionDescription = "",
  guidanceLabel = "Narrator Guidance",
  guidanceValue = "",
  guidancePlaceholder = "",
  avoidGuidanceLabel = "Avoid Guidance",
  avoidGuidanceValue = "",
  avoidGuidancePlaceholder = "",
  presentationPrioritiesControl = null,
  narratorDirectivesControl = null,
  onChangeGuidance = null,
  onChangeAvoidGuidance = null,
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
          label={guidanceLabel}
          value={guidanceValue}
          onChange={(value) => onChangeGuidance?.(value)}
          placeholder={guidancePlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={avoidGuidanceLabel}
          value={avoidGuidanceValue}
          onChange={(value) => onChangeAvoidGuidance?.(value)}
          placeholder={avoidGuidancePlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        {presentationPrioritiesControl ? (
          <div className="mt-2">{presentationPrioritiesControl}</div>
        ) : null}

        {narratorDirectivesControl ? (
          <div className="mt-2">{narratorDirectivesControl}</div>
        ) : null}
      </div>
    </div>
  );
}
