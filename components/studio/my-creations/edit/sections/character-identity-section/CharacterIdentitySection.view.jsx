import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  ReadOnlyField,
  SectionTitle,
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
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
          <CrestfallSelect
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

        <CrestfallSelect
          label={renderingStyleLabel}
          value={renderingStyleValue}
          onChange={(value) => onSelectRenderingStyle?.(value)}
          options={renderingStyleOptions}
        />

        <label className="block">
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
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
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
          />

          {ageHelpText ? (
            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              {ageHelpText}
            </p>
          ) : null}
        </label>

        <div className="space-y-4">
          <CrestfallSelect
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
