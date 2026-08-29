import {
  ReadOnlyField,
  SectionTitle,
  SelectField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function CharacterIdentitySectionView({
  sectionEyebrow = "Creation Editor",
  sectionTitle = "Identity",
  sectionDescription = "",
  characterNameLabel = "Character Name",
  characterNameValue = "",
  characterTitleLabel = "Character Title",
  characterTitleValue = "",
  speciesLabel = "Species",
  speciesValue = "",
  speciesOptions = [],
  showCustomSpecies = false,
  customSpeciesLabel = "Custom Species",
  customSpeciesValue = "",
  customIdentityMaxLength = 0,
  renderingStyleLabel = "Default Rendering Style",
  renderingStyleValue = "EITHER",
  renderingStyleOptions = [],
  defaultImagePresetLabel = "Default Image Preset",
  defaultImagePresetValue = "AUTO",
  defaultImagePresetOptions = [],
  defaultImagePresetHelpText = "",
  ageLabel = "Age",
  ageValue = "",
  ageMinimum = 18,
  agePlaceholder = "18+",
  ageHelpText = "",
  genderPresentationLabel = "Gender Presentation",
  genderPresentationValue = "",
  genderPresentationOptions = [],
  showCustomGenderPresentation = false,
  customGenderPresentationLabel = "Custom Gender Presentation",
  customGenderPresentationValue = "",
  colorPaletteControl = null,
  roleArchetypeControl = null,
  creationTypeLabel = "Creation Type",
  creationTypeValue = "",
  onChangeCharacterName = null,
  onChangeCharacterTitle = null,
  onSelectSpecies = null,
  onChangeCustomSpecies = null,
  onSelectRenderingStyle = null,
  onSelectDefaultImagePreset = null,
  onChangeAge = null,
  onCommitAge = null,
  onSelectGenderPresentation = null,
  onChangeCustomGenderPresentation = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid min-w-0 max-w-full gap-4 md:grid-cols-2 [&>*]:min-w-0 [&>*]:max-w-full">
        <TextField
          label={characterNameLabel}
          value={characterNameValue}
          onChange={(value) => onChangeCharacterName?.(value)}
        />

        <TextField
          label={characterTitleLabel}
          value={characterTitleValue}
          onChange={(value) => onChangeCharacterTitle?.(value)}
        />

        <div className="space-y-4">
          <SelectField
            label={speciesLabel}
            value={speciesValue}
            onChange={(value) => onSelectSpecies?.(value)}
            options={speciesOptions}
          />

          {showCustomSpecies ? (
            <TextField
              label={customSpeciesLabel}
              value={customSpeciesValue}
              onChange={(value) => onChangeCustomSpecies?.(value)}
              maxLength={customIdentityMaxLength || undefined}
            />
          ) : null}
        </div>

        <SelectField
          label={renderingStyleLabel}
          value={renderingStyleValue}
          onChange={(value) => onSelectRenderingStyle?.(value)}
          options={renderingStyleOptions}
        />

        <SelectField
          label={defaultImagePresetLabel}
          value={defaultImagePresetValue}
          onChange={(value) => onSelectDefaultImagePreset?.(value)}
          options={defaultImagePresetOptions}
          helperText={defaultImagePresetHelpText}
        />

        {/* Local field bed, not SharedFields.NumberField (ED1E 4.2):
            this field needs both a per-keystroke onChangeAge and a
            separate onBlur-time onCommitAge, which NumberField does
            not expose. The bed below mirrors NumberField's recipe
            exactly (tier 5 label, --surface-1 bed, --space-1/-2
            spacing, right-aligned tabular-nums, no local focus mark)
            so it reads identically to every other number field on
            the page. */}
        <label className="block min-w-0 max-w-full">
          <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {ageLabel}
          </span>

          <input
            type="number"
            min={ageMinimum}
            inputMode="numeric"
            value={ageValue}
            onChange={(event) => onChangeAge?.(event.target.value)}
            onBlur={(event) => onCommitAge?.(event.target.value)}
            placeholder={agePlaceholder}
            className="mt-[var(--space-1)] w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-right text-[length:var(--text-body)] leading-[var(--lh-body)] tabular-nums text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]"
          />

          {ageHelpText ? (
            <p className="mt-[var(--space-2)] max-w-full break-words text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {ageHelpText}
            </p>
          ) : null}
        </label>

        <div className="space-y-4">
          <SelectField
            label={genderPresentationLabel}
            value={genderPresentationValue}
            onChange={(value) => onSelectGenderPresentation?.(value)}
            options={genderPresentationOptions}
          />

          {showCustomGenderPresentation ? (
            <TextField
              label={customGenderPresentationLabel}
              value={customGenderPresentationValue}
              onChange={(value) =>
                onChangeCustomGenderPresentation?.(value)
              }
              maxLength={customIdentityMaxLength || undefined}
            />
          ) : null}
        </div>

        {colorPaletteControl ? (
          <div className="md:col-span-2">{colorPaletteControl}</div>
        ) : null}

        {roleArchetypeControl ? (
          <div className="md:col-span-2">{roleArchetypeControl}</div>
        ) : null}

        <ReadOnlyField
          label={creationTypeLabel}
          value={creationTypeValue}
        />
      </div>
    </div>
  );
}
