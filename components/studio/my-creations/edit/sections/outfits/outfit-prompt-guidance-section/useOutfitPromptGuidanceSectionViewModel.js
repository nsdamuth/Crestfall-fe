const ASSET_IMAGE_PROMPT_MAX_LENGTH = 2000;
const ASSET_NEGATIVE_PROMPT_MAX_LENGTH = 2000;

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Outfit Editor",
  sectionTitle: "Prompt Guidance",
  sectionDescription:
    "Define how this outfit contributes clothing details to image generation. Normal mode uses one prompt. Advanced mode separates clothing by body section for camera-aware prompt resolution later.",
  clothingModeLabel: "Clothing Mode",
  normalPromptLabel: "Normal Clothing Prompt",
  normalPromptPlaceholder:
    "Reusable image-generation wording for this outfit. Example: opaque black clothing, matte black gown, shadowed fabric, smoke from bottom of gown.",
  signatureClothingLabel: "Signature / Always-Include Clothing",
  signatureClothingPlaceholder:
    "Optional iconic outfit details that should survive most camera crops: signature goggles, crown, shoulder cloak, distinctive collar, etc.",
  advancedSectionsTitle: "Advanced Clothing Sections",
  advancedSectionsDescription:
    "These sections are saved now. Later, Image Studio camera presets will decide which sections to include for headshots, waist-up shots, full-body shots, and other framing options.",
  standalonePromptLabel: "Standalone Image Prompt",
  standalonePromptPlaceholder:
    "Optional standalone prompt for generating catalogue, preview, or reference images of this outfit as its own visual asset. Max 2,000 characters.",
  negativePromptLabel: "Negative Prompt",
  negativePromptPlaceholder:
    "Optional negatives this outfit should contribute when selected in image generation. Example: no transparent fabric, no modern logos, no sneakers. Max 2,000 characters.",
  usageNotesLabel: "Usage Notes",
  usageNotesPlaceholder:
    "When should this outfit be used? What character types, settings, or scenes does it support?",
  compatibilityNotesLabel: "Compatibility Notes",
  compatibilityNotesPlaceholder:
    "Optional compatibility notes for characters, poses, image presets, or locations.",
});

const CLOTHING_MODE_OPTIONS = Object.freeze([
  {
    value: "NORMAL",
    label: "Normal",
    description:
      "Use one reusable clothing prompt. Best for simple outfits or fast setup.",
  },
  {
    value: "ADVANCED",
    label: "Advanced",
    description:
      "Break clothing into body sections so camera presets can include only relevant details later.",
  },
]);

const CLOTHING_SECTION_FIELDS = Object.freeze([
  {
    id: "head",
    label: "Head / Hair Accessories",
    placeholder:
      "Hats, crowns, veils, goggles, hair ornaments, masks, eyewear, headgear.",
  },
  {
    id: "neck_shoulders",
    label: "Neck / Shoulders",
    placeholder:
      "Collars, chokers, necklaces, scarves, pauldrons, shoulder straps, capes around shoulders.",
  },
  {
    id: "chest_torso",
    label: "Chest / Torso",
    placeholder:
      "Tops, shirts, crop tops, bodices, dresses, harnesses, breastplates, jackets, robes.",
  },
  {
    id: "arms_hands",
    label: "Arms / Hands",
    placeholder:
      "Sleeves, gloves, gauntlets, bracelets, arm straps, cuffs, hand wraps.",
  },
  {
    id: "waist_hips",
    label: "Waist / Hips",
    placeholder:
      "Belts, waist armor, hip straps, sashes, corsets, skirts, tool belts, holsters.",
  },
  {
    id: "legs_thighs",
    label: "Legs / Thighs",
    placeholder:
      "Pants, leggings, thigh straps, thigh armor, stockings, greaves, leg wraps.",
  },
  {
    id: "feet",
    label: "Feet / Footwear",
    placeholder:
      "Boots, sandals, heels, armored footwear, barefoot details, anklets.",
  },
  {
    id: "back_carried",
    label: "Back / Carried Gear",
    placeholder:
      "Cloaks, backpacks, sheaths, capes, wings, back-mounted weapons, carried tools.",
  },
  {
    id: "weapons_props",
    label: "Weapons / Props",
    placeholder:
      "Swords, staffs, scimitars, tools, books, goggles, devices, visible carried props.",
  },
  {
    id: "full_body",
    label: "Full-Body / Overall Outfit Impression",
    placeholder:
      "Overall outfit silhouette, style cohesion, color impression, complete look for full-body shots.",
  },
]);

function normalizeText(value) {
  return typeof value === "string" ? value : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeClothingMode(value) {
  return String(value || "").trim().toUpperCase() === "ADVANCED"
    ? "ADVANCED"
    : "NORMAL";
}

function limitPromptValue(value, maxLength) {
  return String(value || "").slice(0, maxLength);
}

export function getOutfitPromptGuidanceSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = normalizeObject(form?.data);
  const clothingMode = normalizeClothingMode(data.clothing_mode);
  const clothingSections = normalizeObject(data.clothing_sections);

  return {
    ...DEFAULT_COPY,
    clothingMode,
    clothingModeOptions: CLOTHING_MODE_OPTIONS.map((option) => ({
      ...option,
      active: clothingMode === option.value,
    })),
    normalClothingPrompt: normalizeText(
      data.normal_clothing_prompt || data.prompt_guidance || data.prompt
    ),
    signatureClothing: normalizeText(data.signature_clothing),
    clothingSections: CLOTHING_SECTION_FIELDS.map((field) => ({
      ...field,
      value: normalizeText(clothingSections[field.id]),
    })),
    standaloneImagePrompt: normalizeText(data.image_prompt),
    negativePrompt: normalizeText(data.negative_prompt),
    usageNotes: normalizeText(data.usage_notes),
    compatibilityNotes: normalizeText(data.compatibility_notes),
    standaloneImagePromptMaxLength: ASSET_IMAGE_PROMPT_MAX_LENGTH,
    negativePromptMaxLength: ASSET_NEGATIVE_PROMPT_MAX_LENGTH,
    onClothingModeChange: (nextMode) =>
      updateDataField?.("clothing_mode", normalizeClothingMode(nextMode)),
    onNormalClothingPromptChange: (value) => {
      updateDataField?.("normal_clothing_prompt", value);
      updateDataField?.("prompt_guidance", value);
    },
    onSignatureClothingChange: (value) =>
      updateDataField?.("signature_clothing", value),
    onClothingSectionChange: (sectionId, value) =>
      updateDataField?.("clothing_sections", {
        ...clothingSections,
        [sectionId]: value,
      }),
    onStandaloneImagePromptChange: (value) =>
      updateDataField?.(
        "image_prompt",
        limitPromptValue(value, ASSET_IMAGE_PROMPT_MAX_LENGTH)
      ),
    onNegativePromptChange: (value) =>
      updateDataField?.(
        "negative_prompt",
        limitPromptValue(value, ASSET_NEGATIVE_PROMPT_MAX_LENGTH)
      ),
    onUsageNotesChange: (value) => updateDataField?.("usage_notes", value),
    onCompatibilityNotesChange: (value) =>
      updateDataField?.("compatibility_notes", value),
  };
}

export function useOutfitPromptGuidanceSectionViewModel(props = {}) {
  return getOutfitPromptGuidanceSectionViewProps(props);
}
