import {
  SectionTitle,
  SelectField,
  TextAreaField,
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
  decisionPrioritiesControl = null,
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
    <div className="min-w-0 max-w-full">
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid min-w-0 max-w-full gap-4 md:grid-cols-2 [&>*]:min-w-0">
        {outwardPersonalityControl}
        {internalPersonalityControl}

        {/* Section 5: no second bordered depth inside a box. */}
        <div className="md:col-span-2 border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {personalityFrameworksEyebrow}
          </p>
          <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {personalityFrameworksDescription}
          </p>

          <div className="mt-[var(--space-4)] grid gap-[var(--space-4)] md:grid-cols-3">
            {mbtiControl}
            {westernZodiacControl}
            {eastAsianZodiacControl}
          </div>
        </div>

        {speechStyleControl}
        {movementStyleControl}
        {voiceModulesControl}

        <SelectField
          label={verbosityLabel}
          value={verbosityValue}
          onChange={(value) => onSelectVerbosity?.(value)}
          options={verbosityOptions}
          helperText={verbosityDescription}
        />

        {interestsControl}

        {decisionPrioritiesControl ? (
          <div className="md:col-span-2">{decisionPrioritiesControl}</div>
        ) : null}

        <div className="md:col-span-2">
          <TextAreaField
            label={philosophyLabel}
            value={philosophyValue}
            onChange={(value) => onChangePhilosophy?.(value)}
            placeholder={philosophyPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
