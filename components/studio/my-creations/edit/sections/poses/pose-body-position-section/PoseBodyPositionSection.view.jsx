import {
  SectionTitle,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function PoseBodyPositionSectionView({
  sectionEyebrow = "Pose Editor",
  sectionTitle = "Body Position",
  sectionDescription = "",
  postureLabel = "Posture",
  postureValue = "",
  bodyOrientationLabel = "Body Orientation",
  bodyOrientationValue = "",
  armHandPositionLabel = "Arm / Hand Position",
  armHandPositionValue = "",
  legFootPositionLabel = "Leg / Foot Position",
  legFootPositionValue = "",
  facialExpressionLabel = "Facial Expression",
  facialExpressionValue = "",
  balanceWeightLabel = "Balance / Weight",
  balanceWeightValue = "",
  bodyPositionNotesLabel = "Body Position Notes",
  bodyPositionNotesValue = "",
  bodyPositionNotesPlaceholder = "",
  onChangePosture = null,
  onChangeBodyOrientation = null,
  onChangeArmHandPosition = null,
  onChangeLegFootPosition = null,
  onChangeFacialExpression = null,
  onChangeBalanceWeight = null,
  onChangeBodyPositionNotes = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField
          label={postureLabel}
          value={postureValue}
          onChange={(value) => onChangePosture?.(value)}
        />

        <TextField
          label={bodyOrientationLabel}
          value={bodyOrientationValue}
          onChange={(value) => onChangeBodyOrientation?.(value)}
        />

        <TextField
          label={armHandPositionLabel}
          value={armHandPositionValue}
          onChange={(value) => onChangeArmHandPosition?.(value)}
        />

        <TextField
          label={legFootPositionLabel}
          value={legFootPositionValue}
          onChange={(value) => onChangeLegFootPosition?.(value)}
        />

        <TextField
          label={facialExpressionLabel}
          value={facialExpressionValue}
          onChange={(value) => onChangeFacialExpression?.(value)}
        />

        <TextField
          label={balanceWeightLabel}
          value={balanceWeightValue}
          onChange={(value) => onChangeBalanceWeight?.(value)}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={bodyPositionNotesLabel}
            value={bodyPositionNotesValue}
            onChange={(value) => onChangeBodyPositionNotes?.(value)}
            placeholder={bodyPositionNotesPlaceholder}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </div>
  );
}
