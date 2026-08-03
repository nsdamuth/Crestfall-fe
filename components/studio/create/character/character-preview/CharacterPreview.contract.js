export const CHARACTER_PREVIEW_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the character-creator preview panel.
 *
 * The View owns the preview placeholder, display initial, identity copy, and
 * responsive card presentation. It does not receive the raw character form and
 * does not know Crestfall form-field names, custom-value sentinel rules,
 * builder state, validation, saving, API requests, or persistence.
 *
 * @typedef {Object} CharacterPreviewViewProps
 * @property {string} displayInitial Single display-ready preview initial.
 * @property {string} characterName Display-ready character name.
 * @property {string} characterSubtitle Display-ready title, concept, or draft fallback.
 * @property {string} speciesLabel Display-ready species text.
 * @property {string} genderPresentationLabel Display-ready gender-presentation text.
 * @property {string} clothingStyleLabel Display-ready clothing-style text.
 */

export {};
