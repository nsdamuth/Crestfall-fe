export const MECHANICS_JSON_EDITOR_VIEW_CONTRACT_VERSION =
  "mechanics_json_editor_view_contract_v1_1";

/**
 * Stable semantic boundary for the portable Mechanics JSON Editor View.
 *
 * The View receives display-ready JSON text, validation messages, status text,
 * and semantic callbacks. It does not know creation form field names, JSONB
 * storage, persistence payloads, or how Crestfall saves a creation.
 *
 * @typedef {Object} MechanicsJsonEditorIssue
 * @property {string} path
 * @property {string} message
 *
 * @typedef {Object} MechanicsJsonEditorViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} jsonText
 * @property {MechanicsJsonEditorIssue[]} errors
 * @property {MechanicsJsonEditorIssue[]} warnings
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
