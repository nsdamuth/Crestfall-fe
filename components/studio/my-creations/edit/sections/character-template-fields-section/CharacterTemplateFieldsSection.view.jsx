import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  ReadOnlyField,
  SectionTitle,
  TextAreaField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function CharacterTemplateFieldsSectionView({
  activeSection = "template",
  sectionEyebrow = "Character Template Editor",
  sectionTitle = "Template Info",
  sectionDescription = "",
  templateNameLabel = "Template Name",
  templateNameValue = "",
  categoryLabel = "Category",
  categoryValue = "",
  shortDescriptionLabel = "Short Description",
  shortDescriptionValue = "",
  shortDescriptionPlaceholder = "",
  tagsLabel = "Tags",
  tagsValue = "",
  creationTypeLabel = "Creation Type",
  creationTypeValue = "",
  appliesToLabel = "Applies To",
  appliesToValue = "New characters only",
  defaultNameLabel = "Default Name",
  defaultNameValue = "",
  defaultTitleLabel = "Default Title",
  defaultTitleValue = "",
  speciesLabel = "Species",
  speciesValue = "",
  speciesOptions = [],
  genderPresentationLabel = "Gender Presentation",
  genderPresentationValue = "",
  genderPresentationOptions = [],
  roleArchetypeControl = null,
  skinToneControl = null,
  eyeColorControl = null,
  hairColorControl = null,
  hairStyleControl = null,
  clothingStyleLabel = "Clothing Style",
  clothingStyleValue = "",
  kibbePresetControl = null,
  bodyTypeControl = null,
  heightControl = null,
  buildControl = null,
  proportionsControl = null,
  bodyNotesLabel = "Custom Body Notes",
  bodyNotesValue = "",
  bodyNotesPlaceholder = "",
  outwardPersonalityControl = null,
  internalPersonalityControl = null,
  mbtiControl = null,
  westernZodiacControl = null,
  eastAsianZodiacControl = null,
  speechStyleControl = null,
  movementStyleControl = null,
  verbosityLabel = "Verbosity",
  verbosityValue = "",
  verbosityOptions = [],
  interestsControl = null,
  philosophyLabel = "Philosophy",
  philosophyValue = "",
  philosophyPlaceholder = "",
  onChangeTemplateName = null,
  onChangeCategory = null,
  onChangeShortDescription = null,
  onChangeTags = null,
  onChangeDefaultName = null,
  onChangeDefaultTitle = null,
  onSelectSpecies = null,
  onSelectGenderPresentation = null,
  onChangeClothingStyle = null,
  onChangeBodyNotes = null,
  onSelectVerbosity = null,
  onChangePhilosophy = null,
} = {}) {
  if (!["template", "identity", "appearance", "body", "behavior"].includes(activeSection)) {
    return null;
  }

  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      {activeSection === "template" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextField
            label={templateNameLabel}
            value={templateNameValue}
            onChange={(value) => onChangeTemplateName?.(value)}
          />

          <TextField
            label={categoryLabel}
            value={categoryValue}
            onChange={(value) => onChangeCategory?.(value)}
          />

          <div className="md:col-span-2">
            <TextAreaField
              label={shortDescriptionLabel}
              value={shortDescriptionValue}
              onChange={(value) => onChangeShortDescription?.(value)}
              placeholder={shortDescriptionPlaceholder}
            />
          </div>

          <div className="md:col-span-2">
            <TextField
              label={tagsLabel}
              value={tagsValue}
              onChange={(value) => onChangeTags?.(value)}
            />
          </div>

          <ReadOnlyField label={creationTypeLabel} value={creationTypeValue} />
          <ReadOnlyField label={appliesToLabel} value={appliesToValue} />
        </div>
      ) : null}

      {activeSection === "identity" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextField
            label={defaultNameLabel}
            value={defaultNameValue}
            onChange={(value) => onChangeDefaultName?.(value)}
          />

          <TextField
            label={defaultTitleLabel}
            value={defaultTitleValue}
            onChange={(value) => onChangeDefaultTitle?.(value)}
          />

          <CrestfallSelect
            label={speciesLabel}
            value={speciesValue}
            onChange={(value) => onSelectSpecies?.(value)}
            options={speciesOptions}
          />

          <CrestfallSelect
            label={genderPresentationLabel}
            value={genderPresentationValue}
            onChange={(value) => onSelectGenderPresentation?.(value)}
            options={genderPresentationOptions}
          />

          {roleArchetypeControl ? (
            <div className="md:col-span-2">{roleArchetypeControl}</div>
          ) : null}
        </div>
      ) : null}

      {activeSection === "appearance" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {skinToneControl}
          {eyeColorControl}
          {hairColorControl}
          {hairStyleControl}

          <div className="md:col-span-2">
            <TextField
              label={clothingStyleLabel}
              value={clothingStyleValue}
              onChange={(value) => onChangeClothingStyle?.(value)}
            />
          </div>
        </div>
      ) : null}

      {activeSection === "body" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {kibbePresetControl ? (
            <div className="md:col-span-2">{kibbePresetControl}</div>
          ) : null}
          {bodyTypeControl}
          {heightControl}
          {buildControl}
          {proportionsControl}

          <div className="md:col-span-2">
            <TextAreaField
              label={bodyNotesLabel}
              value={bodyNotesValue}
              onChange={(value) => onChangeBodyNotes?.(value)}
              placeholder={bodyNotesPlaceholder}
            />
          </div>
        </div>
      ) : null}

      {activeSection === "behavior" ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {outwardPersonalityControl}
          {internalPersonalityControl}

          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              Optional Personality Frameworks
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              These optional defaults provide soft narrative flavor when the
              composer needs more characterization. Explicit personality choices
              and creator guidance always take priority.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {mbtiControl}
              {westernZodiacControl}
              {eastAsianZodiacControl}
            </div>
          </div>

          {speechStyleControl}
          {movementStyleControl}

          <CrestfallSelect
            label={verbosityLabel}
            value={verbosityValue}
            onChange={(value) => onSelectVerbosity?.(value)}
            options={verbosityOptions}
            description="Controls how talkative the character should be during scenes."
          />

          {interestsControl}

          <div className="md:col-span-2">
            <TextAreaField
              label={philosophyLabel}
              value={philosophyValue}
              onChange={(value) => onChangePhilosophy?.(value)}
              placeholder={philosophyPlaceholder}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
