export const OUTFIT_PROMPT_GUIDANCE_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Outfit prompt-guidance View.
 *
 * The View must not inspect a creation form, know Outfit JSONB field names,
 * resolve legacy prompt fallbacks, enforce persistence limits, or coordinate
 * compatibility writes. It renders normalized prompt values and emits
 * semantic edit intent.
 *
 * @typedef {Object} OutfitPromptGuidanceSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} clothingModeLabel
 * @property {"NORMAL"|"ADVANCED"} clothingMode
 * @property {Array<{value:string,label:string,description:string,active:boolean}>} clothingModeOptions
 * @property {string} normalPromptLabel
 * @property {string} normalClothingPrompt
 * @property {string} normalPromptPlaceholder
 * @property {string} signatureClothingLabel
 * @property {string} signatureClothing
 * @property {string} signatureClothingPlaceholder
 * @property {string} advancedSectionsTitle
 * @property {string} advancedSectionsDescription
 * @property {Array<{id:string,label:string,placeholder:string,value:string}>} clothingSections
 * @property {string} standalonePromptLabel
 * @property {string} standaloneImagePrompt
 * @property {string} standalonePromptPlaceholder
 * @property {string} negativePromptLabel
 * @property {string} negativePrompt
 * @property {string} negativePromptPlaceholder
 * @property {string} usageNotesLabel
 * @property {string} usageNotes
 * @property {string} usageNotesPlaceholder
 * @property {string} compatibilityNotesLabel
 * @property {string} compatibilityNotes
 * @property {string} compatibilityNotesPlaceholder
 * @property {((mode: string) => void)|null} onClothingModeChange
 * @property {((value: string) => void)|null} onNormalClothingPromptChange
 * @property {((value: string) => void)|null} onSignatureClothingChange
 * @property {((sectionId: string, value: string) => void)|null} onClothingSectionChange
 * @property {((value: string) => void)|null} onStandaloneImagePromptChange
 * @property {((value: string) => void)|null} onNegativePromptChange
 * @property {((value: string) => void)|null} onUsageNotesChange
 * @property {((value: string) => void)|null} onCompatibilityNotesChange
 */

export {};
