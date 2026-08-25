export const KIT_SAVE_INGREDIENT_PRESET_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable portable UI boundary for the save-ingredient-preset kit
 * piece (docs/SPRINT-E-PLAN.md section 1.3, R6). Fixture-driven
 * mirror of the live save-preset modal's function
 * (components/studio/image-studio/save-ingredient-preset/, READ ONLY
 * reference, never imported). Standing on KitModalFrame
 * (variant="modal"). Only POSE, OUTFIT, LOCATION, and IMAGE_PRESET
 * are savable live; this piece never gates that itself, the caller
 * only opens it from a savable slot's custom editor (1.1).
 *
 * No field carries a character cap in the live flow, so none is
 * invented here (token-first / honesty law): no counters render.
 *
 * 1.0.0 to 1.1.0, additive: backLabel. NESTED MODAL LAW (the R1
 * credits pattern, generalized 10 Aug 2026): when this piece opens
 * from inside another modal (Images v2's mobile create-image panel,
 * under 700px), the caller passes a labeled backLabel so the return
 * path reads at a glance, rather than a bare close icon. Null when
 * opened as a top-level modal.
 *
 * @typedef {Object} KitSaveIngredientPresetViewProps
 * @property {string} presetTypeLabel the modal title (e.g. "Pose
 *   Preset"), mirroring the live per-slot label mapping
 * @property {string} introText
 * @property {string} helperText
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
 *   prompt both non-empty, matching the live `canSave` gate
 * @property {(() => void)|null} onSavePreset opens the R4
 *   fixture-action notice in every fixture-mode consumer; the real
 *   persistence call is live wiring
 * @property {(() => void)|null} onUseOnce closes without persisting
 * @property {string|null} [backLabel] Added 1.1.0. Non-null renders a
 *   labeled back row above the title (e.g. "Back to Image Creator"),
 *   firing onClose, for the nested-modal case.
 * @property {(() => void)|null} onClose the caller passes null while
 *   isSaving is true so backdrop, Escape, and the close control are
 *   all no-ops (KitModalFrame's null-safe dismissal), matching the
 *   live "saving state disables close" rule
 */

export {};
