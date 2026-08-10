export const KIT_MODAL_FRAME_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable portable UI boundary for the unified modal frame kit piece
 * (docs/BUILD-BLUEPRINT.md section 2.5, RULED 9 Aug 2026, carved this
 * pass per docs/SPRINT-A-PLAN.md section 1). The ruled PANEL standing
 * on top of the existing ModalShell behavioral primitive
 * (components/ui/modal-shell/): backdrop dismiss, Escape, and body
 * scroll lock stay owned by ModalShell; this frame owns the panel
 * anatomy (surface, border, radius, shadow, close control) that every
 * caller previously hand-rolled through panelClassName.
 *
 * There is no isOpen prop: the frame renders when mounted, the same
 * ModalShell convention every current caller already follows. There
 * is no prop to hide the close control: it is fixed frame anatomy.
 *
 * @typedef {Object} KitModalFrameViewProps
 * @property {import("react").ReactNode} children panel content; the
 *   caller owns content padding, the frame adds none of its own
 * @property {(() => void)|null} onClose fires from all three ruled
 *   dismissal paths: backdrop click, Escape, and the close control.
 *   Null-safe: with no handler all three are no-ops
 * @property {boolean} closeOnBackdrop default true, pass-through to
 *   ModalShell behavior
 * @property {boolean} closeOnEscape default true, pass-through to
 *   ModalShell behavior
 * @property {"modal"|"sheet"|"viewer"} variant default "modal". "modal"
 *   is the ruled responsive frame: full-screen maximize under 700px
 *   (R4, 10 Aug 2026), centered floating surface at 700px and up.
 *   "sheet" is bottom-docked at every width, for sheet-only consumers
 *   that gate their own mounting by viewport (the dropdown under
 *   700px), and carries a structural close header row (R7, 10 Aug
 *   2026) so the close control never overlaps sheet content. "viewer"
 *   (added 1.1.0, 10 Aug 2026) is the chromeless image-viewer surface
 *   (R2/R5): no panel background, border, shadow, or radius, sticky
 *   nav veil treatment, full-screen maximize under 700px identical to
 *   modal. Empty shell in 1.1.0 phase 1; filled in by the phase 2
 *   viewer rebuild.
 * @property {string} panelClassName per-surface WIDTH and HEIGHT caps
 *   only (e.g. `max-w-lg`); never surface, border, radius, shadow, or
 *   dismissal overrides
 * @property {string} [ariaLabelledBy] forwarded to the dialog, same
 *   as ModalShell
 * @property {string} [ariaDescribedBy] forwarded to the dialog
 * @property {string} [ariaLabel] fallback accessible name for
 *   surfaces with no heading id, rendered as the dialog's accessible
 *   name only when ariaLabelledBy is absent (implemented as a
 *   visually-hidden labelled-by target rather than a raw aria-label
 *   attribute, since the composed ModalShellView accepts
 *   ariaLabelledBy only and is not touched by this package; the
 *   accessible-name result is identical)
 */

export {};
