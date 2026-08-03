export const PROGRESSION_JSON_EDITOR_VIEW_CONTRACT_VERSION =
  "progression_json_editor_view_contract_v1";

/**
 * Stable semantic boundary for the portable Progression JSON Editor View.
 *
 * The View receives display-ready JSON text, validation messages, status text,
 * and semantic callbacks. It does not know creation form fields, persistence
 * payloads, actor state, storage, or how Crestfall saves a creation.
 *
 * @typedef {Object} ProgressionJsonEditorIssue
 * @property {string} path
 * @property {string} message
 *
 * @typedef {Object} ProgressionJsonEditorViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} jsonText
 * @property {ProgressionJsonEditorIssue[]} errors
 * @property {ProgressionJsonEditorIssue[]} warnings
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
