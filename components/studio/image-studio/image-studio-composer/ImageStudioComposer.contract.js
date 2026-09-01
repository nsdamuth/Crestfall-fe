export const IMAGE_STUDIO_COMPOSER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the Image Studio composer panel.
 *
 * The View owns the composer layout, presentation-local options disclosure,
 * controlled text/select inputs, coin and generation feedback, and direct
 * composition of already-portable ingredient and video Views. It does not
 * receive raw creation records and does not own generation requests, preset
 * persistence, media history, account balance loading, or Image Studio state.
 *
 * @typedef {Object} ImageStudioComposerModeOption
 * @property {string} id Semantic mode value.
 * @property {string} label Display label.
 * @property {"image"|"video"} iconKind Presentation icon category.
 *
 * @typedef {Object} ImageStudioComposerChildView
 * @property {string} id Stable display key.
 * @property {Object} viewProps Direct props for a portable child View.
 *
 * @typedef {Object} ImageStudioComposerSelectField
 * @property {string} id Stable field key.
 * @property {string} label Display label.
 * @property {string} value Controlled selected value.
 * @property {{value: string, label: string}[]} options Display-ready options.
 * @property {(nextValue: string) => void} onChange Semantic value change.
 *
 * @typedef {Object} ImageStudioComposerTuningControl
 * @property {string} id Semantic workflow-tuning field.
 * @property {string} label Creator-facing label.
 * @property {string} description Creator-facing explanation.
 * @property {number} value Controlled semantic percentage.
 * @property {number} min Hard UI lower bound.
 * @property {number} max Hard UI upper bound.
 * @property {number} step Slider increment.
 * @property {number} defaultValue Validated workflow default marker.
 * @property {(nextValue: number) => void} onChange Semantic tuning change.
 *
 * @typedef {Object} ImageStudioComposerViewProps
 * @property {ImageStudioComposerModeOption[]} modeOptions
 * @property {"IMAGE"|"VIDEO"} mode
 * @property {string} composerTitle
 * @property {ImageStudioComposerChildView[]} ingredientSlotItems
 * @property {ImageStudioComposerChildView[]} customEditorItems
 * @property {Object|null} videoToolsProps
 * @property {string} promptValue
 * @property {string} negativePromptValue
 * @property {{id:string,label:string,sourceLabel:string,text:string}[]} inheritedNegativePromptItems Effective asset-level negative guidance shown read-only.
 * @property {boolean} canGenerateImage
 * @property {string} generationHelpText
 * @property {string} generationError
 * @property {ImageStudioComposerSelectField[]} imageOptionFields
 * @property {Object|null} advancedTuningProps Curated workflow-specific tuning presentation.
 * @property {string} coinBalanceLabel
 * @property {string} coinCostLabel
 * @property {boolean} showInsufficientCoins
 * @property {string} coinError
 * @property {(mode: "IMAGE"|"VIDEO") => void} onChangeMode
 * @property {(nextValue: string) => void} onChangePrompt
 * @property {(nextValue: string) => void} onChangeNegativePrompt
 * @property {() => void} onGenerateImage
 */

export {};
