import {
  SectionTitle,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
  DEEP_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function LocationVisualDescriptionSectionView({
  sectionEyebrow = "Location Editor",
  sectionTitle = "Visual Description",
  sectionDescription = "",
  architectureLabel = "Architecture / Structure",
  architectureValue = "",
  materialsLabel = "Materials",
  materialsValue = "",
  visualMotifsLabel = "Visual Motifs",
  visualMotifsValue = "",
  landmarksLabel = "Landmarks",
  landmarksValue = "",
  layoutLabel = "Layout / Spatial Design",
  layoutValue = "",
  layoutPlaceholder = "",
  designNotesLabel = "Design Notes",
  designNotesValue = "",
  designNotesPlaceholder = "",
  onChangeArchitecture = null,
  onChangeMaterials = null,
  onChangeVisualMotifs = null,
  onChangeLandmarks = null,
  onChangeLayout = null,
  onChangeDesignNotes = null,
} = {}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField
          label={architectureLabel}
          value={architectureValue}
          onChange={(value) => onChangeArchitecture?.(value)}
        />

        <TextField
          label={materialsLabel}
          value={materialsValue}
          onChange={(value) => onChangeMaterials?.(value)}
        />

        <TextField
          label={visualMotifsLabel}
          value={visualMotifsValue}
          onChange={(value) => onChangeVisualMotifs?.(value)}
        />

        <TextField
          label={landmarksLabel}
          value={landmarksValue}
          onChange={(value) => onChangeLandmarks?.(value)}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={layoutLabel}
            value={layoutValue}
            onChange={(value) => onChangeLayout?.(value)}
            placeholder={layoutPlaceholder}
            maxLength={DEEP_LONGFORM_MAX_LENGTH}
          />
        </div>

        <div className="md:col-span-2">
          <TextAreaField
            label={designNotesLabel}
            value={designNotesValue}
            onChange={(value) => onChangeDesignNotes?.(value)}
            placeholder={designNotesPlaceholder}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </div>
  );
}
