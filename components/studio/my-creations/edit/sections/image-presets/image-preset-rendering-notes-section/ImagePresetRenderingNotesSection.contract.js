export const IMAGE_PRESET_RENDERING_NOTES_SECTION_VIEW_CONTRACT_VERSION =
  "1.0.0";

/**
 * Stable UI boundary for the portable Image Preset rendering-notes View.
 *
 * The View must not inspect a creation form, know Image Preset JSON storage
 * fields, resolve the legacy atmosphere field, or decide how edits are
 * persisted. It renders display-ready values and emits semantic edit intent.
 *
 * @typedef {Object} ImagePresetRenderingNotesSectionViewProps
 * @property {string} sectionEyebrow
 * @property {string} sectionTitle
 * @property {string} sectionDescription
 * @property {string} lightingStyleLabel
 * @property {string} lightingStyleValue
 * @property {string} detailLevelLabel
 * @property {string} detailLevelValue
 * @property {string} lineworkLabel
 * @property {string} lineworkValue
 * @property {string} shadingLabel
 * @property {string} shadingValue
 * @property {string} moodLabel
 * @property {string} moodValue
 * @property {string} compositionStyleLabel
 * @property {string} compositionStyleValue
 * @property {string} renderingGuidanceLabel
 * @property {string} renderingGuidanceValue
 * @property {string} renderingGuidancePlaceholder
 * @property {((value: string) => void)|null} onChangeLightingStyle
 * @property {((value: string) => void)|null} onChangeDetailLevel
 * @property {((value: string) => void)|null} onChangeLinework
 * @property {((value: string) => void)|null} onChangeShading
 * @property {((value: string) => void)|null} onChangeMood
 * @property {((value: string) => void)|null} onChangeCompositionStyle
 * @property {((value: string) => void)|null} onChangeRenderingGuidance
 */

export {};
