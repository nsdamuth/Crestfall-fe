export const EDITOR_SAVE_BAR_VIEW_CONTRACT_VERSION = "2.0.0";

// Version note, 1.0.0 -> 2.0.0 (BREAKING behavior, ED1B,
// docs/plans/ED1B-EDITOR-PAGE-SPEC.md section 3.3): the visibility
// law changes. The bar is visible when and only when there is
// something to act on or to read: `hasUnsavedChanges` is true, a
// save is in flight (`saveStatus` "saving"), or the last save
// failed (`saveStatus` "error"). A successful save no longer pins
// the bar: at `saveStatus` "saved" with a clean form the bar is
// HIDDEN (the bar disappearing is the confirmation). Prop shapes
// are unchanged; the meaning change is the break. `saveMessage` is
// plain language supplied by the caller's ViewModel; a raw client
// `error.message` must never be passed here.

/**
 * Stable portable UI boundary for the editor's save treatment,
 * ruling N2 option A as amended by ED1B
 * (docs/plans/ED1B-EDITOR-PAGE-SPEC.md section 3.3): a contextual
 * save bar docked directly under the sticky top bar
 * (`sticky top-[var(--topbar-h)]`), appearing only when something
 * changed, is saving, or failed to save. Publishing controls
 * (visibility, review, canon, unlist) do not live here; they are in
 * the Publishing group (`creation-publishing-section`). Fixture-fed,
 * portable: no Creation client, no persistence.
 *
 * @typedef {Object} EditorSaveBarViewProps
 * @property {boolean} hasUnsavedChanges
 * @property {"idle"|"saving"|"saved"|"error"} saveStatus
 * @property {string} [saveMessage] Plain language only.
 * @property {(() => void)|null} onSave
 * @property {(() => void)|null} onDiscard
 */

export {};
