export const EDITOR_VIEW_CONTRACT_VERSION = "2.0.0";

// Version note, 1.2.0 -> 2.0.0 (BREAKING, ED1, wave X of
// docs/plans/FABLE-GATE-2-STUDIO.md, rulings N1/N2/N5/N6/N7 and
// standing O11, all ratified option A): the editor shell redesign.
//
// Breaking:
// - `stickyActionBar` ReactNode slot REMOVED. Replaced by two new
//   required slots, `header` (the new editor-header package: art
//   thumb, title, type eyebrow, visibility chip, switcher trigger)
//   and `saveBar` (the new editor-save-bar package, N2: top-docked,
//   visible only when dirty, Save + Discard + status word). The
//   inert emerald Public toggle that lived on the sticky bar is
//   retired with it; status now reads through the header's
//   visibility chip and the Publishing group.
// - Section nav model changed: flat `activeSections` pill row is now
//   ALSO grouped. New required props `activeSectionGroups` (per-type
//   groups of at most five, schema-as-data,
//   creationEditConstants.js), `activeGroupId`, `onSelectGroup`.
//   `activeSections` stays (now scoped to in-group section flow
//   under the active group) and `onSelectSection` is unchanged.
// - Dead `isLoreDocumentSection` typedef field removed (never wired
//   to any real prop).
//
// Additive:
// - `creationPicker` ReactNode slot: the SW1 creation picker, opened
//   by the header's switcher trigger, rendered as an overlay when
//   present.
// - `isLoading` (boolean, default false): a loading skeleton state,
//   product-inert today (the fixture-first mock resolver never has a
//   real async gap); the preview mirror exercises it via a harness
//   override, same precedent as `originOverride`.
// - `mobileNavOpen` / `onToggleMobileNav`: wired for real this pass
//   (O11 option A, standing ruling). Were passed by the Binding Shell
//   before this wave but silently dropped by the View; now open the
//   bottom-sheet section picker (KitModalFrame `variant="sheet"`),
//   listing every group and section, alongside the unchanged
//   horizontally-scrolling group tabs.
// - `overviewDescription` / `overviewContentRating`: feed the
//   per-type overview summary card that leads the first group.
//
// Unsaved-changes confirm on switch lives in the `header` slot's own
// package (editor-header), not this contract: the switcher trigger
// arms a local confirm before firing its `onOpenSwitcher`.
//
// Version note, 1.1.0 -> 1.2.0 (additive, vault-edit-tree pass, 11 Aug
// 2026): two optional props close two CR-007/CR-008 held rows the
// classification found buildable. `isLoreDraftPreview` (boolean,
// default false) shows an "Owner-only draft preview" badge above the
// section content panel when the Binding Shell resolves the active
// section to Lore's rehosted Public Preview (CSV row 839; the
// standalone preview page's badge has no v2 equivalent otherwise).
// `imageLibraryHref` (string|null, default null) renders a "Manage
// image library" link beside the media panel, routing to the new
// `/studio/v2/editor/[id]/image-library` page (CSV rows 409-421, 430).
// Both are additive; every existing consumer is unaffected when
// unset.
//
// Version note, 1.0.0 -> 1.1.0 (additive, RULED 11 Aug 2026): the back
// control returns to the surface that opened the editor (Studio hub
// quick-create, Vault popup edit), falling back to /studio/v2/vault
// when no origin is known. Origin resolution is the Binding Shell's
// business (`../Editor.jsx`), never the View's; the View swaps the
// old `backAction` ReactNode slot for a plain `backLabel` string and
// `onBack` callback so it stays presentation only. The visible label
// is now the neutral "Back" (it previously named a fixed destination,
// "← Vault").

/**
 * Stable portable UI boundary for the advanced editor page View
 * (docs/STUDIO-SPEC.md sections 1, 4, 6, 8.3; docs/plans/
 * FABLE-GATE-2-STUDIO.md wave ED1). Build address
 * `/studio/v2/editor/[id]` (deep-linkable); `/studio/v2/editor` (new
 * index, this wave) renders the empty "Select a creation to edit"
 * state with the picker call to action. Mobile-first at 390: single
 * column, thumb-reachable group tabs plus in-group section flow, no
 * horizontal overflow, the O11 bottom-sheet section picker, fully
 * functional at 1440.
 *
 * Composition, rehost then seat (docs/STUDIO-SPEC.md 4.2, the ruling
 * amendment on Lore): editor header (identity, switcher) -> save bar
 * (N2, visible only when dirty) -> group tabs + in-group section flow
 * (resolved per creation type by the read-only
 * `resolveCreationEditSections`/`resolveCreationEditSectionGroups`
 * helpers in `creation-edit-shell/useCreationEditShellViewModel.js`)
 * -> the two-slot body: media panel (+ Mechanics quick nav when the
 * Mechanics Fields section is active) and the section content panel,
 * led by the overview summary card on the first group's overview
 * section -> named absorption seats (`seats.bodyDetail`,
 * `seats.behaviorDetail`, `seats.advancedPrompting`), always null
 * this pass, no placeholder UI -> the featured image picker modal and
 * the creation picker (switcher), each when open.
 *
 * The View never imports a Creation client, Next.js, or any
 * `components/studio/my-creations/**` package. Every section body,
 * every media/quick-nav/header/save-bar surface, and the featured
 * image picker / creation picker arrive as already-composed
 * `ReactNode` slots built by the Binding Shell (`../Editor.jsx`).
 *
 * @typedef {Object} EditorSectionTab
 * @property {string} id
 * @property {string} label
 * @property {import("react").ComponentType<{size?: number}>} [icon]
 *
 * @typedef {Object} EditorSectionGroup
 * @property {string} id
 * @property {string} label
 * @property {string[]} sectionIds
 *
 * @typedef {Object} EditorSeats
 * @property {import("react").ReactNode} [bodyDetail] Mounts under the
 *   "body" section, beside the existing rehosted Body section. Seated
 *   for a future brief's Body detail absorption section. Null this
 *   pass.
 * @property {import("react").ReactNode} [behaviorDetail] Mounts under
 *   the "behavior" section. Null this pass.
 * @property {import("react").ReactNode} [advancedPrompting] Mounts
 *   under the "advanced" section. Null this pass.
 *
 * @typedef {Object} EditorViewProps
 * @property {string} creationId
 * @property {string} title
 * @property {boolean} isTemplate
 * @property {string} activeSection
 * @property {EditorSectionTab[]} activeSections
 * @property {EditorSectionGroup[]} activeSectionGroups
 * @property {string} activeGroupId
 * @property {(groupId: string) => void} onSelectGroup
 * @property {(sectionId: string) => void} onSelectSection
 * @property {boolean} canSetDefaultPc
 * @property {boolean} settingDefaultPc
 * @property {() => void} onSetDefaultPc
 * @property {string|null} defaultPcStatus
 * @property {string|null} defaultPcError
 * @property {boolean} showMechanicsQuickNav
 * @property {string} backLabel
 * @property {() => void} onBack
 * @property {boolean} [isLoreDraftPreview] Shows the owner-only draft
 *   preview badge above the section content panel.
 * @property {string|null} [imageLibraryHref] When set, renders a
 *   "Manage image library" link beside the media panel.
 * @property {boolean} [isLoading] default false.
 * @property {string|null} [overviewDescription]
 * @property {string|null} [overviewContentRating]
 * @property {import("react").ReactNode} header
 * @property {import("react").ReactNode} saveBar
 * @property {import("react").ReactNode} mediaPanel
 * @property {import("react").ReactNode} mechanicsQuickNav
 * @property {import("react").ReactNode} sectionContent
 * @property {EditorSeats} seats
 * @property {import("react").ReactNode} featuredImagePicker
 * @property {import("react").ReactNode} [creationPicker]
 * @property {boolean} mobileNavOpen
 * @property {() => void} onToggleMobileNav
 * @property {{label: string, message: string}|null} loadError R4
 *   honest-stub notice for the resolved-[id] load path, rendered when
 *   the mock module has no fixture for this id and the live client
 *   call fails.
 * @property {import("react").ReactNode} [harnessSlot] Dev-only
 *   fixture-id switcher, never product.
 */

export {};
