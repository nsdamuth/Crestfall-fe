export const EDITOR_VIEW_CONTRACT_VERSION = "3.0.0";

// Version note, 2.0.0 -> 3.0.0 (BREAKING, ED1B,
// docs/plans/ED1B-EDITOR-PAGE-SPEC.md): the tab model is retired
// after Brian's NO on the ED1 render. The page becomes ONE scrolling
// document per creation: identity header (featured artwork +
// switcher), contextual save bar, the quick-create fields first and
// open (the essentials group), then the advanced fields in named
// collapsible groups per type. Rulings N1 (substance: type-aware
// schema-as-data grouping, at most five groups, type identity in the
// header), N2, N5, N6, N7 and O11 stand; the 13 Aug binding
// experience description governs presentation.
//
// Breaking:
// - Tab-model props REMOVED: `activeSection`, `activeSections`,
//   `activeSectionGroups`, `activeGroupId`, `onSelectGroup`,
//   `onSelectSection`, `sectionContent` (single active node),
//   `showMechanicsQuickNav`/`mechanicsQuickNav` (now a section
//   lead), `seats` (renamed and re-keyed, below),
//   `overviewDescription`/`overviewContentRating` (the overview
//   summary card is redundant on a surface where the overview
//   section itself is visible), `creationId`/`title`/`isTemplate`
//   (identity renders only through the `header` slot; internal ids
//   never render), `isLoreDraftPreview` (now a section badge),
//   `canSetDefaultPc`/`settingDefaultPc`/`onSetDefaultPc`/
//   `defaultPcStatus`/`defaultPcError` (the Set Default PC control
//   moves into the header's `actions` seat, composed by the Binding
//   Shell).
// - New grouped-document props: `groups` (ED1B grammar joined with
//   section metadata; first entry renders open as the essentials
//   region, the rest as collapsible disclosure rows),
//   `openGroupIds`, `onToggleGroup`, `onJumpToGroup` (the O11 sheet
//   and anchor scrolling), `sectionNodes` (sectionId -> composed
//   section body), `sectionLeads` (sectionId -> node rendered above
//   the section body, e.g. the Mechanics quick nav above "fields"),
//   `sectionBadges` (sectionId -> badge node, e.g. the Lore
//   owner-only draft preview badge above "preview"), `sectionSeats`
//   (sectionId -> absorption seat node, the old `seats` re-keyed by
//   section id), `mediaPanel` + `imageLibraryHref` (rendered inside
//   the group whose grammar entry carries `hostsMedia`; media-less
//   types per ruling N5 simply have no such group).
// - `loadError` becomes a friendly full-surface state: fixed plain
//   copy plus `onRetryLoad` and `onOpenPickerFromError` callbacks.
//   Raw client error strings never reach this View.
//
// Carried forward: `header` and `saveBar` slots, `backLabel`/
// `onBack` (origin behavior unchanged), `featuredImagePicker`,
// `creationPicker`, `isLoading`, `mobileNavOpen`/
// `onToggleMobileNav` (O11: now a group/section JUMP list, not a
// section switcher), `harnessSlot`.

/**
 * Stable portable UI boundary for the advanced editor page View
 * (docs/plans/ED1B-EDITOR-PAGE-SPEC.md). Build addresses:
 * `/studio/v2/editor/[id]` (deep-linkable) and `/studio/v2/editor`
 * (index, the "Select a creation to edit" state). Mobile-first at
 * 390: compact header art, single column, the O11 bottom-sheet jump
 * list, no horizontal overflow; the same single document at 1440 in
 * a centered max-w-3xl column.
 *
 * Composition, top to bottom: Back link -> `header` (editor-header
 * 2.0.0: featured artwork, type eyebrow, title, visibility chip,
 * switcher, mobile Sections trigger) -> closing hairline rule ->
 * `saveBar` (editor-save-bar 2.0.0: dirty/saving/save-error only)
 * -> essentials region (first group, open: the quick-create fields)
 * -> collapsible advanced groups in order, Publishing always last ->
 * the featured image picker and creation picker overlays when open.
 *
 * The View never imports a Creation client, Next.js, or any
 * `components/studio/my-creations/**` package. Every section body
 * arrives pre-composed in `sectionNodes`, built by the Binding Shell
 * (`../Editor.jsx`) by mounting the read-only
 * `CreationEditSectionContent` once per section id.
 *
 * @typedef {Object} EditorPageSection
 * @property {string} id
 * @property {string} label
 * @property {import("react").ComponentType<{size?: number}>} [icon]
 *
 * @typedef {Object} EditorPageGroup
 * @property {string} id
 * @property {string} label
 * @property {boolean} [hostsMedia] This group hosts the media panel
 *   and the image-library link above its sections.
 * @property {EditorPageSection[]} sections
 *
 * @typedef {Object} EditorViewProps
 * @property {EditorPageGroup[]} groups First entry is the open
 *   essentials region; the rest render as collapsible rows.
 * @property {string[]} openGroupIds
 * @property {(groupId: string) => void} onToggleGroup
 * @property {(groupId: string) => void} onJumpToGroup Opens the
 *   group (no toggle-off) and closes the mobile sheet; the View
 *   scrolls the anchor.
 * @property {Object<string, import("react").ReactNode>} sectionNodes
 * @property {Object<string, import("react").ReactNode>} [sectionLeads]
 * @property {Object<string, import("react").ReactNode>} [sectionBadges]
 * @property {Object<string, import("react").ReactNode>} [sectionSeats]
 * @property {import("react").ReactNode} [mediaPanel]
 * @property {string|null} [imageLibraryHref]
 * @property {string} backLabel
 * @property {() => void} onBack
 * @property {import("react").ReactNode} header
 * @property {import("react").ReactNode} saveBar
 * @property {import("react").ReactNode} [featuredImagePicker]
 * @property {import("react").ReactNode} [creationPicker]
 * @property {{message?: string}|null} loadError Truthy renders the
 *   friendly full-surface load-error state (fixed plain copy; the
 *   message value itself is not rendered).
 * @property {() => void} [onRetryLoad]
 * @property {() => void} [onOpenPickerFromError]
 * @property {boolean} [isLoading] default false.
 * @property {boolean} mobileNavOpen
 * @property {() => void} onToggleMobileNav
 * @property {import("react").ReactNode} [harnessSlot] Dev-only
 *   fixture switcher, never product.
 */

export {};
