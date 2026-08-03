export const MECHANICS_DOCUMENT_ORCHESTRATION_VIEW_CONTRACT_VERSION =
  "mechanics_document_orchestration_view_contract_v1";

/**
 * Portable controls for complete Mechanics document operations.
 *
 * The View owns only button presentation. It does not know creation form
 * fields, persistence, saved asset IDs, JSONB, or how atomic replacement is
 * implemented by the create/edit parent assembly.
 *
 * @typedef {Object} MechanicsDocumentOrchestrationControlsViewProps
 * @property {boolean} canReplaceData
 * @property {string} presetButtonTitle
 * @property {string} jsonButtonTitle
 * @property {(() => void)|null} onOpenPresetLibrary
 * @property {(() => void)|null} onOpenJsonEditor
 */
