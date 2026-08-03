export const RULES_CODEX_JSON_EDITOR_VIEW_CONTRACT_VERSION =
  "rules_codex_json_editor_view_contract_v1";

/**
 * Stable semantic boundary for the portable Rules Codex JSON Editor View.
 *
 * The View receives display-ready JSON text, validation messages, status text,
 * and semantic callbacks. It does not know creation form fields, persistence
 * payloads, attachment edges, runtime selection, provider prompts, storage, or
 * how Crestfall saves a creation.
 *
 * @typedef {Object} RulesCodexJsonEditorIssue
 * @property {string} path
 * @property {string} message
 *
 * @typedef {Object} RulesCodexJsonEditorViewProps
 * @property {string} title
 * @property {string} description
 * @property {string} jsonText
 * @property {RulesCodexJsonEditorIssue[]} errors
 * @property {RulesCodexJsonEditorIssue[]} warnings
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
