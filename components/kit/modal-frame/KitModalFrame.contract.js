export const KIT_MODAL_FRAME_VIEW_CONTRACT_VERSION = "1.3.0";

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
 *   is the ruled responsive frame: at 700px and up a centered floating
 *   surface, unchanged. Under 700px (1.2.0, 22 Aug 2026, mobile modal
 *   law, supersedes R4): bottom-anchored at the panel's own content
 *   height, capped at 92dvh with internal scroll, never maximized
 *   full-screen. "sheet" is bottom-docked at every width, for
 *   sheet-only consumers that gate their own mounting by viewport (the
 *   dropdown under 700px), and carries a structural close header row
 *   (R7, 10 Aug 2026) so the close control never overlaps sheet
 *   content; the header row now ends in the ratified fade divider
 *   (B1). "viewer" (added 1.1.0, 10 Aug 2026) is the chromeless
 *   image-viewer surface (R2/R5): no panel background, border, shadow,
 *   or radius, sticky nav veil treatment, full-screen maximize under
 *   700px identical to modal's prior R4 behavior (B7 keeps the viewer
 *   out of the mobile modal law's bottom-anchor scope; it is a
 *   chromeless surface, not a bottom-anchored panel). Its panel is
 *   click-transparent (pointer-events none, R3 review-gate fix, 10 Aug
 *   2026) so backdrop clicks reach the veil and dismiss; viewer
 *   content re-enables pointer events on each interactive box
 *   (presentation behavior, not a prop change).
 * @property {string} panelClassName per-surface WIDTH and HEIGHT caps
 *   only (e.g. `max-w-lg`); never surface, border, radius, shadow, or
 *   dismissal overrides
 * @property {boolean} [hasUnsavedChanges] added 1.2.0, 22 Aug 2026
 *   (mobile modal law, checkable condition 3). Default false. The
 *   frame owns no form state of its own; when the caller reports
 *   unsaved state, all three dismissal paths (backdrop click, Escape,
 *   close control) are intercepted into an in-frame confirm step
 *   ("Discard changes?", Keep editing / Discard, B5 danger-fill
 *   recipe on the destructive action) instead of closing immediately.
 *   With the default false, dismissal behavior is unchanged.
 * @property {boolean} [sheetGrabber] added 1.3.0, 23 Aug 2026
 *   (build-0823 pass 2). Default false. When true and variant is
 *   "sheet", renders a small decorative grabber bar above the sheet
 *   header row (aria-hidden, no drag behavior). With the default
 *   false, sheet rendering is unchanged.
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
