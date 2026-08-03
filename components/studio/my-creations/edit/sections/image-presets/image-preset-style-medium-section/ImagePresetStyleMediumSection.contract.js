export const IMAGE_PRESET_STYLE_MEDIUM_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Image Preset style-and-medium View.
 *
 * The View must not inspect a creation form, know Image Preset JSON storage
 * fields, resolve legacy influence/rendering/style-note fields, or decide how
 * edits are persisted. It renders display-ready values and emits semantic edit
 * intent.
 *
 * @typedef {Object} ImagePresetStyleMediumSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} mediumLabel
 * @property {string} mediumValue
 * @property {string} artStyleLabel
 * @property {string} artStyleValue
 * @property {string} artistInfluenceLabel
 * @property {string} artistInfluenceValue
 * @property {string} renderingModeLabel
 * @property {string} renderingModeValue
 * @property {string} textureStyleLabel
 * @property {string} textureStyleValue
 * @property {string} colorPaletteLabel
 * @property {string} colorPaletteValue
 * @property {string} styleNotesLabel
 * @property {string} styleNotesValue
 * @property {string} styleNotesPlaceholder
 * @property {((value: string) => void)|null} onChangeMedium
 * @property {((value: string) => void)|null} onChangeArtStyle
 * @property {((value: string) => void)|null} onChangeArtistInfluence
 * @property {((value: string) => void)|null} onChangeRenderingMode
 * @property {((value: string) => void)|null} onChangeTextureStyle
 * @property {((value: string) => void)|null} onChangeColorPalette
 * @property {((value: string) => void)|null} onChangeStyleNotes
 */

export {};
