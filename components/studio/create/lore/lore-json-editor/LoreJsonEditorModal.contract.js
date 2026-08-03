export const LORE_JSON_EDITOR_VIEW_CONTRACT_VERSION =
  "lore_json_editor_view_contract_v1";

/**
 * Stable semantic boundary for the portable Lore JSON Editor View.
 *
 * The View receives display-ready JSON text, validation messages, status text,
 * and semantic callbacks. It does not know creation form fields, persistence
 * payloads, storage, or how Crestfall saves a creation.
 *
 * @typedef {Object} LoreJsonEditorIssue
 * @property {string} path
 * @property {string} message
 *
 * @typedef {Object} LoreJsonEditorViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} jsonText
 * @property {LoreJsonEditorIssue[]} errors
 * @property {LoreJsonEditorIssue[]} warnings
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
