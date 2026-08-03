export const ACTOR_MECHANICS_PROFILE_JSON_EDITOR_VIEW_CONTRACT_VERSION =
  "actor_mechanics_profile_json_editor_view_contract_v1";

/**
 * Stable semantic boundary for the portable Actor Mechanics JSON Editor View.
 *
 * The View receives display-ready JSON text, validation messages, status text,
 * and semantic callbacks. It does not know creation form fields, persistence
 * payloads, actor state or runtime values, storage, or how Crestfall saves a creation.
 *
 * @typedef {Object} ActorMechanicsProfileJsonEditorIssue
 * @property {string} path
 * @property {string} message
 *
 * @typedef {Object} ActorMechanicsProfileJsonEditorViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} jsonText
 * @property {ActorMechanicsProfileJsonEditorIssue[]} errors
 * @property {ActorMechanicsProfileJsonEditorIssue[]} warnings
 * @property {string} statusMessage
 * @property {"idle"|"copied"|"error"} copyStatus
 * @property {"idle"|"downloaded"|"error"} guideDownloadStatus
 * @property {boolean} canApply
 * @property {boolean} hasDraftChanges
 * @property {number} characterCount
 * @property {number} lineCount
 * @property {(() => void)|null} onClose
 * @property {((value: string) => void)|null} onChangeJson
 * @property {(() => void)|null} onCopy
 * @property {(() => void)|null} onDownloadAiGuide
 * @property {(() => void)|null} onFormat
 * @property {(() => void)|null} onReset
 * @property {(() => void)|null} onValidateAndApply
 */
