import {
  SectionTitle,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function OutfitGarmentDesignSectionView({
  sectionEyebrow = "Outfit Editor",
  sectionTitle = "Garment Design",
  sectionDescription = "",
  silhouetteLabel = "Silhouette",
  silhouetteValue = "",
  fitLabel = "Fit",
  fitValue = "",
  coverageLabel = "Coverage",
  coverageValue = "",
  styleLanguageLabel = "Style Language",
  styleLanguageValue = "",
  clothingPiecesLabel = "Clothing Pieces",
  clothingPiecesValue = "",
  clothingPiecesPlaceholder = "",
  designNotesLabel = "Design Notes",
  designNotesValue = "",
  designNotesPlaceholder = "",
  onChangeSilhouette = null,
  onChangeFit = null,
  onChangeCoverage = null,
  onChangeStyleLanguage = null,
  onChangeClothingPieces = null,
  onChangeDesignNotes = null,
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
          label={silhouetteLabel}
          value={silhouetteValue}
          onChange={(value) => onChangeSilhouette?.(value)}
        />

        <TextField
          label={fitLabel}
          value={fitValue}
          onChange={(value) => onChangeFit?.(value)}
        />

        <TextField
          label={coverageLabel}
          value={coverageValue}
          onChange={(value) => onChangeCoverage?.(value)}
        />

        <TextField
          label={styleLanguageLabel}
          value={styleLanguageValue}
          onChange={(value) => onChangeStyleLanguage?.(value)}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={clothingPiecesLabel}
            value={clothingPiecesValue}
            onChange={(value) => onChangeClothingPieces?.(value)}
            placeholder={clothingPiecesPlaceholder}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
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
