export const CHARACTER_COLOR_PALETTE_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} CharacterColorPaletteViewPalette
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {string[]} swatches
 * @property {{dialogue: string, narration: string, emphasis: string, strong: string, whisper: string, speaker: string, border: string}} previewColors
 */

/**
 * @typedef {Object} CharacterColorPaletteViewFamily
 * @property {string} id
 * @property {string} label
 * @property {CharacterColorPaletteViewPalette[]} palettes
 */

/**
 * Stable UI boundary for the portable Character Color Palette View.
 *
 * The View must not import Crestfall palette constants, decide fallback palette
 * behavior, or know how the selected palette is stored on a character. It
 * renders display-ready visual palettes and emits semantic user intent only.
 *
 * @typedef {Object} CharacterColorPaletteModalViewProps
 * @property {boolean} open
 * @property {string} triggerEyebrow
 * @property {CharacterColorPaletteViewPalette} triggerPalette
 * @property {string} triggerDescription
 * @property {string} modalAriaLabel
 * @property {string} modalEyebrow
 * @property {string} modalTitle
 * @property {string} modalDescription
 * @property {string} selectedPaletteId
 * @property {CharacterColorPaletteViewFamily[]} paletteFamilies
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((paletteId: string) => void)|null} onChoosePalette
 */

export {};
