export const ITEM_REGISTRY_FIELDS_SECTION_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the portable Item Registry Fields View.
 *
 * The View receives normalized registry metadata, display-ready entries,
 * select options, semantic callbacks, and an application-owned starting
 * assignment slot per entry. It must not inspect a Creation form, know Item
 * Registry JSONB storage keys, or load linked Creations.
 */
export const ITEM_REGISTRY_FIELDS_SECTION_APPLICATION_BOUNDARY = Object.freeze({
  applicationOwnedControls: ["ItemStartingAssignmentEditor"],
  reusableAuthoringControls: [
    "ItemEquipmentModifierReferencesEditor",
    "ItemOperationRequirementSetsEditor",
    "ItemOperationEffectReferencesEditor",
  ],
  storageFields: ["scope", "entries", "prompt_guidance"],
  sections: [
    "overview",
    "entries",
    "associations",
    "tracking",
    "prompt",
    "review",
  ],
});

export {};
