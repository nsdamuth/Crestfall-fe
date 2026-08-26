import {
  SectionTitle,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function CharacterAdvancedSectionView({
  sectionEyebrow = "Optional",
  sectionTitle = "Advanced Guidance",
  sectionDescription = "",
  greetingLabel = "Greeting",
  greetingValue = "",
  greetingPlaceholder = "",
  onChangeGreeting = null,
  scenarioLabel = "Scenario",
  scenarioValue = "",
  scenarioPlaceholder = "",
  onChangeScenario = null,
  relationshipLabel = "Relationship to Player",
  relationshipValue = "",
  relationshipPlaceholder = "",
  onChangeRelationship = null,
  backstoryLabel = "Backstory",
  backstoryValue = "",
  backstoryPlaceholder = "",
  onChangeBackstory = null,
  appearanceNotesLabel = "Appearance Notes",
  appearanceNotesValue = "",
  appearanceNotesPlaceholder = "",
  onChangeAppearanceNotes = null,
  personalityNotesLabel = "Personality Notes",
  personalityNotesValue = "",
  personalityNotesPlaceholder = "",
  onChangePersonalityNotes = null,
  runtimeNotesLabel = "Extra Runtime Notes",
  runtimeNotesValue = "",
  runtimeNotesPlaceholder = "",
  onChangeRuntimeNotes = null,
  advancedPromptingControl = null,
}) {
  return (
    <div className="min-w-0 max-w-full">
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid min-w-0 max-w-full gap-[var(--space-4)] [&>*]:min-w-0">
        <TextAreaField
          label={greetingLabel}
          value={greetingValue}
          onChange={(value) => onChangeGreeting?.(value)}
          placeholder={greetingPlaceholder}
        />

        <TextAreaField
          label={scenarioLabel}
          value={scenarioValue}
          onChange={(value) => onChangeScenario?.(value)}
          placeholder={scenarioPlaceholder}
        />

        <TextAreaField
          label={relationshipLabel}
          value={relationshipValue}
          onChange={(value) => onChangeRelationship?.(value)}
          placeholder={relationshipPlaceholder}
        />

        <TextAreaField
          label={backstoryLabel}
          value={backstoryValue}
          onChange={(value) => onChangeBackstory?.(value)}
          placeholder={backstoryPlaceholder}
        />

        <TextAreaField
          label={appearanceNotesLabel}
          value={appearanceNotesValue}
          onChange={(value) => onChangeAppearanceNotes?.(value)}
          placeholder={appearanceNotesPlaceholder}
        />

        <TextAreaField
          label={personalityNotesLabel}
          value={personalityNotesValue}
          onChange={(value) => onChangePersonalityNotes?.(value)}
          placeholder={personalityNotesPlaceholder}
        />

        <TextAreaField
          label={runtimeNotesLabel}
          value={runtimeNotesValue}
          onChange={(value) => onChangeRuntimeNotes?.(value)}
          placeholder={runtimeNotesPlaceholder}
        />

        {advancedPromptingControl}
      </div>
    </div>
  );
}
