import {
  SectionTitle,
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
  energyLevelLabel = "Energy Level",
  energyLevelValue = "",
  viewerRelationLabel = "Viewer Relation",
  viewerRelationValue = "",
  propInteractionLabel = "Prop Interaction",
  propInteractionValue = "",
  sceneFitLabel = "Scene Fit",
  sceneFitValue = "",
  moodAttitudeLabel = "Mood / Attitude",
  moodAttitudeValue = "",
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
        />

        <TextField
          label={energyLevelLabel}
          value={energyLevelValue}
          onChange={(value) => onChangeEnergyLevel?.(value)}
        />

        <TextField
          label={viewerRelationLabel}
          value={viewerRelationValue}
          onChange={(value) => onChangeViewerRelation?.(value)}
        />

        <TextField
          label={propInteractionLabel}
          value={propInteractionValue}
          onChange={(value) => onChangePropInteraction?.(value)}
        />

        <TextField
          label={sceneFitLabel}
          value={sceneFitValue}
          onChange={(value) => onChangeSceneFit?.(value)}
        />

        <TextField
          label={moodAttitudeLabel}
          value={moodAttitudeValue}
          onChange={(value) => onChangeMoodAttitude?.(value)}
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
