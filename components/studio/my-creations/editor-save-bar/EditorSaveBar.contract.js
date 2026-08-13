export const EDITOR_SAVE_BAR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the editor's save treatment,
 * ruling N2 option A (docs/plans/FABLE-GATE-2-STUDIO.md wave ED1):
 * a top-docked contextual save bar sitting directly under the editor
 * header, appearing only when there is something to say about save
 * state. Replaces the floating bottom sticky action bar
 * (`edit/creation-edit-sticky-action-bar`, retired for the v2 editor,
 * recorded in its own README) for the v2 editor page only.
 * Publishing controls (visibility, review, canon, unlist) do not
 * live here; they moved into the Publishing group
 * (`creation-publishing-section`).
 *
 * Visible whenever `hasUnsavedChanges` is true, or while `saveStatus`
 * is anything other than "idle" (a brief "Saved" or error word after
 * a save even once the form is clean again). Fixture-fed, portable:
 * no Creation client, no persistence.
 *
 * @typedef {Object} EditorSaveBarViewProps
 * @property {boolean} hasUnsavedChanges
 * @property {"idle"|"saving"|"saved"|"error"} saveStatus
 * @property {string} [saveMessage]
 * @property {(() => void)|null} onSave
 * @property {(() => void)|null} onDiscard
 */

export {};
