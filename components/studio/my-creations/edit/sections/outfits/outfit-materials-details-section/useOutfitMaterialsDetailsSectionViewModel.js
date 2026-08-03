const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Materials & Details",
  sectionDescription:
    "Define fabrics, colors, trim, accessories, armor, and small visual details that should stay consistent.",
  mainColorsLabel: "Main Colors",
  accentColorsLabel: "Accent Colors",
  materialsLabel: "Materials",
  accessoriesLabel: "Accessories",
  detailsLabel: "Trim / Details",
  detailsPlaceholder:
    "Describe embroidery, buckles, seams, clasps, straps, buttons, jewelry, insignia, etc.",
  armorNotesLabel: "Armor / Protection Notes",
  armorNotesPlaceholder:
    "Optional armor, padding, plates, reinforced areas, or protective elements.",
});

export function getOutfitMaterialsDetailsSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};

  return {
    ...DEFAULT_COPY,
    mainColorsValue: data.main_colors || data.colors || "",
    accentColorsValue: data.accent_colors || "",
    materialsValue: data.materials || "",
    accessoriesValue: data.accessories || "",
    detailsValue: data.details || data.trim_details || "",
    armorNotesValue: data.armor_notes || "",
    onChangeMainColors: (value) =>
      updateDataField?.("main_colors", value),
    onChangeAccentColors: (value) =>
      updateDataField?.("accent_colors", value),
    onChangeMaterials: (value) =>
      updateDataField?.("materials", value),
    onChangeAccessories: (value) =>
      updateDataField?.("accessories", value),
    onChangeDetails: (value) =>
      updateDataField?.("details", value),
    onChangeArmorNotes: (value) =>
      updateDataField?.("armor_notes", value),
  };
}

export function useOutfitMaterialsDetailsSectionViewModel(props = {}) {
  return getOutfitMaterialsDetailsSectionViewProps(props);
}
