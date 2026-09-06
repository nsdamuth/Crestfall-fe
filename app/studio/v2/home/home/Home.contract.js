export const HOME_VIEW_CONTRACT_VERSION = "4.0.0";

/**
 * V2 Home is the signed-in guidepost/dashboard. It is distinct from `/studio`,
 * which is the creation workspace (Quick Start / Guided Build / Full Studio).
 *
 * Product data is assembled outside the View from existing Stories, Community,
 * Vault, Creator, Lore and engagement authorities. The View remains
 * presentation-only and receives only display-ready banners, section rails and
 * callbacks.
 *
 * Composition (4.0.0, Home fine-tuning batch 1, 6 Sep 2026):
 * 1. Continue/cold-start hero
 * 2. One section rail per sidebar section, in sidebar order (Stories,
 *    Adventures, Studio, Images, Vault, Community, Creators, Lore), each with
 *    its own Sort control; a rail with no items renders nothing
 * 3. Creation-oriented bottom banner routing to the next section (Stories)
 *
 * Removed at 4.0.0: destinationTiles, the four named rails
 * (topRatedRail, recentlyAddedRail, fromTheCommunityRail,
 * creatorsToFollowRail), and the single page-level sortControl.
 *
 * Partial source failures are non-fatal: navigation remains usable and loaded
 * rails remain visible while a warning strip describes degraded data.
 */
export const homeViewContract = Object.freeze({
  version: HOME_VIEW_CONTRACT_VERSION,
  route: "/studio/v2/home",
  canonicalCreationWorkspace: "/studio",
  inputs: Object.freeze([
    "topBanner",
    "continueItem",
    "welcomeName",
    "sectionRails",
    "bottomBanner",
    "errorMessage",
    "warningMessage",
    "notice",
    "onCloseNotice",
  ]),
  sectionRail: Object.freeze({
    fields: Object.freeze(["id", "label", "viewAllLabel", "onViewAll", "items", "sortControl"]),
    sortOptions: Object.freeze(["plays", "likes", "saves", "newest"]),
    sortControlRule:
      "A rail offers only the sort options its items carry data for; sortControl is null when none apply.",
  }),
  authority: Object.freeze({
    viewFetchesData: false,
    viewOwnsRouting: false,
    backendAuthorityMovedToHome: false,
  }),
});
