export const DEFAULT_CLOTHING_SELECTOR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} DefaultClothingSelectionViewItem
 * @property {string} typeLabel
 * @property {string} title
 * @property {string} description
 * @property {string} imageUrl
 */

/**
 * Stable UI boundary for the portable default-clothing selector View.
 *
 * The View must not know Crestfall form field names, Outfit or Wardrobe
 * creation payloads, featured-media fallback rules, content-rating storage,
 * picker loading behavior, or how a selected creation is written back into a
 * character draft. It renders one display-ready clothing source and emits
 * semantic selection intent only.
 *
 * @typedef {Object} DefaultClothingSelectorViewProps
 * @property {DefaultClothingSelectionViewItem|null} selectedClothing
 * @property {string} emptyMessage
 * @property {string} outfitActionLabel
 * @property {string} wardrobeActionLabel
 * @property {(() => void)|null} onOpenOutfitPicker
 * @property {(() => void)|null} onOpenWardrobePicker
 * @property {(() => void)|null} onClearDefaultClothing
 */

export {};
