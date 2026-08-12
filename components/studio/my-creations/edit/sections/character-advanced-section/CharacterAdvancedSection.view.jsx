import {
  SectionTitle,
  TextAreaField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
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
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-5">
        <TextAreaField
          label={greetingLabel}
          value={greetingValue}
          onChange={(value) => onChangeGreeting?.(value)}
          placeholder={greetingPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={scenarioLabel}
          value={scenarioValue}
          onChange={(value) => onChangeScenario?.(value)}
          placeholder={scenarioPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={relationshipLabel}
          value={relationshipValue}
          onChange={(value) => onChangeRelationship?.(value)}
          placeholder={relationshipPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={backstoryLabel}
          value={backstoryValue}
          onChange={(value) => onChangeBackstory?.(value)}
          placeholder={backstoryPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={appearanceNotesLabel}
          value={appearanceNotesValue}
          onChange={(value) => onChangeAppearanceNotes?.(value)}
          placeholder={appearanceNotesPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={personalityNotesLabel}
          value={personalityNotesValue}
          onChange={(value) => onChangePersonalityNotes?.(value)}
          placeholder={personalityNotesPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        <TextAreaField
          label={runtimeNotesLabel}
          value={runtimeNotesValue}
          onChange={(value) => onChangeRuntimeNotes?.(value)}
          placeholder={runtimeNotesPlaceholder}
          maxLength={DEEP_LONGFORM_MAX_LENGTH}
        />

        {advancedPromptingControl}
      </div>
    </div>
  );
}
