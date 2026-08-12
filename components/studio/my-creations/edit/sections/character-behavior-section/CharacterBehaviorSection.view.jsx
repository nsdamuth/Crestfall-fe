import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  SectionTitle,
  TextAreaField,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function CharacterBehaviorSectionView({
  sectionEyebrow = "Character Editor",
  sectionTitle = "Behavior",
  sectionDescription = "",
  outwardPersonalityControl = null,
  internalPersonalityControl = null,
  personalityFrameworksEyebrow = "Optional Personality Frameworks",
  personalityFrameworksDescription = "",
  mbtiControl = null,
  westernZodiacControl = null,
  eastAsianZodiacControl = null,
  speechStyleControl = null,
  movementStyleControl = null,
  voiceModulesControl = null,
  verbosityLabel = "Verbosity",
  verbosityValue = "",
  verbosityOptions = [],
  verbosityDescription = "",
  interestsControl = null,
  philosophyLabel = "Philosophy",
  philosophyValue = "",
  philosophyPlaceholder = "",
  onSelectVerbosity = null,
  onChangePhilosophy = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {outwardPersonalityControl}
        {internalPersonalityControl}

        <div className="md:col-span-2 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            {personalityFrameworksEyebrow}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            {personalityFrameworksDescription}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {mbtiControl}
            {westernZodiacControl}
            {eastAsianZodiacControl}
          </div>
        </div>

        {speechStyleControl}
        {movementStyleControl}
        {voiceModulesControl}

        <CrestfallSelect
          label={verbosityLabel}
          value={verbosityValue}
          onChange={(value) => onSelectVerbosity?.(value)}
          options={verbosityOptions}
          description={verbosityDescription}
        />

        {interestsControl}

        <div className="md:col-span-2">
          <TextAreaField
            label={philosophyLabel}
            value={philosophyValue}
            onChange={(value) => onChangePhilosophy?.(value)}
            placeholder={philosophyPlaceholder}
            maxLength={DEEP_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </div>
  );
}
