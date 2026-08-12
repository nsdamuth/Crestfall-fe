export const CHARACTER_PREVIEW_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the character-creator preview panel.
 *
 * The View owns the preview placeholder, display initial, identity copy, and
 * responsive card presentation. It does not receive the raw character form and
 * does not know Crestfall form-field names, custom-value sentinel rules,
 * builder state, validation, saving, API requests, or persistence.
 *
 * v1.1.0, RULED 11 Aug 2026 (Sprint H render review, item 3): the art
 * slot no longer renders as if generated on load. Pre-tap it shows
 * the shared KitArtPlaceholder camellia mark plus an explicit CTA,
 * "Generate preview · {previewCostLabel} tokens"; no generation fires
 * without a tap. Post-tap it shows the existing identity-initial
 * card, relabeled "Preview Generated". Tap state (`hasGenerated`) is
 * package-local View state: there is no backend call to await, so
 * there is nothing for the ViewModel to normalize.
 *
 * @typedef {Object} CharacterPreviewViewProps
 * @property {string} displayInitial Single display-ready preview initial.
 * @property {string} characterName Display-ready character name.
 * @property {string} characterSubtitle Display-ready title, concept, or draft fallback.
 * @property {string} speciesLabel Display-ready species text.
 * @property {string} genderPresentationLabel Display-ready gender-presentation text.
 * @property {string} clothingStyleLabel Display-ready clothing-style text.
 * @property {string} [previewCostLabel] Display-ready token cost, default "40" (v1.1.0).
 */

export {};
