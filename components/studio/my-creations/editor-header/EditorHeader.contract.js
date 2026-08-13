export const EDITOR_HEADER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the editor's identity header
 * (docs/plans/FABLE-GATE-2-STUDIO.md wave ED1, ruling N1 option A).
 * Asset art thumb, display-name title, type eyebrow (the display
 * name from lib/shared/presentation/terminology.js), a visibility
 * status chip (composes KitBadge), and the switcher trigger that
 * opens the creation picker built in wave SW1
 * (components/studio/creation-picker/). Fixture-fed, portable: no
 * Next.js, no Creation client, no picker import; the Binding Shell
 * composes the actual CreationPicker as a ReactNode slot.
 *
 * Unsaved-changes confirm on switch, ruling ED1 "Work": when
 * `hasUnsavedChanges` is true, activating the switcher trigger arms
 * a local two-step confirm ("keep editing" / "discard and switch")
 * before firing `onOpenSwitcher`; when false, the trigger fires
 * `onOpenSwitcher` immediately. UI-only state, no extra props needed
 * for the confirm step itself.
 *
 * @typedef {Object} EditorHeaderViewProps
 * @property {string|null} [imageSrc] Art thumb; the no-image fallback
 *   renders when absent.
 * @property {string} title
 * @property {string} typeLabel Type eyebrow, from the terminology map.
 * @property {string} visibilityLabel "Private" / "Unlisted" /
 *   "Public", or "Canon" when the creation is canon (canon wins).
 * @property {"canon"|"status"} visibilityVariant KitBadge variant.
 * @property {boolean} hasUnsavedChanges
 * @property {string} [switcherLabel] default "Switch creation"
 * @property {(() => void)|null} onOpenSwitcher
 */

export {};
