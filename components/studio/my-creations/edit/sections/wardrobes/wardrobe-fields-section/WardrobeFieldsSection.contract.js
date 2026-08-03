export const WARDROBE_FIELDS_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Wardrobe Fields View.
 *
 * The View receives normalized wardrobe metadata, display-ready Outfit entries,
 * selection-rule values, prompt values, and semantic callbacks. It must not
 * inspect a Creation form, know Wardrobe JSONB storage keys, or load Outfit
 * creations.
 */
export const WARDROBE_FIELDS_SECTION_APPLICATION_BOUNDARY = Object.freeze({
  applicationOwnedControls: ["OutfitPickerModal"],
  storageFields: [
    "scope",
    "entries",
    "selectionRules",
    "promptGuidance",
    "image_prompt",
    "negative_prompt",
  ],
  sections: ["overview", "entries", "rules"],
});

export {};
