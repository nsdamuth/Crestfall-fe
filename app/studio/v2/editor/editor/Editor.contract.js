export const EDITOR_VIEW_CONTRACT_VERSION = "4.0.0";

// Version note, 3.0.0 -> 4.0.0 (BREAKING, ED1C,
// docs/plans/ED1B-EDITOR-PAGE-SPEC.md, Brian's 13 Aug direction):
// the single-surface document becomes the hero + accordion + rail
// architecture.
//
// Breaking:
// - `header`/`saveBar` slots REMOVED. The artwork hero arrives as
//   the `hero` slot (editor-header 3.0.0); the save controls are no
//   longer a slot at all: the View renders them itself in the
//   desktop ToC rail and the mobile bottom bar from the new
//   save-state props (`isDirty`, `saveStatus`, `saveErrorCopy`,
//   `onSave`, `onDiscard`). editor-save-bar is RETIRED for this
//   route (recorded in its README).
// - Accordion model replaces open-groups: `openSectionId` (single,
//   null legal) + `onOpenSection` replace `openGroupIds`/
//   `onToggleGroup`/`onJumpToGroup`. Exactly one section box is
//   open at a time; each section is one distinct box opened from
//   its own header or the ToC.
// - New `sectionMarks` ({sectionId: "dirty"|"saved"}) drive the
//   per-section state marks in the ToC and on box headers.
// - New switcher props on the View (`onOpenSwitcher`): the creation
//   switcher moved into the rail/sheet, with the unsaved-changes
//   confirm armed inline there (presentation-local state).
// - `groups` no longer carries `hostsMedia`: artwork moved into the
//   hero; the media group is gone from the page grammar (the ED1C
//   resolver strips it).
// - `mobileNavOpen`/`onToggleMobileNav` now open the ED1C bottom
//   sheet (switcher + save block + ToC), the O11 seat.
//
// Carried forward: `backLabel`/`onBack`, `sectionNodes`/
// `sectionLeads`/`sectionBadges`/`sectionSeats`, `loadError` +
// `onRetryLoad`/`onOpenPickerFromError`, `isLoading`,
// `featuredImagePicker`, `creationPicker`, `harnessSlot`,
// `imageLibraryHref` (consumed by the hero via the Binding Shell,
// no longer rendered by this View).

/**
 * Stable portable UI boundary for the advanced editor page View
 * (docs/plans/ED1B-EDITOR-PAGE-SPEC.md, ED1C revision). Build
 * addresses: `/studio/v2/editor/[id]` (deep-linkable) and
 * `/studio/v2/editor` (index). Desktop (lg+): content column +
 * sticky right rail (switcher, always-visible save block, ToC with
 * per-section marks). Mobile-first at 390: hero compact, single
 * column, sticky bottom control bar (Sections + save state + Save)
 * opening the bottom sheet.
 *
 * Composition, top to bottom: Back link -> `hero` slot (artwork
 * hero) -> section boxes in grammar order (quick-create groups
 * first; quiet group separators; ONE box open at a time; every
 * section body wrapped by the Binding Shell in
 * EditorSectionChromeContext so internal header stacks suppress) ->
 * rail (desktop) / bottom bar + sheet (mobile) -> overlays.
 *
 * The View never imports a Creation client, Next.js, or any
 * `components/studio/my-creations/**` package.
 *
 * @typedef {Object} EditorPageSection
 * @property {string} id
 * @property {string} label
 * @property {import("react").ComponentType<{size?: number}>} [icon]
 *
 * @typedef {Object} EditorPageGroup
 * @property {string} id
 * @property {string} label
 * @property {EditorPageSection[]} sections
 *
 * @typedef {Object} EditorViewProps
 * @property {EditorPageGroup[]} groups Quick-create groups first.
 * @property {string|null} openSectionId Single open box; null = all
 *   closed. The ViewModel defaults it to the first section.
 * @property {(sectionId: string|null) => void} onOpenSection
 *   Opening a section closes every other; passing the open id (or
 *   null) closes it.
 * @property {Object<string, "dirty"|"saved">} [sectionMarks]
 * @property {boolean} isDirty
 * @property {"idle"|"saving"|"saved"|"error"} saveStatus
 * @property {string} [saveErrorCopy] Plain language only.
 * @property {(() => void)|null} onSave
 * @property {(() => void)|null} onDiscard
 * @property {(() => void)|null} onOpenSwitcher Fires after the
 *   inline unsaved-changes confirm when dirty.
 * @property {Object<string, import("react").ReactNode>} sectionNodes
 * @property {Object<string, import("react").ReactNode>} [sectionLeads]
 * @property {Object<string, import("react").ReactNode>} [sectionBadges]
 * @property {Object<string, import("react").ReactNode>} [sectionSeats]
 * @property {string} backLabel
 * @property {() => void} onBack
 * @property {import("react").ReactNode} hero
 * @property {import("react").ReactNode} [featuredImagePicker]
 * @property {import("react").ReactNode} [creationPicker]
 * @property {{message?: string}|null} loadError
 * @property {() => void} [onRetryLoad]
 * @property {() => void} [onOpenPickerFromError]
 * @property {boolean} [isLoading]
 * @property {boolean} mobileNavOpen
 * @property {() => void} onToggleMobileNav
 * @property {import("react").ReactNode} [harnessSlot]
 */

export {};
