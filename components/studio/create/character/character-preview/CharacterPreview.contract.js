export const CHARACTER_PREVIEW_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * Stable UI boundary for the character-creator preview panel.
 *
 * The View owns the preview placeholder/image, display identity copy, async
 * presentation, and responsive card layout. It does not receive the raw
 * character form and does not know Crestfall form-field names, saving rules,
 * image-generation payloads, polling, APIs, or persistence.
 *
 * v1.2.0: Character Creator preview is live. The binding/VM receives controlled
 * generation state from the creator application boundary. A deliberate tap may
 * persist the current draft, create one normal Image Studio generation job,
 * spend the standard 5-Coin image-generation price, wait for the resulting
 * output, and render that image here. Editing the draft invalidates the stale
 * preview. No generation fires on mount.
 *
 * @typedef {Object} CharacterPreviewViewProps
 * @property {string} displayInitial Single display-ready preview initial.
 * @property {string} characterName Display-ready character name.
 * @property {string} characterSubtitle Display-ready title, concept, or draft fallback.
 * @property {string} speciesLabel Display-ready species text.
 * @property {string} genderPresentationLabel Display-ready gender-presentation text.
 * @property {string} clothingStyleLabel Display-ready clothing-style text.
 * @property {string} [previewCostLabel] Display-ready Coin cost, default "5".
 * @property {string} [previewImageUrl] Generated preview image URL.
 * @property {"idle"|"preparing"|"generating"|"ready"|"error"} [previewStatus]
 * @property {string} [previewError]
 * @property {boolean} [previewDisabled]
 * @property {Function|null} [onGeneratePreview]
 */

export {};
