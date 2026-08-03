export const VOICE_MODULE_PICKER_MODAL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * @typedef {Object} VoiceModulePickerViewItem
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} VoiceModulePickerViewOption
 * @property {string} id
 * @property {string} label
 * @property {string} description
 */

/**
 * @typedef {Object} VoiceModulePickerViewGroup
 * @property {string} id
 * @property {string} label
 * @property {VoiceModulePickerViewOption[]} options
 */

/**
 * Stable UI boundary for the portable Voice Module Picker View.
 *
 * The View must not import Crestfall voice-module constants, read character
 * form fields, normalize stored arrays, or decide how selected module IDs are
 * persisted. It renders display-ready groups and emits semantic actions only.
 *
 * @typedef {Object} VoiceModulePickerModalViewProps
 * @property {boolean} open
 * @property {string} triggerLabel
 * @property {string} triggerDescription
 * @property {string} triggerActionLabel
 * @property {VoiceModulePickerViewItem[]} selectedItems
 * @property {string} emptySelectionMessage
 * @property {string} modalAriaLabel
 * @property {string} modalTitle
 * @property {string} modalDescription
 * @property {VoiceModulePickerViewGroup[]} optionGroups
 * @property {string[]} selectedIds
 * @property {string} clearActionLabel
 * @property {string} doneActionLabel
 * @property {boolean} canClear
 * @property {(() => void)|null} onOpen
 * @property {(() => void)|null} onClose
 * @property {((moduleId: string) => void)|null} onToggleModule
 * @property {(() => void)|null} onClearAll
 * @property {(() => void)|null} onDone
 */

export {};
