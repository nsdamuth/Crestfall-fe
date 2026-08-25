export const KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the image creator panel kit piece
 * (docs/SPRINT-E-PLAN.md section 1.1, R6). Fixture-driven mirror of
 * the live image composer's function (`components/studio/image-studio/`,
 * READ ONLY reference, never imported): mode toggle, the six live
 * ingredient slots, the custom-guidance inline editor, the prompt and
 * Options block, and the generate/video blocks. No fetch anywhere;
 * the caller supplies display-ready values and receives intent
 * through named callbacks. Generation and persistence stay honest
 * stubs until live wiring (SOP HIDE/STUB law); the panel never fakes
 * a pending job or a saved preset.
 *
 * The six ingredient slots are FIXED anatomy, not caller-supplied
 * data: id, label, icon, and savable-as-preset are owned by this
 * package (mirroring components/studio/image-studio/imageStudioData.js
 * ingredientSlots verbatim, including the live labels Character,
 * Player Character, Pose, Clothing Source, Location / Scene,
 * Rendering Preset). The caller supplies only each slot's live STATE
 * through the `slots` map, keyed by the same six ids.
 *
 * @typedef {"character"|"playerCharacter"|"pose"|"outfit"|"location"|"preset"} KitImageCreatorSlotId
 *
 * @typedef {Object} KitImageCreatorSlotState
 * @property {{title: string, subtitle?: string}|null} selection the
 *   chosen ingredient, or null for an empty slot
 * @property {boolean} isCustomMode true renders the inline custom
 *   guidance editor in place of the picker-opening tile
 * @property {string} customText the custom guidance textarea value,
 *   read only while isCustomMode is true
 *
 * @typedef {Object} KitImageCreatorOptionField
 * @property {string} id
 * @property {string} label
 * @property {string} value
 * @property {{value: string, label: string}[]} options
 *
 * @typedef {Object} KitImageCreatorPanelViewProps
 * @property {"IMAGE"|"VIDEO"} mode
 * @property {((mode: "IMAGE"|"VIDEO") => void)|null} onChangeMode
 * @property {Object<KitImageCreatorSlotId, KitImageCreatorSlotState>} slots
 *   keyed by the six fixed slot ids; an id absent from the map renders
 *   as an empty, non-custom slot
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onSlotActivate
 *   fires when a non-custom slot tile is tapped; the caller owns
 *   opening the ingredient picker (1.2)
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onSlotClear
 *   fires from the clear control on a filled or custom slot
 * @property {((slotId: KitImageCreatorSlotId, text: string) => void)|null} onCustomChangeText
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onCustomBackToPresets
 *   re-opens the picker for that slot (1.2)
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onCustomSavePreset
 *   opens the save-preset modal (1.3); only reachable for the four
 *   savable slots (pose, outfit, location, preset)
 * @property {string} promptValue
 * @property {((value: string) => void)|null} onChangePrompt
 * @property {string} negativePromptValue
 * @property {((value: string) => void)|null} onChangeNegativePrompt
 * @property {KitImageCreatorOptionField[]} optionFields the five
 *   Options-expander dropdowns (Render Style, Camera / Framing,
 *   Wardrobe Theme, Aspect Ratio, Output Count), single-select
 * @property {((fieldId: string, value: string) => void)|null} onChangeOption
 * @property {string} coinBalanceLabel
 * @property {string} coinCostLabel
 * @property {boolean} showInsufficientCoins
 * @property {boolean} canGenerate honest disabled-state gate,
 *   pre-computed by the caller (fixture logic, never the View)
 * @property {string} generationHelpText the block-reason or
 *   non-blocking help line, pre-computed by the caller; rendered
 *   whenever non-empty
 * @property {(() => void)|null} onGenerate fires the R4 fixture-action
 *   notice in fixture mode; the real job pipeline is live wiring
 * @property {KitImageCreatorOptionField[]} videoOptionFields Duration,
 *   Video Aspect, Motion Style
 * @property {((fieldId: string, value: string) => void)|null} onChangeVideoOption
 * @property {string} videoDirectionValue
 * @property {((value: string) => void)|null} onChangeVideoDirection
 */

export {};
