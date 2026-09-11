export const KIT_SAVE_INGREDIENT_PRESET_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for the custom asset modal kit piece.
 * THE modal Custom opens for every asset type in Media Studio
 * (FE/MEDIA-STUDIO session 2, Brian's note 4, 9 Sep 2026). Standing
 * on KitModalFrame: variant "sheet" with the grabber under 700px (the
 * same sheet the composer uses), variant "modal" at 700px and up.
 * Persistence is live wiring: "Save and use preset" runs the caller's
 * onSavePreset (today POST /api/creations for POSE, OUTFIT, LOCATION,
 * IMAGE_PRESET; see docs/handoffs/MEDIA-STUDIO-BACKEND.md gap 7).
 * Character has no preset type, so the caller passes
 * saveAvailable=false and the button renders disabled with the Soon
 * chip; "Use once" is its live path.
 *
 * No field carries a character cap in the live flow, so none is
 * invented here (token-first / honesty law): no counters render.
 *
 * 1.1.0 to 2.0.0, BREAKING (session 2, 10 Sep 2026): presetTypeLabel
 * renamed assetLabel; helperText removed (no bottom note); added
 * message, messageTone (the caller's save error, previously passed
 * and silently dropped), canUseOnce, saveAvailable, hasUnsavedChanges.
 * Buttons read "Use once" (secondary, left) and "Save and use preset"
 * (primary, right). Placeholders describe the asset in plain words.
 *
 * @typedef {Object} KitSaveIngredientPresetViewProps
 * @property {string} assetLabel the modal title, the asset word
 *   (Character, Pose, Outfit, Location, Preset)
 * @property {string} introText one sentence under the title
 * @property {string} [message] a save result line; empty renders
 *   nothing
 * @property {"info"|"error"} [messageTone] error renders in the
 *   status-danger text tier with the word "Error" beside it
 * @property {string} nameValue
 * @property {((value: string) => void)|null} onChangeName
 * @property {string} descriptionValue
 * @property {((value: string) => void)|null} onChangeDescription
 * @property {string} promptValue
 * @property {((value: string) => void)|null} onChangePrompt
 * @property {string} tagsValue
 * @property {((value: string) => void)|null} onChangeTags
 * @property {boolean} isSaving
 * @property {boolean} canSave pre-computed by the caller: name and
 *   prompt both non-empty
 * @property {boolean} [canUseOnce] pre-computed by the caller: prompt
 *   non-empty
 * @property {boolean} [saveAvailable] false renders "Save and use
 *   preset" disabled with the Soon chip (no preset type for this
 *   asset yet)
 * @property {boolean} [hasUnsavedChanges] routes dismissal through the
 *   frame's confirm step; the caller decides what counts as dirty
 * @property {(() => void)|null} onSavePreset
 * @property {(() => void)|null} onUseOnce applies the prompt to the
 *   slot once, without saving; the caller closes
 * @property {string|null} [backLabel] NESTED MODAL LAW: when this
 *   modal opens from inside another modal (the mobile composer
 *   sheet), the caller passes a labeled back row above the title,
 *   firing onClose. Null when opened as a top-level modal.
 * @property {(() => void)|null} onClose the caller passes null while
 *   isSaving is true so backdrop, Escape, and the close control are
 *   all no-ops (KitModalFrame's null-safe dismissal)
 */

export {};
