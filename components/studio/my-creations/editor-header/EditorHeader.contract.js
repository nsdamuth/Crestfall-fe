export const EDITOR_HEADER_VIEW_CONTRACT_VERSION = "2.0.0";

// Version note, 1.0.0 -> 2.0.0 (BREAKING, ED1B,
// docs/plans/ED1B-EDITOR-PAGE-SPEC.md section 3.2): the identity
// header is redesigned for the single-surface editor page.
// - The 56px square art thumb becomes the featured-artwork frame:
//   3:4 portrait, 132px wide from sm, 72px wide at phone widths so
//   the first editable field stays within one short scroll at 390.
//   The no-art fallback renders the frame on --surface-1 with a
//   quiet type icon (new optional `typeIcon`), no text label.
// - New `onOpenSections` callback: renders the "Sections" trigger
//   (below lg only) that opens the O11 bottom-sheet group/section
//   jump list. Null hides the trigger entirely.
// - New `actions` ReactNode seat in the meta row (the Binding Shell
//   seats the Set Default PC control and its status words here for
//   Player Characters; null renders nothing).
// - The header no longer paints its own card surface: it sits on
//   the canvas and the page composition owns the closing rule.
// The unsaved-changes switch confirm behavior is carried forward
// unchanged from 1.0.0.

/**
 * Stable portable UI boundary for the editor's identity header
 * (docs/plans/ED1B-EDITOR-PAGE-SPEC.md section 3.2). Featured
 * artwork, type eyebrow (the display name from
 * lib/shared/presentation/terminology.js: the type identity
 * surface), display-name title, visibility chip (composes
 * KitBadge), the creation switcher beside the artwork, and the
 * mobile Sections trigger. Fixture-fed, portable: no Next.js, no
 * Creation client, no picker import; the Binding Shell composes the
 * actual CreationPicker and the O11 sheet.
 *
 * Unsaved-changes confirm on switch: when `hasUnsavedChanges` is
 * true, activating the switcher arms a local two-step confirm
 * ("Keep editing" / "Discard and switch") before firing
 * `onOpenSwitcher`; when false, the trigger fires immediately.
 * UI-only state, no extra props for the confirm step itself.
 *
 * @typedef {Object} EditorHeaderViewProps
 * @property {string|null} [imageSrc] Featured artwork; the no-art
 *   frame renders when absent.
 * @property {string} title
 * @property {string} typeLabel Type eyebrow, from the terminology map.
 * @property {import("react").ComponentType<{size?: number}>} [typeIcon]
 *   Quiet icon for the no-art frame.
 * @property {string} visibilityLabel "Private" / "Unlisted" /
 *   "Public", or "Canon" when the creation is canon (canon wins).
 * @property {"canon"|"status"} visibilityVariant KitBadge variant.
 * @property {boolean} hasUnsavedChanges
 * @property {string} [switcherLabel] default "Switch creation"
 * @property {(() => void)|null} onOpenSwitcher
 * @property {(() => void)|null} [onOpenSections] Mobile-width
 *   Sections trigger (O11 sheet); null hides the trigger.
 * @property {import("react").ReactNode} [actions] Meta-row seat
 *   (e.g. Set Default PC), composed by the Binding Shell.
 */

export {};
