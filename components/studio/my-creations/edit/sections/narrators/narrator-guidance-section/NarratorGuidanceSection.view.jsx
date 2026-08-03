import {
  SectionTitle,
  TextAreaField,
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
        />

        <TextAreaField
          label={avoidGuidanceLabel}
          value={avoidGuidanceValue}
          onChange={(value) => onChangeAvoidGuidance?.(value)}
          placeholder={avoidGuidancePlaceholder}
        />
      </div>
    </div>
  );
}
