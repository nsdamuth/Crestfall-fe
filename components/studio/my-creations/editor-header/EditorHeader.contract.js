export const EDITOR_HEADER_VIEW_CONTRACT_VERSION = "3.0.0";

// Version note, 2.0.0 -> 3.0.0 (BREAKING, ED1C,
// docs/plans/ED1B-EDITOR-PAGE-SPEC.md section 3.2): the identity
// header becomes the ARTWORK HERO. Brian's 13 Aug direction: the
// artwork is the hero at the top, primary art large, slots beside
// it, generate-more and go-to-Images actions, so switching
// creations immediately shows what you are working on.
//
// Breaking:
// - `imageSrc` becomes `primaryImageSrc` (the ACTIVE featured
//   slot's image, large 3:4 frame: 232px wide from sm, 148px at
//   phone widths).
// - New `slots` array + `onSelectSlot`: the other featured slots
//   render as a thumb rail beside the primary art; tapping a thumb
//   makes it the displayed primary. New `onReplaceActiveSlot`
//   opens the featured image picker (KitModalFrame) for the active
//   slot.
// - New `generateHref` ("Generate more", routes to the Images
//   generation surface) and `imageLibraryHref` ("Image library").
// - REMOVED: `hasUnsavedChanges`, `switcherLabel`,
//   `onOpenSwitcher`, `onOpenSections`. The creation switcher, its
//   unsaved-changes confirm, and the Sections trigger moved to the
//   page's ToC rail / mobile bottom bar (Editor contract 4.0.0);
//   this package no longer knows about save state or navigation.
// Carried forward: `title`, `typeLabel`, `typeIcon`,
// `visibilityLabel`/`visibilityVariant`, `actions` meta-row seat.

/**
 * Stable portable UI boundary for the editor's artwork hero
 * (docs/plans/ED1B-EDITOR-PAGE-SPEC.md section 3.2). Primary art
 * large with the remaining featured slots beside it, type eyebrow
 * (terminology map: the type identity surface), title, visibility
 * chip, and the artwork actions (Replace image, Generate more,
 * Image library). Fixture-fed, portable: no Next.js, no Creation
 * client; hrefs arrive as strings, intents as callbacks.
 *
 * @typedef {Object} EditorHeroSlot
 * @property {string} id
 * @property {number} index featured-slot index (0..3)
 * @property {string} label "Primary" / "Alt 1" / ...
 * @property {string|null} imageSrc
 * @property {boolean} isActive the slot currently shown as primary
 *
 * @typedef {Object} EditorHeaderViewProps
 * @property {string|null} [primaryImageSrc] Active slot's image;
 *   the no-art frame (quiet type icon) renders when absent.
 * @property {EditorHeroSlot[]} [slots]
 * @property {((index: number) => void)|null} [onSelectSlot]
 * @property {(() => void)|null} [onReplaceActiveSlot]
 * @property {string|null} [generateHref]
 * @property {string|null} [imageLibraryHref]
 * @property {string} title
 * @property {string} typeLabel
 * @property {import("react").ComponentType<{size?: number}>} [typeIcon]
 * @property {string} visibilityLabel
 * @property {"canon"|"status"} visibilityVariant
 * @property {import("react").ReactNode} [actions] Meta-row seat
 *   (e.g. Set Default PC), composed by the Binding Shell.
 */

export {};
