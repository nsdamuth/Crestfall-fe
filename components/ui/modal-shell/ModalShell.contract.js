export const MODAL_SHELL_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable UI boundary for the shared floating-modal frame used across the
 * studio (12 callers per docs/SHELL-INVENTORY.md).
 *
 * The View owns the fixed overlay, scrim, blur, backdrop dismiss surface,
 * dialog semantics, and the panel slot. It does not own open/closed
 * disclosure state outside the current render, escape-key handling, or
 * body-scroll locking; those are ViewModel behavior.
 *
 * 1.1.0 (10 Aug 2026, kit polish 3 pass, R2/R5): additive `veilClassName`
 * prop, a full substitution for the veil's background/blur treatment
 * (default unchanged: `--scrim-strong` plus `--blur-panel`). Added so
 * KitModalFrame's `viewer` variant can supply the sticky nav
 * chrome-frost veil instead, per docs/BUILD-BLUEPRINT.md 2.16 (r).
 * Every other consumer is unaffected unless it opts in.
 *
 * @typedef {Object} ModalShellViewProps
 * @property {import("react").ReactNode} children
 * @property {string} className
 * @property {string} [veilClassName] full substitution for the veil's
 *   background/blur classes; omit for the default scrim-plus-blur
 * @property {string} panelClassName
 * @property {string} [ariaLabelledBy]
 * @property {string} [ariaDescribedBy]
 * @property {(event: import("react").MouseEvent) => void} onBackdropMouseDown
 */

export {};
