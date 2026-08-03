const modeOptions = [
  {
    value: "NORMAL",
    label: "Normal",
    description:
      "Use one reusable clothing prompt. Best for simple outfits or fast setup.",
    active: true,
  },
  {
    value: "ADVANCED",
    label: "Advanced",
    description:
      "Break clothing into body sections so camera presets can include only relevant details later.",
    active: false,
  },
];

const sectionFixtures = [
  {
    id: "head",
    label: "Head / Hair Accessories",
    placeholder:
      "Hats, crowns, veils, goggles, hair ornaments, masks, eyewear, headgear.",
    value: "Antique brass goggles pushed above the brow.",
  },
  {
    id: "neck_shoulders",
    label: "Neck / Shoulders",
    placeholder:
      "Collars, chokers, necklaces, scarves, pauldrons, shoulder straps, capes around shoulders.",
    value: "Arcane shoulder straps with small brass fittings.",
  },
  {
    id: "chest_torso",
    label: "Chest / Torso",
    placeholder:
      "Tops, shirts, crop tops, bodices, dresses, harnesses, breastplates, jackets, robes.",
    value: "White embroidered work top over an ornate fitted harness.",
  },
  {
    id: "arms_hands",
    label: "Arms / Hands",
    placeholder:
      "Sleeves, gloves, gauntlets, bracelets, arm straps, cuffs, hand wraps.",
    value: "Fingerless leather gloves and reinforced arm straps.",
  },
  {
    id: "waist_hips",
    label: "Waist / Hips",
    placeholder:
      "Belts, waist armor, hip straps, sashes, corsets, skirts, tool belts, holsters.",
    value: "Layered off-hip belts, tool pouches, and engraved clasps.",
  },
  {
    id: "legs_thighs",
    label: "Legs / Thighs",
    placeholder:
      "Pants, leggings, thigh straps, thigh armor, stockings, greaves, leg wraps.",
    value: "Dark stitched work trousers with fitted thigh holsters.",
  },
  {
    id: "feet",
    label: "Feet / Footwear",
    placeholder:
      "Boots, sandals, heels, armored footwear, barefoot details, anklets.",
    value: "Worn brown buccaneer boots with reinforced soles.",
  },
  {
    id: "back_carried",
    label: "Back / Carried Gear",
    placeholder:
      "Cloaks, backpacks, sheaths, capes, wings, back-mounted weapons, carried tools.",
    value: "Compact tool satchel and scimitar sheath.",
  },
  {
    id: "weapons_props",
    label: "Weapons / Props",
    placeholder:
      "Swords, staffs, scimitars, tools, books, goggles, devices, visible carried props.",
    value: "Curved artificer scimitar and calibration tools.",
  },
  {
    id: "full_body",
    label: "Full-Body / Overall Outfit Impression",
    placeholder:
      "Overall outfit silhouette, style cohesion, color impression, complete look for full-body shots.",
    value:
      "Agile brass-and-leather fantasy workwear with a tool-heavy silhouette.",
  },
];

const baseFixture = {
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Prompt Guidance",
  sectionDescription:
    "Define how this outfit contributes clothing details to image generation. Normal mode uses one prompt. Advanced mode separates clothing by body section for camera-aware prompt resolution later.",
  clothingModeLabel: "Clothing Mode",
  clothingMode: "NORMAL",
  clothingModeOptions: modeOptions,
  normalPromptLabel: "Normal Clothing Prompt",
  normalClothingPrompt:
    "Fitted black-and-white artificer workwear, layered leather tool belts, brass fittings, fingerless gloves, and worn brown boots.",
  normalPromptPlaceholder: "Reusable image-generation wording for this outfit.",
  signatureClothingLabel: "Signature / Always-Include Clothing",
  signatureClothing: "Brass goggles and a layered arcane tool belt.",
  signatureClothingPlaceholder: "Optional iconic outfit details.",
  advancedSectionsTitle: "Advanced Clothing Sections",
  advancedSectionsDescription:
    "Camera presets can later choose only the clothing sections relevant to the current framing.",
  clothingSections: sectionFixtures,
  standalonePromptLabel: "Standalone Image Prompt",
  standaloneImagePrompt:
    "Catalogue image of ornate fantasy artificer workwear displayed on a neutral tailoring form.",
  standalonePromptPlaceholder: "Optional standalone asset prompt.",
  negativePromptLabel: "Negative Prompt",
  negativePrompt: "modern logos, sneakers, transparent fabric",
  negativePromptPlaceholder: "Optional negatives.",
  usageNotesLabel: "Usage Notes",
  usageNotes: "Use for workshop, appraisal, market, and light fieldwork scenes.",
  usageNotesPlaceholder: "When should this outfit be used?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotes:
    "Designed for agile adult humanoid characters and full-body or waist-up framing.",
  compatibilityNotesPlaceholder: "Optional compatibility notes.",
  onClothingModeChange: null,
  onNormalClothingPromptChange: null,
  onSignatureClothingChange: null,
  onClothingSectionChange: null,
  onStandaloneImagePromptChange: null,
  onNegativePromptChange: null,
  onUsageNotesChange: null,
  onCompatibilityNotesChange: null,
};

export const outfitPromptGuidanceNormalFixture = {
  ...baseFixture,
};

export const outfitPromptGuidanceAdvancedFixture = {
  ...baseFixture,
  clothingMode: "ADVANCED",
  clothingModeOptions: modeOptions.map((option) => ({
    ...option,
    active: option.value === "ADVANCED",
  })),
};

export const outfitPromptGuidanceEmptyFixture = {
  ...baseFixture,
  normalClothingPrompt: "",
  signatureClothing: "",
  clothingSections: sectionFixtures.map((field) => ({ ...field, value: "" })),
  standaloneImagePrompt: "",
  negativePrompt: "",
  usageNotes: "",
  compatibilityNotes: "",
};

export const outfitPromptGuidanceLongContentFixture = {
  ...baseFixture,
  clothingMode: "ADVANCED",
  clothingModeOptions: modeOptions.map((option) => ({
    ...option,
    active: option.value === "ADVANCED",
  })),
  sectionTitle: "Detailed Camera-Aware Outfit Prompt Guidance",
  sectionDescription:
    "Define a reusable visual language for a complex outfit whose iconic details, section-specific garments, props, materials, and negative constraints must remain coherent across portraits, waist-up scenes, full-body compositions, catalogue images, and cinematic environmental staging.",
  signatureClothing:
    "Always retain the narrow brass goggles, angular shoulder harness, layered tool-belt assembly, engraved waist clasp, and one visible calibration instrument whenever the camera framing reasonably permits them.",
  usageNotes:
    "Use during workshop repair, appraisal, trade-district bargaining, field inspection, market pursuit, rooftop movement, cursed-object containment, and light combat scenes. Avoid replacing the outfit with generic robes or pristine court fashion.",
};

export const outfitPromptGuidanceMissingCallbacksFixture = {
  ...baseFixture,
};
