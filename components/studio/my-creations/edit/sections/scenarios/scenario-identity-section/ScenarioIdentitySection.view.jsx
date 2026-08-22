import {
  ReadOnlyField,
  SectionTitle,
  SelectField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ScenarioIdentitySectionView({
  sectionEyebrow = "Scenario Editor",
  sectionTitle = "Scenario Identity",
  sectionDescription = "",
  toneLabel = "Tone",
  toneValue = "",
  toneOptions = [],
  participantModeLabel = "Participant Mode",
  participantModeValue = "FLEXIBLE",
  participantModeOptions = [],
  tagsLabel = "Tags",
  tagsValue = "",
  creationTypeLabel = "Creation Type",
  creationTypeValue = "",
  onSelectTone = null,
  onSelectParticipantMode = null,
  onChangeTags = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)] md:grid-cols-2">
        <SelectField
          label={toneLabel}
          value={toneValue}
          onChange={(value) => onSelectTone?.(value)}
          options={toneOptions}
        />

        <SelectField
          label={participantModeLabel}
          value={participantModeValue}
          onChange={(value) => onSelectParticipantMode?.(value)}
          options={participantModeOptions}
        />

        <TextField
          label={tagsLabel}
          value={tagsValue}
          onChange={(value) => onChangeTags?.(value)}
        />

        <ReadOnlyField
          label={creationTypeLabel}
          value={creationTypeValue}
        />
      </div>
    </div>
  );
}
