// 2.0.0, 23 Aug 2026 (build-0823 pass 4, RULED, the Studio hub
// three-zone ruling): STRUCTURAL. The altitude ladder (levels,
// activeLevelId, onSelectLevel), the Guided Build pane
// (guidedBuildSoon), the Story bridge strip (storyBridge), and the
// Full Studio tool-card grid (toolGroups) are all REMOVED. One calm
// scroll, three zones in order, plain zone labels: CREATE (the four
// live quick-create doors plus Player Character's Soon door, plus a
// quiet line routing to the advanced editor), BUILD (Build a Story,
// Build an Adventure), PUBLISH (one line routing to the Vault). New
// props: onOpenAdvancedEditor, onBuildStory, onBuildAdventure,
// onOpenVault.
export const STUDIO_VIEW_CONTRACT_VERSION = "2.0.0";

/**
 * Stable portable UI boundary for the Studio hub page View
 * (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.4; docs/BUILD-BLUEPRINT.md
 * 3.1 row 6; docs/STUDIO-SPEC.md sections 1, 2, 3, 6, 8.1). Build
 * address /studio/v2/studio (route law, cutover sequence).
 * Fixture-driven only, pre-parity: no fetch, no services-api, no
 * product data, except the four quick-create modals' own existing
 * live save wiring, which this page consumes read-only.
 *
 * Ruled composition, top to bottom, exhaustive: page header
 * (StudioPageHeaderView) -> the hub explainer strip (KitAlertStrip
 * neutral, carrying the submission-hub presentation: Public and Canon
 * submissions begin here) -> CREATE zone (asset-first doors:
 * Character live, opening CharacterCreatorModal with
 * fieldScope="quick"; Worlds live (door id "location", labeled
 * "Worlds"), opening WorldCreatorModal; Looks live (door id "outfit",
 * labeled "Looks"), opening LookCreatorModal; Stories live (door id
 * "story", labeled "Stories"), opening StoryCreatorModal; Player
 * Character quiet with the standing Soon treatment; a quiet line
 * "Prefer full control? Start in the advanced editor" routing to
 * /studio/v2/editor) -> BUILD zone ("Build a Story", same handler as
 * the Stories door; "Build an Adventure", routes to
 * /studio/v2/adventures) -> PUBLISH zone (one line routing to
 * /studio/v2/vault) -> bottom promo banner (promo-banner bottom
 * treatment) routing to /studio/v2/images.
 *
 * What the View renders itself: the section order and every ruled
 * kit composition (KitStudioPage, KitPromoBanner, KitAlertStrip, the
 * page-local Door/BuildRow recipes, page-local per LOOM law until a
 * second consumer needs them). What it delegates: all data, all
 * routing (every onX callback), the R4 fixture-action notice's
 * open/closed state (presentation-only, owned by the ViewModel). The
 * View fetches nothing.
 *
 * CharacterCreatorModal, WorldCreatorModal, LookCreatorModal, and
 * StoryCreatorModal are all mounted by the Shell (Studio.jsx), not
 * the View. The View only reports intent, through
 * onOpenCharacterCreator, onOpenWorldCreator, onOpenLookCreator, and
 * onOpenStoryCreator respectively (folded into `doors[].onOpen` by
 * the ViewModel), plus onBuildStory for the BUILD zone's own row.
 *
 * @typedef {Object} StudioDoor
 * @property {string} id
 * @property {string} label
 * @property {string} eyebrow
 * @property {string} description
 * @property {string|null} imageSrc
 * @property {boolean} isLive Character, Worlds (door id "location"), Looks (door id "outfit"), and Stories (door id "story") only; Player Character is Soon.
 * @property {(() => void)|null} onOpen Present only when isLive; the button renders `disabled` when not.
 *
 * @typedef {Object} StudioBanner
 * @property {string} eyebrow
 * @property {string} title
 * @property {string} line
 * @property {string} ctaLabel
 * @property {string|null} imageSrc
 * @property {(() => void)|null} onCtaClick
 *
 * @typedef {Object} StudioExplainer
 * @property {string} title
 * @property {string} body
 *
 * @typedef {Object} StudioViewProps
 * @property {StudioExplainer} hubExplainer
 * @property {StudioDoor[]} doors CREATE zone.
 * @property {(() => void)|null} onOpenAdvancedEditor CREATE zone's quiet line, routes to /studio/v2/editor.
 * @property {(() => void)|null} onBuildStory BUILD zone, opens StoryCreatorModal (same handler as the Stories door).
 * @property {(() => void)|null} onBuildAdventure BUILD zone, routes to /studio/v2/adventures.
 * @property {(() => void)|null} onOpenVault PUBLISH zone, routes to /studio/v2/vault.
 * @property {StudioBanner} bottomBanner Routes to /studio/v2/images.
 * @property {{label: string, message: string}|null} notice R4 fixture-action notice: non-persisting acknowledgement for any control whose real behavior waits on live wiring (the Player Character Soon door). Null renders nothing.
 * @property {(() => void)|null} onCloseNotice
 * @property {import("react").ReactNode} [harnessSlot] Dev-only fixture-state switcher, never product.
 */

export {};
