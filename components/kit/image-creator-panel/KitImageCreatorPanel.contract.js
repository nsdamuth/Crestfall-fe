export const KIT_IMAGE_CREATOR_PANEL_VIEW_CONTRACT_VERSION = "2.1.0";

/**
 * Stable portable UI boundary for the Media Studio composer (kit
 * image creator panel). 2.0.0, 9 Sep 2026 (FE/MEDIA-STUDIO, Brian's
 * notes 1 and 2, docs/references/media-studio/NOTES.md): the Player
 * slot is gone (five fixed slots), the Options expander is gone
 * (options render inline), the coins block is gone (the balance lives
 * in the left sidebar), output count moved beside the Generate
 * button, stage tabs (Generate, Remix) sit under the mode toggle, and
 * the Generate row is a sticky footer. No fetch anywhere; the caller
 * supplies display-ready values and receives intent through named
 * callbacks. Anything the backend cannot do yet renders disabled with
 * the words "Not available yet" and never fakes a result.
 *
 * The five slots are FIXED anatomy, not caller-supplied data: id,
 * label, icon, requirement, and savable-as-preset are owned by this
 * package (mirroring components/studio/image-studio/imageStudioData.js
 * ingredientSlots minus playerCharacter). The caller supplies only
 * each slot's live STATE through the `slots` map, keyed by id.
 *
 * 2.0.0 to 2.1.0, ADDITIVE (FE/MEDIA-STUDIO session 4, 10 Sep 2026,
 * Brian's notes 5, 5a, 5b): one nested `remix` prop carries the whole
 * Remix stage (references, location, prompt with @ mentions, cost,
 * gate). Null keeps the session 1 stub ("Not available yet"). Limits
 * and the cost are the caller's: this View writes no number; the
 * "Up to N characters" line and the cost label arrive pre-computed.
 *
 * @typedef {Object} KitImageCreatorRemixReference
 * @property {string} slotId the Remix character slot this reference
 *   fills; reported back through onChangeCharacter / onRemoveCharacter
 * @property {number} position 1-based slot position, stable for the
 *   life of the selection (a cleared slot leaves a gap the next Add
 *   fills, so a prompt's @img mention keeps pointing at its character)
 * @property {string} mention the prompt handle, "@img1" to "@img6"
 * @property {{title: string, subtitle?: string, imageSrc?: string}} selection
 *   display-ready; imageSrc empty for a once-only custom character
 *
 * @typedef {Object} KitImageCreatorRemixMentionOption
 * @property {string} mention "@img1" or "@location"
 * @property {string} title the asset's name
 * @property {string} [imageSrc]
 *
 * @typedef {Object} KitImageCreatorRemixProps
 * @property {KitImageCreatorRemixReference[]} references filled
 *   character slots in slot order
 * @property {boolean} canAddCharacter false past the limit; the Add
 *   tile renders disabled reading addLimitLabel
 * @property {string} addLimitLabel "Up to 6 characters", computed by
 *   the caller from its one limit constant
 * @property {{slotId: string, mention: string, selection: {title: string, subtitle?: string, imageSrc?: string}|null}} location
 *   the one location slot (mention "@location")
 * @property {(() => void)|null} onAddCharacter opens the shared asset
 *   picker for the first empty character slot
 * @property {((slotId: string) => void)|null} onChangeCharacter
 *   re-opens the picker for a filled slot
 * @property {((slotId: string) => void)|null} onRemoveCharacter
 * @property {(() => void)|null} onSelectLocation opens the picker for
 *   the location slot
 * @property {(() => void)|null} onClearLocation
 * @property {string} promptValue the Remix prompt (required); "@" opens
 *   the mention list, choosing a row inserts its mention at the caret
 * @property {((value: string) => void)|null} onChangePrompt
 * @property {KitImageCreatorRemixMentionOption[]} mentionOptions the
 *   filled references plus the location when filled
 * @property {string} generateCostLabel count times the Remix cost,
 *   pre-computed by the caller
 * @property {boolean} canGenerate honest gate (coins, at least one
 *   character, a prompt), pre-computed by the caller
 * @property {string} generationHelpText the block reason, the disabled
 *   button's tooltip and accessible description
 * @property {boolean} available false renders the Soon treatment on
 *   the footer button (disabled, coin glyph and cost, Soon chip, title
 *   "Not available yet") until the Chassis carries the Remix job
 * @property {(() => void)|null} onGenerate
 *
 * @typedef {"character"|"pose"|"outfit"|"location"|"preset"} KitImageCreatorSlotId
 *
 * @typedef {Object} KitImageCreatorSlotState
 * @property {{title: string, subtitle?: string, imageSrc?: string}|null} selection the
 *   chosen asset, including its display-ready featured image when available,
 *   or null for an empty slot
 * @property {boolean} isCustomMode true renders the inline custom
 *   guidance editor in place of the picker-opening tile
 * @property {string} customText the custom guidance textarea value,
 *   read only while isCustomMode is true
 *
 * @typedef {Object} KitImageCreatorOptionField
 * @property {string} id
 * @property {string} label display label, sentence case; rendered as
 *   the control title above the shared SettingSelect trigger
 * @property {string} value
 * @property {string} [defaultValue] the untouched starting value. When
 *   value matches it the trigger reads in the dim ink; when it differs
 *   the trigger reads gold (state law, browser review round 3 item 2).
 *   Omitted means the control never reads as changed.
 * @property {{value: string, label: string}[]} options
 *
 * @typedef {Object} KitImageCreatorCountOption
 * @property {string} value
 * @property {string} label
 * @property {boolean} [isDisabled] true for counts the backend cannot
 *   serve yet; the row renders disabled
 * @property {string} [tooltip] the disabled reason, rendered as the
 *   row's trailing chip; "Soon" for counts (RULED 10 Sep 2026, round 6)
 *
 * @typedef {Object} KitImageCreatorRailStop
 * @property {string} value
 * @property {string} shortLabel the diagonal step name
 * @property {string} mappedLabel the full workflow name
 * @property {string} [definition] one-line definition shown in the
 *   step's hover or tap tooltip
 * @property {boolean} [active]
 *
 * @typedef {Object} KitImageCreatorPanelViewProps
 * @property {"IMAGE"|"VIDEO"} mode
 * @property {((mode: "IMAGE"|"VIDEO") => void)|null} onChangeMode
 * @property {boolean} videoDisabled true keeps the Video option
 *   non-interactive with the Soon label (alpha default)
 * @property {string} videoSoonLabel
 * @property {"GENERATE"|"REMIX"} stage which stage tab is active;
 *   the caller owns the value (page-local presentation state)
 * @property {((stage: "GENERATE"|"REMIX") => void)|null} onChangeStage
 * @property {KitImageCreatorRemixProps|null} [remix] the Remix stage
 *   body and footer values (2.1.0); null renders the stub
 * @property {Object<KitImageCreatorSlotId, KitImageCreatorSlotState>} slots
 *   keyed by the five fixed slot ids; an id absent from the map renders
 *   as an empty, non-custom slot
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onSlotActivate
 *   fires when a non-custom slot tile is tapped; the caller owns
 *   opening the asset picker
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onSlotClear
 *   fires from the clear control on a filled or custom slot
 * @property {((slotId: KitImageCreatorSlotId, text: string) => void)|null} onCustomChangeText
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onCustomBackToPresets
 *   re-opens the picker for that slot
 * @property {((slotId: KitImageCreatorSlotId) => void)|null} onCustomSavePreset
 *   opens the save-preset modal; only reachable for the four savable
 *   slots (pose, outfit, location, preset)
 * @property {string} promptValue the custom prompt (optional field)
 * @property {((value: string) => void)|null} onChangePrompt
 * @property {string} negativePromptValue
 * @property {((value: string) => void)|null} onChangeNegativePrompt
 * @property {{value: string, defaultValue?: string, activeLabel: string, options: KitImageCreatorRailStop[], onChange: Function}|null} renderStyleRailProps
 *   the six-stop snapping render style rail; presentation is owned
 *   here, profile values and callbacks are supplied by the caller.
 *   defaultValue is the untouched profile: while value matches it the
 *   active step name reads dim, otherwise gold (round 3 item 2)
 * @property {KitImageCreatorOptionField[]} optionFields the inline
 *   single-select dropdowns after Camera framing (Wardrobe theme,
 *   Aspect ratio). Output count is NOT in this list; see countOptions.
 * @property {((fieldId: string, value: string) => void)|null} onChangeOption
 * @property {Object|null} advancedTuningProps optional display-ready bounded
 *   workflow tuning projection, rendered inside the Advanced disclosure
 * @property {KitImageCreatorCountOption[]} countOptions the output count
 *   list beside the Generate button (2, 4, 8, 16, 32, 64, 128, 256; values
 *   the backend cannot serve carry isDisabled and the tooltip)
 * @property {string} countValue the selected count value
 * @property {((value: string) => void)|null} onChangeCount reports the
 *   same selection to the same handler the former Output Count select
 *   used (contract law, FRONTEND-SOP section 13)
 * @property {string} generateCostLabel the coin cost shown on the
 *   Generate button (count times the per-image cost), pre-computed by
 *   the caller; prices come from the backend or the caller's one
 *   constant table, never from this View
 * @property {boolean} canGenerate honest disabled-state gate,
 *   pre-computed by the caller
 * @property {string} generationHelpText the block reason, pre-computed
 *   by the caller; rendered as the disabled button's tooltip and its
 *   accessible description, never as helper copy on the panel
 * @property {string} generationStatus "loading" renders the spinner in
 *   place of the coin glyph while Generate stays available
 * @property {string} generationError live submission error text,
 *   rendered as an alert line above the footer
 * @property {string} cameraPresetLabel selected camera/framing preset label
 * @property {string} cameraPresetDescription selected preset helper copy
 * @property {boolean} cameraPresetChanged true once the viewer picks a
 *   preset other than the Auto default; drives the same dim-or-gold
 *   state law as every other control in Image settings
 * @property {(() => void)|null} onOpenCameraPresetPicker opens the
 *   camera/framing picker (the catalog is too large for inline tiles)
 * @property {boolean} showSceneryOnlyHelper true for location-only requests
 * @property {boolean} sceneryOnlyHelperEnabled whether scenery optimization is active
 * @property {((enabled: boolean) => void)|null} onChangeSceneryOnlyHelper
 * @property {(() => void)|null} onGenerate fires the real job pipeline
 * @property {KitImageCreatorOptionField[]} videoOptionFields Duration,
 *   Video Aspect, Motion Style (video mode, unreachable while videoDisabled)
 * @property {((fieldId: string, value: string) => void)|null} onChangeVideoOption
 * @property {string} videoDirectionValue
 * @property {((value: string) => void)|null} onChangeVideoDirection
 */

export {};
