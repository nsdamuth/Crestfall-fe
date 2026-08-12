export const EDITOR_VIEW_CONTRACT_VERSION = "1.2.0";

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
 * (docs/STUDIO-SPEC.md sections 1, 4, 6, 8.3; Sprint H OPEN item 40,
 * option A). New page this pass, contract authorized none to 1.0.0 at
 * this gate. Build address `/studio/v2/editor/[id]` (route law,
 * cutover sequence per docs/STUDIO-SPEC.md 4.1). Mobile-first at 390:
 * single column, thumb-reachable section navigation, no horizontal
 * overflow, sticky action bar inside the R4 grammar; fully functional
 * at 1440.
 *
 * Composition, rehost then seat (docs/STUDIO-SPEC.md 4.2, the ruling
 * amendment on Lore): editor header (creation id, title, type,
 * template flag, Set Default PC, back action) -> the section
 * navigation (Nick's real order per creationEditConstants.js,
 * resolved per creation type by the read-only
 * `resolveCreationEditSections` helper in
 * `creation-edit-shell/useCreationEditShellViewModel.js`) -> the
 * two-slot body: media panel (+ Mechanics quick nav when the
 * Mechanics Fields section is active) and the section content panel
 * -> named absorption seats (`seats.bodyDetail`, `seats.behaviorDetail`,
 * `seats.advancedPrompting`), always null this pass, no placeholder UI
 * -> the sticky action bar -> the featured image picker modal, when
 * open.
 *
 * The View never imports a Creation client, Next.js, or any
 * `components/studio/my-creations/**` package. Every section body,
 * every media/quick-nav/action-bar surface, and the featured image
 * picker arrive as already-composed `ReactNode` slots built by the
 * Binding Shell (`../Editor.jsx`) from the read-only
 * `creation-edit-shell` lineage (`useCreationEditShellViewModel`,
 * `CreationEditSectionContent`, `CreationEditMediaPanel`,
 * `CreationEditStickyActionBar`, `CreationEditMechanicsRuntimeQuickNav`,
 * `CreationFeaturedImagePickerModal`), none of which this brief edits.
 *
 * @typedef {Object} EditorSectionTab
 * @property {string} id
 * @property {string} label
 * @property {import("react").ComponentType<{size?: number}>} [icon]
 *
 * @typedef {Object} EditorSeats
 * @property {import("react").ReactNode} [bodyDetail] Mounts under the
 *   "body" section, beside the existing rehosted Body section. Seated
 *   for a future brief's Body detail absorption section (Kibbe
 *   identity, Body Type, Height, Build, Proportions). Null this pass.
 * @property {import("react").ReactNode} [behaviorDetail] Mounts under
 *   the "behavior" section, beside the existing rehosted Behavior
 *   section. Seated for a future brief's Behavior detail absorption
 *   section (Outward/Internal Personality, Speech/Movement Style,
 *   Interests, MBTI, Western and East Asian zodiac, Voice Modules).
 *   Null this pass.
 * @property {import("react").ReactNode} [advancedPrompting] Mounts
 *   under the "advanced" section, beside the existing rehosted
 *   Advanced section. Seated for a future brief's Advanced Prompting
 *   section (enable toggle, nine guidance sections, per-section
 *   counters, 32,000-character combined budget). Null this pass.
 *
 * @typedef {Object} EditorViewProps
 * @property {string} creationId
 * @property {string} creationType
 * @property {string} title
 * @property {boolean} isTemplate
 * @property {string} activeSection
 * @property {EditorSectionTab[]} activeSections
 * @property {(sectionId: string) => void} onSelectSection
 * @property {boolean} canSetDefaultPc
 * @property {boolean} settingDefaultPc
 * @property {() => void} onSetDefaultPc
 * @property {string|null} defaultPcStatus
 * @property {string|null} defaultPcError
 * @property {boolean} showMechanicsQuickNav
 * @property {boolean} isLoreDocumentSection} Whether the active section
 *   is Lore's rehosted structured authoring surface (the ruling's
 *   ADDITIONAL item). Used only to widen the content panel; the
 *   authoring surface itself is part of `sectionContent`.
 * @property {string} backLabel
 * @property {() => void} onBack
 * @property {boolean} [isLoreDraftPreview] Shows the owner-only draft
 *   preview badge above the section content panel. Set by the
 *   Binding Shell when `sectionContentProps.isLore` and the active
 *   section is Lore's Public Preview. Default false.
 * @property {string|null} [imageLibraryHref] When set, renders a
 *   "Manage image library" link beside the media panel routing to
 *   `/studio/v2/editor/[id]/image-library`. Default null (hidden).
 * @property {import("react").ReactNode} mediaPanel
 * @property {import("react").ReactNode} mechanicsQuickNav
 * @property {import("react").ReactNode} sectionContent
 * @property {EditorSeats} seats
 * @property {import("react").ReactNode} stickyActionBar
 * @property {import("react").ReactNode} featuredImagePicker
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
