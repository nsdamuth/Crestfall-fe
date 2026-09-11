export const OUTFIT_ADVANCED_CLOTHING_SECTION_IDS = Object.freeze([
  "head",
  "neck_shoulders",
  "chest_torso",
  "arms_hands",
  "waist_hips",
  "legs_thighs",
  "feet",
  "back_carried",
  "weapons_props",
  "full_body",
]);

function normalizeText(value) {
  return typeof value === "string" ? value : "";
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export function hasAuthoredAdvancedClothing(form = {}) {
  const data = normalizeObject(form?.data);
  const clothingSections = normalizeObject(data.clothing_sections);

  return Boolean(
    normalizeText(data.signature_clothing).trim() ||
      OUTFIT_ADVANCED_CLOTHING_SECTION_IDS.some((sectionId) =>
        normalizeText(clothingSections[sectionId]).trim()
      )
  );
}

export function applyOutfitAdvancedPromptConversion({
  conversion,
  updateDataField,
} = {}) {
  if (!conversion || typeof conversion !== "object") return false;

  const sections = normalizeObject(conversion.clothing_sections);
  const normalizedSections = Object.fromEntries(
    OUTFIT_ADVANCED_CLOTHING_SECTION_IDS.map((sectionId) => [
      sectionId,
      normalizeText(sections[sectionId]),
    ])
  );

  updateDataField?.(
    "signature_clothing",
    normalizeText(conversion.signature_clothing)
  );
  updateDataField?.("clothing_sections", normalizedSections);
  updateDataField?.("clothing_mode", "ADVANCED");
  return true;
}
