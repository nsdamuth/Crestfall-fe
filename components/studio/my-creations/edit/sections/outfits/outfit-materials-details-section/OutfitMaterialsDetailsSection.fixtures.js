const baseFixture = {
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Materials & Details",
  sectionDescription:
    "Define fabrics, colors, trim, accessories, armor, and small visual details that should stay consistent.",
  mainColorsLabel: "Main Colors",
  mainColorsValue: "Matte black, charcoal, and deep gunmetal",
  accentColorsLabel: "Accent Colors",
  accentColorsValue: "Muted silver and pale ivory",
  materialsLabel: "Materials",
  materialsValue: "Heavy wool, velvet, brushed leather, and polished steel",
  accessoriesLabel: "Accessories",
  accessoriesValue: "Formal gloves, narrow belt, signet ring, and cloak clasp",
  detailsLabel: "Trim / Details",
  detailsValue:
    "Restrained silver embroidery along the waistcoat, blackened buckles, narrow stitched seams, and a geometric insignia at the collar.",
  detailsPlaceholder:
    "Describe embroidery, buckles, seams, clasps, straps, buttons, jewelry, insignia, etc.",
  armorNotesLabel: "Armor / Protection Notes",
  armorNotesValue:
    "Thin concealed plates protect the ribs and shoulders without changing the formal silhouette.",
  armorNotesPlaceholder:
    "Optional armor, padding, plates, reinforced areas, or protective elements.",
  onChangeMainColors: null,
  onChangeAccentColors: null,
  onChangeMaterials: null,
  onChangeAccessories: null,
  onChangeDetails: null,
  onChangeArmorNotes: null,
};

export const outfitMaterialsDetailsSectionDefaultFixture = {
  ...baseFixture,
};

export const outfitMaterialsDetailsSectionEmptyFixture = {
  ...baseFixture,
  mainColorsValue: "",
  accentColorsValue: "",
  materialsValue: "",
  accessoriesValue: "",
  detailsValue: "",
  armorNotesValue: "",
};

export const outfitMaterialsDetailsSectionLegacyColorsFixture = {
  ...baseFixture,
  mainColorsValue:
    "Legacy colors value normalized into the current Main Colors presentation.",
};

export const outfitMaterialsDetailsSectionLegacyDetailsFixture = {
  ...baseFixture,
  detailsValue:
    "Legacy trim-details copy normalized into the current Trim / Details presentation.",
};

export const outfitMaterialsDetailsSectionMinimalFixture = {
  ...baseFixture,
  mainColorsValue: "Brown and cream",
  accentColorsValue: "",
  materialsValue: "Cotton and leather",
  accessoriesValue: "Simple belt",
  detailsValue: "Plain stitching",
  armorNotesValue: "",
};

export const outfitMaterialsDetailsSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Materials and Fine Construction Details for an Elaborate Ceremonial Outfit",
  sectionDescription:
    "Define an extensive reusable material language, color hierarchy, accessory set, surface treatment, protective construction, and small visual details that must remain consistent across portraits, full-body scenes, and cinematic visual storytelling.",
  mainColorsValue:
    "Layered matte black, graphite, charcoal, deep blue-black, smoked gunmetal, and near-black violet arranged in a controlled hierarchy that preserves the outfit's tall formal silhouette.",
  accentColorsValue:
    "Pale ivory at the waistcoat, muted antique silver along clasps and embroidery, and very small cool-blue reflective details around the collar insignia.",
  materialsValue:
    "Dense wool outer layers, low-sheen velvet panels, brushed calfskin belts and gloves, polished but darkened steel fittings, silk lining, reinforced canvas interlayers, and fine metallic embroidery thread.",
  accessoriesValue:
    "Formal gloves, signet ring, narrow utility belt, ceremonial clasp, detachable shoulder mantle, hidden document pouch, polished walking cane, and a set of restrained diplomatic insignia.",
  detailsValue:
    "Use narrow geometric embroidery, blackened buckles, double-stitched seams, subtle piping, small articulated clasps, engraved buttons, concealed closures, and recurring angular motifs that feel expensive and disciplined rather than decorative for decoration's sake.",
  armorNotesValue:
    "Concealed flexible plates protect the shoulders, ribs, spine, and upper thighs. Reinforcement must remain visually integrated beneath tailored layers so the outfit reads as formalwear first and protective equipment second.",
};

export const outfitMaterialsDetailsSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Wardrobe Asset",
  sectionTitle: "Material Language",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  mainColorsLabel: "Primary Palette",
  detailsLabel: "Surface Construction",
};

export const outfitMaterialsDetailsSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeMainColors: null,
  onChangeAccentColors: null,
  onChangeMaterials: null,
  onChangeAccessories: null,
  onChangeDetails: null,
  onChangeArmorNotes: null,
};
