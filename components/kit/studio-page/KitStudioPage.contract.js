export const KIT_STUDIO_PAGE_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable portable UI boundary for the studio-v2 page skeleton
 * (docs/BUILD-BLUEPRINT.md 2.16(l), content width law, R1). This is
 * the ONLY horizontal margin a studio-v2 page carries: StudioShell's
 * own section padding is the page container margin, and no slot may
 * add a second one.
 *
 * The View renders no horizontal class of its own. A consumer that
 * adds max-width, mx-auto, or horizontal padding around a slot is out
 * of contract.
 *
 * @typedef {Object} KitStudioPageViewProps
 * @property {import("react").ReactNode} harnessSlot Fixture-mode row. Preview and staging harness only; real pages pass nothing.
 * @property {import("react").ReactNode} headerSlot The StudioPageHeaderView block.
 * @property {import("react").ReactNode} filterBarSlot The KitStudioFilterBarView, rendered as a direct child of the root with no wrapper.
 * @property {import("react").ReactNode} bannerSlot The bottom KitPromoBannerView.
 * @property {import("react").ReactNode} children Everything between the filter line and the banner: grid, list, load-more, loading, empty.
 */

export {};
