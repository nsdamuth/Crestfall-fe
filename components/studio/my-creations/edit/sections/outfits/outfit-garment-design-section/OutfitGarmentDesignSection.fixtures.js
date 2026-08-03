const baseFixture = {
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Garment Design",
  sectionDescription:
    "Describe the visible clothing pieces, silhouette, fit, coverage, and style language for this outfit.",
  silhouetteLabel: "Silhouette",
  silhouetteValue: "Long structured hourglass silhouette",
  fitLabel: "Fit",
  fitValue: "Tailored through the torso with a flowing lower layer",
  coverageLabel: "Coverage",
  coverageValue: "Full-length with covered arms and high neckline",
  styleLanguageLabel: "Style Language",
  styleLanguageValue: "Dark formal courtwear with restrained gothic detailing",
  clothingPiecesLabel: "Clothing Pieces",
  clothingPiecesValue:
    "Fitted velvet coat, high-collar waistcoat, layered trousers, gloves, polished boots, and a long ceremonial outer mantle.",
  clothingPiecesPlaceholder:
    "List the visible pieces: jacket, boots, belts, gloves, armor plates, dress layers, etc.",
  designNotesLabel: "Design Notes",
  designNotesValue:
    "Keep the upper body sharply structured while the mantle adds controlled movement and a tall, authoritative profile.",
  designNotesPlaceholder:
    "Describe the outfit's visual identity, proportions, mood, and design intent.",
  onChangeSilhouette: null,
  onChangeFit: null,
  onChangeCoverage: null,
  onChangeStyleLanguage: null,
  onChangeClothingPieces: null,
  onChangeDesignNotes: null,
};

export const outfitGarmentDesignSectionDefaultFixture = {
  ...baseFixture,
};

export const outfitGarmentDesignSectionEmptyFixture = {
  ...baseFixture,
  silhouetteValue: "",
  fitValue: "",
  coverageValue: "",
  styleLanguageValue: "",
  clothingPiecesValue: "",
  designNotesValue: "",
};

export const outfitGarmentDesignSectionLegacyNotesFixture = {
  ...baseFixture,
  silhouetteValue: "Compact travel silhouette",
  fitValue: "Layered and adjustable",
  coverageValue: "Weather-ready full coverage",
  styleLanguageValue: "Practical frontier clothing",
  clothingPiecesValue:
    "Waxed coat, wool shirt, reinforced trousers, travel boots, belt pouches, and weather hood.",
  designNotesValue:
    "Legacy design-reference copy normalized into the current Design Notes presentation.",
};

export const outfitGarmentDesignSectionMinimalFixture = {
  ...baseFixture,
  silhouetteValue: "Relaxed",
  fitValue: "Loose",
  coverageValue: "Moderate",
  styleLanguageValue: "Everyday",
  clothingPiecesValue: "Shirt, trousers, and boots.",
  designNotesValue: "",
};

export const outfitGarmentDesignSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Garment Design for an Elaborate Multi-Layered Ceremonial Outfit",
  sectionDescription:
    "Describe a complex reusable wardrobe asset whose silhouette, coverage, fit, visible garment layers, and design language must remain consistent across portraits, cinematic scenes, multiple camera crops, and long-form visual storytelling.",
  silhouetteValue:
    "A tall architectural silhouette with a sharply tailored upper body, broad shoulder structure, narrow waist, layered asymmetrical skirt panels, and a floor-length outer mantle that creates a strong vertical line.",
  fitValue:
    "Precisely fitted through the shoulders, chest, and waist; flexible through the elbows and knees; layered enough to imply movement without obscuring the character's body proportions.",
  coverageValue:
    "Full arm and leg coverage with a high neckline, gloves, enclosed footwear, layered outerwear, and only minimal intentional skin exposure around the face.",
  styleLanguageValue:
    "Diplomatic dark-fantasy formalwear combining ceremonial military tailoring, understated gothic geometry, polished luxury materials, and restrained symbolic ornamentation.",
  clothingPiecesValue:
    "High-collar shirt, embroidered waistcoat, fitted long coat, articulated shoulder mantle, layered sash, reinforced trousers, formal gloves, polished boots, narrow belts, ceremonial clasps, and a detachable floor-length cloak.",
  designNotesValue:
    "The ensemble should feel expensive, disciplined, and politically authoritative rather than theatrical. Preserve the long dark vertical silhouette, pale waistcoat contrast, controlled embroidery, and clean separation between the fitted core garments and the moving outer layers.",
};

export const outfitGarmentDesignSectionCustomCopyFixture = {
  ...baseFixture,
  sectionEyebrow: "Wardrobe Asset",
  sectionTitle: "Visible Garment Construction",
  sectionDescription:
    "Preview alternate display copy without changing the application contract.",
  clothingPiecesLabel: "Visible Layers",
  designNotesLabel: "Construction Intent",
};

export const outfitGarmentDesignSectionMissingCallbacksFixture = {
  ...baseFixture,
  onChangeSilhouette: null,
  onChangeFit: null,
  onChangeCoverage: null,
  onChangeStyleLanguage: null,
  onChangeClothingPieces: null,
  onChangeDesignNotes: null,
};
