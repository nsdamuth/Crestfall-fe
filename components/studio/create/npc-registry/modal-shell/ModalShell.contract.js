export const NPC_REGISTRY_MODAL_SHELL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the NPC Registry modal frame.
 *
 * The View owns the fixed overlay, modal container, NPC Registry eyebrow,
 * title presentation, close control, scrollable content region, responsive
 * sizing, and safe close-callback invocation. It does not own modal disclosure
 * state, draft values, validation, save behavior, registry mutations, API
 * calls, permissions, or persistence.
 *
 * @typedef {Object} NpcRegistryModalShellViewProps
 * @property {string} title
 * @property {(() => void)|null} onClose
 * @property {import("react").ReactNode} children
 */

export {};
