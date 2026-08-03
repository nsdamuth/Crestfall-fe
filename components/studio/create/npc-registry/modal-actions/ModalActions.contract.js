export const NPC_REGISTRY_MODAL_ACTIONS_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the NPC Registry modal action row.
 *
 * The View owns Cancel and primary-action presentation, alignment, button
 * styling, visible primary-action copy, and safe semantic callback invocation.
 * It does not own draft state, validation, whether saving is allowed, modal
 * disclosure, registry mutations, API calls, permissions, or persistence.
 *
 * @typedef {Object} NpcRegistryModalActionsViewProps
 * @property {(() => void)|null} onClose
 * @property {(() => void)|null} onSave
 * @property {string} saveLabel
 */

export {};
