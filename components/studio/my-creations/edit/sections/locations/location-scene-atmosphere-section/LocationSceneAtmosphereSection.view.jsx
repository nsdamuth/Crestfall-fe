import {
  SectionTitle,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function LocationSceneAtmosphereSectionView({
  sectionEyebrow,
  sectionTitle,
  sectionDescription,
  moodLabel,
  moodValue,
  lightingLabel,
  lightingValue,
  timeOfDayLabel,
  timeOfDayValue,
  weatherLabel,
  weatherValue,
  activityLevelLabel,
  activityLevelValue,
  populationPresenceLabel,
  populationPresenceValue,
  sensoryNotesLabel,
  sensoryNotesValue,
  sensoryNotesPlaceholder,
  sensoryEnvironmentSlot = null,
  sensoryEnvironmentFallbackText,
  onChangeMood = () => {},
  onChangeLighting = () => {},
  onChangeTimeOfDay = () => {},
  onChangeWeather = () => {},
  onChangeActivityLevel = () => {},
  onChangePopulationPresence = () => {},
  onChangeSensoryNotes = () => {},
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)] md:grid-cols-2">
        <TextField
          label={moodLabel}
          value={moodValue}
          onChange={onChangeMood}
        />

        <TextField
          label={lightingLabel}
          value={lightingValue}
          onChange={onChangeLighting}
        />

        <TextField
          label={timeOfDayLabel}
          value={timeOfDayValue}
          onChange={onChangeTimeOfDay}
        />

        <TextField
          label={weatherLabel}
          value={weatherValue}
          onChange={onChangeWeather}
        />

        <TextField
          label={activityLevelLabel}
          value={activityLevelValue}
          onChange={onChangeActivityLevel}
        />

        <TextField
          label={populationPresenceLabel}
          value={populationPresenceValue}
          onChange={onChangePopulationPresence}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={sensoryNotesLabel}
            value={sensoryNotesValue}
            onChange={onChangeSensoryNotes}
            placeholder={sensoryNotesPlaceholder}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>

      <div className="mt-[var(--space-6)]">
        {sensoryEnvironmentSlot || (
          // CLEANUP fix: SlotFallback panel retired for plain helper
          // text (matches the same helper's fix in
          // location-runtime-modules-section).
          <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {sensoryEnvironmentFallbackText}
          </p>
        )}
      </div>
    </div>
  );
}
