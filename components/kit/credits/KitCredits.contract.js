export const KIT_CREDITS_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable portable UI boundary for the shared attribution kit piece
 * (R11, docs/SPRINT-A-POLISH-PLAN.md section 5), ported from the
 * old-design credits panel
 * (components/studio/creations/creation-credits/, read-only
 * reference, never edited) onto current tokens.
 *
 * v1.1.0, RULED 10 Aug 2026 (R1, kit polish 3 pass, plan 1.3):
 * additive. The package gains a second documented component,
 * `KitCreditsModal` (shell `components/kit/KitCreditsModal.jsx`, view
 * `components/kit/credits/KitCreditsModal.view.jsx`), the secondary
 * surface the asset detail popup's "View all credits" control opens:
 * a back control plus the gold "Credits" label, a scrollable region
 * rendering this same `KitCreditsView` with the full list. Props:
 * `credits` (same item shape as this component), `LinkComponent`
 * (the shell injects `next/link`), `onClose` (fired by both the back
 * control and the frame's own close control). `KitCreditsView` itself
 * is unchanged.
 *
 * The View receives display-ready attribution rows. It does not
 * receive the raw creation graph or know how Crestfall resolves
 * creator attribution, inherited assets, template sources, profile
 * routes, or ownership data. Kind labels arrive already mapped
 * through the terminology module by the caller; backend names never
 * render here.
 *
 * @typedef {Object} KitCreditsItem
 * @property {string} id Stable rendering key.
 * @property {string} kindLabel Human-readable attribution kind.
 * @property {string} creatorHandle Display-ready creator handle.
 * @property {string|null} creatorHref Optional public creator-profile route.
 * @property {string|null} assetTitle Optional credited asset title.
 *
 * @typedef {Object} KitCreditsViewProps
 * @property {KitCreditsItem[]} credits Empty list renders null (never
 *   the old design's literal `0` text-node bug).
 * @property {import("react").ElementType} LinkComponent Injected by
 *   the shell (next/link in product code), matching the old
 *   package's pattern.
 */

export {};
