export const HOME_VIEW_CONTRACT_VERSION = "3.0.0";

/**
 * V2 Home is the signed-in guidepost/dashboard. It is distinct from `/studio`,
 * which is the creation workspace (Quick Start / Guided Build / Full Studio).
 *
 * Product data is assembled outside the View from existing Stories, Community,
 * Creator and engagement authorities. The View remains presentation-only and
 * receives only display-ready banners, destination tiles, rails and callbacks.
 *
 * Composition:
 * 1. Continue/cold-start hero
 * 2. Eight destination tiles
 * 3. Popular / recent / Community / creator rails when data exists
 * 4. Creation-oriented bottom banner back to Studio
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
    "destinationTiles",
    "topRatedRail",
    "recentlyAddedRail",
    "fromTheCommunityRail",
    "creatorsToFollowRail",
    "sortControl",
    "bottomBanner",
    "errorMessage",
    "warningMessage",
    "notice",
    "onCloseNotice",
  ]),
  authority: Object.freeze({
    viewFetchesData: false,
    viewOwnsRouting: false,
    backendAuthorityMovedToHome: false,
  }),
});
