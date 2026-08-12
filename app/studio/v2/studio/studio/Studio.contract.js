// 1.0.0 to 1.1.0 (this pass, the Q1 world quick-create brief):
// additive only. A second door (id "location", relabeled "Worlds")
// goes live, opening WorldCreatorModal the same way the Character
// door opens CharacterCreatorModal. StudioDoor's isLive is no longer
// "Character only"; no shape change to StudioDoor or any other
// typedef, and the Shell (Studio.jsx) gains onOpenWorldCreator
// alongside onOpenCharacterCreator, mirroring the existing pattern
// exactly.
export const STUDIO_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable portable UI boundary for the Studio hub page View
 * (docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 4.4; docs/BUILD-BLUEPRINT.md
 * 3.1 row 6; docs/SPRINT-G-PLAN.md section 2; docs/STUDIO-SPEC.md
 * sections 1, 2, 3, 6, 8.1). New page this pass, contract authorized
 * none to 1.0.0 at this gate. Build address /studio/v2/studio (route
 * law, cutover sequence). Fixture-driven only, pre-parity: no fetch,
 * no services-api, no product data, except CharacterCreatorModal's own
 * existing live save wiring, which this page consumes read-only.
 *
 * Ruled composition, top to bottom, exhaustive: page header
 * (StudioPageHeaderView) -> the hub explainer strip (KitAlertStrip
 * neutral, the sanctioned .stripinfo lineage, carrying the
 * submission-hub presentation: Public and Canon submissions begin
 * here, honest fixtures only, CR-014 and CR-027 stay non-blocking) ->
 * the ladder's level selector (three levels: Quick Start, Guided
 * Build, Full Studio) -> the active level's pane:
 *   - Quick Start: asset-first doors (Character live, opening
 *     CharacterCreatorModal with fieldScope="quick"; Worlds live
 *     (door id "location", labeled "Worlds"), opening
 *     WorldCreatorModal; every other type's door quiet with the
 *     standing Soon treatment) plus the Story bridge strip
 *     (KitAlertStrip neutral, same .stripinfo lineage).
 *   - Guided Build: no allocation exists yet for Story assembly
 *     (docs/STUDIO-SPEC.md section 9, item 2), so this pane renders
 *     the same quiet Soon treatment as a door, not fabricated
 *     bucket data.
 *   - Full Studio: tool card groups, pro density, Character live,
 *     every other card Soon.
 * -> bottom promo banner (promo-banner bottom treatment) routing to
 * /studio/v2/images.
 *
 * What the View renders itself: the section order and every ruled
 * kit composition (KitStudioPage, KitPromoBanner, KitAlertStrip, the
 * page-local level/door/tool-card recipes, none of which exist as
 * kit packages yet and are therefore page-local per LOOM law: a
 * package not yet promoted to components/kit stays where it is used
 * until a second consumer asks for it). What it delegates: all data,
 * all routing (every onX callback), all local state that is not
 * presentation-only (the active level tab IS presentation-only and is
 * therefore owned by the ViewModel per the fixture-mode harness
 * convention, not hardcoded in the View). The View fetches nothing.
 *
 * CharacterCreatorModal and WorldCreatorModal are both mounted by the
 * Shell (Studio.jsx), not the View: each is a real, live-wired
 * component (existing save path through creationClient), not a
 * fixture-shaped prop, and the Shell is the LOOM layer that owns real
 * integration per docs/CRESTFALL-DESIGN-CONTEXT.md. The View only
 * reports intent, through onOpenCharacterCreator and
 * onOpenWorldCreator respectively.
 *
 * @typedef {Object} StudioLevel
 * @property {string} id
 * @property {string} numeral
 * @property {string} title
 * @property {string} description
 * @property {number} depth 1, 2, or 3; how many depth-meter segments render filled.
 *
 * @typedef {Object} StudioDoor
 * @property {string} id
 * @property {string} label
 * @property {string} eyebrow
 * @property {string} description
 * @property {string|null} imageSrc
 * @property {boolean} isLive Character and Worlds (door id "location") only; every other door is Soon.
 * @property {(() => void)|null} onOpen
 *
 * @typedef {Object} StudioToolCard
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {boolean} isLive
 * @property {(() => void)|null} onOpen
 *
 * @typedef {Object} StudioToolGroup
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {StudioToolCard[]} cards
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
 * @typedef {Object} StudioStoryBridge
 * @property {string} title
 * @property {string} body
 * @property {string} actionLabel
 * @property {(() => void)|null} onAction
 *
 * @typedef {Object} StudioViewProps
 * @property {StudioLevel[]} levels
 * @property {string} activeLevelId
 * @property {((levelId: string) => void)|null} onSelectLevel
 * @property {StudioExplainer} hubExplainer
 * @property {StudioDoor[]} doors Quick Start pane.
 * @property {StudioStoryBridge} storyBridge Quick Start pane, end of the doors grid.
 * @property {StudioExplainer} guidedBuildSoon Guided Build pane, no allocation yet (section 9, item 2).
 * @property {StudioToolGroup[]} toolGroups Full Studio pane.
 * @property {StudioBanner} bottomBanner Routes to /studio/v2/images.
 * @property {{label: string, message: string}|null} notice R4 fixture-action notice: non-persisting acknowledgement for any control whose real behavior waits on live wiring (every Soon door and tool card, the Story bridge action). Null renders nothing.
 * @property {(() => void)|null} onCloseNotice
 * @property {import("react").ReactNode} [harnessSlot] Dev-only fixture-state switcher, never product.
 */

export {};
