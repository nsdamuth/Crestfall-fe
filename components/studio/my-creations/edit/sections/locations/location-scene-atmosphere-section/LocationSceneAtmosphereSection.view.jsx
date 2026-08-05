import {
  SectionTitle,
  TextAreaField,
  TextField,
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
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
          />
        </div>
      </div>

      <div className="mt-6">
        {sensoryEnvironmentSlot || (
          <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/20 p-5 text-sm leading-6 text-[var(--ink-dim)]">
            {sensoryEnvironmentFallbackText}
          </div>
        )}
      </div>
    </div>
  );
}
