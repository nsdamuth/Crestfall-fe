export const MODAL_SHELL_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the shared floating-modal frame used across the
 * studio (12 callers per docs/SHELL-INVENTORY.md).
 *
 * The View owns the fixed overlay, scrim, blur, backdrop dismiss surface,
 * dialog semantics, and the panel slot. It does not own open/closed
 * disclosure state outside the current render, escape-key handling, or
 * body-scroll locking; those are ViewModel behavior.
 *
 * @typedef {Object} ModalShellViewProps
 * @property {import("react").ReactNode} children
 * @property {string} className
 * @property {string} panelClassName
 * @property {string} [ariaLabelledBy]
 * @property {string} [ariaDescribedBy]
 * @property {(event: import("react").MouseEvent) => void} onBackdropMouseDown
 */

export {};
