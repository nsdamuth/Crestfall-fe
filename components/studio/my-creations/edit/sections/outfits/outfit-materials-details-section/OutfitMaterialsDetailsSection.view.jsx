import {
  SectionTitle,
  TextAreaField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function OutfitMaterialsDetailsSectionView({
  sectionEyebrow = "Outfit Editor",
  sectionTitle = "Materials & Details",
  sectionDescription = "",
  mainColorsLabel = "Main Colors",
  mainColorsValue = "",
  accentColorsLabel = "Accent Colors",
  accentColorsValue = "",
  materialsLabel = "Materials",
  materialsValue = "",
  accessoriesLabel = "Accessories",
  accessoriesValue = "",
  detailsLabel = "Trim / Details",
  detailsValue = "",
  detailsPlaceholder = "",
  armorNotesLabel = "Armor / Protection Notes",
  armorNotesValue = "",
  armorNotesPlaceholder = "",
  onChangeMainColors = null,
  onChangeAccentColors = null,
  onChangeMaterials = null,
  onChangeAccessories = null,
  onChangeDetails = null,
  onChangeArmorNotes = null,
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
          label={mainColorsLabel}
          value={mainColorsValue}
          onChange={(value) => onChangeMainColors?.(value)}
        />

        <TextField
          label={accentColorsLabel}
          value={accentColorsValue}
          onChange={(value) => onChangeAccentColors?.(value)}
        />

        <TextField
          label={materialsLabel}
          value={materialsValue}
          onChange={(value) => onChangeMaterials?.(value)}
        />

        <TextField
          label={accessoriesLabel}
          value={accessoriesValue}
          onChange={(value) => onChangeAccessories?.(value)}
        />

        <div className="md:col-span-2">
          <TextAreaField
            label={detailsLabel}
            value={detailsValue}
            onChange={(value) => onChangeDetails?.(value)}
            placeholder={detailsPlaceholder}
          />
        </div>

        <div className="md:col-span-2">
          <TextAreaField
            label={armorNotesLabel}
            value={armorNotesValue}
            onChange={(value) => onChangeArmorNotes?.(value)}
            placeholder={armorNotesPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
