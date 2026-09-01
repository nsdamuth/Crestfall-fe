import {
  SectionTitle,
  SelectField,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function PoseMotionStagingSectionView({
  sectionEyebrow = "Pose Editor",
  sectionTitle = "Motion / Staging",
  sectionDescription = "",
  actionMotionLabel = "Action / Motion",
  actionMotionValue = "",
  actionMotionHelper = "",
  energyLevelLabel = "Energy Level",
  energyLevelValue = "",
  energyOptions = [],
  energyLevelHelper = "",
  viewerRelationLabel = "Viewer Relation",
  viewerRelationValue = "",
  viewerRelationOptions = [],
  viewerRelationHelper = "",
  propInteractionLabel = "Prop Interaction",
  propInteractionValue = "",
  propInteractionHelper = "",
  sceneFitLabel = "Scene Fit",
  sceneFitValue = "",
  sceneFitHelper = "",
  moodAttitudeLabel = "Mood / Attitude",
  moodAttitudeValue = "",
  moodAttitudeHelper = "",
  stagingNotesLabel = "Staging Notes",
  stagingNotesValue = "",
  stagingNotesPlaceholder = "",
  onChangeActionMotion = null,
  onChangeEnergyLevel = null,
  onChangeViewerRelation = null,
  onChangePropInteraction = null,
  onChangeSceneFit = null,
  onChangeMoodAttitude = null,
  onChangeStagingNotes = null,
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
          label={actionMotionLabel}
          value={actionMotionValue}
          onChange={(value) => onChangeActionMotion?.(value)}
          helperText={actionMotionHelper}
        />

        <SelectField
          label={energyLevelLabel}
          value={energyLevelValue}
          onChange={(value) => onChangeEnergyLevel?.(value)}
          options={energyOptions}
          helperText={energyLevelHelper}
        />

        <SelectField
          label={viewerRelationLabel}
          value={viewerRelationValue}
          onChange={(value) => onChangeViewerRelation?.(value)}
          options={viewerRelationOptions}
          helperText={viewerRelationHelper}
        />

        <TextField
          label={propInteractionLabel}
          value={propInteractionValue}
          onChange={(value) => onChangePropInteraction?.(value)}
          helperText={propInteractionHelper}
        />

        <TextField
          label={sceneFitLabel}
          value={sceneFitValue}
          onChange={(value) => onChangeSceneFit?.(value)}
          helperText={sceneFitHelper}
        />

        <TextField
          label={moodAttitudeLabel}
          value={moodAttitudeValue}
          onChange={(value) => onChangeMoodAttitude?.(value)}
          helperText={moodAttitudeHelper}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={stagingNotesLabel}
            value={stagingNotesValue}
            onChange={(value) => onChangeStagingNotes?.(value)}
            placeholder={stagingNotesPlaceholder}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </div>
  );
}
